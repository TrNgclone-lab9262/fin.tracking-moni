import { Category } from "@/types/finance";

export const DEFAULT_CATEGORIES: Category[] = [
  // CHI TIÊU (EXPENSE)
  {
    id: "cat_expense_food",
    name: "Ăn uống",
    type: "EXPENSE",
    color: "#3B82F6", // Blue
    icon: "Utensils",
    isDefault: true,
  },
  {
    id: "cat_expense_rent",
    name: "Tiền nhà",
    type: "EXPENSE",
    color: "#F43F5E", // Rose
    icon: "Home",
    isDefault: true,
  },
  {
    id: "cat_expense_transport",
    name: "Đi lại",
    type: "EXPENSE",
    color: "#6366F1", // Indigo
    icon: "Car",
    isDefault: true,
  },
  {
    id: "cat_expense_shopping",
    name: "Mua sắm",
    type: "EXPENSE",
    color: "#F59E0B", // Amber
    icon: "ShoppingBag",
    isDefault: true,
  },
  {
    id: "cat_expense_health",
    name: "Sức khoẻ",
    type: "EXPENSE",
    color: "#10B981", // Emerald
    icon: "HeartPulse",
    isDefault: true,
  },
  {
    id: "cat_expense_bills",
    name: "Hoá đơn",
    type: "EXPENSE",
    color: "#EC4899", // Pink
    icon: "Zap",
    isDefault: true,
  },
  {
    id: "cat_expense_entertainment",
    name: "Giải trí",
    type: "EXPENSE",
    color: "#8B5CF6", // Purple
    icon: "Film",
    isDefault: true,
  },
  {
    id: "cat_expense_other",
    name: "Chi phí khác",
    type: "EXPENSE",
    color: "#64748B", // Slate
    icon: "MoreHorizontal",
    isDefault: true,
  },

  // THU NHẬP (INCOME)
  {
    id: "cat_income_salary",
    name: "Lương",
    type: "INCOME",
    color: "#10B981", // Emerald
    icon: "Briefcase",
    isDefault: true,
  },
  {
    id: "cat_income_freelance",
    name: "Freelance",
    type: "INCOME",
    color: "#06B6D4", // Cyan
    icon: "Laptop",
    isDefault: true,
  },
  {
    id: "cat_income_bonus",
    name: "Thưởng",
    type: "INCOME",
    color: "#F59E0B", // Amber
    icon: "Award",
    isDefault: true,
  },
  {
    id: "cat_income_investment",
    name: "Đầu tư",
    type: "INCOME",
    color: "#8B5CF6", // Violet
    icon: "TrendingUp",
    isDefault: true,
  },
];
