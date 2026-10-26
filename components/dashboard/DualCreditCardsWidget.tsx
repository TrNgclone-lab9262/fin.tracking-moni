"use client";

import React from "react";
import { CreditCard, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { useFinance } from "@/context/FinanceContext";
import { formatVND } from "@/lib/formatters";

export function DualCreditCardsWidget() {
  const { husbandCreditCard, wifeCreditCard, setActiveTab } = useFinance();

  const getStatusBadge = (percentage: number) => {
    if (percentage >= 90) {
      return { text: "Nguy cơ cao", color: "text-rose-400", bar: "bg-rose-500" };
    }
    if (percentage >= 70) {
      return { text: "Cảnh báo", color: "text-amber-400", bar: "bg-amber-400" };
    }
    return { text: "An toàn", color: "text-emerald-400", bar: "bg-emerald-400" };
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-[#DCE4EE] shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#E9EEF5]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#172B4D]">
              Quản lý 2 Thẻ Tín Dụng BIDV Credit
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Chốt sao kê ngày 20 hàng tháng · Hạn trả ngày 25
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab("accounts")}
          className="text-xs font-semibold px-2.5 py-1.5 rounded-md text-blue-600 hover:text-blue-700 hover:bg-blue-50/70 transition-all flex items-center gap-1"
        >
          <span>Chi tiết ví</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. THẺ BIDV CREDIT (ANH CHUỘT) - HẠN MỨC 50TR */}
        {husbandCreditCard && (
          <div className="relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-[#0F172A] via-[#172B4D] to-[#1E3A8A] text-white shadow-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest block">
                  BIDV PLATINUM CREDIT
                </span>
                <h4 className="text-sm font-extrabold text-white mt-0.5">
                  Thẻ 👨 Anh Chuột
                </h4>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/15 text-blue-200">
                Hạn mức 50 Triệu
              </span>
            </div>

            <div className="mt-4">
              <div className="flex justify-between items-baseline text-xs mb-1">
                <span className="text-slate-300">Dư nợ đã dùng:</span>
                <span className="font-black text-amber-300 text-sm">
                  {formatVND(husbandCreditCard.usedAmount)}
                </span>
              </div>

              {/* Thanh đo hạn mức 3 cấp độ */}
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    getStatusBadge(husbandCreditCard.usagePercentage).bar
                  }`}
                  style={{ width: `${Math.min(husbandCreditCard.usagePercentage, 100)}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-300 mt-2 font-medium">
                <span>Khả dụng: {formatVND(husbandCreditCard.availableAmount)}</span>
                <span className={`font-bold ${getStatusBadge(husbandCreditCard.usagePercentage).color}`}>
                  {husbandCreditCard.usagePercentage}% ({getStatusBadge(husbandCreditCard.usagePercentage).text})
                </span>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-300">
              <span>Sao kê ngày 20 · Hạn trả: 25/10</span>
              <span className="font-mono text-slate-400">4111 •••• 5050</span>
            </div>
          </div>
        )}

        {/* 2. THẺ BIDV CREDIT (BÉ MÈO) - HẠN MỨC 20TR */}
        {wifeCreditCard && (
          <div className="relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-[#451A03] via-[#78350F] to-[#B45309] text-white shadow-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-200 uppercase tracking-widest block">
                  BIDV GOLD FLEXI
                </span>
                <h4 className="text-sm font-extrabold text-white mt-0.5">
                  Thẻ 👩 Bé Mèo
                </h4>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/15 text-amber-200">
                Hạn mức 20 Triệu
              </span>
            </div>

            <div className="mt-4">
              <div className="flex justify-between items-baseline text-xs mb-1">
                <span className="text-amber-100">Dư nợ đã dùng:</span>
                <span className="font-black text-amber-200 text-sm">
                  {formatVND(wifeCreditCard.usedAmount)}
                </span>
              </div>

              {/* Thanh đo hạn mức 3 cấp độ */}
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    getStatusBadge(wifeCreditCard.usagePercentage).bar
                  }`}
                  style={{ width: `${Math.min(wifeCreditCard.usagePercentage, 100)}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] text-amber-100 mt-2 font-medium">
                <span>Khả dụng: {formatVND(wifeCreditCard.availableAmount)}</span>
                <span className={`font-bold ${getStatusBadge(wifeCreditCard.usagePercentage).color}`}>
                  {wifeCreditCard.usagePercentage}% ({getStatusBadge(wifeCreditCard.usagePercentage).text})
                </span>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] text-amber-100">
              <span>Sao kê ngày 20 · Hạn trả: 25/10</span>
              <span className="font-mono text-amber-200/80">4111 •••• 2020</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
