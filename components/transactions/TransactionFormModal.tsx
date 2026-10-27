"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  Calendar,
  Tag,
  CreditCard,
  FileText,
  Users,
  Check,
} from "lucide-react";
import { useFinance } from "@/context/FinanceContext";
import { formatVND } from "@/lib/formatters";
import { FamilyMember, ExpenseScope, TransactionType, Transaction } from "@/types/finance";

interface TransactionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: TransactionType;
  editTransaction?: Transaction | null;
}

export function TransactionFormModal({
  isOpen,
  onClose,
  defaultType = "EXPENSE",
  editTransaction = null,
}: TransactionFormModalProps) {
  const { accounts, categories, addTransaction, updateTransaction, activePerspective } = useFinance();

  const [type, setType] = useState<TransactionType>(defaultType);
  const [amountInput, setAmountInput] = useState("");
  const [numericAmount, setNumericAmount] = useState<number>(0);
  const [categoryId, setCategoryId] = useState("");
  const [accountId, setAccountId] = useState("");
  const [toAccountId, setToAccountId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");
  const [memberId, setMemberId] = useState<FamilyMember>("HUSBAND");
  const [scope, setScope] = useState<ExpenseScope>("FAMILY");
  const [error, setError] = useState<string | null>(null);

  // Khởi tạo giá trị mặc định theo góc nhìn hiện tại hoặc nạp dữ liệu chỉnh sửa
  useEffect(() => {
    if (isOpen) {
      if (editTransaction) {
        setType(editTransaction.type);
        setAmountInput(new Intl.NumberFormat("vi-VN").format(editTransaction.amount));
        setNumericAmount(editTransaction.amount);
        setDate(editTransaction.date);
        setCategoryId(editTransaction.categoryId);
        setAccountId(editTransaction.accountId);
        if (editTransaction.toAccountId) setToAccountId(editTransaction.toAccountId);
        setNote(editTransaction.note || "");
        setMemberId(editTransaction.memberId || "HUSBAND");
        setScope(editTransaction.scope || "FAMILY");
        setError(null);
      } else {
        setType(defaultType);
        setAmountInput("");
        setNumericAmount(0);
        setDate(new Date().toISOString().split("T")[0]);
        setNote("");
        setError(null);

        // Gán thành viên theo activePerspective
        if (activePerspective === "WIFE") {
          setMemberId("WIFE");
        } else {
          setMemberId("HUSBAND");
        }

        // Chọn tài khoản đầu tiên phù hợp
        if (accounts.length > 0) {
          const preferred =
            activePerspective === "WIFE"
              ? accounts.find((a) => a.owner === "WIFE") || accounts[0]
              : accounts.find((a) => a.owner === "HUSBAND") || accounts[0];
          setAccountId(preferred.id);
          const second = accounts.find((a) => a.id !== preferred.id);
          if (second) setToAccountId(second.id);
        }
      }
    }
  }, [isOpen, defaultType, editTransaction, activePerspective, accounts]);

  // Lọc danh mục tương ứng với type
  const availableCategories = categories.filter((c) => c.type === type);

  useEffect(() => {
    if (!editTransaction && availableCategories.length > 0 && !availableCategories.some((c) => c.id === categoryId)) {
      setCategoryId(availableCategories[0].id);
    }
  }, [type, availableCategories, categoryId, editTransaction]);

  if (!isOpen) return null;

  // Format số tiền khi người dùng gõ
  const handleAmountChange = (val: string) => {
    const rawNumber = val.replace(/[^0-9]/g, "");
    if (!rawNumber) {
      setAmountInput("");
      setNumericAmount(0);
      return;
    }
    const num = parseInt(rawNumber, 10);
    setNumericAmount(num);
    setAmountInput(num.toLocaleString("vi-VN"));
  };

  // Numpad Quick add
  const addQuickAmount = (delta: number) => {
    const next = numericAmount + delta;
    setNumericAmount(next);
    setAmountInput(next.toLocaleString("vi-VN"));
  };

  const appendZeros = () => {
    if (numericAmount <= 0) return;
    const next = numericAmount * 1000;
    setNumericAmount(next);
    setAmountInput(next.toLocaleString("vi-VN"));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numericAmount <= 0) {
      setError("Vui lòng nhập số tiền lớn hơn 0");
      return;
    }

    if (type === "TRANSFER" && accountId === toAccountId) {
      setError("Tài khoản nguồn và tài khoản nhận phải khác nhau");
      return;
    }

    const payload = {
      amount: numericAmount,
      date,
      type,
      categoryId: type === "TRANSFER" ? "cat_transfer_default" : categoryId,
      accountId,
      toAccountId: type === "TRANSFER" ? toAccountId : undefined,
      note: note.trim() || undefined,
      memberId,
      scope,
    };

    if (editTransaction) {
      updateTransaction(editTransaction.id, payload);
    } else {
      addTransaction(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden border border-[#DCE4EE] flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-[#E9EEF5] flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏡</span>
            <h2 className="text-base sm:text-lg font-bold text-[#172B4D]">
              {editTransaction ? "Chỉnh sửa giao dịch" : "Ghi chép giao dịch gia đình"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-lg">
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
                className={`flex items-center justify-center gap-2 py-2 rounded-md text-xs sm:text-sm font-bold border transition-all ${
                  memberId === "HUSBAND"
                    ? "bg-blue-50 border-blue-600 text-blue-700 shadow-xs"
                    : "border-[#DCE4EE] text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span>👨</span>
                <span>Anh Chuột</span>
              </button>
              <button
                type="button"
                onClick={() => setMemberId("WIFE")}
                className={`flex items-center justify-center gap-2 py-2 rounded-md text-xs sm:text-sm font-bold border transition-all ${
                  memberId === "WIFE"
                    ? "bg-emerald-50 border-emerald-600 text-emerald-700 shadow-xs"
                    : "border-[#DCE4EE] text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span>👩</span>
                <span>Bé Mèo</span>
              </button>
            </div>
          </div>

          {/* 2. Loại giao dịch (Chi tiêu, Thu nhập, Chuyển khoản) */}
          <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1.5 rounded-lg border border-[#E9EEF5]">
            <button
              type="button"
              onClick={() => setType("EXPENSE")}
              className={`flex items-center justify-center gap-1 py-1.5 rounded-md text-xs font-bold transition-all ${
                type === "EXPENSE"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              Chi tiêu
            </button>
            <button
              type="button"
              onClick={() => setType("INCOME")}
              className={`flex items-center justify-center gap-1 py-1.5 rounded-md text-xs font-bold transition-all ${
                type === "INCOME"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              Thu nhập
            </button>
            <button
              type="button"
              onClick={() => setType("TRANSFER")}
              className={`flex items-center justify-center gap-1 py-1.5 rounded-md text-xs font-bold transition-all ${
                type === "TRANSFER"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              Chuyển khoản
            </button>
          </div>

          {/* 3. Ô Nhập Số Tiền & Numpad Quick Buttons */}
          <div className="bg-slate-50 rounded-lg p-4 border border-[#DCE4EE] text-center">
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
              className="w-full text-center text-3xl sm:text-4xl font-black bg-transparent outline-none text-[#172B4D] placeholder:text-slate-300"
            />
            <p className="text-xs font-semibold text-blue-600 mt-1">
              {numericAmount > 0 ? formatVND(numericAmount) : "Nhập số tiền..."}
            </p>

            {/* Quick Numpad Shortcuts */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 pt-3 border-t border-[#E9EEF5]">
              <button
                type="button"
                onClick={appendZeros}
                className="px-2.5 py-1 bg-white border border-[#DCE4EE] hover:bg-slate-100 rounded-md text-xs font-black text-slate-700 shadow-2xs"
              >
                +000
              </button>
              <button
                type="button"
                onClick={() => addQuickAmount(50000)}
                className="px-2.5 py-1 bg-white border border-[#DCE4EE] hover:bg-slate-100 rounded-md text-xs font-bold text-slate-700 shadow-2xs"
              >
                +50k
              </button>
              <button
                type="button"
                onClick={() => addQuickAmount(100000)}
                className="px-2.5 py-1 bg-white border border-[#DCE4EE] hover:bg-slate-100 rounded-md text-xs font-bold text-slate-700 shadow-2xs"
              >
                +100k
              </button>
              <button
                type="button"
                onClick={() => addQuickAmount(200000)}
                className="px-2.5 py-1 bg-white border border-[#DCE4EE] hover:bg-slate-100 rounded-md text-xs font-bold text-slate-700 shadow-2xs"
              >
                +200k
              </button>
              <button
                type="button"
                onClick={() => addQuickAmount(500000)}
                className="px-2.5 py-1 bg-white border border-[#DCE4EE] hover:bg-slate-100 rounded-md text-xs font-bold text-slate-700 shadow-2xs"
              >
                +500k
              </button>
            </div>
          </div>

          {/* 4. Mục đích chi tiêu: Việc chung gia đình vs Cá nhân */}
          {type === "EXPENSE" && (
            <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-[#DCE4EE] text-xs">
              <span className="font-bold text-slate-600 shrink-0">Mục đích:</span>
              <button
                type="button"
                onClick={() => setScope("FAMILY")}
                className={`flex-1 py-1 px-2 rounded-md font-bold transition-all ${
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
                className={`flex-1 py-1 px-2 rounded-md font-bold transition-all ${
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
              className="w-full bg-slate-50 border border-[#DCE4EE] rounded-lg px-3.5 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 cursor-pointer"
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
                className="w-full bg-slate-50 border border-[#DCE4EE] rounded-lg px-3.5 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 cursor-pointer"
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
                className="w-full bg-slate-50 border border-[#DCE4EE] rounded-lg px-3.5 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 cursor-pointer"
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
                className="w-full bg-slate-50 border border-[#DCE4EE] rounded-lg px-3.5 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500"
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
                className="w-full bg-slate-50 border border-[#DCE4EE] rounded-lg px-3.5 py-2 text-sm text-slate-800 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-md text-xs sm:text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              className={`flex-1 py-2.5 px-4 rounded-md text-xs sm:text-sm font-bold text-white shadow-xs transition-all active:scale-95 flex items-center justify-center gap-2 ${
                type === "EXPENSE"
                  ? "bg-rose-600 hover:bg-rose-700"
                  : type === "INCOME"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              <Check className="w-4 h-4" />
              {editTransaction ? "Lưu thay đổi" : "Lưu giao dịch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
