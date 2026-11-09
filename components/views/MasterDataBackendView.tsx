"use client";

import React, { useState } from "react";
import {
  Database,
  Tag,
  Building2,
  Sliders,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  Sparkles,
  Layers,
  Save,
  RotateCcw,
} from "lucide-react";
import { useFinance } from "@/context/FinanceContext";
import { Category, Account, AccountType, FamilyMember, TransactionType } from "@/types/finance";
import { formatVND } from "@/lib/formatters";
import { Button } from "@/components/ui/button";

export function MasterDataBackendView() {
  const {
    categories,
    accounts,
    budgets,
    addCategory,
    updateCategory,
    deleteCategory,
    addAccount,
    updateAccount,
    deleteAccount,
    setCategoryBudget,
  } = useFinance();

  const [activeSection, setActiveSection] = useState<"CATEGORIES" | "ACCOUNTS" | "BUDGETS">("CATEGORIES");

  // Form Danh mục
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [catName, setCatName] = useState("");
  const [catType, setCatType] = useState<TransactionType>("EXPENSE");
  const [catColor, setCatColor] = useState("#2563EB");

  // Form Tài khoản
  const [editingAcc, setEditingAcc] = useState<Account | null>(null);
  const [accName, setAccName] = useState("");
  const [accOwner, setAccOwner] = useState<FamilyMember>("HUSBAND");
  const [accType, setAccType] = useState<AccountType>("BANK");
  const [accLimit, setAccLimit] = useState("");
  const [accNumber, setAccNumber] = useState("");

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    if (editingCat) {
      updateCategory(editingCat.id, {
        name: catName.trim(),
        type: catType as any,
        color: catColor,
      });
      setEditingCat(null);
    } else {
      addCategory({
        name: catName.trim(),
        type: catType as any,
        color: catColor,
      });
    }

    setCatName("");
    setCatColor("#2563EB");
  };

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accName.trim()) return;

    const limitVal = accType === "CREDIT_CARD" ? parseInt(accLimit.replace(/[^0-9]/g, ""), 10) || 0 : undefined;

    if (editingAcc) {
      updateAccount(editingAcc.id, {
        name: accName.trim(),
        owner: accOwner,
        type: accType,
        creditLimit: limitVal,
        accountNumber: accNumber.trim() || undefined,
      });
      setEditingAcc(null);
    } else {
      addAccount({
        name: accName.trim(),
        owner: accOwner,
        type: accType,
        initialBalance: 0,
        creditLimit: limitVal,
        accountNumber: accNumber.trim() || undefined,
      });
    }

    setAccName("");
    setAccLimit("");
    setAccNumber("");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* 1. Header Phân Hệ Quản Trị Backend */}
      <div className="bg-gradient-to-r from-[#172B4D] via-[#1E3A8A] to-[#2563EB] text-white p-6 rounded-[3px] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-300" />
            <h2 className="text-lg font-black tracking-tight">Trung Tâm Quản Trị Dữ Liệu Gốc (Master Data Hub)</h2>
          </div>
          <p className="text-xs text-blue-100/90 mt-1">
            Toàn quyền thêm, đổi tên, cấu hình màu sắc, tài khoản thẻ BIDV và tham số lõi. Tự động đồng bộ hai chiều với Supabase PostgreSQL.
          </p>
        </div>

        {/* 3 Tab Điều Khiển Phân Khu */}
        <div className="flex items-center bg-white/10 p-1 rounded-[3px] backdrop-blur-xs self-start sm:self-auto border border-white/15">
          <button
            type="button"
            onClick={() => setActiveSection("CATEGORIES")}
            className={`px-3 py-1.5 rounded-[3px] text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSection === "CATEGORIES" ? "bg-white text-blue-900 shadow-xs" : "text-white/80 hover:text-white"
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Danh mục</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("ACCOUNTS")}
            className={`px-3 py-1.5 rounded-[3px] text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSection === "ACCOUNTS" ? "bg-white text-blue-900 shadow-xs" : "text-white/80 hover:text-white"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Ví & Thẻ</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("BUDGETS")}
            className={`px-3 py-1.5 rounded-[3px] text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSection === "BUDGETS" ? "bg-white text-blue-900 shadow-xs" : "text-white/80 hover:text-white"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Hạn mức tháng</span>
          </button>
        </div>
      </div>

      {/* 2. NỘI DUNG SECTION: DANH MỤC (CATEGORIES) */}
      {activeSection === "CATEGORIES" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cột Trái: Bảng Danh Sách Danh Mục */}
          <div className="lg:col-span-2 bg-white rounded-[3px] p-5 border border-[#DCE4EE] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9EEF5]">
              <h3 className="text-sm font-bold text-[#172B4D] flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-600" />
                <span>Danh Sách Danh Mục ({categories.length})</span>
              </h3>
              <span className="text-xs text-slate-400 font-medium">Bấm bút chì để sửa tên / màu</span>
            </div>

            <div className="divide-y divide-[#E9EEF5] max-h-[500px] overflow-y-auto">
              {categories.map((cat) => (
                <div key={cat.id} className="py-2.5 px-2 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-4 h-4 rounded-full shrink-0 border border-black/10"
                      style={{ backgroundColor: cat.color }}
                    />
                    <div>
                      <span className="font-bold text-xs text-slate-800">{cat.name}</span>
                      <span className="text-[10px] text-slate-400 ml-2 font-mono">({cat.id})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-[3px] ${
                        cat.type === "INCOME" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {cat.type === "INCOME" ? "Thu nhập" : "Chi tiêu"}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCat(cat);
                        setCatName(cat.name);
                        setCatType(cat.type);
                        setCatColor(cat.color || "#2563EB");
                      }}
                      className="p-1 text-slate-400 hover:text-blue-600 rounded-[3px] transition-colors"
                      title="Sửa danh mục"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Anh có muốn xóa danh mục "${cat.name}"?`)) {
                          deleteCategory(cat.id);
                        }
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-[3px] transition-colors"
                      title="Xóa danh mục"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cột Phải: Form Thêm / Sửa Danh Mục */}
          <div className="bg-white rounded-[3px] p-5 border border-[#DCE4EE] shadow-xs space-y-4 h-fit">
            <h3 className="text-sm font-bold text-[#172B4D] pb-3 border-b border-[#E9EEF5]">
              {editingCat ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
            </h3>

            <form onSubmit={handleSaveCategory} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên danh mục</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Cà phê gia đình, Điện nước..."
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-[3px] px-3 py-2 outline-none focus:border-blue-600 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Loại luồng tiền</label>
                <select
                  value={catType}
                  onChange={(e) => setCatType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-[3px] px-3 py-2 outline-none focus:border-blue-600 font-semibold cursor-pointer"
                >
                  <option value="EXPENSE">Chi tiêu (Expense)</option>
                  <option value="INCOME">Thu nhập (Income)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mã màu nhận diện</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={catColor}
                    onChange={(e) => setCatColor(e.target.value)}
                    className="w-10 h-8 p-0 border border-slate-300 rounded-[3px] cursor-pointer"
                  />
                  <input
                    type="text"
                    value={catColor}
                    onChange={(e) => setCatColor(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-[3px] px-3 py-1.5 font-mono text-xs outline-none uppercase"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                {editingCat && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingCat(null);
                      setCatName("");
                    }}
                    className="flex-1 text-xs h-9"
                  >
                    Hủy
                  </Button>
                )}
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9">
                  <Save className="w-3.5 h-3.5 mr-1" />
                  <span>{editingCat ? "Cập nhật" : "Lưu danh mục"}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. NỘI DUNG SECTION: TÀI KHOẢN & THẺ (ACCOUNTS) */}
      {activeSection === "ACCOUNTS" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cột Trái: Bảng Danh Sách Tài Khoản */}
          <div className="lg:col-span-2 bg-white rounded-[3px] p-5 border border-[#DCE4EE] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9EEF5]">
              <h3 className="text-sm font-bold text-[#172B4D] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Danh Sách Tài Khoản & Thẻ ({accounts.length})</span>
              </h3>
              <span className="text-xs text-slate-400 font-medium">Bao gồm 2 thẻ BIDV Credit</span>
            </div>

            <div className="divide-y divide-[#E9EEF5]">
              {accounts.map((acc) => (
                <div key={acc.id} className="py-3 px-2 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-800">{acc.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({acc.accountNumber || "Tiền mặt"})</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                      <span>Chủ sở hữu: <strong>{acc.owner === "HUSBAND" ? "👨 Anh Chuột" : acc.owner === "WIFE" ? "👩 Bé Mèo" : "🏡 Chung"}</strong></span>
                      {acc.type === "CREDIT_CARD" && (
                        <span className="text-amber-600 font-semibold">Hạn mức: {formatVND(acc.creditLimit || 0)}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAcc(acc);
                        setAccName(acc.name);
                        setAccOwner(acc.owner);
                        setAccType(acc.type);
                        setAccLimit(acc.creditLimit ? new Intl.NumberFormat("vi-VN").format(acc.creditLimit) : "");
                        setAccNumber(acc.accountNumber || "");
                      }}
                      className="p-1 text-slate-400 hover:text-blue-600 rounded-[3px] transition-colors"
                      title="Sửa tài khoản"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Anh có muốn xóa tài khoản "${acc.name}" không?`)) {
                          deleteAccount(acc.id);
                        }
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-[3px] transition-colors"
                      title="Xóa tài khoản"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cột Phải: Form Thêm / Sửa Tài Khoản */}
          <div className="bg-white rounded-[3px] p-5 border border-[#DCE4EE] shadow-xs space-y-4 h-fit">
            <h3 className="text-sm font-bold text-[#172B4D] pb-3 border-b border-[#E9EEF5]">
              {editingAcc ? "Chỉnh sửa tài khoản" : "Thêm tài khoản / thẻ mới"}
            </h3>

            <form onSubmit={handleSaveAccount} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên tài khoản / Thẻ</label>
                <input
                  type="text"
                  required
                  placeholder="VD: BIDV Chuột, Tiền mặt..."
                  value={accName}
                  onChange={(e) => setAccName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-[3px] px-3 py-2 outline-none focus:border-blue-600 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Chủ sở hữu</label>
                <select
                  value={accOwner}
                  onChange={(e) => setAccOwner(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-[3px] px-3 py-2 outline-none focus:border-blue-600 font-semibold cursor-pointer"
                >
                  <option value="HUSBAND">👨 Anh Chuột (Chồng)</option>
                  <option value="WIFE">👩 Bé Mèo (Vợ)</option>
                  <option value="SHARED">🏡 My Home (Quỹ chung)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Loại hình</label>
                <select
                  value={accType}
                  onChange={(e) => setAccType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-[3px] px-3 py-2 outline-none focus:border-blue-600 font-semibold cursor-pointer"
                >
                  <option value="BANK">Tài khoản Ngân hàng (Bank)</option>
                  <option value="CREDIT_CARD">Thẻ tín dụng (Credit Card)</option>
                  <option value="CASH">Tiền mặt (Cash)</option>
                  <option value="E_WALLET">Ví điện tử (E-Wallet)</option>
                </select>
              </div>

              {accType === "CREDIT_CARD" && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hạn mức thẻ (VND)</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: 50.000.000"
                    value={accLimit}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^0-9]/g, "");
                      setAccLimit(raw ? new Intl.NumberFormat("vi-VN").format(parseInt(raw, 10)) : "");
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-[3px] px-3 py-2 outline-none focus:border-blue-600 font-bold"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Số tài khoản (hoặc 4 số cuối thẻ)</label>
                <input
                  type="text"
                  placeholder="VD: 1221****6789"
                  value={accNumber}
                  onChange={(e) => setAccNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-[3px] px-3 py-2 outline-none focus:border-blue-600 font-mono"
                />
              </div>

              <div className="pt-2 flex gap-2">
                {editingAcc && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingAcc(null);
                      setAccName("");
                    }}
                    className="flex-1 text-xs h-9"
                  >
                    Hủy
                  </Button>
                )}
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9">
                  <Save className="w-3.5 h-3.5 mr-1" />
                  <span>{editingAcc ? "Cập nhật" : "Lưu tài khoản"}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. NỘI DUNG SECTION: HẠN MỨC & NGÂN SÁCH (BUDGETS) */}
      {activeSection === "BUDGETS" && (
        <div className="bg-white rounded-[3px] p-5 border border-[#DCE4EE] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E9EEF5]">
            <h3 className="text-sm font-bold text-[#172B4D] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>Cấu Hình Hạn Mức Ngân Sách Tháng Cho Từng Danh Mục</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">Thay đổi và bấm lưu</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories
              .filter((c) => c.type === "EXPENSE")
              .map((c) => {
                const currentBudget = budgets.find((b) => b.categoryId === c.id);
                return (
                  <div key={c.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-[3px] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-800">{c.name}</span>
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: c.color }}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        defaultValue={currentBudget?.limitAmount || 0}
                        id={`budget_input_${c.id}`}
                        className="flex-1 bg-white border border-slate-300 rounded-[3px] px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-600"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const inputEl = document.getElementById(`budget_input_${c.id}`) as HTMLInputElement;
                          const val = parseInt(inputEl?.value, 10) || 0;
                          setCategoryBudget(c.id, val);
                          alert(`Đã cập nhật ngân sách cho "${c.name}" thành ${formatVND(val)}`);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-[3px] transition-colors"
                      >
                        Lưu
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}

