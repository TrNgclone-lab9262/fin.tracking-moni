"use client";

import React, { useState } from "react";
import {
  Shield,
  Download,
  RotateCcw,
  HardDrive,
  Database,
  RefreshCw,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";
import { useFinance } from "@/context/FinanceContext";
import { useSecurity } from "@/context/SecurityContext";
import { Button } from "@/components/ui/button";
import { DesignSystemPreview } from "@/components/common/DesignSystemPreview";
import { PinLockModal } from "@/components/security/PinLockModal";

interface SettingsViewProps {
  onOpenBackupModal: () => void;
  onOpenResetConfirm: () => void;
}

export function SettingsView({
  onOpenBackupModal,
  onOpenResetConfirm,
}: SettingsViewProps) {
  const {
    isCloudConnected,
    isSyncing,
    lastSyncedAt,
    syncWithCloud,
  } = useFinance();

  const {
    isConfigured,
    isPrivacyMode,
    togglePrivacyMode,
    lockApp,
    removePin,
  } = useSecurity();

  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  return (
    <div className="max-w-3xl mx-auto space-y-5 animate-in fade-in duration-200">
      {/* 0. Live Preview Components Theo Chuẩn Mới DESIGN_SYSTEM.md */}
      <DesignSystemPreview />

      {/* 0.1 HÀNG RÀO AN NINH & BẢO MẬT GIA ĐÌNH (Family Security Shield) */}
      <div className="bg-white rounded-[3px] p-5 sm:p-6 border border-[#DCE4EE] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E9EEF5]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[3px] bg-blue-50 text-blue-600 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#172B4D]">
                Hàng Rào An Ninh & Khóa PIN Gia Đình
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Bảo vệ số dư, ngăn chặn người lạ xem dữ liệu và chống nhìn trộm nơi công cộng
              </p>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] text-xs font-bold border ${
              isConfigured
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : "bg-slate-50 text-slate-600 border-slate-200"
            }`}
          >
            {isConfigured ? "Đang bảo vệ (Đã cài PIN)" : "Chưa cài mã PIN"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Cấu hình PIN */}
          <div className="p-3.5 bg-slate-50 rounded-[3px] border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-blue-600" />
                Mã PIN 4-6 số
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {isConfigured
                ? "Mã PIN đã được băm SHA-256 an toàn. Hỗ trợ nhớ thiết bị trong 30 ngày."
                : "Chưa thiết lập mã PIN. Bất kỳ ai mở link đều có thể xem dữ liệu."}
            </p>
            <div className="pt-1 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPinModalOpen(true)}
                className="h-8 text-xs font-bold border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                {isConfigured ? "Đổi mã PIN mới" : "Thiết lập mã PIN ngay"}
              </Button>
              {isConfigured && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={removePin}
                  className="h-8 text-xs font-bold border-rose-200 text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Xóa PIN
                </Button>
              )}
            </div>
          </div>

          {/* Chế độ Privacy Mode */}
          <div className="p-3.5 bg-slate-50 rounded-[3px] border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                {isPrivacyMode ? <EyeOff className="w-4 h-4 text-rose-600" /> : <Eye className="w-4 h-4 text-emerald-600" />}
                Chế độ che số tiền (Privacy)
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Ẩn toàn bộ số dư và giao dịch dạng <code>•••••• ₫</code> khi ghi chép nơi đông người.
            </p>
            <div className="pt-1 flex items-center gap-2">
              <Button
                variant={isPrivacyMode ? "destructive" : "default"}
                size="sm"
                onClick={togglePrivacyMode}
                className="h-8 text-xs font-bold"
              >
                {isPrivacyMode ? "Đang bật (Tắt ẩn số)" : "Bật ẩn số tiền ngay"}
              </Button>
              {isConfigured && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={lockApp}
                  className="h-8 text-xs font-bold border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  <Lock className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  Khóa app ngay
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 1. Cơ sở Dữ liệu Đám mây (Supabase Cloud BaaS) */}
      <div className="bg-white rounded-[3px] p-5 sm:p-6 border border-[#DCE4EE] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E9EEF5]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[3px] bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#172B4D]">
                Đồng Bộ Đám Mây (Supabase Cloud BaaS)
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Tự động sao lưu & đồng bộ 2 chiều tức thì giữa 👨 Anh Chuột & 👩 Bé Mèo
              </p>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] text-xs font-bold border ${
              isCloudConnected
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isCloudConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
              }`}
            />
            {isCloudConnected ? "Realtime Cloud Active" : "Ngoại tuyến (Offline)"}
          </span>
        </div>

        <div className="space-y-3">
          <div className="p-3 bg-slate-50 border border-[#E9EEF5] rounded-[3px] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold text-slate-700">Supabase Project Endpoint</p>
              <code className="text-[11px] text-blue-600 font-mono">
                {process.env.NEXT_PUBLIC_SUPABASE_URL || "Chưa cấu hình NEXT_PUBLIC_SUPABASE_URL"}
              </code>
            </div>
            {lastSyncedAt && (
              <span className="text-[11px] text-slate-400">
                Đồng bộ lần cuối: {lastSyncedAt.toLocaleTimeString("vi-VN")}
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              onClick={() => syncWithCloud()}
              disabled={isSyncing}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-bold text-xs h-10"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
              <span>{isSyncing ? "Đang đồng bộ dữ liệu..." : "Đồng bộ thủ công ngay"}</span>
            </Button>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            ⚡ <strong>Cơ chế Realtime Replication:</strong> Khi Anh Chuột hoặc Bé Mèo nhập giao dịch trên điện thoại,
            dữ liệu sẽ được tự động đồng bộ sang máy của người còn lại trong tích tắc mà không cần tải lại trang.
          </p>
        </div>
      </div>

      {/* 2. Dữ liệu LocalStorage & Sao lưu Dự phòng */}
      <div className="bg-white rounded-[3px] p-5 sm:p-6 border border-[#DCE4EE] shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#E9EEF5]">
          <div className="w-8 h-8 rounded-[3px] bg-blue-50 text-blue-600 flex items-center justify-center">
            <HardDrive className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#172B4D]">
              Quản lý Dữ liệu LocalStorage & Sao lưu
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Khóa lưu trữ active: <code className="font-mono text-blue-600">HOME_MONI_DATA_V4</code>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={onOpenBackupModal}
            className="flex-1 gap-2 font-bold text-xs h-10 border-[#DCE4EE] text-slate-700 hover:bg-slate-50"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span>Sao lưu / Phục hồi JSON</span>
          </Button>

          <Button
            variant="destructive"
            onClick={onOpenResetConfirm}
            className="flex-1 gap-2 font-bold text-xs h-10 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 shadow-none hover:text-rose-800"
          >
            <RotateCcw className="w-4 h-4 text-rose-600" />
            <span>Nạp lại dữ liệu mẫu Demo</span>
          </Button>
        </div>
      </div>

      {/* 3. Bảo Mật & Thông Tin Bản Quyền */}
      <div className="bg-white rounded-[3px] p-5 sm:p-6 border border-[#DCE4EE] shadow-xs space-y-3">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#E9EEF5]">
          <div className="w-8 h-8 rounded-[3px] bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#172B4D]">
              Bảo Mật & Kiến Trúc Vận Hành
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Kiến trúc Hybrid Local-First kết hợp Supabase PostgreSQL RLS
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Ứng dụng được thiết kế riêng cho tổ ấm <strong>HOME MONI</strong> của <strong>👨 Anh Chuột & 👩 Bé Mèo</strong>.
          Dữ liệu tài chính gia đình được mã hóa và lưu trữ an toàn song song trên LocalStorage thiết bị và Supabase Cloud PostgreSQL.
        </p>
      </div>

      {/* Modal thiết lập mã PIN mới */}
      {isPinModalOpen && (
        <PinLockModal
          mode="SETUP"
          onSuccess={() => setIsPinModalOpen(false)}
          onCancel={() => setIsPinModalOpen(false)}
        />
      )}
    </div>
  );
}

