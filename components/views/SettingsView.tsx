"use client";

import React, { useState } from "react";
import {
  Palette,
  Shield,
  Download,
  RotateCcw,
  Check,
  CheckCircle2,
  HardDrive,
  Cloud,
  RefreshCw,
  Database,
  Radio,
} from "lucide-react";
import { useFinance } from "@/context/FinanceContext";
import { ThemeColor } from "@/types/finance";

interface SettingsViewProps {
  onOpenBackupModal: () => void;
  onOpenResetConfirm: () => void;
}

const THEME_OPTIONS: { id: ThemeColor; name: string; bgClass: string; hex: string }[] = [
  { id: "blue", name: "Xanh dương", bgClass: "bg-blue-600", hex: "#2563EB" },
  { id: "purple", name: "Tím thạch anh", bgClass: "bg-purple-600", hex: "#9333EA" },
  { id: "pink", name: "Hồng ruby", bgClass: "bg-rose-500", hex: "#F43F5E" },
  { id: "green", name: "Xanh ngọc lục bảo", bgClass: "bg-emerald-600", hex: "#059669" },
  { id: "orange", name: "Cam hoàng hôn", bgClass: "bg-amber-600", hex: "#D97706" },
];

export function SettingsView({
  onOpenBackupModal,
  onOpenResetConfirm,
}: SettingsViewProps) {
  const {
    settings,
    updateSettings,
    isCloudConnected,
    isSyncing,
    lastSyncedAt,
    syncWithCloud,
  } = useFinance();
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSelectTheme = (color: ThemeColor) => {
    updateSettings({ themeColor: color });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* 1. Tùy biến Giao diện (Khớp 100% hình setting.JPG) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Palette className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-bold text-slate-800">Giao diện</h3>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-2">
            Màu sắc chủ đề (được ghi nhớ trên thiết bị này):
          </label>
          <div className="flex items-center gap-3">
            {THEME_OPTIONS.map((t) => {
              const isSelected = settings.themeColor === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleSelectTheme(t.id)}
                  title={t.name}
                  className={`w-10 h-10 rounded-full ${t.bgClass} flex items-center justify-center transition-all ${
                    isSelected
                      ? "ring-4 ring-blue-200 scale-110 shadow-md"
                      : "opacity-85 hover:opacity-100 hover:scale-105"
                  }`}
                >
                  {isSelected && <Check className="w-5 h-5 text-white" />}
                </button>
              );
            })}
          </div>
          {saveSuccess && (
            <p className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1 animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" /> Đã lưu màu chủ đề thành công!
            </p>
          )}
        </div>
      </div>

      {/* 2. Cơ sở Dữ liệu Đám mây (Supabase Cloud BaaS) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-800">Cơ sở dữ liệu Đám mây (Supabase Cloud)</h3>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
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
          <div className="p-3.5 bg-slate-50 border border-slate-200/70 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
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
              className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-60 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/25"
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

      {/* 3. Bảo mật */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Shield className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-bold text-slate-800">Bảo mật</h3>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Mật khẩu mới</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Nhập lại mật khẩu mới</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 hover:bg-blue-700"
          >
            Đổi mật khẩu
          </button>
          <p className="text-[11px] text-slate-400 mt-1">
            Ứng dụng hoạt động với mô hình Hybrid Local-First & Supabase RLS. Dữ liệu được bảo vệ an toàn trên thiết bị và Cloud.
          </p>
        </div>
      </div>

      {/* 4. Dữ liệu & Sao lưu */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <HardDrive className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-bold text-slate-800">Quản lý Dữ liệu LocalStorage & Sao lưu</h3>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onOpenBackupModal}
            className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span>Sao lưu / Phục hồi JSON</span>
          </button>

          <button
            onClick={onOpenResetConfirm}
            className="flex-1 py-3 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4 text-rose-600" />
            <span>Nạp lại dữ liệu mẫu Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
