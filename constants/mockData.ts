import {
  Account,
  Transaction,
  CategoryBudget,
  SavingsGoal,
  DebtItem,
  InvestmentItem,
  AppSettings,
  AppNotification,
} from "@/types/finance";
import { REAL_TRANSACTIONS } from "./realTransactionsData";

export const DEFAULT_ACCOUNTS: Account[] = [
  // --- TÀI KHOẢN CỦA ANH CHUỘT ---
  {
    id: "acc_husband_vietinbank",
    name: "Vietinbank (Lương Anh Chuột)",
    owner: "HUSBAND",
    type: "BANK",
    isSalaryAccount: true,
    initialBalance: 5000000,
    currentBalance: 32500000,
    accountNumber: "1088****9988",
    color: "#005CA9", // Vietinbank Blue
    icon: "Building2",
  },
  {
    id: "acc_husband_bidv",
    name: "BIDV (Chi tiêu Anh Chuột)",
    owner: "HUSBAND",
    type: "BANK",
    initialBalance: 2000000,
    currentBalance: 6450000,
    accountNumber: "1221****6789",
    color: "#0A6E3F", // BIDV Emerald
    icon: "Banknote",
  },
  {
    id: "acc_husband_bidv_credit",
    name: "BIDV Credit (Anh Chuột)",
    owner: "HUSBAND",
    type: "CREDIT_CARD",
    creditLimit: 50000000, // Hạn mức 50 triệu VND
    initialBalance: 0,
    currentBalance: 12500000, // Dư nợ đang dùng
    accountNumber: "4111****5050",
    color: "#1E3A8A", // BIDV Navy
    icon: "CreditCard",
  },

  // --- TÀI KHOẢN CỦA BÉ MÈO ---
  {
    id: "acc_wife_vcb",
    name: "Vietcombank (Lương Bé Mèo)",
    owner: "WIFE",
    type: "BANK",
    isSalaryAccount: true,
    initialBalance: 4000000,
    currentBalance: 26800000,
    accountNumber: "0071****1234",
    color: "#008542", // Vietcombank Green
    icon: "Building2",
  },
  {
    id: "acc_wife_acb",
    name: "ACB (Chi tiêu Bé Mèo)",
    owner: "WIFE",
    type: "BANK",
    initialBalance: 1500000,
    currentBalance: 5320000,
    accountNumber: "2345****8888",
    color: "#0060AF", // ACB Blue
    icon: "Banknote",
  },
  {
    id: "acc_wife_bidv_credit",
    name: "BIDV Credit (Bé Mèo)",
    owner: "WIFE",
    type: "CREDIT_CARD",
    creditLimit: 20000000, // Hạn mức 20 triệu VND
    initialBalance: 0,
    currentBalance: 4200000, // Dư nợ đang dùng
    accountNumber: "4111****2020",
    color: "#D97706", // BIDV Amber
    icon: "CreditCard",
  },

  // --- QUỸ CHUNG GIA ĐÌNH ---
  {
    id: "acc_family_cash",
    name: "Tiền mặt Gia đình",
    owner: "SHARED",
    type: "CASH",
    initialBalance: 2000000,
    currentBalance: 3500000,
    color: "#10B981",
    icon: "Wallet",
  },
];

export const DEFAULT_DEBTS: DebtItem[] = [
  {
    id: "debt_car",
    name: "Vay mua ô tô gia đình",
    type: "BORROW",
    totalAmount: 120000000,
    paidAmount: 40000000,
    interestRate: 8.5,
    startDate: "2026-01-15",
    dueDate: "2027-12-15",
    status: "ACTIVE",
    memberId: "SHARED",
  },
  {
    id: "debt_house_renovation",
    name: "Mượn ông bà sửa nhà",
    type: "BORROW",
    totalAmount: 30000000,
    paidAmount: 30000000,
    interestRate: 0,
    startDate: "2026-03-01",
    dueDate: "2026-09-01",
    status: "PAID",
    memberId: "SHARED",
  },
];

