"use client";

import React from "react";
import {
  Shield,
  Download,
  RotateCcw,
  HardDrive,
  Database,
  RefreshCw,
} from "lucide-react";
import { useFinance } from "@/context/FinanceContext";

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

  return (
    <div className="max-w-3xl mx-auto space-y-5 animate-in fade-in duration-200">
      {/* 1. Cơ sở Dữ liệu Đám mây (Supabase Cloud BaaS) */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-[#DCE4EE] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E9EEF5]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
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
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${
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
          <div className="p-3 bg-slate-50 border border-[#E9EEF5] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2">
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
            <button
              type="button"
              onClick={() => syncWithCloud()}
              disabled={isSyncing}
              className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-60 text-white rounded-md text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
              <span>{isSyncing ? "Đang đồng bộ dữ liệu..." : "Đồng bộ thủ công ngay"}</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            ⚡ <strong>Cơ chế Realtime Replication:</strong> Khi Anh Chuột hoặc Bé Mèo nhập giao dịch trên điện thoại,
            dữ liệu sẽ được tự động đồng bộ sang máy của người còn lại trong tích tắc mà không cần tải lại trang.
          </p>
        </div>
      </div>

      {/* 2. Dữ liệu LocalStorage & Sao lưu Dự phòng */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-[#DCE4EE] shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#E9EEF5]">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
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
          <button
            onClick={onOpenBackupModal}
            className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span>Sao lưu / Phục hồi JSON</span>
          </button>

          <button
            onClick={onOpenResetConfirm}
            className="flex-1 py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-md text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4 text-rose-600" />
            <span>Nạp lại dữ liệu mẫu Demo</span>
          </button>
        </div>
      </div>

      {/* 3. Bảo Mật & Thông Tin Bản Quyền */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-[#DCE4EE] shadow-xs space-y-3">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#E9EEF5]">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
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
    </div>
  );
}
