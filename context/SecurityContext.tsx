"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

const PIN_STORAGE_KEY = "HOME_MONI_SECURITY_PIN_V1";
const SESSION_UNLOCKED_KEY = "HOME_MONI_SESSION_UNLOCKED_V2";
const PRIVACY_MODE_KEY = "HOME_MONI_PRIVACY_MODE_V1";
const INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000; // 5 phút

interface SecurityContextType {
  isConfigured: boolean; // Đã cài PIN chưa
  isLocked: boolean; // Đang bị khóa cần nhập PIN hay đã unlock
  isPrivacyMode: boolean; // Chế độ che số tiền toàn diện
  isMounted: boolean; // Trạng thái đã hydrate xong trên client
  togglePrivacyMode: () => void;
  unlockWithPin: (pin: string) => Promise<{ success: boolean; message?: string }>;
  setupNewPin: (pin: string) => Promise<boolean>;
  lockApp: () => void;
  removePin: () => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

// Web Crypto SHA-256 Native Helper
async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`HOME_MONI_SALT_${pin}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function SecurityProvider({ children }: { children: React.ReactNode }) {
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isPrivacyMode, setIsPrivacyMode] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const backgroundTimestampRef = useRef<number | null>(null);

  // Hàm khóa ứng dụng ngay lập tức
  const lockApp = useCallback(() => {
    try {
      sessionStorage.removeItem(SESSION_UNLOCKED_KEY);
    } catch {}
    setIsLocked(true);
  }, []);

  // Khởi động lại bộ đếm 5 phút không hoạt động
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    // Chỉ kích hoạt đếm giờ nếu đã cấu hình PIN và hiện đang mở khóa
    const storedPinHash = typeof window !== "undefined" ? localStorage.getItem(PIN_STORAGE_KEY) : null;
    if (storedPinHash) {
      inactivityTimerRef.current = setTimeout(() => {
        lockApp();
      }, INACTIVITY_TIMEOUT_MS);
    }
  }, [lockApp]);

  // Khởi tạo kiểm tra PIN & Session khi tải trang (chỉ chạy trên Client)
  useEffect(() => {
    try {
      const storedPinHash = localStorage.getItem(PIN_STORAGE_KEY);
      const storedPrivacy = localStorage.getItem(PRIVACY_MODE_KEY);

      if (storedPrivacy !== null) {
        setIsPrivacyMode(storedPrivacy === "true");
      }

      if (!storedPinHash) {
        // Chưa từng thiết lập mã PIN => Cho vào trực tiếp
        setIsConfigured(false);
        setIsLocked(false);
      } else {
        setIsConfigured(true);
        // Kiểm tra sessionStorage (mất đi khi tắt tab / đóng app)
        const sessionUnlocked = sessionStorage.getItem(SESSION_UNLOCKED_KEY);
        if (sessionUnlocked === "true") {
          setIsLocked(false);
          resetInactivityTimer();
        } else {
          setIsLocked(true);
        }
      }
    } catch {
      setIsLocked(false);
    } finally {
      setIsMounted(true);
    }
  }, [resetInactivityTimer]);

  // Lắng nghe sự kiện người dùng tương tác để reset Inactivity Timer
  useEffect(() => {
    if (!isConfigured || isLocked) return;

    const handleUserActivity = () => {
      resetInactivityTimer();
    };

    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("mousedown", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);
    window.addEventListener("touchstart", handleUserActivity);
    window.addEventListener("scroll", handleUserActivity, { passive: true });

    resetInactivityTimer();

    return () => {
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("mousedown", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("touchstart", handleUserActivity);
      window.removeEventListener("scroll", handleUserActivity);
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [isConfigured, isLocked, resetInactivityTimer]);

  // Lắng nghe Page Visibility API (Chuyển tab, tắt màn hình, đóng app)
  useEffect(() => {
    if (!isConfigured) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // App rơi vào nền (ẩn tab hoặc tắt màn hình)
        backgroundTimestampRef.current = Date.now();
      } else {
        // App hiển thị lại: Kiểm tra thời gian đã trôi qua
        if (backgroundTimestampRef.current) {
          const elapsed = Date.now() - backgroundTimestampRef.current;
          if (elapsed >= INACTIVITY_TIMEOUT_MS) {
            lockApp();
          }
          backgroundTimestampRef.current = null;
        }
      }
    };

    const handlePageHide = () => {
      // Đóng tab hoặc điều hướng rời khỏi
      try {
        sessionStorage.removeItem(SESSION_UNLOCKED_KEY);
      } catch {}
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [isConfigured, lockApp]);

  const togglePrivacyMode = useCallback(() => {
    setIsPrivacyMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(PRIVACY_MODE_KEY, String(next));
      } catch {}
      return next;
    });
  }, []);

  const unlockWithPin = useCallback(async (pin: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const storedPinHash = localStorage.getItem(PIN_STORAGE_KEY);
      if (!storedPinHash) {
        setIsLocked(false);
        return { success: true };
      }

      const inputHash = await hashPin(pin);
      if (inputHash === storedPinHash) {
        setIsLocked(false);
        try {
          sessionStorage.setItem(SESSION_UNLOCKED_KEY, "true");
        } catch {}
        resetInactivityTimer();
        return { success: true };
      } else {
        return { success: false, message: "Mã PIN không chính xác, vui lòng thử lại!" };
      }
    } catch {
      return { success: false, message: "Đã xảy ra lỗi khi xác thực mã PIN" };
    }
  }, [resetInactivityTimer]);

  const setupNewPin = useCallback(async (pin: string): Promise<boolean> => {
    try {
      if (pin.length < 4 || pin.length > 6) return false;
      const hashed = await hashPin(pin);
      localStorage.setItem(PIN_STORAGE_KEY, hashed);
      sessionStorage.setItem(SESSION_UNLOCKED_KEY, "true");
      setIsConfigured(true);
      setIsLocked(false);
      resetInactivityTimer();
      return true;
    } catch {
      return false;
    }
  }, [resetInactivityTimer]);

  const removePin = useCallback(() => {
    try {
      localStorage.removeItem(PIN_STORAGE_KEY);
      sessionStorage.removeItem(SESSION_UNLOCKED_KEY);
    } catch {}
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    setIsConfigured(false);
    setIsLocked(false);
  }, []);

  return (
    <SecurityContext.Provider
      value={{
        isConfigured,
        isLocked,
        isPrivacyMode,
        isMounted,
        togglePrivacyMode,
        unlockWithPin,
        setupNewPin,
        lockApp,
        removePin,
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
}

export function useSecurity() {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error("useSecurity must be used within a SecurityProvider");
  }
  return context;
}
