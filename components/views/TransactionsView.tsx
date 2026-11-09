"use client";

import React, { useState, useMemo } from "react";
import {
  Download,
  Plus,
  Search,
  Filter,
} from "lucide-react";
import { useFinance } from "@/context/FinanceContext";
import { formatVNDMasked, getMonthDisplayLabel } from "@/lib/formatters";
import { useSecurity } from "@/context/SecurityContext";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { TransactionFormModal } from "@/components/transactions/TransactionFormModal";
import { TransactionDetailSheet } from "@/components/mobile/sheets/TransactionDetailSheet";
import { TransactionDataTable } from "@/components/transactions/TransactionDataTable";
import { Transaction } from "@/types/finance";

interface TransactionsViewProps {
  onOpenAddModal: () => void;
  onOpenBackupModal: () => void;
}

export function TransactionsView({
  onOpenAddModal,
  onOpenBackupModal,
}: TransactionsViewProps) {
  const {
    filteredTransactions,
    categories,
    accounts,
    selectedMonth,
    setSelectedMonth,
    availableMonths,
    selectedType,
    setSelectedType,
    selectedCategory,
    setSelectedCategory,
    selectedAccount,
    setSelectedAccount,
    searchQuery,
    setSearchQuery,
    deleteTransaction,
  } = useFinance();

  const { isPrivacyMode } = useSecurity();

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [selectedTxForDetail, setSelectedTxForDetail] = useState<Transaction | null>(null);

  // Thống kê nhanh theo bộ lọc
  const filterSummary = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const tx of filteredTransactions) {
      if (tx.type === "INCOME") income += tx.amount;
      if (tx.type === "EXPENSE") expense += tx.amount;
    }
    return { income, expense, diff: income - expense };
  }, [filteredTransactions]);

  const targetTx = useMemo(
    () => filteredTransactions.find((t) => t.id === deleteTargetId),
    [filteredTransactions, deleteTargetId]
  );

  const handleBatchDelete = (ids: string[]) => {
    ids.forEach((id) => deleteTransaction(id));
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* 1. Thanh Lọc & Điều Khiển Sổ Giao Dịch */}
      <div className="bg-white rounded-[3px] p-4 sm:p-5 border border-[#DCE4EE] shadow-xs space-y-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Bộ chọn tháng nhanh */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
            <button
              onClick={() => setSelectedMonth("ALL")}
              className={`px-3 py-1.5 rounded-[3px] text-xs font-bold transition-all whitespace-nowrap ${
                selectedMonth === "ALL"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600"
              }`}
            >
              Toàn bộ 320+ GD
            </button>
            {availableMonths.map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMonth(m)}
                className={`px-3 py-1.5 rounded-[3px] text-xs font-bold transition-all whitespace-nowrap ${
                  selectedMonth === m
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                }`}
              >
                {getMonthDisplayLabel(m)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenBackupModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-[3px] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Xuất JSON</span>
            </button>
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-[3px] shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm giao dịch</span>
            </button>
          </div>
        </div>

        {/* Dòng Dropdowns: Loại, Tài khoản, Danh mục, Search */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-[#E9EEF5]">
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="w-full bg-slate-50 border border-[#DCE4EE] rounded-[3px] px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="ALL">Tất cả loại giao dịch</option>
              <option value="INCOME">Thu nhập</option>
              <option value="EXPENSE">Chi tiêu</option>
              <option value="TRANSFER">Chuyển khoản</option>
            </select>
          </div>

          <div>
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="w-full bg-slate-50 border border-[#DCE4EE] rounded-[3px] px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="ALL">Tất cả tài khoản (Ví)</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 border border-[#DCE4EE] rounded-[3px] px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="ALL">Tất cả danh mục</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.type === "INCOME" ? "Thu" : "Chi"})
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Tìm theo ghi chú, tiền..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-[#DCE4EE] rounded-[3px] pl-8 pr-3 py-2 text-xs text-slate-700 outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* 2. Dải Thông Số Thu Chi của Bộ Lọc Hiện Tại */}
      <div className="flex flex-wrap items-center gap-4 px-3 py-2 bg-slate-100/90 rounded-[3px] border border-[#E9EEF5] text-xs font-semibold text-slate-700">
        <span>
          Đang xem: <strong>{filteredTransactions.length}</strong> giao dịch
        </span>
        <span className="text-slate-300">|</span>
        <span className="text-emerald-700">
          Thu: <strong>{formatVNDMasked(filterSummary.income, isPrivacyMode)}</strong>
        </span>
        <span className="text-rose-600">
          Chi: <strong>{formatVNDMasked(filterSummary.expense, isPrivacyMode)}</strong>
        </span>
        <span className="text-blue-600">
          Chênh lệch: <strong>{formatVNDMasked(filterSummary.diff, isPrivacyMode)}</strong>
        </span>
      </div>

      {/* 3. Bảng Sổ Giao Dịch Data Grid với TanStack Table (Resize + Sort + Indeterminate + Zebra) */}
      <TransactionDataTable
        data={filteredTransactions}
        onEdit={(tx) => setEditingTx(tx)}
        onDelete={(id) => setDeleteTargetId(id)}
        onSelectDetail={(tx) => setSelectedTxForDetail(tx)}
        onBatchDelete={handleBatchDelete}
      />

      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        title="Xóa giao dịch này?"
        message={`Bạn có chắc muốn xóa giao dịch ${
          targetTx ? formatVNDMasked(targetTx.amount, isPrivacyMode) : ""
        }?`}
        confirmLabel="Xóa"
        cancelLabel="Hủy"
        isDanger={true}
        onConfirm={() => {
          if (deleteTargetId) {
            deleteTransaction(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        onCancel={() => setDeleteTargetId(null)}
      />

      {/* Mobile Transaction Detail Bottom Sheet */}
      <TransactionDetailSheet
        transaction={selectedTxForDetail}
        isOpen={selectedTxForDetail !== null}
        onClose={() => setSelectedTxForDetail(null)}
        onEdit={(tx) => {
          setSelectedTxForDetail(null);
          setEditingTx(tx);
        }}
        onDelete={(id) => {
          setSelectedTxForDetail(null);
          setDeleteTargetId(id);
        }}
      />

      {/* Modal Chỉnh Sửa Giao Dịch */}
      {editingTx && (
        <TransactionFormModal
          isOpen={editingTx !== null}
          onClose={() => setEditingTx(null)}
          editTransaction={editingTx}
        />
      )}
    </div>
  );
}
