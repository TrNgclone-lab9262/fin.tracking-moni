"use client";

import React, { useState, useMemo } from "react";
import {
  CreditCard,
  Plus,
  Building2,
  Banknote,
  CheckCircle2,
  AlertTriangle,
  Wallet,
} from "lucide-react";
import { useFinance, CreditCardInfo } from "@/context/FinanceContext";
import { formatVND } from "@/lib/formatters";
import { Account } from "@/types/finance";
import { CreditCardRepaymentSheet } from "@/components/mobile/sheets/CreditCardRepaymentSheet";

interface MobileAccountsViewProps {
  onOpenAddAccount?: () => void;
}

export function MobileAccountsView({ onOpenAddAccount }: MobileAccountsViewProps) {
  const {
    accounts,
    husbandCreditCard,
    wifeCreditCard,
    activePerspective,
  } = useFinance();

  const [repayingCard, setRepayingCard] = useState<CreditCardInfo | null>(null);

  // Lọc tài khoản theo perspective
  const filteredAccounts = useMemo(() => {
    if (activePerspective === "HUSBAND") {
      return accounts.filter((a) => a.owner === "HUSBAND");
    }
    if (activePerspective === "WIFE") {
      return accounts.filter((a) => a.owner === "WIFE");
    }
    return accounts;
  }, [accounts, activePerspective]);

  // Tổng số dư khả dụng (không tính thẻ tín dụng)
  const totalAvailable = useMemo(() => {
    return filteredAccounts
      .filter((a) => a.type !== "CREDIT_CARD")
      .reduce((sum, a) => sum + Math.max(0, a.currentBalance), 0);
  }, [filteredAccounts]);

  // Tổng dư nợ thẻ tín dụng
  const totalCreditDebt = useMemo(() => {
    return filteredAccounts
      .filter((a) => a.type === "CREDIT_CARD")
      .reduce((sum, a) => sum + Math.max(0, a.currentBalance), 0);
  }, [filteredAccounts]);

  // Tách tài khoản bank / tiền mặt
  const bankAndCashAccounts = filteredAccounts.filter((a) => a.type !== "CREDIT_CARD");

  return (
    <div className="space-y-3.5 animate-in fade-in duration-200">
      {/* 1. HEADER 2 CHỈ SỐ TÀI CHÍNH TỔNG (Khớp 100% Figma Screen 5) */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3.5 rounded-xl bg-white border border-[#DCE4EE] shadow-xs space-y-1">
          <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider block">
            Tổng khả dụng (Ví & Bank)
          </span>
          <span className="text-base sm:text-lg font-black text-blue-600 block">
            {formatVND(totalAvailable)}
          </span>
          <span className="text-[10px] text-slate-400 font-medium block">
            Sẵn sàng chi tiêu sinh hoạt
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-[#DCE4EE] shadow-xs space-y-1">
          <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider block">
            Dư nợ 2 thẻ BIDV
          </span>
          <span className="text-base sm:text-lg font-black text-amber-600 block">
            {formatVND(totalCreditDebt)}
          </span>
          <span className="text-[10px] text-slate-400 font-medium block">
            Sao kê 20 · Hạn trả 25
          </span>
        </div>
      </div>

      {/* 2. KHỐI QUẢN TRỊ 2 THẺ TÍN DỤNG BIDV CREDIT (Chuẩn Vàng) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-0.5">
          <span className="flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-blue-600" />
            <span>Thẻ Tín Dụng BIDV Gia Đình</span>
          </span>
          <span className="text-[10px] text-slate-400 font-medium">Hạn mức 70M</span>
        </div>

        <div className="space-y-2.5">
          {/* Thẻ Chuột 50M */}
          {husbandCreditCard && (activePerspective === "ALL" || activePerspective === "HUSBAND") && (
            <div className="rounded-xl p-4 bg-gradient-to-br from-[#0F172A] via-[#172B4D] to-[#1E3A8A] text-white shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-blue-300 font-bold uppercase tracking-widest block">
                    BIDV PLATINUM CASHBACK
                  </span>
                  <span className="font-extrabold text-white text-sm">
                    Thẻ 👨 Anh Chuột (50 Triệu)
                  </span>
                </div>
                <span className="font-mono text-slate-300 text-xs">•••• 8868</span>
              </div>

              <div>
                <div className="flex items-baseline justify-between text-xs mb-1">
                  <span className="text-slate-300 text-[11px]">Dư nợ đã dùng:</span>
                  <span className="font-black text-base text-amber-300">
                    {formatVND(husbandCreditCard.usedAmount)}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all"
                    style={{ width: `${Math.min(husbandCreditCard.usagePercentage, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-300 mt-1.5">
                  <span>Khả dụng: {formatVND(husbandCreditCard.availableAmount)}</span>
                  <span className="font-bold text-amber-300">
                    {husbandCreditCard.usagePercentage}% (An toàn)
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/15 flex items-center justify-between">
                <span className="text-[10px] text-slate-300">
                  Sao kê: ngày 20 · Hạn trả: <strong>25/10</strong>
                </span>
                <button
                  onClick={() => setRepayingCard(husbandCreditCard)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  Thanh toán dư nợ
                </button>
              </div>
            </div>
          )}

          {/* Thẻ Mèo 20M */}
          {wifeCreditCard && (activePerspective === "ALL" || activePerspective === "WIFE") && (
            <div className="rounded-xl p-4 bg-gradient-to-br from-[#451A03] via-[#78350F] to-[#B45309] text-white shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-amber-200 font-bold uppercase tracking-widest block">
                    BIDV GOLD FLEXI
                  </span>
                  <span className="font-extrabold text-white text-sm">
                    Thẻ 👩 Bé Mèo (20 Triệu)
                  </span>
                </div>
                <span className="font-mono text-amber-200 text-xs">•••• 2020</span>
              </div>

              <div>
                <div className="flex items-baseline justify-between text-xs mb-1">
                  <span className="text-amber-100 text-[11px]">Dư nợ đã dùng:</span>
                  <span className="font-black text-base text-amber-200">
                    {formatVND(wifeCreditCard.usedAmount)}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
                  <div
                    className="h-full bg-amber-300 rounded-full transition-all"
                    style={{ width: `${Math.min(wifeCreditCard.usagePercentage, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-amber-100 mt-1.5">
                  <span>Khả dụng: {formatVND(wifeCreditCard.availableAmount)}</span>
                  <span className="font-bold text-amber-200">
                    {wifeCreditCard.usagePercentage}% (An toàn)
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/15 flex items-center justify-between">
                <span className="text-[10px] text-amber-100">
                  Sao kê: ngày 20 · Hạn trả: <strong>25/10</strong>
                </span>
                <button
                  onClick={() => setRepayingCard(wifeCreditCard)}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  Thanh toán dư nợ
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. DANH SÁCH 5 VÍ & TÀI KHOẢN THANH TOÁN */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-0.5">
          <span>Tài Khoản Thanh Toán & Tiền Mặt</span>
          <span className="text-[10px] text-slate-400 font-medium">
            {bankAndCashAccounts.length} tài khoản
          </span>
        </div>

        <div className="bg-white rounded-xl border border-[#DCE4EE] shadow-xs divide-y divide-slate-100 overflow-hidden">
          {bankAndCashAccounts.map((acc) => {
            const isHusband = acc.owner === "HUSBAND";
            const isCash = acc.type === "CASH";

            return (
              <div
                key={acc.id}
                className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                      isCash
                        ? "bg-amber-50 text-amber-600"
                        : isHusband
                        ? "bg-blue-50 text-blue-600"
                        : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    {isCash ? "💵" : "🏦"}
                  </div>

                  <div className="min-w-0">
                    <span className="font-bold text-xs sm:text-sm text-slate-800 block truncate">
                      {acc.name}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-medium">
                      {isHusband ? "👨 Anh Chuột" : acc.owner === "WIFE" ? "👩 Bé Mèo" : "🏠 Tổ Ấm"}
                      {acc.accountNumber ? ` · ${acc.accountNumber}` : ""}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-black text-xs sm:text-sm text-blue-600 block">
                    {formatVND(acc.currentBalance)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium block">
                    Số dư khả dụng
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Sheet trả nợ thẻ BIDV */}
      <CreditCardRepaymentSheet
        cardInfo={repayingCard}
        isOpen={repayingCard !== null}
        onClose={() => setRepayingCard(null)}
      />
    </div>
  );
}
