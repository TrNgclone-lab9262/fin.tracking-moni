"use client";

import React, { useState } from "react";
import {
  Trash2,
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
  AlertCircle,
  Calendar,
  FileText,
} from "lucide-react";
import { useFinance } from "@/context/FinanceContext";
import { Transaction } from "@/types/finance";
import { formatVND, formatDateVN } from "@/lib/formatters";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { CategoryIcon } from "@/components/common/CategoryIcon";

export function TransactionList() {
  const { filteredTransactions, getCategoryById, deleteTransaction } = useFinance();
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const targetTransaction = filteredTransactions.find((tx) => tx.id === deleteTargetId);

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      deleteTransaction(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#DCE4EE] shadow-xs overflow-hidden flex flex-col">
      {/* Header Danh sách */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Receipt className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Lịch sử giao dịch</h3>
            <p className="text-xs text-slate-400 font-medium">
              Sắp xếp theo ngày phát sinh mới nhất
            </p>
          </div>
        </div>
        <div className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-md">
          {filteredTransactions.length} giao dịch
        </div>
      </div>

      {/* Nội dung danh sách */}
      {filteredTransactions.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-8 h-8" />
          </div>
          <p className="text-sm font-bold text-slate-700">Không tìm thấy giao dịch nào</p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Không có bản ghi nào khớp với tiêu chí tìm kiếm hoặc bộ lọc hiện tại. Thử đổi bộ lọc hoặc thêm giao dịch mới.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View (Ẩn trên mobile) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Mã GD</th>
                  <th className="py-3.5 px-4">Ngày</th>
                  <th className="py-3.5 px-4">Loại</th>
                  <th className="py-3.5 px-4">Danh mục</th>
                  <th className="py-3.5 px-4">Ghi chú</th>
                  <th className="py-3.5 px-4 text-right">Số tiền</th>
                  <th className="py-3.5 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map((tx) => {
                  const category = getCategoryById(tx.categoryId);
                  const isExpense = tx.type === "EXPENSE";

                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Mã GD */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400 font-medium">
                        {tx.id.length > 14 ? `${tx.id.substring(0, 12)}...` : tx.id}
                      </td>

                      {/* Ngày */}
                      <td className="py-3.5 px-4 font-medium text-slate-700 whitespace-nowrap">
                        {formatDateVN(tx.date)}
                      </td>

                      {/* Loại Thu / Chi */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            isExpense
                              ? "bg-rose-50 text-rose-600 border border-rose-100"
                              : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          }`}
                        >
                          {isExpense ? (
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

                      {/* Danh mục */}
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-800 bg-slate-100/90 border border-slate-200/60">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: category?.color || "#94A3B8" }}
                          />
                          <CategoryIcon
                            name={category?.icon}
                            className="w-3.5 h-3.5 text-slate-500"
                          />
                          <span>{category?.name || "Khác"}</span>
                        </div>
                      </td>

                      {/* Ghi chú */}
                      <td className="py-3.5 px-4 max-w-xs truncate text-slate-600 font-medium">
                        {tx.note || <span className="text-slate-300 italic">Không có</span>}
                      </td>

                      {/* Số tiền */}
                      <td
                        className={`py-3.5 px-4 text-right font-bold text-sm whitespace-nowrap ${
                          isExpense ? "text-rose-600" : "text-emerald-600"
                        }`}
                      >
                        {isExpense ? "-" : "+"} {formatVND(tx.amount)}
                      </td>

                      {/* Nút Xóa */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setDeleteTargetId(tx.id)}
                          title="Xóa giao dịch này"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
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

          {/* Mobile Card View (Hiện trên mobile & tablet nhỏ) */}
          <div className="md:hidden divide-y divide-slate-100">
            {filteredTransactions.map((tx) => {
              const category = getCategoryById(tx.categoryId);
              const isExpense = tx.type === "EXPENSE";

              return (
                <div
                  key={tx.id}
                  className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Icon Category */}
                    <div
                      className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 text-white shadow-xs"
                      style={{ backgroundColor: category?.color || "#94A3B8" }}
                    >
                      <CategoryIcon name={category?.icon} className="w-5 h-5" />
                    </div>

                    {/* Chi tiết */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-800 truncate">
                          {category?.name || "Khác"}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {formatDateVN(tx.date)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {tx.note || (isExpense ? "Chi tiêu" : "Thu nhập")}
                      </p>
                    </div>
                  </div>

                  {/* Số tiền & Xóa */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <p
                        className={`text-sm font-bold whitespace-nowrap ${
                          isExpense ? "text-rose-600" : "text-emerald-600"
                        }`}
                      >
                        {isExpense ? "-" : "+"} {formatVND(tx.amount)}
                      </p>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        {isExpense ? "Khoản chi" : "Khoản thu"}
                      </span>
                    </div>

                    <button
                      onClick={() => setDeleteTargetId(tx.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Dialog xác nhận xóa giao dịch */}
      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        title="Xóa giao dịch này?"
        message={`Bạn có chắc chắn muốn xóa giao dịch ${
          targetTransaction ? formatVND(targetTransaction.amount) : ""
        } khỏi lịch sử chi tiêu? Thao tác này không thể hoàn tác.`}
        confirmLabel="Xóa vĩnh viễn"
        cancelLabel="Hủy"
        isDanger={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
