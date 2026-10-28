"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Receipt,
  Sparkles,
  Calendar,
  AlertCircle,
  Filter,
} from "lucide-react";
import { useFinance } from "@/context/FinanceContext";
import { formatVND, formatDateVN } from "@/lib/formatters";
import { Transaction } from "@/types/finance";
import { TransactionDetailSheet } from "@/components/mobile/sheets/TransactionDetailSheet";

interface MobileTransactionsViewProps {
  onOpenAddModal: () => void;
}

type QuickFilter = "ALL" | "HUSBAND" | "WIFE" | "FAMILY";

export function MobileTransactionsView({ onOpenAddModal }: MobileTransactionsViewProps) {
  const {
    filteredTransactions,
    deleteTransaction,
    budgetSummary,
    getCategoryById,
    getAccountById,
  } = useFinance();

  const [quickFilter, setQuickFilter] = useState<QuickFilter>("ALL");
  const [search, setSearch] = useState("");
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // Lọc theo 4 chip
  const displayedTransactions = useMemo(() => {
    return filteredTransactions.filter((tx) => {
      // 1. Quick filter
      if (quickFilter === "HUSBAND" && tx.memberId !== "HUSBAND") return false;
      if (quickFilter === "WIFE" && tx.memberId !== "WIFE") return false;
      if (quickFilter === "FAMILY" && tx.scope !== "FAMILY") return false;

      // 2. Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const noteMatch = (tx.note || "").toLowerCase().includes(q);
        const cat = getCategoryById(tx.categoryId);
        const catMatch = (cat?.name || "").toLowerCase().includes(q);
        return noteMatch || catMatch;
      }
      return true;
    });
  }, [filteredTransactions, quickFilter, search, getCategoryById]);

  // Thống kê nhanh theo bộ lọc
  const totalExpense = useMemo(() => {
    return displayedTransactions
      .filter((tx) => tx.type === "EXPENSE")
      .reduce((sum, tx) => sum + tx.amount, 0);
  }, [displayedTransactions]);

  // Đếm số lượng cho từng chip
  const counts = useMemo(() => {
    return {
      all: filteredTransactions.length,
      husband: filteredTransactions.filter((t) => t.memberId === "HUSBAND").length,
      wife: filteredTransactions.filter((t) => t.memberId === "WIFE").length,
      family: filteredTransactions.filter((t) => t.scope === "FAMILY").length,
    };
  }, [filteredTransactions]);

  return (
    <div className="space-y-3 animate-in fade-in duration-200">
      {/* 1. Header Tìm Kiếm & Lọc Nhanh */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo ghi chú, danh mục..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-[#DCE4EE] rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={onOpenAddModal}
          className="h-9 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs shrink-0"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Ghi 3s</span>
        </button>
      </div>

      {/* 2. KHỐI LỌC 4 VIÊN CỐ ĐỊNH (Khớp 100% Figma Screen 3) */}
      <div className="grid grid-cols-4 gap-1.5 text-xs font-bold">
        <button
          onClick={() => setQuickFilter("ALL")}
          className={`py-2 px-1 rounded-xl transition-all text-center border ${
            quickFilter === "ALL"
              ? "bg-blue-600 border-blue-600 text-white shadow-xs"
              : "bg-white border-[#DCE4EE] text-slate-600 hover:bg-slate-50"
          }`}
        >
          Tất cả ({counts.all})
        </button>

        <button
          onClick={() => setQuickFilter("HUSBAND")}
          className={`py-2 px-1 rounded-xl transition-all text-center border ${
            quickFilter === "HUSBAND"
              ? "bg-blue-600 border-blue-600 text-white shadow-xs"
              : "bg-white border-[#DCE4EE] text-slate-600 hover:bg-slate-50"
          }`}
        >
          👨 Chuột ({counts.husband})
        </button>

        <button
          onClick={() => setQuickFilter("WIFE")}
          className={`py-2 px-1 rounded-xl transition-all text-center border ${
            quickFilter === "WIFE"
              ? "bg-blue-600 border-blue-600 text-white shadow-xs"
              : "bg-white border-[#DCE4EE] text-slate-600 hover:bg-slate-50"
          }`}
        >
          👩 Mèo ({counts.wife})
        </button>

        <button
          onClick={() => setQuickFilter("FAMILY")}
          className={`py-2 px-1 rounded-xl transition-all text-center border ${
            quickFilter === "FAMILY"
              ? "bg-blue-600 border-blue-600 text-white shadow-xs"
              : "bg-white border-[#DCE4EE] text-slate-600 hover:bg-slate-50"
          }`}
        >
          🏠 Chung ({counts.family})
        </button>
      </div>

      {/* 3. THẺ TÓM TẮT BỘ LỌC (KPI Pill Card) */}
      <div className="p-3 bg-white rounded-xl border border-[#DCE4EE] shadow-xs flex items-center justify-between text-xs">
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Tổng chi trong bộ lọc
          </span>
          <span className="text-base font-black text-[#BE123C]">
            -{formatVND(totalExpense)}
          </span>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Hạn mức ngày hôm nay
          </span>
          <span className="text-xs font-black text-emerald-600">
            Còn {formatVND(350000)} / {formatVND(500000)}
          </span>
        </div>
      </div>

      {/* 4. DANH SÁCH BENTO CARDS HOẶC TRẠNG THÁI RỖNG (Khớp Figma Screen 3 & 4) */}
      {displayedTransactions.length === 0 ? (
        /* TRẠNG THÁI RỖNG ẤM ÁP (Figma Screen 4) */
        <div className="p-8 bg-white rounded-2xl border border-[#DCE4EE] shadow-xs text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-3xl mx-auto shadow-inner">
            🧾
          </div>

          <div className="space-y-1">
            <h4 className="font-extrabold text-slate-800 text-base">
              Chưa Có Giao Dịch Nào
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
              Không tìm thấy giao dịch phù hợp với bộ lọc hiện tại. Hãy ghi chép ngay để bảo toàn mục tiêu gia đình!
            </p>
          </div>

          <button
            onClick={onOpenAddModal}
            className="w-full max-w-xs mx-auto py-3 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ GHI CHÉP GIAO DỊCH (3S)</span>
          </button>

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-left text-xs text-emerald-800 space-y-0.5">
            <span className="font-bold flex items-center gap-1 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Mẹo tài chính tổ ấm:
            </span>
            <p className="text-[10px] text-emerald-700 leading-relaxed">
              Ghi chép trong 3 giây sau khi quẹt thẻ giúp 2 vợ chồng bảo vệ điểm tín dụng CIC và tiến độ Quỹ Mua Nhà 2028.
            </p>
          </div>
        </div>
      ) : (
        /* DANH SÁCH BENTO TRANSACTION CARDS */
        <div className="space-y-2">
          {displayedTransactions.map((tx) => {
            const cat = getCategoryById(tx.categoryId);
            const acc = getAccountById(tx.accountId);
            const isExpense = tx.type === "EXPENSE";
            const isTransfer = tx.type === "TRANSFER";

            return (
              <div
                key={tx.id}
                onClick={() => setSelectedTx(tx)}
                className="p-3.5 bg-white rounded-xl border border-[#DCE4EE] shadow-xs hover:border-blue-400 active:bg-blue-50/50 cursor-pointer transition-all space-y-2"
              >
                {/* Dòng trên: Người chi + Ngày + Phạm vi */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        tx.memberId === "HUSBAND"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {tx.memberId === "HUSBAND" ? "👨 Anh Chuột" : "👩 Bé Mèo"}
                    </span>

                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        tx.scope === "FAMILY"
                          ? "bg-slate-100 text-slate-700"
                          : "bg-purple-50 text-purple-700 border border-purple-200"
                      }`}
                    >
                      {tx.scope === "FAMILY" ? "🏠 Chung" : "👤 Riêng"}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400 font-medium">
                    {formatDateVN(tx.date)}
                  </span>
                </div>

                {/* Dòng giữa: Danh mục + Ghi chú + Số tiền */}
                <div className="flex items-center justify-between gap-2">
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
                      <span className="font-bold text-xs text-slate-800 block truncate">
                        {tx.note || (isExpense ? "Chi tiêu" : isTransfer ? "Chuyển tiền" : "Thu nhập")}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium block truncate">
                        {isTransfer ? "Chuyển khoản ví" : cat?.name || "Chi tiêu"} · {acc?.name || "Ví"}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-sm sm:text-base font-black shrink-0 ${
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
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Action Sheet chi tiết giao dịch */}
      <TransactionDetailSheet
        transaction={selectedTx}
        isOpen={selectedTx !== null}
        onClose={() => setSelectedTx(null)}
        onEdit={(tx) => {
          setSelectedTx(null);
          // Trigger edit
        }}
        onDelete={(id) => {
          setSelectedTx(null);
          deleteTransaction(id);
        }}
      />
    </div>
  );
}
