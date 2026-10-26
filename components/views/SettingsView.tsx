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
  Info,
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
  const { settings, updateSettings } = useFinance();
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

      {/* 2. Bảo mật (Khớp hình setting.JPG) */}
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
            Ứng dụng hoạt động cục bộ (Local-First). Khóa mã bảo vệ được xác thực trực tiếp trên trình duyệt của bạn.
          </p>
        </div>
      </div>

      {/* 3. Dữ liệu & Sao lưu */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <HardDrive className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-bold text-slate-800">Quản lý Dữ liệu LocalStorage</h3>
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
