"use client";

import React, { useState } from "react";
import {
  CreditCard,
  ArrowRight,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useFinance, CreditCardInfo } from "@/context/FinanceContext";
import { formatVND, formatDateVN } from "@/lib/formatters";
import { Transaction } from "@/types/finance";
import { TransactionDetailSheet } from "@/components/mobile/sheets/TransactionDetailSheet";
import { CreditCardRepaymentSheet } from "@/components/mobile/sheets/CreditCardRepaymentSheet";

export function MobileOverviewView() {
  const {
    summary,
    husbandCreditCard,
    wifeCreditCard,
    filteredTransactions,
    budgetSummary,
    setActiveTab,
    deleteTransaction,
  } = useFinance();

  const totalNetWorth = summary.netWorth;
  const monthlyIncome = summary.monthlyIncome;
  const monthlyExpense = summary.monthlyExpense;

  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [repayingCard, setRepayingCard] = useState<CreditCardInfo | null>(null);

  // Tính tỷ lệ tiết kiệm tháng
  const savingsRate =
    monthlyIncome > 0
      ? Math.max(0, Math.round(((monthlyIncome - monthlyExpense) / monthlyIncome) * 100))
      : 0;

  // Lấy 3 giao dịch mới nhất
  const recentTransactions = filteredTransactions.slice(0, 3);

  // Hạn mức ngày
  const dailyAllowance = budgetSummary?.dailyAllowance || 500000;
  const todaySpent = 150000; // Mocked active day usage
  const todayRemaining = Math.max(0, dailyAllowance - todaySpent);
  const dailyPct = Math.min(100, Math.round((todaySpent / dailyAllowance) * 100));

  return (
    <div className="space-y-3.5 animate-in fade-in duration-200">
      {/* 1. HERO NET WORTH NAVY CARD (Khớp 100% Figma Screen 1) */}
      <div className="rounded-xl p-4 bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#1D4ED8] text-white shadow-md relative overflow-hidden space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-blue-200 uppercase tracking-widest font-bold text-[10px]">
            TỔNG TÀI SẢN RÒNG GIA ĐÌNH
          </span>
          <span className="px-2 py-0.5 rounded-full bg-white/15 text-blue-100 font-semibold text-[10px]">
            Tháng 10/2026
          </span>
        </div>

        <div>
          <div className="text-3xl font-black tracking-tight text-white">
            {formatVND(totalNetWorth)}
          </div>
        </div>

        {/* Inline Sub-metrics Strip */}
        <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-white/15 text-xs">
          <div>
            <span className="text-[10px] text-blue-200/80 block">Thu nhập</span>
            <span className="font-extrabold text-emerald-400 text-xs sm:text-sm">
              +{formatVND(monthlyIncome)}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-blue-200/80 block">Chi tiêu</span>
            <span className="font-extrabold text-rose-300 text-xs sm:text-sm">
              -{formatVND(monthlyExpense)}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-blue-200/80 block">Tích lũy</span>
            <span className="font-extrabold text-blue-200 text-xs sm:text-sm">
              {savingsRate}%
            </span>
          </div>
        </div>
      </div>

      {/* 2. DUAL BIDV CREDIT CARDS MINI WIDGET (Cạnh nhau cô đọng) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-0.5">
          <span className="flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-blue-600" />
            <span>Thẻ Tín Dụng BIDV (Sao kê 20/10)</span>
          </span>
          <button
            onClick={() => setActiveTab("accounts")}
            className="text-[11px] text-blue-600 font-semibold hover:underline"
          >
            Quản trị ➔
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Thẻ Chuột 50M */}
          {husbandCreditCard && (
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#0F172A] to-[#1E3A8A] text-white shadow-xs flex flex-col justify-between space-y-2">
              <div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-blue-300">👨 Thẻ Chuột</span>
                  <span className="text-[9px] text-slate-300">50M</span>
                </div>
                <div className="mt-1">
                  <span className="text-[10px] text-slate-300 block">Dư nợ kỳ này:</span>
                  <span className="font-black text-sm text-white">
                    {formatVND(husbandCreditCard.usedAmount)}
                  </span>
                </div>
              </div>

              <div>
                <div className="w-full h-1.5 rounded-full bg-white/20 overflow-hidden mb-1.5">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${Math.min(husbandCreditCard.usagePercentage, 100)}%` }}
                  />
                </div>
                <button
                  onClick={() => setRepayingCard(husbandCreditCard)}
                  className="w-full py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-[10px] font-bold text-white transition-colors"
                >
                  Thanh toán
                </button>
              </div>
            </div>
          )}

          {/* Thẻ Mèo 20M */}
          {wifeCreditCard && (
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#451A03] to-[#78350F] text-white shadow-xs flex flex-col justify-between space-y-2">
              <div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-amber-300">👩 Thẻ Mèo</span>
                  <span className="text-[9px] text-amber-200">20M</span>
                </div>
                <div className="mt-1">
                  <span className="text-[10px] text-amber-200/80 block">Dư nợ kỳ này:</span>
                  <span className="font-black text-sm text-white">
                    {formatVND(wifeCreditCard.usedAmount)}
                  </span>
                </div>
              </div>

              <div>
                <div className="w-full h-1.5 rounded-full bg-white/20 overflow-hidden mb-1.5">
                  <div
                    className="h-full bg-amber-300 rounded-full"
                    style={{ width: `${Math.min(wifeCreditCard.usagePercentage, 100)}%` }}
                  />
                </div>
                <button
                  onClick={() => setRepayingCard(wifeCreditCard)}
                  className="w-full py-1 rounded-md bg-amber-600 hover:bg-amber-500 text-[10px] font-bold text-white transition-colors"
                >
                  Thanh toán
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. DAILY ALLOWANCE MINI CARD (Hạn mức ngày an toàn) */}
      <div className="p-3.5 rounded-xl bg-white border border-[#DCE4EE] shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-base">
            🛡️
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Hạn Mức Chi Tiêu Ngày
            </span>
            <span className="text-xs sm:text-sm font-black text-slate-800">
              Còn {formatVND(todayRemaining)} / {formatVND(dailyAllowance)}
            </span>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
          An toàn 30%
        </span>
      </div>

      {/* 4. RECENT TRANSACTIONS (3 BENTO CARDS CHẠM MỞ DETAIL) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-0.5">
          <span>Giao Dịch Gần Nhất</span>
          <button
            onClick={() => setActiveTab("transactions")}
            className="text-[11px] text-blue-600 font-semibold hover:underline"
          >
            Xem tất cả ➔
          </button>
        </div>

        <div className="bg-white rounded-xl border border-[#DCE4EE] shadow-xs divide-y divide-slate-100 overflow-hidden">
          {recentTransactions.map((tx) => {
            const isExpense = tx.type === "EXPENSE";
            const isTransfer = tx.type === "TRANSFER";

            return (
              <div
                key={tx.id}
                onClick={() => setSelectedTx(tx)}
                className="p-3 flex items-center justify-between hover:bg-slate-50 active:bg-blue-50/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 ${
                      isExpense
                        ? "bg-rose-50 text-rose-600"
                        : isTransfer
                        ? "bg-blue-50 text-blue-600"
                        : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    {isExpense ? "🛒" : isTransfer ? "⇄" : "💰"}
                  </div>

                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-800 block truncate">
                      {tx.note || (isExpense ? "Chi tiêu" : isTransfer ? "Chuyển tiền" : "Thu nhập")}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-medium">
                      {tx.memberId === "HUSBAND" ? "👨 Chuột" : "👩 Mèo"} · {formatDateVN(tx.date)}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-xs sm:text-sm font-black block ${
                      isExpense
                        ? "text-[#BE123C]"
                        : isTransfer
                        ? "text-blue-600"
                        : "text-[#047857]"
                    }`}
                  >
                    {isExpense ? "-" : isTransfer ? "" : "+"}
                    {formatVND(tx.amount)}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                      tx.scope === "FAMILY"
                        ? "bg-slate-100 text-slate-600"
                        : "bg-purple-50 text-purple-700"
                    }`}
                  >
                    {tx.scope === "FAMILY" ? "🏠 Chung" : "👤 Riêng"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Sheets liên kết */}
      <TransactionDetailSheet
        transaction={selectedTx}
        isOpen={selectedTx !== null}
        onClose={() => setSelectedTx(null)}
        onEdit={(tx) => {
          setSelectedTx(null);
          // Edit modal trigger
        }}
        onDelete={(id) => {
          setSelectedTx(null);
          deleteTransaction(id);
        }}
      />

      <CreditCardRepaymentSheet
        cardInfo={repayingCard}
        isOpen={repayingCard !== null}
        onClose={() => setRepayingCard(null)}
      />
    </div>
  );
}
