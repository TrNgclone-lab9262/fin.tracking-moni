"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Check,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Calendar,
  Tag,
  FileText,
  CreditCard,
  Users,
  Heart,
} from "lucide-react";
import { useFinance } from "@/context/FinanceContext";
import { TransactionType, FamilyMember, ExpenseScope } from "@/types/finance";
import { formatVND } from "@/lib/formatters";

interface TransactionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TransactionFormModal({ isOpen, onClose }: TransactionFormModalProps) {
  const { categories, accounts, activePerspective, addTransaction } = useFinance();

  const [type, setType] = useState<TransactionType>("EXPENSE");
  const [memberId, setMemberId] = useState<FamilyMember>(() => {
    return activePerspective === "WIFE" ? "WIFE" : "HUSBAND";
  });
  const [scope, setScope] = useState<ExpenseScope>("FAMILY");

  const [amountInput, setAmountInput] = useState<string>("");
  const [date, setDate] = useState<string>(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  });

  const [categoryId, setCategoryId] = useState<string>("");
  const [accountId, setAccountId] = useState<string>("");
  const [toAccountId, setToAccountId] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const availableCategories = categories.filter(
    (c) => c.type === (type === "INCOME" ? "INCOME" : "EXPENSE")
  );

  useEffect(() => {
    if (availableCategories.length > 0) {
      const isCurrentValid = availableCategories.some((c) => c.id === categoryId);
      if (!isCurrentValid) {
        setCategoryId(availableCategories[0].id);
      }
    }
  }, [type, availableCategories, categoryId]);

  // Chọn tài khoản gợi ý phù hợp với thành viên
  useEffect(() => {
    if (accounts.length > 0) {
      const preferredAccount = accounts.find(
        (a) => a.owner === memberId && a.type !== "CREDIT_CARD"
      );
      if (preferredAccount) {
        setAccountId(preferredAccount.id);
      } else {
        setAccountId(accounts[0].id);
      }
    }
  }, [memberId, accounts]);

  useEffect(() => {
    if (isOpen) {
      setAmountInput("");
      setNote("");
      setError(null);
      setMemberId(activePerspective === "WIFE" ? "WIFE" : "HUSBAND");
    }
  }, [isOpen, activePerspective]);

  if (!isOpen) return null;

  const numericAmount = parseFloat(amountInput.replace(/[^0-9]/g, "")) || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (numericAmount <= 0) {
      setError("Vui lòng nhập số tiền lớn hơn 0");
      return;
    }

    if (!accountId) {
      setError("Vui lòng chọn tài khoản nguồn");
      return;
    }

    if (type === "TRANSFER") {
      if (!toAccountId) {
        setError("Vui lòng chọn tài khoản nhận");
        return;
      }
      if (accountId === toAccountId) {
        setError("Tài khoản nguồn và tài khoản nhận không được trùng nhau");
        return;
      }
    } else {
      if (!categoryId) {
        setError("Vui lòng chọn danh mục giao dịch");
        return;
      }
    }

    addTransaction({
      amount: numericAmount,
      date,
      type,
      categoryId: type === "TRANSFER" ? "cat_expense_other" : categoryId,
      accountId,
      toAccountId: type === "TRANSFER" ? toAccountId : undefined,
      memberId,
      scope,
      note: note.trim(),
    });

    onClose();
  };

  const handleAmountChange = (valStr: string) => {
    const rawVal = valStr.replace(/[^0-9]/g, "");
    if (!rawVal) {
      setAmountInput("");
      return;
    }
    const num = parseInt(rawVal, 10);
    setAmountInput(new Intl.NumberFormat("vi-VN").format(num));
  };

  // Numpad fast buttons
  const addQuickAmount = (extra: number) => {
    const current = numericAmount;
    handleAmountChange(`${current + extra}`);
  };

  const appendZeros = () => {
    if (numericAmount > 0) {
      handleAmountChange(`${numericAmount}000`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏡</span>
            <h2 className="text-base sm:text-lg font-bold text-slate-800">
              Ghi chép giao dịch gia đình
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
              {error}
            </div>
          )}

          {/* 1. Chọn Ai là người chi/thu? (Chồng vs Vợ) */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              Thành viên thực hiện
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMemberId("HUSBAND")}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                  memberId === "HUSBAND"
                    ? "bg-blue-50 border-blue-600 text-blue-700 shadow-sm"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span>👨</span>
                <span>Anh Chuột</span>
              </button>
              <button
                type="button"
                onClick={() => setMemberId("WIFE")}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                  memberId === "WIFE"
                    ? "bg-emerald-50 border-emerald-600 text-emerald-700 shadow-sm"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span>👩</span>
                <span>Bé Mèo</span>
              </button>
            </div>
          </div>

          {/* 2. Loại giao dịch (Chi tiêu, Thu nhập, Chuyển khoản) */}
          <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => setType("EXPENSE")}
              className={`flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-bold transition-all ${
                type === "EXPENSE"
                  ? "bg-rose-600 text-white shadow-md shadow-rose-600/25"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              Chi tiêu
            </button>
            <button
              type="button"
              onClick={() => setType("INCOME")}
              className={`flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-bold transition-all ${
                type === "INCOME"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              Thu nhập
            </button>
            <button
              type="button"
              onClick={() => setType("TRANSFER")}
              className={`flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-bold transition-all ${
                type === "TRANSFER"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              Chuyển khoản
            </button>
          </div>

          {/* 3. Ô Nhập Số Tiền & Numpad Quick Buttons */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-center">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Số tiền giao dịch (VND)
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={amountInput}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0"
              autoFocus
              className="w-full text-center text-3xl sm:text-4xl font-black bg-transparent outline-none text-slate-900 placeholder:text-slate-300"
            />
            <p className="text-xs font-semibold text-blue-600 mt-1">
              {numericAmount > 0 ? formatVND(numericAmount) : "Nhập số tiền..."}
            </p>

            {/* Quick Numpad Shortcuts */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 pt-3 border-t border-slate-200/60">
              <button
                type="button"
                onClick={appendZeros}
                className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-black text-slate-700 shadow-2xs"
              >
                +000
              </button>
              <button
                type="button"
                onClick={() => addQuickAmount(50000)}
                className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-700 shadow-2xs"
              >
                +50k
              </button>
              <button
                type="button"
                onClick={() => addQuickAmount(100000)}
                className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-700 shadow-2xs"
              >
                +100k
              </button>
              <button
                type="button"
                onClick={() => addQuickAmount(200000)}
                className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-700 shadow-2xs"
              >
                +200k
              </button>
              <button
                type="button"
                onClick={() => addQuickAmount(500000)}
                className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-700 shadow-2xs"
              >
                +500k
              </button>
            </div>
          </div>

          {/* 4. Mục đích chi tiêu: Việc chung gia đình vs Cá nhân */}
          {type === "EXPENSE" && (
            <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs">
              <span className="font-bold text-slate-600 shrink-0">Mục đích:</span>
              <button
                type="button"
                onClick={() => setScope("FAMILY")}
                className={`flex-1 py-1 px-2 rounded-lg font-bold transition-all ${
                  scope === "FAMILY"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                🏠 Chung gia đình
              </button>
              <button
                type="button"
                onClick={() => setScope("PERSONAL")}
                className={`flex-1 py-1 px-2 rounded-lg font-bold transition-all ${
                  scope === "PERSONAL"
                    ? "bg-purple-600 text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                👤 Cá nhân riêng
              </button>
            </div>
          )}

          {/* 5. Chọn Tài Khoản Nguồn */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-blue-600" />
              {type === "TRANSFER" ? "Từ tài khoản (Nguồn)" : "Tài khoản / Thẻ thanh toán"}
            </label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 cursor-pointer"
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}{" "}
                  {acc.type === "CREDIT_CARD"
                    ? `(Dư nợ: ${formatVND(acc.currentBalance)})`
                    : `(Số dư: ${formatVND(acc.currentBalance)})`}
                </option>
              ))}
            </select>
          </div>

          {/* Nếu là Chuyển Khoản -> Chọn Tài Khoản Nhận */}
          {type === "TRANSFER" ? (
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                Đến tài khoản (Đích)
              </label>
              <select
                value={toAccountId}
                onChange={(e) => setToAccountId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 cursor-pointer"
              >
                {accounts
                  .filter((a) => a.id !== accountId)
                  .map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name}
                    </option>
                  ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-blue-600" />
                Chọn danh mục
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 cursor-pointer"
              >
                {availableCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Ngày Giao dịch & Ghi chú */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                Ngày giao dịch
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                Ghi chú
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="VD: Tiền chợ, Tiền nhà..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
                type === "EXPENSE"
                  ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/25"
                  : type === "INCOME"
                  ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25"
                  : "bg-blue-600 hover:bg-blue-700 shadow-blue-600/25"
              }`}
            >
              <Check className="w-4 h-4" />
              Lưu giao dịch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
