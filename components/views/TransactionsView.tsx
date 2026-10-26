"use client";

import React, { useState, useMemo } from "react";
import {
  Trash2,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Search,
  Download,
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
  AlertCircle,
  Users,
} from "lucide-react";
import { useFinance } from "@/context/FinanceContext";
import { formatVND, formatDateVN, getMonthDisplayLabel } from "@/lib/formatters";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

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
    getCategoryById,
    getAccountById,
    deleteTransaction,
    activePerspective,
  } = useFinance();

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filterSummary = useMemo(() => {
    let income = 0;
    let expense = 0;

    filteredTransactions.forEach((tx) => {
      if (tx.type === "INCOME") income += tx.amount;
      if (tx.type === "EXPENSE") expense += tx.amount;
    });

    return {
      count: filteredTransactions.length,
      income,
      expense,
      diff: income - expense,
    };
  }, [filteredTransactions]);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / pageSize));
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, currentPage]);

  const targetTx = filteredTransactions.find((tx) => tx.id === deleteTargetId);

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* 1. Thanh Lọc & Tìm kiếm Toàn diện */}
      <div className="bg-white rounded-xl p-5 border border-[#DCE4EE] shadow-xs space-y-4">
        {/* Quick Month Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedMonth("ALL")}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap ${
                selectedMonth === "ALL"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600"
              }`}
            >
              Tất cả thời gian
            </button>
            {availableMonths.map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMonth(m)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap ${
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
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Xuất dữ liệu</span>
            </button>
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-md shadow-xs"
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
              className="w-full bg-slate-50 border border-[#DCE4EE] rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500"
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
              className="w-full bg-slate-50 border border-[#DCE4EE] rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500"
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
              className="w-full bg-slate-50 border border-[#DCE4EE] rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="ALL">Tất cả danh mục</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.type === "INCOME" ? "[Thu] " : "[Chi] "}
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo ghi chú..."
              className="w-full bg-slate-50 border border-[#DCE4EE] rounded-lg pl-9 pr-8 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 placeholder:text-slate-400 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Dòng Tóm tắt Chỉ số */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-8 px-2 text-xs font-bold text-slate-600">
        <span className="text-slate-700">
          📋 <strong>{filterSummary.count}</strong> giao dịch {activePerspective !== "ALL" ? `(${activePerspective === "HUSBAND" ? "Anh Chuột" : "Bé Mèo"})` : "(My Home)"}
        </span>
        <span className="text-emerald-600">
          Thu: <strong>{formatVND(filterSummary.income)}</strong>
        </span>
        <span className="text-rose-600">
          Chi: <strong>{formatVND(filterSummary.expense)}</strong>
        </span>
        <span className="text-blue-600">
          Chênh lệch: <strong>{formatVND(filterSummary.diff)}</strong>
        </span>
      </div>

      {/* 3. Bảng Giao Dịch Chi Tiết */}
      <div className="bg-white rounded-xl border border-[#DCE4EE] shadow-xs overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-600">Không tìm thấy giao dịch nào phù hợp</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Ngày</th>
                  <th className="py-3.5 px-4">Người chi</th>
                  <th className="py-3.5 px-4">Loại</th>
                  <th className="py-3.5 px-4">Mục đích</th>
                  <th className="py-3.5 px-4">Danh mục</th>
                  <th className="py-3.5 px-4 text-right">Số tiền</th>
                  <th className="py-3.5 px-4">Tài khoản</th>
                  <th className="py-3.5 px-4">Ghi chú</th>
                  <th className="py-3.5 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedList.map((tx) => {
                  const cat = getCategoryById(tx.categoryId);
                  const acc = getAccountById(tx.accountId);
                  const toAcc = tx.toAccountId ? getAccountById(tx.toAccountId) : undefined;
                  const isExpense = tx.type === "EXPENSE";
                  const isTransfer = tx.type === "TRANSFER";

                  return (
                    <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-slate-700 whitespace-nowrap">
                        {formatDateVN(tx.date)}
                      </td>

                      {/* Người chi (Chồng hay Vợ) */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            tx.memberId === "HUSBAND"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {tx.memberId === "HUSBAND" ? "👨 Anh Chuột" : "👩 Bé Mèo"}
                        </span>
                      </td>

                      {/* Loại */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            isTransfer
                              ? "bg-blue-50 text-blue-600 border border-blue-200"
                              : isExpense
                              ? "bg-rose-50 text-rose-600 border border-rose-200"
                              : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                          }`}
                        >
                          {isTransfer ? (
                            <>
                              <ArrowLeftRight className="w-3 h-3" />
                              Chuyển khoản
                            </>
                          ) : isExpense ? (
                            <>
                              <ArrowUpRight className="w-3 h-3" />
                              Chi
                            </>
                          ) : (
                            <>
                              <ArrowDownLeft className="w-3 h-3" />
                              Thu
                            </>
                          )}
                        </span>
                      </td>

                      {/* Mục đích (Chung gia đình vs Cá nhân) */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                            tx.scope === "FAMILY"
                              ? "bg-slate-100 text-slate-700"
                              : "bg-purple-50 text-purple-700 border border-purple-200"
                          }`}
                        >
                          {tx.scope === "FAMILY" ? "🏠 Chung nhà" : "👤 Riêng"}
                        </span>
                      </td>

                      {/* Danh mục */}
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200/60">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: cat?.color || "#94A3B8" }}
                          />
                          <span>{isTransfer ? "Chuyển khoản ví" : cat?.name || "Khác"}</span>
                        </div>
                      </td>

                      {/* Số tiền */}
                      <td
                        className={`py-3.5 px-4 text-right font-black whitespace-nowrap ${
                          isTransfer
                            ? "text-blue-600"
                            : isExpense
                            ? "text-rose-600"
                            : "text-emerald-600"
                        }`}
                      >
                        {isExpense ? "-" : isTransfer ? "" : "+"} {formatVND(tx.amount)}
                      </td>

                      {/* Tài khoản */}
                      <td className="py-3.5 px-4 text-slate-600 font-semibold whitespace-nowrap">
                        {isTransfer ? `${acc?.name} → ${toAcc?.name}` : acc?.name || "Ví tiền"}
                      </td>

                      {/* Ghi chú */}
                      <td className="py-3.5 px-4 max-w-xs truncate text-slate-600 font-medium">
                        {tx.note || <span className="text-slate-300 italic">—</span>}
                      </td>

                      {/* Xóa */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setDeleteTargetId(tx.id)}
                          className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Phân trang */}
        {filteredTransactions.length > pageSize && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-30 hover:bg-slate-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-7 h-7 rounded-lg font-bold text-xs ${
                    currentPage === p ? "bg-blue-600 text-white" : "hover:bg-slate-100"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-30 hover:bg-slate-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <span>
              Hiển thị {(currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, filteredTransactions.length)} của{" "}
              {filteredTransactions.length} giao dịch
            </span>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        title="Xóa giao dịch này?"
        message={`Bạn có chắc muốn xóa giao dịch ${
          targetTx ? formatVND(targetTx.amount) : ""
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
    </div>
  );
}
