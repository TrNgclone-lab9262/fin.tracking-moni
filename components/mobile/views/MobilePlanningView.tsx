"use client";

import React, { useState } from "react";
import {
  Target,
  Sparkles,
  TrendingUp,
  Coins,
  ShieldCheck,
  Calendar,
  Plus,
} from "lucide-react";
import { useFinance } from "@/context/FinanceContext";
import { formatVND } from "@/lib/formatters";
import { SavingsGoal } from "@/types/finance";
import { GoalDepositSheet } from "@/components/mobile/sheets/GoalDepositSheet";

export function MobilePlanningView() {
  const { goals, budgetSummary, categories } = useFinance();

  const [activeTab, setActiveTab] = useState<"GOALS" | "BUDGET">("GOALS");
  const [depositingGoal, setDepositingGoal] = useState<SavingsGoal | null>(null);

  const dailyAllowance = budgetSummary?.dailyAllowance || 500000;
  const todaySpent = 150000;
  const todayRemaining = Math.max(0, dailyAllowance - todaySpent);
  const dailyPct = Math.min(100, Math.round((todaySpent / dailyAllowance) * 100));

  return (
    <div className="space-y-3.5 animate-in fade-in duration-200">
      {/* 1. Header Switcher (Khớp 100% Figma Screen 6) */}
      <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold">
        <button
          onClick={() => setActiveTab("GOALS")}
          className={`py-2 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 ${
            activeTab === "GOALS"
              ? "bg-white text-blue-600 shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>Hũ Tích Lũy ({goals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("BUDGET")}
          className={`py-2 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 ${
            activeTab === "BUDGET"
              ? "bg-white text-blue-600 shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Coins className="w-3.5 h-3.5" />
          <span>Hạn Mức & Ngân Sách</span>
        </button>
      </div>

      {/* 2. DAILY ALLOWANCE WIDGET (Luôn hiển thị) */}
      <div className="p-3.5 rounded-xl bg-white border border-[#DCE4EE] shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-base">🛡️</span>
            <div>
              <span className="font-bold text-slate-800 text-xs block">
                Hạn Mức Chi Tiêu Ngày
              </span>
              <span className="text-[10px] text-slate-400 block font-medium">
                Ngân sách ngày giúp giữ nhịp chi tiêu gia đình
              </span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[11px]">
            Còn {100 - dailyPct}%
          </span>
        </div>

        <div>
          <div className="flex justify-between items-baseline text-xs mb-1">
            <span className="text-slate-500 text-[11px]">Hôm nay còn chi được:</span>
            <span className="font-black text-sm text-emerald-600">
              {formatVND(todayRemaining)} / {formatVND(dailyAllowance)}
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{ width: `${dailyPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. NỘI DUNG THEO TAB CHỌN */}
      {activeTab === "GOALS" ? (
        /* DANH SÁCH 3 HŨ MỤC TIÊU TÍCH LŨY TƯƠNG LAI */
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-0.5">
            <span>3 Hũ Tích Lũy Tương Lai Tổ Ấm</span>
            <span className="text-[10px] text-blue-600 font-medium">Cán đích 2028</span>
          </div>

          {goals.map((g) => {
            const current = g.currentAmount;
            const target = g.targetAmount;
            const pct = Math.min(100, Math.round((current / target) * 1000) / 10);
            const isHome = g.name.toLowerCase().includes("nhà");

            return (
              <div
                key={g.id}
                className={`p-4 rounded-xl border shadow-xs space-y-3 ${
                  isHome
                    ? "bg-[#F5F3FF] border-[#DDD6FE]"
                    : "bg-white border-[#DCE4EE]"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{isHome ? "🏡" : "🎯"}</span>
                    <div>
                      <h4 className={`font-extrabold text-xs sm:text-sm ${isHome ? "text-[#4338CA]" : "text-slate-800"}`}>
                        {g.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 block font-medium">
                        {g.deadline ? `Hạn mục tiêu: ${g.deadline}` : "Tổ ấm tương lai"}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-black px-2 py-0.5 rounded-md ${
                      isHome
                        ? "bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE]"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {pct}%
                  </span>
                </div>

                <div>
                  <div className="flex justify-between items-baseline text-xs mb-1">
                    <span className="text-slate-500 text-[11px]">Đã tích lũy:</span>
                    <span className={`font-black ${isHome ? "text-[#312E81]" : "text-slate-800"}`}>
                      {formatVND(current)} / {formatVND(target)}
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-200/70 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isHome ? "bg-[#4F46E5]" : "bg-blue-600"
                      }`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-medium">
                    {isHome ? "Còn ~26 tháng · Cần ~25M/tháng" : "Tích lũy đều đặn"}
                  </span>
                  <button
                    onClick={() => setDepositingGoal(g)}
                    className={`px-3 py-1.5 rounded-lg text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-colors ${
                      isHome ? "bg-[#4F46E5] hover:bg-indigo-700" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Nạp hũ</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TIẾN ĐỘ NGÂN SÁCH DANH MỤC THÁNG 10 */
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-0.5">
            <span>Tiến Độ Ngân Sách Danh Mục Tháng 10</span>
            <span className="text-[10px] text-slate-400 font-medium">Chi tiêu an toàn</span>
          </div>

          <div className="bg-white rounded-xl border border-[#DCE4EE] shadow-xs divide-y divide-slate-100 overflow-hidden">
            {(budgetSummary?.items || []).slice(0, 5).map((item) => {
              const pct = Math.min(100, Math.round(item.percentage));
              const isOver = item.spentAmount > item.limitAmount;

              return (
                <div key={item.categoryId} className="p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: item.categoryColor || "#2563EB" }}
                      />
                      <span className="font-bold text-slate-800">{item.categoryName}</span>
                    </div>

                    <span className={`font-bold ${isOver ? "text-rose-600" : "text-slate-600"}`}>
                      {formatVND(item.spentAmount)} / {formatVND(item.limitAmount)}
                    </span>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isOver ? "bg-rose-500" : "bg-blue-600"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Sheet nạp tiền vào hũ tích lũy */}
      <GoalDepositSheet
        goal={depositingGoal}
        isOpen={depositingGoal !== null}
        onClose={() => setDepositingGoal(null)}
      />
    </div>
  );
}
