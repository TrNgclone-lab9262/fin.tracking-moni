"use client";

import React, { useState, useMemo } from "react";
import {
  Trash2,
  Pencil,
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
import { TransactionFormModal } from "@/components/transactions/TransactionFormModal";
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
    getCategoryById,
    getAccountById,
    deleteTransaction,
    activePerspective,
  } = useFinance();

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
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

      {/* 3. Bảng Giao Dịch Chi Tiết Đa Thiết Bị (Desktop / Tablet / Mobile) */}
      <div className="bg-white rounded-xl border border-[#DCE4EE] shadow-xs overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-600">Không tìm thấy giao dịch nào phù hợp</p>
          </div>
        ) : (
          <>
            {/* VIEW 1: DESKTOP TABLE (>= 1024px) - Table-fixed, không rớt dòng */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left text-xs table-fixed">
                <colgroup>
                  <col className="w-[105px]" />
                  <col className="w-[125px]" />
                  <col className="w-[85px]" />
                  <col className="w-[85px]" />
                  <col className="w-[155px]" />
                  <col className="w-[130px]" />
                  <col className="w-[150px]" />
                  <col className="w-auto" />
                  <col className="w-[85px]" />
                </colgroup>
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-3.5">Ngày</th>
                    <th className="py-3.5 px-3.5">Người chi</th>
                    <th className="py-3.5 px-3">Loại</th>
                    <th className="py-3.5 px-3">Mục đích</th>
                    <th className="py-3.5 px-3.5">Danh mục</th>
                    <th className="py-3.5 px-3.5 text-right">Số tiền</th>
                    <th className="py-3.5 px-3.5">Nguồn tiền</th>
                    <th className="py-3.5 px-3.5">Ghi chú</th>
                    <th className="py-3.5 px-3 text-center">Thao tác</th>
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
                      <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="py-3.5 px-3.5 font-medium text-slate-700 whitespace-nowrap">
                          {formatDateVN(tx.date)}
                        </td>

                        {/* Người chi (Chồng hay Vợ) */}
                        <td className="py-3.5 px-3.5 whitespace-nowrap">
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
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
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
                                Chuyển
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

                        {/* Mục đích (Chung vs Riêng) */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              tx.scope === "FAMILY"
                                ? "bg-slate-100 text-slate-700"
                                : "bg-purple-50 text-purple-700 border border-purple-200"
                            }`}
                          >
                            {tx.scope === "FAMILY" ? "🏠 Chung" : "👤 Riêng"}
                          </span>
                        </td>

                        {/* Danh mục */}
                        <td className="py-3.5 px-3.5 whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200/60 max-w-full">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: cat?.color || "#94A3B8" }}
                            />
                            <span className="truncate">{isTransfer ? "Chuyển khoản ví" : cat?.name || "Khác"}</span>
                          </div>
                        </td>

                        {/* Số tiền */}
                        <td
                          className={`py-3.5 px-3.5 text-right font-black whitespace-nowrap ${
                            isTransfer
                              ? "text-blue-600"
                              : isExpense
                              ? "text-rose-600"
                              : "text-emerald-600"
                          }`}
                        >
                          {isExpense ? "-" : isTransfer ? "" : "+"} {formatVND(tx.amount)}
                        </td>

                        {/* Tài khoản nguồn */}
                        <td className="py-3.5 px-3.5 text-slate-600 font-semibold whitespace-nowrap">
                          <span
                            className="inline-flex items-center gap-1 text-[11px] bg-slate-100 px-2 py-0.5 rounded-md text-slate-700 truncate max-w-full"
                            title={isTransfer ? `${acc?.name} → ${toAcc?.name}` : acc?.name}
                          >
                            {isTransfer ? `${acc?.name} → ${toAcc?.name}` : acc?.name || "Ví tiền"}
                          </span>
                        </td>

                        {/* Ghi chú */}
                        <td
                          className="py-3.5 px-3.5 truncate text-slate-600 font-medium"
                          title={tx.note || ""}
                        >
                          {tx.note || <span className="text-slate-300 italic">—</span>}
                        </td>

                        {/* Thao tác Sửa & Xóa */}
                        <td className="py-3.5 px-3 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => setEditingTx(tx)}
                              title="Chỉnh sửa giao dịch"
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteTargetId(tx.id)}
                              title="Xóa giao dịch"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* VIEW 2: TABLET TABLE (768px - 1023px) - Bảng tinh gọn 7 cột */}
            <div className="hidden md:block lg:hidden overflow-x-auto">
              <table className="w-full text-left text-xs table-fixed">
                <colgroup>
                  <col className="w-[100px]" />
                  <col className="w-[140px]" />
                  <col className="w-[80px]" />
                  <col className="w-[140px]" />
                  <col className="w-[125px]" />
                  <col className="w-auto" />
                  <col className="w-[80px]" />
                </colgroup>
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-3">Ngày</th>
                    <th className="py-3 px-3">Người & Ví</th>
                    <th className="py-3 px-2">Loại</th>
                    <th className="py-3 px-3">Danh mục</th>
                    <th className="py-3 px-3 text-right">Số tiền</th>
                    <th className="py-3 px-3">Ghi chú</th>
                    <th className="py-3 px-2 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedList.map((tx) => {
                    const cat = getCategoryById(tx.categoryId);
                    const acc = getAccountById(tx.accountId);
                    const isExpense = tx.type === "EXPENSE";
                    const isTransfer = tx.type === "TRANSFER";

                    return (
                      <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3 font-medium text-slate-700 whitespace-nowrap">
                          {formatDateVN(tx.date)}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[11px] font-bold text-slate-800">
                              {tx.memberId === "HUSBAND" ? "👨 Anh Chuột" : "👩 Bé Mèo"}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium truncate">
                              {acc?.name || "Ví"}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-2 whitespace-nowrap">
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                              isTransfer
                                ? "bg-blue-50 text-blue-600"
                                : isExpense
                                ? "bg-rose-50 text-rose-600"
                                : "bg-emerald-50 text-emerald-600"
                            }`}
                          >
                            {isTransfer ? "Chuyển" : isExpense ? "Chi" : "Thu"}
                          </span>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="font-semibold text-slate-700 truncate block">
                            {isTransfer ? "Chuyển khoản" : cat?.name || "Khác"}
                          </span>
                        </td>
                        <td
                          className={`py-3 px-3 text-right font-black whitespace-nowrap ${
                            isTransfer
                              ? "text-blue-600"
                              : isExpense
                              ? "text-rose-600"
                              : "text-emerald-600"
                          }`}
                        >
                          {isExpense ? "-" : isTransfer ? "" : "+"} {formatVND(tx.amount)}
                        </td>
                        <td className="py-3 px-3 truncate text-slate-500 font-medium" title={tx.note || ""}>
                          {tx.note || <span className="text-slate-300 italic">—</span>}
                        </td>
                        <td className="py-3 px-2 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => setEditingTx(tx)}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              title="Sửa"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteTargetId(tx.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                              title="Xóa"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* VIEW 3: MOBILE BENTO CARD VIEW (< 768px) - Chuẩn chạm ngón tay 44px */}
            <div className="md:hidden divide-y divide-slate-100">
              {paginatedList.map((tx) => {
                const cat = getCategoryById(tx.categoryId);
                const acc = getAccountById(tx.accountId);
                const toAcc = tx.toAccountId ? getAccountById(tx.toAccountId) : undefined;
                const isExpense = tx.type === "EXPENSE";
                const isTransfer = tx.type === "TRANSFER";

                return (
                  <div key={tx.id} className="p-4 space-y-2.5 hover:bg-slate-50/80 transition-colors">
                    {/* Hàng 1: Người chi + Mục đích + Ngày */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            tx.memberId === "HUSBAND"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
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

                    {/* Hàng 2: Danh mục + Ví + Ghi chú */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0"
                          style={{ backgroundColor: cat?.color || "#94A3B8" }}
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-sm text-[#172B4D] truncate block">
                            {isTransfer ? "Chuyển khoản ví" : cat?.name || "Khác"}
                          </span>
                          <span className="text-xs text-slate-500 font-medium truncate block">
                            {tx.note || (isExpense ? "Chi tiêu" : isTransfer ? "Chuyển tiền" : "Thu nhập")}
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md shrink-0 whitespace-nowrap">
                        {isTransfer ? `${acc?.name} → ${toAcc?.name}` : acc?.name || "Ví tiền"}
                      </span>
                    </div>

                    {/* Hàng 3: Số tiền + Cặp nút Sửa / Xóa (40-44px touch) */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-50">
                      <p
                        className={`text-base font-black ${
                          isTransfer
                            ? "text-blue-600"
                            : isExpense
                            ? "text-rose-600"
                            : "text-emerald-600"
                        }`}
                      >
                        {isExpense ? "-" : isTransfer ? "" : "+"} {formatVND(tx.amount)}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setEditingTx(tx)}
                          className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center active:scale-95"
                          aria-label="Sửa giao dịch"
                          title="Sửa"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(tx.id)}
                          className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center active:scale-95"
                          aria-label="Xóa giao dịch"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
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
