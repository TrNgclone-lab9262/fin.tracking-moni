"use client";

import React from "react";
import { useSecurity } from "@/context/SecurityContext";
import { PinLockModal } from "@/components/security/PinLockModal";
import { Shield } from "lucide-react";

export function SecurityGate({ children }: { children: React.ReactNode }) {
  const { isConfigured, isLocked, isMounted } = useSecurity();

  // 1. Trong lúc chưa hydrate xong trên client (SSR / Hydration initial state)
  // Hiển thị Skeleton Loader ấm áp thay vì để màn hình trắng xóa
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#F6F8FB] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-[3px] border border-slate-200/80 p-8 shadow-sm flex flex-col items-center space-y-4 animate-pulse">
          <div className="w-12 h-12 rounded-[3px] bg-blue-100 flex items-center justify-center text-blue-600">
            <Shield className="w-6 h-6 animate-pulse" />
          </div>
          <div className="h-4 w-36 bg-slate-200 rounded-[3px]" />
          <div className="h-3 w-48 bg-slate-100 rounded-[3px]" />
          <div className="flex gap-2.5 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-3.5 h-3.5 rounded-full bg-slate-200" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 2. Nếu người dùng đã cài PIN và trạng thái đang bị Khóa (chưa unlock / token hết hạn / bấm Khóa ngay)
  if (isConfigured && isLocked) {
    return <PinLockModal mode="UNLOCK" />;
  }

  // 3. Trường hợp bình thường (hoặc chưa cài PIN) => Render toàn bộ ứng dụng
  return <>{children}</>;
}

