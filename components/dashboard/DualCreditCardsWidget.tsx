"use client";

import React from "react";
import { CreditCard, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { useFinance } from "@/context/FinanceContext";
import { formatVND } from "@/lib/formatters";

export function DualCreditCardsWidget() {
  const { husbandCreditCard, wifeCreditCard, setActiveTab } = useFinance();

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-800">
              Quản lý 2 Thẻ Tín Dụng BIDV Credit
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Kiểm soát dư nợ & hạn mức chi tiêu của 2 vợ chồng
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab("accounts")}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          <span>Chi tiết ví</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. THẺ BIDV CREDIT (CHỒNG) - HẠN MỨC 50TR */}
        {husbandCreditCard && (
          <div className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest block">
                  BIDV PLATINUM CREDIT
                </span>
                <h4 className="text-sm font-extrabold text-white mt-0.5">
                  Thẻ Anh Chuột
                </h4>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/15 text-blue-200">
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

              {/* Thanh đo hạn mức */}
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    husbandCreditCard.usagePercentage > 70
                      ? "bg-rose-500"
                      : "bg-emerald-400"
                  }`}
                  style={{ width: `${husbandCreditCard.usagePercentage}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-300 mt-2 font-medium">
                <span>Khả dụng: {formatVND(husbandCreditCard.availableAmount)}</span>
                <span className="font-bold text-emerald-400">
                  {husbandCreditCard.usagePercentage}% (An toàn)
                </span>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-300">
              <span>Sao kê ngày 20 · Hạn trả: 25/10</span>
              <span className="font-mono text-slate-400">4111 •••• 5050</span>
            </div>
          </div>
        )}

        {/* 2. THẺ BIDV CREDIT (VỢ) - HẠN MỨC 20TR */}
        {wifeCreditCard && (
          <div className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-amber-950 via-slate-900 to-rose-950 text-white shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest block">
                  BIDV GOLD CREDIT
                </span>
                <h4 className="text-sm font-extrabold text-white mt-0.5">
                  Thẻ Bé Mèo
                </h4>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/15 text-amber-200">
                Hạn mức 20 Triệu
              </span>
            </div>

            <div className="mt-4">
              <div className="flex justify-between items-baseline text-xs mb-1">
                <span className="text-slate-300">Dư nợ đã dùng:</span>
                <span className="font-black text-amber-300 text-sm">
                  {formatVND(wifeCreditCard.usedAmount)}
                </span>
              </div>

              {/* Thanh đo hạn mức */}
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    wifeCreditCard.usagePercentage > 70
                      ? "bg-rose-500"
                      : "bg-emerald-400"
                  }`}
                  style={{ width: `${wifeCreditCard.usagePercentage}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-300 mt-2 font-medium">
                <span>Khả dụng: {formatVND(wifeCreditCard.availableAmount)}</span>
                <span className="font-bold text-emerald-400">
                  {wifeCreditCard.usagePercentage}% (An toàn)
                </span>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-300">
              <span>Sao kê ngày 22 · Hạn trả: 28/10</span>
              <span className="font-mono text-slate-400">4111 •••• 2020</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
