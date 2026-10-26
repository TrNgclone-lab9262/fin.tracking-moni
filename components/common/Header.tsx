"use client";

import React, { useState } from "react";
import {
  Wallet,
  PlusCircle,
  HardDriveDownload,
  RotateCcw,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { useFinance } from "@/context/FinanceContext";
import { getMonthDisplayLabel } from "@/lib/formatters";

interface HeaderProps {
  onOpenAddModal: () => void;
  onOpenBackupModal: () => void;
  onOpenResetConfirm: () => void;
}

export function Header({
  onOpenAddModal,
  onOpenBackupModal,
  onOpenResetConfirm,
}: HeaderProps) {
  const { selectedMonth, setSelectedMonth, availableMonths } = useFinance();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-xl tracking-tight bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 bg-clip-text text-transparent">
                  LOVELY MONEY
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Đã đồng bộ LocalStorage
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium hidden sm:block">
                Quản lý chi tiêu cá nhân thông minh & bảo mật
              </p>
            </div>
          </div>

          {/* Controls & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Bộ chọn tháng hiển thị */}
            <div className="relative">
              <div className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer border border-slate-200">
                <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-transparent border-none outline-none cursor-pointer pr-1 font-semibold text-slate-700 text-xs sm:text-sm"
                >
                  <option value="ALL">Tất cả thời gian</option>
                  {availableMonths.map((m) => (
                    <option key={m} value={m}>
                      {getMonthDisplayLabel(m)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Nút Sao lưu / Khôi phục */}
            <button
              onClick={onOpenBackupModal}
              title="Sao lưu hoặc phục hồi dữ liệu JSON"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all shadow-sm active:scale-95"
            >
              <HardDriveDownload className="w-4 h-4 text-slate-500" />
              <span>Sao lưu / Khôi phục</span>
            </button>

            {/* Nút Khôi phục dữ liệu mẫu */}
            <button
              onClick={onOpenResetConfirm}
              title="Khôi phục lại dữ liệu mẫu ban đầu để test UI"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all shadow-sm active:scale-95"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>Dữ liệu mẫu</span>
            </button>

            {/* Nút Thêm giao dịch (Primary) */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-all shadow-md shadow-blue-600/25 active:scale-95"
            >
              <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Thêm giao dịch</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
