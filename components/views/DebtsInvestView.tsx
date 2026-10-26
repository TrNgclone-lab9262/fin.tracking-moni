"use client";

import React, { useState, useMemo } from "react";
import {
  Coins,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  X,
  CreditCard,
  DollarSign,
} from "lucide-react";
import { useFinance } from "@/context/FinanceContext";
import { DebtItem, InvestmentItem, InvestmentType } from "@/types/finance";
import { formatVND, formatDateVN } from "@/lib/formatters";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

export function DebtsInvestView() {
  const {
    debts,
    investments,
    addDebt,
    payDebt,
    deleteDebt,
    addInvestment,
    updateInvestment,
    deleteInvestment,
  } = useFinance();

  // Modals state
  const [isDebtModalOpen, setIsDebtModalOpen] = useState(false);
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
  const [payTargetDebt, setPayTargetDebt] = useState<DebtItem | null>(null);
  const [payAmount, setPayAmount] = useState("");
  const [deleteDebtId, setDeleteDebtId] = useState<string | null>(null);
  const [deleteInvestId, setDeleteInvestId] = useState<string | null>(null);

  // Form states Thêm Nợ
  const [debtName, setDebtName] = useState("");
  const [debtTotal, setDebtTotal] = useState("");
  const [debtInterest, setDebtInterest] = useState("0");
  const [debtStartDate, setDebtStartDate] = useState("");
  const [debtDueDate, setDebtDueDate] = useState("");

  // Form states Thêm Đầu tư
  const [invName, setInvName] = useState("");
  const [invType, setInvType] = useState<InvestmentType>("SAVINGS");
  const [invAmount, setInvAmount] = useState("");
  const [invProfit, setInvProfit] = useState("6.5");
  const [invStartDate, setInvStartDate] = useState("");

  // Thống kê Nợ
  const debtTotals = useMemo(() => {
    const totalBorrowed = debts.reduce((sum, d) => sum + d.totalAmount, 0);
    const totalPaid = debts.reduce((sum, d) => sum + d.paidAmount, 0);
    const remaining = totalBorrowed - totalPaid;
    return { totalBorrowed, totalPaid, remaining };
  }, [debts]);

  // Thống kê Đầu tư
  const investTotals = useMemo(() => {
    const totalInvested = investments.reduce((sum, i) => sum + i.amount, 0);
    const activeInvested = investments
      .filter((i) => i.status === "ACTIVE")
      .reduce((sum, i) => sum + i.amount, 0);
    return { totalInvested, activeInvested };
  }, [investments]);

  const handleCreateDebt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!debtName.trim()) return;

    const total = parseFloat(debtTotal.replace(/[^0-9]/g, "")) || 0;
    addDebt({
      name: debtName.trim(),
      type: "BORROW",
      totalAmount: total,
      paidAmount: 0,
      interestRate: parseFloat(debtInterest) || 0,
      startDate: debtStartDate || new Date().toISOString().split("T")[0],
      dueDate: debtDueDate || new Date().toISOString().split("T")[0],
      status: "ACTIVE",
    });

    setDebtName("");
    setDebtTotal("");
    setDebtInterest("0");
    setDebtStartDate("");
    setDebtDueDate("");
    setIsDebtModalOpen(false);
  };

  const handlePayDebtSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payTargetDebt) return;

    const amt = parseFloat(payAmount.replace(/[^0-9]/g, "")) || 0;
    if (amt > 0) {
      payDebt(payTargetDebt.id, amt);
    }
    setPayTargetDebt(null);
    setPayAmount("");
  };

  const handleCreateInvest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invName.trim()) return;

    const amt = parseFloat(invAmount.replace(/[^0-9]/g, "")) || 0;
    addInvestment({
      name: invName.trim(),
      type: invType,
      amount: amt,
      currentValue: Math.round(amt * (1 + (parseFloat(invProfit) || 0) / 100)),
      expectedProfitRate: parseFloat(invProfit) || 0,
      startDate: invStartDate || new Date().toISOString().split("T")[0],
      status: "ACTIVE",
    });

    setInvName("");
    setInvAmount("");
    setInvProfit("6.5");
    setInvStartDate("");
    setIsInvestModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* ========================================================
          PHẦN 1: QUẢN LÝ KHOẢN NỢ (Khớp 100% debt-invest-management.JPG)
          ======================================================== */}
      <section className="space-y-4">
        <div className="bg-white rounded-xl p-6 border border-[#DCE4EE] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6 sm:gap-10">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Tổng đã vay
              </span>
              <span className="text-xl sm:text-2xl font-black text-slate-700 mt-0.5 block">
                {formatVND(debtTotals.totalBorrowed)}
              </span>
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">
                Đã trả
              </span>
              <span className="text-xl sm:text-2xl font-black text-emerald-600 mt-0.5 block">
                {formatVND(debtTotals.totalPaid)}
              </span>
            </div>
            <div>
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block">
                Còn nợ
              </span>
              <span className="text-xl sm:text-2xl font-black text-rose-600 mt-0.5 block">
                {formatVND(debtTotals.remaining)}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsDebtModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs sm:text-sm font-bold shadow-xs active:scale-95 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm khoản nợ</span>
          </button>
        </div>

        {/* Bảng Khoản Nợ */}
        <div className="bg-white rounded-xl border border-[#DCE4EE] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Mã nợ</th>
                  <th className="py-3.5 px-4">Tên khoản nợ</th>
                  <th className="py-3.5 px-4">Số tiền vay</th>
                  <th className="py-3.5 px-4">Tiến độ trả</th>
                  <th className="py-3.5 px-4">Ngày vay</th>
                  <th className="py-3.5 px-4">Đáo hạn</th>
                  <th className="py-3.5 px-4 text-center">Lãi suất</th>
                  <th className="py-3.5 px-4 text-center">Trạng thái</th>
                  <th className="py-3.5 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {debts.map((d) => {
                  const remaining = Math.max(0, d.totalAmount - d.paidAmount);
                  const isPaid = d.status === "PAID" || remaining === 0;

                  return (
                    <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-slate-400">{d.id}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">{d.name}</td>
                      <td className="py-3.5 px-4 font-black text-slate-800">
                        {formatVND(d.totalAmount)}
                      </td>
                      <td className="py-3.5 px-4 min-w-[140px]">
                        <div className="space-y-1">
                          <span className="text-[11px] text-slate-500 font-medium block">
                            {isPaid ? "Còn 0 VND" : `Còn ${formatVND(remaining)}`}
                          </span>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isPaid ? "bg-emerald-500" : "bg-blue-600"
                              }`}
                              style={{
                                width: `${Math.min(
                                  100,
                                  Math.round((d.paidAmount / d.totalAmount) * 100)
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                        {formatDateVN(d.startDate)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                        {formatDateVN(d.dueDate)}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                        {d.interestRate}%
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            isPaid
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                              : "bg-rose-50 text-rose-600 border border-rose-200"
                          }`}
                        >
                          {isPaid ? "Đã trả" : "Đang vay"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          {!isPaid && (
                            <button
                              onClick={() => {
                                setPayTargetDebt(d);
                                setPayAmount("");
                              }}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold rounded-lg transition-colors"
                            >
                              Trả nợ
                            </button>
                          )}
                          <button
                            onClick={() => setDeleteDebtId(d.id)}
                            className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ========================================================
          PHẦN 2: QUẢN LÝ ĐẦU TƯ (Khớp 100% debt-invest-management.JPG)
          ======================================================== */}
      <section className="space-y-4">
        <div className="bg-white rounded-xl p-6 border border-[#DCE4EE] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6 sm:gap-10">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Tổng đã đầu tư
              </span>
              <span className="text-xl sm:text-2xl font-black text-slate-700 mt-0.5 block">
                {formatVND(investTotals.totalInvested)}
              </span>
            </div>
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
                Đang đầu tư
              </span>
              <span className="text-xl sm:text-2xl font-black text-blue-600 mt-0.5 block">
                {formatVND(investTotals.activeInvested)}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsInvestModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs sm:text-sm font-bold shadow-xs active:scale-95 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm khoản đầu tư</span>
          </button>
        </div>

        {/* Bảng Đầu tư */}
        <div className="bg-white rounded-xl border border-[#DCE4EE] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Mã</th>
                  <th className="py-3.5 px-4">Tên khoản đầu tư</th>
                  <th className="py-3.5 px-4">Loại</th>
                  <th className="py-3.5 px-4">Số tiền vốn</th>
                  <th className="py-3.5 px-4">Ngày bắt đầu</th>
                  <th className="py-3.5 px-4 text-center">Lợi nhuận dự kiến</th>
                  <th className="py-3.5 px-4 text-center">Trạng thái</th>
                  <th className="py-3.5 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {investments.map((i) => {
                  const isActive = i.status === "ACTIVE";
                  const typeLabel =
                    i.type === "GOLD"
                      ? "Vàng"
                      : i.type === "SAVINGS"
                      ? "Tiết kiệm"
                      : i.type === "STOCK"
                      ? "Chứng khoán"
                      : "Khác";

                  return (
                    <tr key={i.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-slate-400">{i.id}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">{i.name}</td>
                      <td className="py-3.5 px-4 font-medium text-slate-600">{typeLabel}</td>
                      <td className="py-3.5 px-4 font-black text-slate-800">
                        {formatVND(i.amount)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                        {formatDateVN(i.startDate)}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-emerald-600">
                        {i.expectedProfitRate}%
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            isActive
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                              : "bg-slate-100 text-slate-500 border border-slate-200"
                          }`}
                        >
                          {isActive ? "Đang đầu tư" : "Đã kết thúc"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          {isActive ? (
                            <button
                              onClick={() => updateInvestment(i.id, { status: "CLOSED" })}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg transition-colors"
                            >
                              Tất toán
                            </button>
                          ) : (
                            <button
                              onClick={() => updateInvestment(i.id, { status: "ACTIVE" })}
                              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 text-[11px] font-bold rounded-lg transition-colors"
                            >
                              Kích hoạt lại
                            </button>
                          )}
                          <button
                            onClick={() => setDeleteInvestId(i.id)}
                            className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Modal Trả Nợ */}
      {payTargetDebt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full max-w-sm bg-white rounded-xl shadow-2xl p-6 border border-[#DCE4EE]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-bold text-slate-800 mb-1">
              Ghi nhận trả nợ - {payTargetDebt.name}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Còn nợ: {formatVND(payTargetDebt.totalAmount - payTargetDebt.paidAmount)}
            </p>

            <form onSubmit={handlePayDebtSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Số tiền trả đợt này (VND)
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={payAmount}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, "");
                    setPayAmount(raw ? new Intl.NumberFormat("vi-VN").format(parseInt(raw, 10)) : "");
                  }}
                  placeholder="0"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-sm font-bold outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPayTargetDebt(null)}
                  className="flex-1 py-2.5 text-xs font-semibold bg-slate-100 rounded-md hover:bg-slate-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-bold bg-emerald-600 text-white rounded-md shadow-md hover:bg-emerald-700 transition-colors"
                >
                  Xác nhận trả
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Thêm Khoản Nợ */}
      {isDebtModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 border border-[#DCE4EE]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Thêm khoản nợ mới</h3>
              <button onClick={() => setIsDebtModalOpen(false)} className="text-slate-400 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDebt} className="space-y-3.5 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Tên khoản nợ</label>
                <input
                  type="text"
                  required
                  value={debtName}
                  onChange={(e) => setDebtName(e.target.value)}
                  placeholder="VD: Vay mua xe, Mượn bạn..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Số tiền vay (VND)</label>
                <input
                  type="text"
                  required
                  value={debtTotal}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, "");
                    setDebtTotal(raw ? new Intl.NumberFormat("vi-VN").format(parseInt(raw, 10)) : "");
                  }}
                  placeholder="0"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Ngày vay</label>
                  <input
                    type="date"
                    required
                    value={debtStartDate}
                    onChange={(e) => setDebtStartDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Ngày đáo hạn</label>
                  <input
                    type="date"
                    required
                    value={debtDueDate}
                    onChange={(e) => setDebtDueDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Lãi suất (%/năm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={debtInterest}
                  onChange={(e) => setDebtInterest(e.target.value)}
                  placeholder="0"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 font-semibold"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsDebtModalOpen(false)}
                  className="flex-1 py-2.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-md text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/25 transition-colors"
                >
                  Lưu khoản nợ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Thêm Đầu tư */}
      {isInvestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 border border-[#DCE4EE]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Thêm khoản đầu tư</h3>
              <button onClick={() => setIsInvestModalOpen(false)} className="text-slate-400 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateInvest} className="space-y-3.5 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Tên khoản đầu tư</label>
                <input
                  type="text"
                  required
                  value={invName}
                  onChange={(e) => setInvName(e.target.value)}
                  placeholder="VD: Vàng SJC, Cổ phiếu FPT..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Loại đầu tư</label>
                <select
                  value={invType}
                  onChange={(e) => setInvType(e.target.value as InvestmentType)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 font-semibold"
                >
                  <option value="GOLD">Vàng</option>
                  <option value="SAVINGS">Tiết kiệm ngân hàng</option>
                  <option value="STOCK">Cổ phiếu / Chứng khoán</option>
                  <option value="OTHER">Khác</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Số tiền vốn (VND)</label>
                <input
                  type="text"
                  required
                  value={invAmount}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, "");
                    setInvAmount(raw ? new Intl.NumberFormat("vi-VN").format(parseInt(raw, 10)) : "");
                  }}
                  placeholder="0"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Lợi nhuận dự kiến (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={invProfit}
                    onChange={(e) => setInvProfit(e.target.value)}
                    placeholder="6.5"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Ngày bắt đầu</label>
                  <input
                    type="date"
                    required
                    value={invStartDate}
                    onChange={(e) => setInvStartDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 font-semibold"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsInvestModalOpen(false)}
                  className="flex-1 py-2.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-md text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/25 transition-colors"
                >
                  Lưu đầu tư
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm xóa nợ */}
      <ConfirmDialog
        isOpen={deleteDebtId !== null}
        title="Xóa khoản nợ này?"
        message="Khoản nợ này sẽ bị xóa khỏi danh sách theo dõi."
        confirmLabel="Xóa"
        cancelLabel="Hủy"
        isDanger={true}
        onConfirm={() => {
          if (deleteDebtId) {
            deleteDebt(deleteDebtId);
            setDeleteDebtId(null);
          }
        }}
        onCancel={() => setDeleteDebtId(null)}
      />

      {/* Confirm xóa đầu tư */}
      <ConfirmDialog
        isOpen={deleteInvestId !== null}
        title="Xóa khoản đầu tư này?"
        message="Khoản đầu tư này sẽ bị xóa khỏi danh mục của bạn."
        confirmLabel="Xóa"
        cancelLabel="Hủy"
        isDanger={true}
        onConfirm={() => {
          if (deleteInvestId) {
            deleteInvestment(deleteInvestId);
            setDeleteInvestId(null);
          }
        }}
        onCancel={() => setDeleteInvestId(null)}
      />
    </div>
  );
}
