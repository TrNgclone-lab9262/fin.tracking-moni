"use client";

import React, { useState } from "react";
import {
  Bell,
  Plus,
  Download,
  Calendar,
  CheckCircle2,
  Menu,
  X,
  AlertTriangle,
  RotateCcw,
  Users,
  Home,
  Cloud,
  CloudOff,
  RefreshCw,
} from "lucide-react";
import { useFinance, NavTab, PerspectiveMode } from "@/context/FinanceContext";
import { getMonthDisplayLabel } from "@/lib/formatters";

interface TopBarProps {
  onOpenAddModal: () => void;
  onOpenBackupModal: () => void;
  onOpenResetConfirm: () => void;
  onToggleMobileMenu: () => void;
}

export function TopBar({
  onOpenAddModal,
  onOpenBackupModal,
  onOpenResetConfirm,
  onToggleMobileMenu,
}: TopBarProps) {
  const {
    selectedMonth,
    setSelectedMonth,
    availableMonths,
    notifications,
    activeTab,
    activePerspective,
    setActivePerspective,
    isCloudConnected,
    isSyncing,
    lastSyncedAt,
    syncWithCloud,
  } = useFinance();

  const [showNotifications, setShowNotifications] = useState(false);

  const tabTitles: Record<NavTab, string> = {
    overview: "Tổng quan tổ ấm (My Home)",
    transactions: "Sổ giao dịch gia đình",
    accounts: "Tài khoản & Thẻ tín dụng",
    planning: "Kế hoạch & Ngân sách tổ ấm",
    debts_invest: "Nợ & Đầu tư gia đình",
    guide: "Cẩm nang tài chính tổ ấm",
    settings: "Cài đặt & Tùy biến",
  };

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-20 shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-4">
          {/* Bên Trái: Nút Mobile Menu + Tiêu đề Phân hệ */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleMobileMenu}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="Mở menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-base sm:text-xl font-black text-slate-900 tracking-tight">
                  {tabTitles[activeTab]}
                </h1>
                {isCloudConnected ? (
                  <button
                    type="button"
                    onClick={() => syncWithCloud()}
                    title={
                      lastSyncedAt
                        ? `Supabase Realtime • Bấm để đồng bộ (Lần cuối: ${lastSyncedAt.toLocaleTimeString("vi-VN")})`
                        : "Supabase Realtime • Bấm để đồng bộ lại"
                    }
                    className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-200/80 transition-all cursor-pointer shadow-2xs"
                  >
                    <RefreshCw
                      className={`w-3 h-3 text-emerald-600 ${isSyncing ? "animate-spin" : ""}`}
                    />
                    <span>{isSyncing ? "Đang đồng bộ..." : "Supabase Cloud"}</span>
                  </button>
                ) : (
                  <span
                    title="Đang hoạt động chế độ lưu máy (Offline-first)"
                    className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200"
                  >
                    <CloudOff className="w-3.5 h-3.5 text-slate-500" />
                    Lưu máy
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Giữa: Bộ Chuyển Đổi Góc Nhìn Thành Viên (My Home / Anh Chuột / Bé Mèo) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl shadow-inner border border-slate-200/60">
            <button
              type="button"
              onClick={() => setActivePerspective("ALL")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activePerspective === "ALL"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>🏡</span>
              <span className="hidden sm:inline">My Home</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePerspective("HUSBAND")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activePerspective === "HUSBAND"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>👨</span>
              <span className="hidden sm:inline">Anh Chuột</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePerspective("WIFE")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activePerspective === "WIFE"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>👩</span>
              <span className="hidden sm:inline">Bé Mèo</span>
            </button>
          </div>

          {/* Bên Phải: Bộ chọn kỳ + Chuông thông báo + Nút Thao tác */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Bộ chọn tháng */}
            <div className="flex items-center bg-slate-100/90 text-slate-700 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200/60">
              <Calendar className="w-4 h-4 text-blue-600 mr-1.5 shrink-0" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent border-none outline-none cursor-pointer pr-1 font-semibold text-slate-800 text-xs sm:text-sm"
              >
                <option value="ALL">Toàn thời gian</option>
                {availableMonths.map((m) => (
                  <option key={m} value={m}>
                    {getMonthDisplayLabel(m)}
                  </option>
                ))}
              </select>
            </div>

            {/* Chuông Thông Báo */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-xl bg-slate-100/90 hover:bg-slate-200 text-slate-600 transition-colors"
                title="Cảnh báo & Nhắc nhở"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-xs">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Popup Cảnh báo & Nhắc nhở */}
              {showNotifications && (
                <div
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      Cảnh báo gia đình
                    </span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-slate-600 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 p-2">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="p-3 hover:bg-slate-50 rounded-xl transition-colors flex items-start gap-2.5"
                      >
                        <span
                          className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                            notif.type === "danger"
                              ? "bg-rose-500"
                              : notif.type === "warning"
                              ? "bg-amber-500"
                              : "bg-blue-500"
                          }`}
                        />
                        <div>
                          <p className="text-xs font-semibold text-slate-800">
                            {notif.message}
                          </p>
                          <span className="text-[10px] text-slate-400 mt-0.5 block">
                            {notif.date}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Nút Sao lưu */}
            <button
              onClick={onOpenBackupModal}
              title="Sao lưu / Khôi phục dữ liệu JSON"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all shadow-xs"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Sao lưu</span>
            </button>

            {/* Nút Mẫu demo */}
            <button
              onClick={onOpenResetConfirm}
              title="Nạp lại bộ dữ liệu mẫu gia đình chuẩn"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all shadow-xs"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>Mẫu demo</span>
            </button>

            {/* Nút Thêm giao dịch */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-all shadow-md shadow-blue-600/25 active:scale-95"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Thêm giao dịch</span>
              <span className="sm:hidden">Thêm</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
