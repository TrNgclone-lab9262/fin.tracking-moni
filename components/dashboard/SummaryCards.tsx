"use client";

import React from "react";
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  PiggyBank,
  Sparkles,
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. THẺ HERO TÀI SẢN RÒNG (Navy Gradient) */}
      <div className="relative overflow-hidden rounded-xl p-5 bg-gradient-to-br from-[#172B4D] via-[#1E3A8A] to-[#1E40AF] text-white shadow-xs">
        <div className="absolute -right-3 -bottom-3 w-24 h-24 bg-white/10 rounded-full blur-lg pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-200 flex items-center gap-1.5">
            <Wallet className="w-4 h-4 text-blue-300" />
            Tài sản ròng ({perspectiveLabel})
          </span>
          <span className="p-1.5 rounded-lg bg-white/15 text-white backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
        </div>
        <div className="mt-3">
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {formatVND(summary.netWorth)}
          </h3>
          <p className="text-[11px] text-blue-200/90 mt-1.5 font-medium">
            Ví: {formatVND(summary.currentBalance)} · Nợ thẻ: {formatVND(summary.totalCreditDebt)}
          </p>
        </div>
      </div>

      {/* 2. THẺ THU NHẬP (Flat White Card + Emerald Accent) */}
      <div className="relative rounded-xl p-5 bg-white border border-[#DCE4EE] shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowDownLeft className="w-3.5 h-3.5" />
            </div>
            Thu nhập ({perspectiveLabel})
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
            {periodLabel}
          </span>
        </div>
        <div className="mt-3">
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#172B4D]">
            {formatVND(summary.monthlyIncome)}
          </h3>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[11px] text-slate-500 font-medium truncate">
              {activePerspective === "ALL"
                ? `Chồng: ${formatVND(summary.husbandIncome)} · Vợ: ${formatVND(summary.wifeIncome)}`
                : "Thu nhập ghi nhận theo kỳ"}
            </span>
          </div>
        </div>
      </div>

      {/* 3. THẺ CHI TIÊU (Flat White Card + Rose Accent) */}
      <div className="relative rounded-xl p-5 bg-white border border-[#DCE4EE] shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
            Chi tiêu ({perspectiveLabel})
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-100">
            {periodLabel}
          </span>
        </div>
        <div className="mt-3">
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#172B4D]">
            {formatVND(summary.monthlyExpense)}
          </h3>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[11px] text-slate-500 font-medium truncate">
              {activePerspective === "ALL"
                ? `Sinh hoạt chung: ${formatVND(summary.familySharedExpense)}`
                : `Tổng chi trong ${periodLabel}`}
            </span>
          </div>
        </div>
      </div>

      {/* 4. THẺ TIẾT KIỆM (Flat White Card + Amber/Brand Accent) */}
      <div className="relative rounded-xl p-5 bg-white border border-[#DCE4EE] shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <PiggyBank className="w-3.5 h-3.5" />
            </div>
            Tiết kiệm tích lũy
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-100">
            {summary.savingsRate}% tích lũy
          </span>
        </div>
        <div className="mt-3">
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#172B4D]">
            {formatVND(summary.savingsAmount)}
          </h3>
          <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all"
              style={{ width: `${Math.min(Math.max(summary.savingsRate, 0), 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
