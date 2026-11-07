"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const PIN_STORAGE_KEY = "HOME_MONI_SECURITY_PIN_V1";
const TRUSTED_TOKEN_KEY = "HOME_MONI_TRUSTED_DEVICE_TOKEN_V1";
const PRIVACY_MODE_KEY = "HOME_MONI_PRIVACY_MODE_V1";
const TOKEN_MAX_AGE_DAYS = 30;

interface SecurityContextType {
  isConfigured: boolean; // Đã cài PIN chưa
  isLocked: boolean; // Đang bị khóa cần nhập PIN hay đã unlock
  isPrivacyMode: boolean; // Chế độ che số tiền
  isMounted: boolean; // Trạng thái đã hydrate xong trên client
  togglePrivacyMode: () => void;
  unlockWithPin: (pin: string, remember30Days: boolean) => Promise<{ success: boolean; message?: string }>;
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

  // Khởi tạo kiểm tra PIN & Trusted Token khi tải trang (chỉ chạy trên Client)
  useEffect(() => {
    try {
      const storedPinHash = localStorage.getItem(PIN_STORAGE_KEY);
      const storedPrivacy = localStorage.getItem(PRIVACY_MODE_KEY);

      if (storedPrivacy !== null) {
        setIsPrivacyMode(storedPrivacy === "true");
      }

      if (!storedPinHash) {
        // Chưa từng thiết lập mã PIN => Vào trực tiếp
        setIsConfigured(false);
        setIsLocked(false);
      } else {
        setIsConfigured(true);
        // Đã có mã PIN, kiểm tra Trusted Device Token 30 ngày
        const rawToken = localStorage.getItem(TRUSTED_TOKEN_KEY);
        if (rawToken) {
          try {
            const tokenData = JSON.parse(rawToken);
            const now = Date.now();
            const tokenAgeDays = (now - tokenData.timestamp) / (1000 * 60 * 60 * 24);

            if (tokenData.hash === storedPinHash && tokenAgeDays < TOKEN_MAX_AGE_DAYS) {
              // Thiết bị tin cậy hợp lệ còn trong hạn 30 ngày => Mở khóa tức thì
              setIsLocked(false);
            } else {
              // Hết hạn => Khóa
              localStorage.removeItem(TRUSTED_TOKEN_KEY);
              setIsLocked(true);
            }
          } catch {
            setIsLocked(true);
          }
        } else {
          setIsLocked(true);
        }
      }
    } catch {
      setIsLocked(false);
    } finally {
      setIsMounted(true);
    }
  }, []);

  const togglePrivacyMode = useCallback(() => {
    setIsPrivacyMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(PRIVACY_MODE_KEY, String(next));
      } catch {}
      return next;
    });
  }, []);

  const unlockWithPin = useCallback(async (pin: string, remember30Days: boolean): Promise<{ success: boolean; message?: string }> => {
    try {
      const storedPinHash = localStorage.getItem(PIN_STORAGE_KEY);
      if (!storedPinHash) {
        setIsLocked(false);
        return { success: true };
      }

      const inputHash = await hashPin(pin);
      if (inputHash === storedPinHash) {
        setIsLocked(false);
        if (remember30Days) {
          const tokenData = {
            hash: storedPinHash,
            timestamp: Date.now(),
          };
          localStorage.setItem(TRUSTED_TOKEN_KEY, JSON.stringify(tokenData));
        } else {
          localStorage.removeItem(TRUSTED_TOKEN_KEY);
        }
        return { success: true };
      } else {
        return { success: false, message: "Mã PIN không chính xác, vui lòng thử lại!" };
      }
    } catch {
      return { success: false, message: "Đã xảy ra lỗi khi xác thực mã PIN" };
    }
  }, []);

  const setupNewPin = useCallback(async (pin: string): Promise<boolean> => {
    try {
      if (pin.length < 4 || pin.length > 6) return false;
      const hashed = await hashPin(pin);
      localStorage.setItem(PIN_STORAGE_KEY, hashed);
      setIsConfigured(true);
      setIsLocked(false);
      // Mặc định tạo token tin cậy 30 ngày cho thiết bị đang cài đặt
      localStorage.setItem(
        TRUSTED_TOKEN_KEY,
        JSON.stringify({ hash: hashed, timestamp: Date.now() })
      );
      return true;
    } catch {
      return false;
    }
  }, []);

  const lockApp = useCallback(() => {
    try {
      localStorage.removeItem(TRUSTED_TOKEN_KEY);
    } catch {}
    setIsLocked(true);
  }, []);

  const removePin = useCallback(() => {
    try {
      localStorage.removeItem(PIN_STORAGE_KEY);
      localStorage.removeItem(TRUSTED_TOKEN_KEY);
    } catch {}
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

