"use client";

import React, { useState } from "react";
import { CreditCardRepaymentSheet } from "@/components/mobile/sheets/CreditCardRepaymentSheet";
import { CreditCard, ArrowRight, ShieldCheck, Wifi, Sparkles, AlertCircle } from "lucide-react";
import { useFinance, CreditCardInfo } from "@/context/FinanceContext";
import { formatVND } from "@/lib/formatters";

export function DualCreditCardsWidget() {
  const [repayingCard, setRepayingCard] = useState<CreditCardInfo | null>(null);
  const { husbandCreditCard, wifeCreditCard, setActiveTab } = useFinance();

  const getStatusBadge = (percentage: number) => {
    if (percentage >= 90) {
      return { text: "Nguy cơ cao", color: "text-rose-400", bar: "bg-rose-500", border: "border-rose-500/40" };
    }
    if (percentage >= 70) {
      return { text: "Cảnh báo", color: "text-amber-400", bar: "bg-amber-400", border: "border-amber-500/40" };
    }
    return { text: "An toàn", color: "text-emerald-400", bar: "bg-emerald-400", border: "border-emerald-500/40" };
  };

  return (
    <div className="bg-white rounded-[3px] p-5 border border-[#DCE4EE] shadow-xs space-y-4">
      {/* Widget Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E9EEF5]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[3px] bg-blue-50 text-blue-600 flex items-center justify-center">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#172B4D]">
              Quản Lý 2 Thẻ Tín Dụng BIDV Credit
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Chuẩn Corporate Smart Card (ISO 7810 ID-1 • 1.58:1) · Chốt sao kê ngày 20 · Hạn trả ngày 25
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab("accounts")}
          className="text-xs font-semibold px-2.5 py-1.5 rounded-[3px] text-blue-600 hover:text-blue-700 hover:bg-blue-50/70 transition-all flex items-center gap-1 border border-transparent hover:border-blue-200"
        >
          <span>Chi tiết ví</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ISO 7810 ID-1 Dual Cards Grid (Aspect Ratio 1.58:1) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 1. THẺ BIDV PLATINUM CREDIT - ANH CHUỘT (50TR) */}
        {husbandCreditCard && (
          <div className="relative aspect-[1.58/1] w-full rounded-[6px] p-5 sm:p-6 bg-gradient-to-br from-[#0F172A] via-[#172B4D] to-[#1E3A8A] text-white shadow-md border border-slate-700/60 flex flex-col justify-between overflow-hidden select-none">
            {/* Holographic Watermark / Circuit Texture */}
            <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:12px_12px] opacity-40 pointer-events-none" />

            {/* Top Row: Bank Brand + Contactless Wave */}
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-black tracking-wider text-white font-mono">
                    BIDV
                  </span>
                  <span className="text-[9px] font-bold tracking-widest text-blue-300 uppercase px-1.5 py-0.5 bg-blue-500/20 rounded-[3px] border border-blue-400/30">
                    PLATINUM
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 font-mono mt-0.5 tracking-wider">
                  CORPORATE SMART ID
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-blue-200 rotate-90" />
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-[3px] bg-white/10 text-blue-200 border border-white/20">
                  50.000.000 ₫
                </span>
              </div>
            </div>

            {/* Middle Row: EMV Metallic Chip + Balance Overview */}
            <div className="relative z-10 flex items-center justify-between my-auto">
              {/* Smart Card EMV Chip Simulation */}
              <div className="w-11 h-8 rounded-[3px] bg-gradient-to-tr from-amber-200 via-yellow-400 to-amber-100 border border-amber-500/50 p-1 shadow-inner relative flex flex-col justify-between overflow-hidden">
                <div className="w-full h-[1px] bg-amber-800/40 my-auto" />
                <div className="absolute inset-y-0 left-1/3 w-[1px] bg-amber-800/40" />
                <div className="absolute inset-y-0 right-1/3 w-[1px] bg-amber-800/40" />
              </div>

              {/* Dư nợ kỳ này */}
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-slate-300 block font-medium">
                  Dư Nợ Đang Dùng
                </span>
                <span className="text-lg sm:text-2xl font-black text-amber-300 tracking-tight tabular-nums">
                  {formatVND(husbandCreditCard.usedAmount)}
                </span>
              </div>
            </div>

            {/* Bottom Row: Cardholder Name, Masked PAN, & Progress Bar */}
            <div className="relative z-10 space-y-2">
              {/* Progress bar */}
              <div className="w-full h-1.5 bg-black/40 rounded-[3px] overflow-hidden">
                <div
                  className={`h-full transition-all rounded-[3px] ${
                    getStatusBadge(husbandCreditCard.usagePercentage).bar
                  }`}
                  style={{ width: `${Math.min(husbandCreditCard.usagePercentage, 100)}%` }}
                />
              </div>

              <div className="flex items-end justify-between pt-1">
                <div>
                  <p className="text-[9px] text-slate-400 font-mono tracking-wider">CARDHOLDER</p>
                  <p className="text-xs font-bold text-white tracking-widest font-mono">
                    LE VAN CHUOT
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] text-slate-400 font-mono">VALID THRU</p>
                  <p className="text-xs font-bold text-slate-200 font-mono">25/10</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-slate-400 font-mono">ACCOUNT NO.</p>
                  <p className="text-xs font-bold text-blue-200 font-mono tracking-wider">
                    •••• 5050
                  </p>
                </div>
                <button
                  onClick={() => setRepayingCard(husbandCreditCard)}
                  className="px-3 py-1 bg-white hover:bg-slate-100 text-[#172B4D] font-bold text-xs rounded-[3px] transition-colors shadow-xs"
                >
                  Thanh Toán
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. THẺ BIDV FLEXI GOLD / FEMININE ROSE - BÉ MÈO (20TR) */}
        {wifeCreditCard && (
          <div className="relative aspect-[1.58/1] w-full rounded-[6px] p-5 sm:p-6 bg-gradient-to-br from-[#881337] via-[#9F1239] to-[#BE123C] text-white shadow-md border border-rose-400/40 flex flex-col justify-between overflow-hidden select-none">
            {/* Holographic Watermark / Rose Glow Texture */}
            <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-rose-400/20 blur-2xl pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff0f_1px,transparent_1px)] [background-size:12px_12px] opacity-40 pointer-events-none" />

            {/* Top Row: Bank Brand + Contactless Wave */}
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-black tracking-wider text-white font-mono">
                    BIDV
                  </span>
                  <span className="text-[9px] font-bold tracking-widest text-rose-100 uppercase px-1.5 py-0.5 bg-white/20 rounded-[3px] border border-white/30 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> FLEXI GOLD
                  </span>
                </div>
                <p className="text-[10px] text-rose-200 font-mono mt-0.5 tracking-wider">
                  CORPORATE SMART ID
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-rose-200 rotate-90" />
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-[3px] bg-white/15 text-rose-100 border border-white/20">
                  20.000.000 ₫
                </span>
              </div>
            </div>

            {/* Middle Row: EMV Metallic Chip + Balance Overview */}
            <div className="relative z-10 flex items-center justify-between my-auto">
              {/* Smart Card EMV Chip Simulation */}
              <div className="w-11 h-8 rounded-[3px] bg-gradient-to-tr from-amber-200 via-yellow-400 to-amber-100 border border-amber-500/50 p-1 shadow-inner relative flex flex-col justify-between overflow-hidden">
                <div className="w-full h-[1px] bg-amber-800/40 my-auto" />
                <div className="absolute inset-y-0 left-1/3 w-[1px] bg-amber-800/40" />
                <div className="absolute inset-y-0 right-1/3 w-[1px] bg-amber-800/40" />
              </div>

              {/* Dư nợ kỳ này */}
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-rose-200 block font-medium">
                  Dư Nợ Đang Dùng
                </span>
                <span className="text-lg sm:text-2xl font-black text-white tracking-tight tabular-nums">
                  {formatVND(wifeCreditCard.usedAmount)}
                </span>
              </div>
            </div>

            {/* Bottom Row: Cardholder Name, Masked PAN, & Progress Bar */}
            <div className="relative z-10 space-y-2">
              {/* Progress bar */}
              <div className="w-full h-1.5 bg-black/40 rounded-[3px] overflow-hidden">
                <div
                  className={`h-full transition-all rounded-[3px] ${
                    getStatusBadge(wifeCreditCard.usagePercentage).bar
                  }`}
                  style={{ width: `${Math.min(wifeCreditCard.usagePercentage, 100)}%` }}
                />
              </div>

              <div className="flex items-end justify-between pt-1">
                <div>
                  <p className="text-[9px] text-rose-300 font-mono tracking-wider">CARDHOLDER</p>
                  <p className="text-xs font-bold text-white tracking-widest font-mono">
                    TRAN THI MEO
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] text-rose-300 font-mono">VALID THRU</p>
                  <p className="text-xs font-bold text-rose-100 font-mono">25/10</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-rose-300 font-mono">ACCOUNT NO.</p>
                  <p className="text-xs font-bold text-rose-200 font-mono tracking-wider">
                    •••• 2020
                  </p>
                </div>
                <button
                  onClick={() => setRepayingCard(wifeCreditCard)}
                  className="px-3 py-1 bg-white hover:bg-rose-50 text-rose-700 font-bold text-xs rounded-[3px] transition-colors shadow-xs"
                >
                  Thanh Toán
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Sheet Repayment Modal */}
      {repayingCard && (
        <CreditCardRepaymentSheet
          cardInfo={repayingCard}
          isOpen={!!repayingCard}
          onClose={() => setRepayingCard(null)}
        />
      )}
    </div>
  );
}

