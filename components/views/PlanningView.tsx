"use client";

import React, { useState } from "react";
import {
  Target,
  Sliders,
  Plus,
  Calendar,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  X,
  Coins,
  ShieldAlert,
  Plane,
  Laptop,
  Trash2,
  Edit2,
  Pencil,
} from "lucide-react";
import { useFinance } from "@/context/FinanceContext";
import { formatVND } from "@/lib/formatters";
import { CategoryIcon } from "@/components/common/CategoryIcon";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { SavingsGoal } from "@/types/finance";

export function PlanningView() {
  const {
    budgetSummary,
    goals,
    categories,
    setCategoryBudget,
    addGoal,
    updateGoal,
    depositGoal,
    deleteGoal,
  } = useFinance();

  const [activeSubTab, setActiveSubTab] = useState<"BUDGET" | "GOALS">("BUDGET");
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [depositGoalId, setDepositGoalId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [deleteGoalId, setDeleteGoalId] = useState<string | null>(null);

  // Goal Form State (Dual-Mode: Create & Edit)
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [goalName, setGoalName] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [goalCurrent, setGoalCurrent] = useState("");
  const [goalDeadline, setGoalDeadline] = useState("");

  // Quick Category Budget Edit Modal
  const [editingCategoryBudget, setEditingCategoryBudget] = useState<{
    categoryId: string;
    categoryName: string;
    categoryColor: string;
    limitAmount: number;
  } | null>(null);
  const [categoryBudgetInput, setCategoryBudgetInput] = useState("");

  const handleOpenCreateGoal = () => {
    setEditingGoal(null);
    setGoalName("");
    setGoalTarget("");
    setGoalCurrent("");
    setGoalDeadline("");
    setIsGoalModalOpen(true);
  };

  const handleOpenEditGoal = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    setGoalName(goal.name);
    setGoalTarget(new Intl.NumberFormat("vi-VN").format(goal.targetAmount));
    setGoalCurrent(new Intl.NumberFormat("vi-VN").format(goal.currentAmount));
    setGoalDeadline(goal.deadline || "");
    setIsGoalModalOpen(true);
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalName.trim()) return;

    const target = parseFloat(goalTarget.replace(/[^0-9]/g, "")) || 0;
    const current = parseFloat(goalCurrent.replace(/[^0-9]/g, "")) || 0;

    if (editingGoal) {
      updateGoal(editingGoal.id, {
        name: goalName.trim(),
        targetAmount: target,
        currentAmount: current,
        deadline: goalDeadline || undefined,
      });
    } else {
      addGoal({
        name: goalName.trim(),
        targetAmount: target,
        currentAmount: current,
        deadline: goalDeadline || undefined,
      });
    }

    setEditingGoal(null);
    setGoalName("");
    setGoalTarget("");
    setGoalCurrent("");
    setGoalDeadline("");
    setIsGoalModalOpen(false);
  };

  const handleOpenQuickBudgetEdit = (item: {
    categoryId: string;
    categoryName: string;
    categoryColor: string;
    limitAmount: number;
  }) => {
    setEditingCategoryBudget(item);
    setCategoryBudgetInput(new Intl.NumberFormat("vi-VN").format(item.limitAmount));
  };

  const handleSaveCategoryBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategoryBudget) return;
    const val = parseFloat(categoryBudgetInput.replace(/[^0-9]/g, "")) || 0;
    setCategoryBudget(editingCategoryBudget.categoryId, val);
    setEditingCategoryBudget(null);
    setCategoryBudgetInput("");
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositGoalId) return;

    const amt = parseFloat(depositAmount.replace(/[^0-9]/g, "")) || 0;
    if (amt > 0) {
      depositGoal(depositGoalId, amt);
    }
    setDepositGoalId(null);
    setDepositAmount("");
  };

  const getGoalIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("khẩn cấp") || lower.includes("quỹ")) return <ShieldAlert className="w-5 h-5 text-rose-500" />;
    if (lower.includes("du lịch") || lower.includes("đà lạt") || lower.includes("vé")) return <Plane className="w-5 h-5 text-blue-500" />;
    return <Laptop className="w-5 h-5 text-amber-500" />;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Tab Switcher: Ngân sách vs Mục tiêu (Khớp hình financial-plan.JPG) */}
      <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-[#E9EEF5] w-fit">
        <button
          onClick={() => setActiveSubTab("BUDGET")}
          className={`px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-md transition-all ${
            activeSubTab === "BUDGET"
              ? "bg-white text-blue-700 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Ngân sách tháng
        </button>
        <button
          onClick={() => setActiveSubTab("GOALS")}
          className={`px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-md transition-all ${
            activeSubTab === "GOALS"
              ? "bg-white text-blue-700 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Mục tiêu tiết kiệm
        </button>
      </div>

      {activeSubTab === "BUDGET" ? (
        <div className="space-y-6">
          {/* Header 4 thẻ chỉ số ngân sách tháng (Khớp 100% financial-plan.JPG) */}
          <div className="bg-white rounded-xl p-6 border border-[#DCE4EE] shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E9EEF5]">
              <div>
                <h3 className="text-base font-bold text-[#172B4D]">Theo dõi ngân sách tháng</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Theo dõi chi tiêu tháng này so với ngân sách đặt cho từng danh mục chi
                </p>
              </div>
              <button
                onClick={() => setIsBudgetModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-md transition-colors self-start sm:self-auto"
              >
                <Sliders className="w-4 h-4 text-slate-500" />
                <span>Đặt ngân sách</span>
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-6">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Tổng ngân sách tháng
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#172B4D] mt-1 block">
                  {formatVND(budgetSummary.totalBudget)}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Đã chi
                </span>
                <span className="text-xl sm:text-2xl font-black text-rose-600 mt-1 block">
                  {formatVND(budgetSummary.totalSpent)}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Còn lại
                </span>
                <span className="text-xl sm:text-2xl font-black text-emerald-600 mt-1 block">
                  {formatVND(budgetSummary.remaining)}
                </span>
              </div>
              <div className="bg-blue-50/70 p-3 sm:p-4 rounded-lg border border-blue-100">
                <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
                  Mỗi ngày còn được tiêu ({budgetSummary.daysRemaining} ngày)
                </span>
                <span className="text-lg sm:text-xl font-black text-blue-700 mt-1 block">
                  {formatVND(budgetSummary.dailyAllowance)}
                </span>
              </div>
            </div>
          </div>

          {/* Grid Hạn mức từng danh mục (Khớp 100% financial-plan.JPG) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgetSummary.items.map((item) => {
              const isOver = item.percentage >= 100;
              return (
                <div
                  key={item.categoryId}
                  className="bg-white rounded-xl p-5 border border-[#DCE4EE] shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: item.categoryColor }}
                      />
                      <h4 className="font-bold text-[#172B4D] text-sm">{item.categoryName}</h4>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-slate-500">
                        {formatVND(item.spentAmount)} / {formatVND(item.limitAmount)}
                      </span>
                      <button
                        onClick={() => handleOpenQuickBudgetEdit(item)}
                        title="Điều chỉnh hạn mức danh mục"
                        className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isOver ? "bg-amber-500" : "bg-teal-500"
                      }`}
                      style={{ width: `${Math.min(100, item.percentage)}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
                    <span>
                      {isOver ? "Còn 0 VND" : `Còn ${formatVND(item.remainingAmount)}`}
                    </span>
                    <span className={`font-bold ${isOver ? "text-amber-600" : "text-teal-600"}`}>
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* TAB 2: MỤC TIÊU TIẾT KIỆM (Khớp 100% financial-plan.JPG) */
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-[#DCE4EE] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-[#172B4D]">Mục tiêu tài chính</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Đặt mục tiêu tiết kiệm và theo dõi số tiền cần để dành mỗi tháng
              </p>
            </div>
            <button
              onClick={handleOpenCreateGoal}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs sm:text-sm font-bold shadow-xs active:scale-95 transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm mục tiêu</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {goals.map((g) => {
              const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
              const isDone = pct === 100;

              return (
                <div
                  key={g.id}
                  className="bg-white rounded-xl p-5 sm:p-6 border border-[#DCE4EE] shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center border border-[#E9EEF5]">
                          {getGoalIcon(g.name)}
                        </div>
                        <div>
                          <h4 className="font-bold text-[#172B4D] text-sm">{g.name}</h4>
                          <p className="text-[11px] text-slate-400 font-medium">
                            {g.deadline ? `Hạn: ${g.deadline.split("-").reverse().join("/")}` : "Không đặt hạn"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between items-baseline mb-1.5 text-xs">
                        <span className="font-black text-[#172B4D]">
                          {formatVND(g.currentAmount)}
                        </span>
                        <span className="text-slate-400 font-semibold">
                          / {formatVND(g.targetAmount)}
                        </span>
                      </div>

                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isDone ? "bg-emerald-500" : "bg-blue-600"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      <div className="flex justify-between items-center text-[11px] mt-2 font-medium">
                        <span className="text-slate-500">
                          {isDone ? "🎉 Đã hoàn thành!" : `Tiến độ: ${pct}%`}
                        </span>
                        {!isDone && (
                          <span className="text-blue-600 font-semibold">
                            Cần ~{formatVND(Math.round((g.targetAmount - g.currentAmount) / 12))}/tháng
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E9EEF5] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {!isDone ? (
                        <button
                          onClick={() => setDepositGoalId(g.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold rounded-md transition-colors"
                        >
                          <Coins className="w-3.5 h-3.5" />
                          <span>Nạp thêm</span>
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-bold">
                          <CheckCircle2 className="w-4 h-4" /> Đạt mục tiêu
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditGoal(g)}
                        title="Chỉnh sửa mục tiêu"
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteGoalId(g.id)}
                        title="Xóa mục tiêu"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal Cài đặt Hạn mức Ngân sách */}
      {isBudgetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg bg-white rounded-xl shadow-2xl p-6 border border-[#DCE4EE] max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E9EEF5]">
              <h3 className="text-base font-bold text-[#172B4D]">Cài đặt hạn mức ngân sách tháng</h3>
              <button onClick={() => setIsBudgetModalOpen(false)} className="text-slate-400 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {categories
                .filter((c) => c.type === "EXPENSE")
                .map((cat) => {
                  const currentBudget = budgetSummary.items.find((b) => b.categoryId === cat.id)?.limitAmount || 0;
                  return (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between gap-3 p-3 rounded-lg bg-slate-50 border border-[#E9EEF5]"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="text-xs font-bold text-slate-800">{cat.name}</span>
                      </div>
                      <input
                        type="text"
                        defaultValue={new Intl.NumberFormat("vi-VN").format(currentBudget)}
                        onBlur={(e) => {
                          const val = parseFloat(e.target.value.replace(/[^0-9]/g, "")) || 0;
                          setCategoryBudget(cat.id, val);
                        }}
                        className="w-32 text-right bg-white border border-[#DCE4EE] rounded-lg px-2.5 py-1 text-xs font-black text-slate-800 outline-none focus:border-blue-500"
                      />
                    </div>
                  );
                })}
            </div>

            <div className="pt-3 border-t border-[#E9EEF5] flex justify-end">
              <button
                onClick={() => setIsBudgetModalOpen(false)}
                className="px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-md shadow-xs"
              >
                Hoàn tất
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nạp thêm tiền vào Mục tiêu */}
      {depositGoalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full max-w-sm bg-white rounded-xl shadow-2xl p-6 border border-[#DCE4EE]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-bold text-[#172B4D] mb-3">Nạp tiền vào mục tiêu</h3>
            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Số tiền nạp (VND)</label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={depositAmount}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, "");
                    setDepositAmount(raw ? new Intl.NumberFormat("vi-VN").format(parseInt(raw, 10)) : "");
                  }}
                  placeholder="0"
                  className="w-full bg-slate-50 border border-[#DCE4EE] rounded-lg px-3 py-2 text-sm font-bold outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setDepositGoalId(null)}
                  className="flex-1 py-2 text-xs font-semibold bg-slate-100 rounded-md"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold bg-blue-600 text-white rounded-md shadow-xs"
                >
                  Xác nhận
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tạo / Sửa Mục Tiêu Tiết Kiệm (Dual-Mode) */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 border border-[#DCE4EE]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E9EEF5]">
              <h3 className="text-base font-bold text-[#172B4D]">
                {editingGoal ? "Chỉnh sửa mục tiêu tiết kiệm" : "Thêm mục tiêu tiết kiệm"}
              </h3>
              <button
                onClick={() => {
                  setIsGoalModalOpen(false);
                  setEditingGoal(null);
                }}
                className="text-slate-400 p-1 hover:text-slate-600 rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveGoal} className="space-y-3.5 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Tên mục tiêu</label>
                <input
                  type="text"
                  required
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  placeholder="VD: Quỹ dự phòng, Mua xe máy..."
                  className="w-full bg-slate-50 border border-[#DCE4EE] rounded-lg px-3.5 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Số tiền mục tiêu (VND)</label>
                <input
                  type="text"
                  required
                  value={goalTarget}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, "");
                    setGoalTarget(raw ? new Intl.NumberFormat("vi-VN").format(parseInt(raw, 10)) : "");
                  }}
                  placeholder="VD: 50.000.000"
                  className="w-full bg-slate-50 border border-[#DCE4EE] rounded-lg px-3.5 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Hiện đã có (VND)</label>
                <input
                  type="text"
                  value={goalCurrent}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, "");
                    setGoalCurrent(raw ? new Intl.NumberFormat("vi-VN").format(parseInt(raw, 10)) : "");
                  }}
                  placeholder="0"
                  className="w-full bg-slate-50 border border-[#DCE4EE] rounded-lg px-3.5 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Hạn mục tiêu (Tùy chọn)</label>
                <input
                  type="date"
                  value={goalDeadline}
                  onChange={(e) => setGoalDeadline(e.target.value)}
                  className="w-full bg-slate-50 border border-[#DCE4EE] rounded-lg px-3.5 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 font-semibold"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsGoalModalOpen(false);
                    setEditingGoal(null);
                  }}
                  className="flex-1 py-2.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-md text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-xs transition-colors"
                >
                  {editingGoal ? "Cập nhật mục tiêu" : "Lưu mục tiêu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Chỉnh sửa nhanh Hạn mức Danh mục */}
      {editingCategoryBudget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full max-w-sm bg-white rounded-xl shadow-2xl p-6 border border-[#DCE4EE]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E9EEF5]">
              <div className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: editingCategoryBudget.categoryColor }}
                />
                <h3 className="text-sm font-bold text-[#172B4D]">
                  Hạn mức: {editingCategoryBudget.categoryName}
                </h3>
              </div>
              <button
                onClick={() => setEditingCategoryBudget(null)}
                className="text-slate-400 p-1 hover:text-slate-600 rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategoryBudget} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Hạn mức chi tháng này (VND)
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={categoryBudgetInput}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, "");
                    setCategoryBudgetInput(
                      raw ? new Intl.NumberFormat("vi-VN").format(parseInt(raw, 10)) : ""
                    );
                  }}
                  placeholder="0"
                  className="w-full bg-slate-50 border border-[#DCE4EE] rounded-lg px-3 py-2 text-base font-black text-slate-800 outline-none focus:border-blue-500 text-right"
                />
              </div>

              {/* Quick adjustment buttons */}
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                {[
                  { label: "1.000.000đ", val: 1000000 },
                  { label: "2.000.000đ", val: 2000000 },
                  { label: "3.000.000đ", val: 3000000 },
                  { label: "5.000.000đ", val: 5000000 },
                  { label: "7.000.000đ", val: 7000000 },
                  { label: "10.000.000đ", val: 10000000 },
                ].map((preset) => (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() =>
                      setCategoryBudgetInput(new Intl.NumberFormat("vi-VN").format(preset.val))
                    }
                    className="py-1 px-2 text-[11px] font-semibold bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 rounded-md transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCategoryBudget(null)}
                  className="flex-1 py-2 text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-md transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-md shadow-xs transition-colors"
                >
                  Lưu hạn mức
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Dialog Xóa mục tiêu */}
      <ConfirmDialog
        isOpen={deleteGoalId !== null}
        title="Xóa mục tiêu này?"
        message="Mục tiêu tiết kiệm này sẽ bị xóa khỏi kế hoạch tài chính của bạn."
        confirmLabel="Xóa mục tiêu"
        cancelLabel="Hủy"
        isDanger={true}
        onConfirm={() => {
          if (deleteGoalId) {
            deleteGoal(deleteGoalId);
            setDeleteGoalId(null);
          }
        }}
        onCancel={() => setDeleteGoalId(null)}
      />
    </div>
  );
}
