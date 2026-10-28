"use client";

import React from "react";
import {
  X,
  Pencil,
  Trash2,
  Calendar,
  CreditCard,
  FileText,
  User,
  Users,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
} from "lucide-react";
import { Transaction } from "@/types/finance";
import { formatVND, formatDateVN } from "@/lib/formatters";
import { useFinance } from "@/context/FinanceContext";

interface TransactionDetailSheetProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionDetailSheet({
  transaction,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: TransactionDetailSheetProps) {
  const { getCategoryById, getAccountById } = useFinance();

  if (!isOpen || !transaction) return null;

  const category = getCategoryById(transaction.categoryId);
  const account = getAccountById(transaction.accountId);
  const toAccount = transaction.toAccountId ? getAccountById(transaction.toAccountId) : null;

  const isExpense = transaction.type === "EXPENSE";
  const isIncome = transaction.type === "INCOME";
  const isTransfer = transaction.type === "TRANSFER";

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end bg-[#0B132B]/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Vùng Backdrop phía trên có giả lập Dynamic Island */}
      <div className="flex-1 flex flex-col items-center pt-3 pb-4 pointer-events-none">
        <div className="w-[126px] h-9 rounded-full bg-black shadow-lg flex items-center justify-center pointer-events-auto">
          <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-700 mr-2" />
          <div className="w-2.5 h-2.5 rounded-full bg-blue-900/60" />
        </div>
      </div>

      {/* Container Bottom Sheet Modal */}
      <div
        className="w-full max-w-lg mx-auto bg-white rounded-t-[32px] shadow-2xl border-t border-slate-200 p-5 space-y-3.5 animate-in slide-in-from-bottom duration-200 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Handle */}
        <div className="w-12 h-1.5 rounded-full bg-slate-300 mx-auto -mt-1 cursor-grab" />

        {/* Header Bar */}
        <div className="flex items-center justify-between pb-1">
          <h3 className="text-base sm:text-lg font-bold text-[#0F172A]">
            Chi Tiết Giao Dịch
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Amount Hero Card (Chuẩn Fintech Tokens) */}
        <div
          className={`rounded-xl p-4 text-center border flex flex-col items-center justify-center gap-1.5 ${
            isExpense
              ? "bg-[#FFF1F2] border-[#FECDD3] text-[#BE123C]"
              : isIncome
              ? "bg-[#ECFDF5] border-[#A7F3D0] text-[#047857]"
              : "bg-[#EFF6FF] border-[#BFDBFE] text-[#1D4ED8]"
          }`}
        >
          {/* Category Chip */}
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold ${
              isExpense
                ? "bg-[#FFE4E6] text-[#BE123C]"
                : isIncome
                ? "bg-[#D1FAE5] text-[#047857]"
                : "bg-[#DBEAFE] text-[#1D4ED8]"
            }`}
          >
            {category?.icon || "🏷️"} {isTransfer ? "Chuyển khoản ví" : category?.name || "Chi tiêu"}
          </span>

          {/* Large Amount */}
          <span className="text-2xl sm:text-3xl font-black tracking-tight">
            {isExpense ? "-" : isIncome ? "+" : ""}
            {formatVND(transaction.amount)}
          </span>

          {/* Time & Verified Status */}
          <span className="text-xs text-[#475569] font-medium flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDateVN(transaction.date)} · <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" /> Đã ghi sổ gia đình
          </span>
        </div>

        {/* Bento Details Card */}
        <div className="rounded-xl p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] space-y-2.5 text-xs">
          {/* Row 1: Thành viên & Phạm vi */}
          <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-1.5">
              <span className="text-[#64748B] font-medium">Người chi:</span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold ${
                  transaction.memberId === "HUSBAND"
                    ? "bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8]"
                    : "bg-[#FDF2F8] border border-[#FBCFE8] text-[#BE185D]"
                }`}
              >
                <span>{transaction.memberId === "HUSBAND" ? "👨 Anh Chuột" : "👩 Bé Mèo"}</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[#64748B] font-medium">Phạm vi:</span>
              <span
                className={`px-2 py-0.5 rounded-md font-bold ${
                  transaction.scope === "FAMILY"
                    ? "bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857]"
                    : "bg-[#FAF5FF] border border-[#E9D5FF] text-[#7E22CE]"
                }`}
              >
                {transaction.scope === "FAMILY" ? "🏠 Dùng chung 100%" : "👤 Chi riêng"}
              </span>
            </div>
          </div>

          {/* Row 2: Nguồn thanh toán */}
          <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
            <span className="text-[#64748B] font-medium flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-slate-500" />
              Nguồn thanh toán:
            </span>
            <span className="font-bold text-[#1E293B]">
              {isTransfer
                ? `${account?.name || "Ví nguồn"} ➔ ${toAccount?.name || "Ví nhận"}`
                : account?.name || "Ví tiền"}
            </span>
          </div>

          {/* Row 3: Ghi chú chi tiết */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
              Ghi chú tổ ấm
            </span>
            <p className="text-[#1E293B] font-normal leading-relaxed text-xs">
              {transaction.note || <span className="text-slate-400 italic">Không có ghi chú thêm</span>}
            </p>
          </div>
        </div>

        {/* Bill OCR Attachment Card */}
        <div className="rounded-xl p-2.5 bg-[#F1F5F9] border border-slate-200/70 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xl">🧾</span>
            <div className="min-w-0">
              <span className="font-bold text-[#1E293B] block truncate">
                Hoa_don_WinMart_{transaction.date.replace(/-/g, "")}.jpg
              </span>
              <span className="text-[10px] text-[#475569] block">
                1.2 MB · Quét OCR tự động khớp 100%
              </span>
            </div>
          </div>
          <button
            type="button"
            className="text-xs font-bold text-[#2563EB] hover:underline px-2 py-1 shrink-0"
            onClick={() => alert("Đang mở hóa đơn đính kèm...")}
          >
            Xem ảnh
          </button>
        </div>

        {/* Action Buttons Stack */}
        <div className="space-y-2 pt-1">
          <button
            onClick={() => {
              onClose();
              onEdit(transaction);
            }}
            className="w-full h-11 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <Pencil className="w-4 h-4" />
            <span>Chỉnh Sửa Giao Dịch</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onDelete(transaction.id);
            }}
            className="w-full h-10 rounded-xl bg-[#FEE2E2] hover:bg-rose-200 border border-[#FCA5A5] text-[#BE123C] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Xóa Giao Dịch Này</span>
          </button>
        </div>

        {/* Home Indicator */}
        <div className="w-32 h-1 rounded-full bg-slate-800 mx-auto mt-2" />
      </div>
    </div>
  );
}
