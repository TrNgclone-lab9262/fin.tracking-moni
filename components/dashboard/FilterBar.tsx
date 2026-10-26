"use client";

import React from "react";
import { Search, Filter, X } from "lucide-react";
import { useFinance } from "@/context/FinanceContext";
import { TransactionType } from "@/types/finance";
import { getMonthDisplayLabel } from "@/lib/formatters";

export function FilterBar() {
  const {
    categories,
    selectedMonth,
    setSelectedMonth,
    availableMonths,
    selectedType,
    setSelectedType,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
  } = useFinance();

  const handleClearFilters = () => {
    setSelectedType("ALL");
    setSelectedCategory("ALL");
    setSearchQuery("");
  };

  const hasActiveFilters =
    selectedType !== "ALL" || selectedCategory !== "ALL" || searchQuery.trim() !== "";

  // Danh mục tương ứng để lọc
  const filteredCategoryOptions = categories.filter((c) => {
    if (selectedType === "ALL") return true;
    return c.type === selectedType;
  });

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Quick Tabs lọc theo tháng */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedMonth("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              selectedMonth === "ALL"
                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                : "bg-slate-100 hover:bg-slate-200 text-slate-600"
            }`}
          >
            Tất cả thời gian
          </button>
          {availableMonths.map((m) => {
            const isSelected = selectedMonth === m;
            return (
              <button
                key={m}
                onClick={() => setSelectedMonth(m)}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                }`}
              >
                {getMonthDisplayLabel(m)}
              </button>
            );
          })}
        </div>

        {/* Nút Reset bộ lọc khi đang có filter */}
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold self-start md:self-auto bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-200/50 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Xóa bộ lọc</span>
          </button>
        )}
      </div>

      {/* Dòng điều khiển: Lọc Loại + Danh mục + Tìm kiếm */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* 1. Lọc theo Loại (Thu / Chi / Tất cả) */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Loại giao dịch
          </label>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setSelectedType("ALL")}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedType === "ALL"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Tất cả
            </button>
            <button
              type="button"
              onClick={() => setSelectedType("INCOME")}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedType === "INCOME"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-500 hover:text-emerald-700"
              }`}
            >
              Thu nhập
            </button>
            <button
              type="button"
              onClick={() => setSelectedType("EXPENSE")}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedType === "EXPENSE"
                  ? "bg-rose-600 text-white shadow-sm"
                  : "text-slate-500 hover:text-rose-700"
              }`}
            >
              Chi tiêu
            </button>
          </div>
        </div>

        {/* 2. Dropdown Lọc Danh mục */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Danh mục
          </label>
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm font-medium rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="ALL">Tất cả danh mục</option>
              {filteredCategoryOptions.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.type === "INCOME" ? "[Thu] " : "[Chi] "}
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 3. Ô tìm kiếm ghi chú / từ khóa */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Tìm kiếm
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo ghi chú hoặc số tiền..."
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm rounded-xl pl-9 pr-8 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