export const DEFAULT_INVESTMENTS: InvestmentItem[] = [
  {
    id: "inv_gold_family",
    name: "Vàng nhẫn tiết kiệm (2 chỉ)",
    type: "GOLD",
    amount: 17000000,
    currentValue: 18500000,
    expectedProfitRate: 8.8,
    startDate: "2026-03-20",
    status: "ACTIVE",
    memberId: "SHARED",
  },
  {
    id: "inv_savings_nest",
    name: "Sổ tiết kiệm tổ ấm 12 tháng",
    type: "SAVINGS",
    amount: 50000000,
    currentValue: 53200000,
    expectedProfitRate: 6.4,
    startDate: "2026-06-10",
    status: "ACTIVE",
    memberId: "SHARED",
  },
  {
    id: "inv_husband_stocks",
    name: "Cổ phiếu FPT (Chồng)",
    type: "STOCK",
    amount: 25000000,
    currentValue: 28500000,
    expectedProfitRate: 14,
    startDate: "2025-11-15",
    status: "ACTIVE",
    memberId: "HUSBAND",
  },
];

export const DEFAULT_SAVINGS_GOALS: SavingsGoal[] = [
  {
    id: "goal_emergency_fund",
    name: "Quỹ khẩn cấp gia đình (6 tháng)",
    targetAmount: 100000000,
    currentAmount: 65000000,
    deadline: "2027-06-01",
    icon: "ShieldAlert",
    isCompleted: false,
    memberId: "SHARED",
  },
  {
    id: "goal_japan_trip",
    name: "Du lịch Nhật Bản 2 vợ chồng",
    targetAmount: 45000000,
    currentAmount: 32000000,
    deadline: "2027-04-15",
    icon: "Plane",
    isCompleted: false,
    memberId: "SHARED",
  },
  {
    id: "goal_upgrade_macbook",
    name: "Nâng cấp máy tính cho Chồng",
    targetAmount: 35000000,
    currentAmount: 35000000,
    icon: "Laptop",
    isCompleted: true,
    memberId: "HUSBAND",
  },
];

export const DEFAULT_BUDGETS: CategoryBudget[] = [
  {
    categoryId: "cat_expense_rent",
    month: "2026-10",
    limitAmount: 7000000, // Tiền thuê nhà & dịch vụ
  },
  {
    categoryId: "cat_expense_food",
    month: "2026-10",
    limitAmount: 8500000, // Tiền chợ, siêu thị & ăn uống gia đình
  },
  {
    categoryId: "cat_expense_bills",
    month: "2026-10",
    limitAmount: 2000000, // Điện, nước, internet
  },
  {
    categoryId: "cat_expense_shopping",
    month: "2026-10",
    limitAmount: 4000000, // Mua sắm vật dụng tổ ấm
  },
  {
    categoryId: "cat_expense_transport",
    month: "2026-10",
    limitAmount: 2500000, // Xăng xe & đi lại của 2 vợ chồng
  },
  {
    categoryId: "cat_expense_entertainment",
    month: "2026-10",
    limitAmount: 2000000, // Hẹn hò, xem phim, cà phê
  },
];

export const DEFAULT_SETTINGS: AppSettings = {
  themeColor: "blue",
  currency: "VND",
  notificationsEnabled: true,
  husbandName: "Anh Chuột",
  wifeName: "Bé Mèo",
};

export const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif_bidv_statement_husband",
    title: "Kỳ sao kê thẻ BIDV Credit (Anh Chuột)",
    message: "Hạn thanh toán thẻ BIDV Credit (Anh Chuột - 50tr) là ngày 25/10. Dư nợ: 12.500.000 ₫",
    type: "warning",
    date: "2026-10-20",
    read: false,
  },
  {
    id: "notif_bidv_statement_wife",
    title: "Kỳ sao kê thẻ BIDV Credit (Bé Mèo)",
    message: "Hạn thanh toán thẻ BIDV Credit (Bé Mèo - 20tr) là ngày 25/10. Dư nợ: 4.200.000 ₫",
    type: "warning",
    date: "2026-10-20",
    read: false,
  },
  {
    id: "notif_budget_food",
    title: "Tiến độ ngân sách Ăn uống",
    message: 'Ngân sách "Ăn uống & Đi chợ" đã dùng 62% hạn mức tháng',
    type: "info",
    date: "2026-10-18",
    read: false,
  },
];

export const DEFAULT_TRANSACTIONS: Transaction[] = REAL_TRANSACTIONS;
