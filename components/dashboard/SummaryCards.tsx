"use client";

import React from "react";
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  PiggyBank,
  Sparkles,
  CreditCard,
} from "lucide-react";
import { useFinance } from "@/context/FinanceContext";
import { formatVND, getMonthDisplayLabel } from "@/lib/formatters";

export function SummaryCards() {
  const { summary, selectedMonth, activePerspective } = useFinance();
  const periodLabel =
    selectedMonth === "ALL" ? "Toàn thời gian" : getMonthDisplayLabel(selectedMonth);

  const perspectiveLabel =
    activePerspective === "ALL"
      ? "My Home"
      : activePerspective === "HUSBAND"
      ? "Anh Chuột"
      : "Bé Mèo";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {/* 1. THẺ TÀI SẢN RÒNG (Blue Gradient) */}
      <div className="relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white shadow-lg shadow-blue-600/15">
        <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-100 flex items-center gap-1.5">
            <Wallet className="w-4 h-4 text-blue-200" />
            Tài sản ròng ({perspectiveLabel})
          </span>
          <span className="p-2 rounded-2xl bg-white/15 text-white backdrop-blur-xs">
            <Sparkles className="w-4 h-4" />
          </span>
        </div>
        <div className="mt-3">
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
            {formatVND(summary.netWorth)}
          </h3>
          <p className="text-xs text-blue-200 mt-1 font-medium">
            Ví: {formatVND(summary.currentBalance)} · Dư nợ thẻ: {formatVND(summary.totalCreditDebt)}
          </p>
        </div>
      </div>

      {/* 2. THẺ THU NHẬP (Emerald Gradient) */}
      <div className="relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-500/15">
        <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-100 flex items-center gap-1.5">
            <ArrowDownLeft className="w-4 h-4 text-emerald-200" />
            Thu nhập ({perspectiveLabel})
          </span>
          <span className="p-2 rounded-2xl bg-white/15 text-white backdrop-blur-xs">
            <ArrowDownLeft className="w-4 h-4" />
          </span>
        </div>
        <div className="mt-3">
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
            {formatVND(summary.monthlyIncome)}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
              {activePerspective === "ALL"
                ? `Chồng: ${formatVND(summary.husbandIncome)} · Vợ: ${formatVND(summary.wifeIncome)}`
                : "Lương tháng nhận đủ"}
            </span>
          </div>
        </div>
      </div>

      {/* 3. THẺ CHI TIÊU (Rose Gradient) */}
      <div className="relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-rose-500 via-rose-600 to-pink-700 text-white shadow-lg shadow-rose-500/15">
        <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-100 flex items-center gap-1.5">
            <ArrowUpRight className="w-4 h-4 text-rose-200" />
            Chi tiêu ({perspectiveLabel})
          </span>
          <span className="p-2 rounded-2xl bg-white/15 text-white backdrop-blur-xs">
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>
        <div className="mt-3">
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
            {formatVND(summary.monthlyExpense)}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
              {activePerspective === "ALL"
                ? `Việc chung nhà: ${formatVND(summary.familySharedExpense)}`
                : `${periodLabel}`}
            </span>
          </div>
        </div>
      </div>

      {/* 4. THẺ TIẾT KIỆM (Amber Gradient) */}
      <div className="relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-white shadow-lg shadow-amber-500/15">
        <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-100 flex items-center gap-1.5">
            <PiggyBank className="w-4 h-4 text-amber-200" />
            Tiết kiệm tích lũy
          </span>
          <span className="p-2 rounded-2xl bg-white/15 text-white backdrop-blur-xs">
            <PiggyBank className="w-4 h-4" />
          </span>
        </div>
        <div className="mt-3">
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
            {formatVND(summary.savingsAmount)}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
              {summary.savingsRate}% tỷ lệ tích lũy
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
