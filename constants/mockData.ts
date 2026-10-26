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

export const DEFAULT_TRANSACTIONS: Transaction[] = [
  // --- THU NHẬP LƯƠNG ANH CHUỘT & BÉ MÈO THÁNG 10/2026 ---
  {
    id: "TX261005080001",
    amount: 28000000,
    date: "2026-10-05",
    type: "INCOME",
    categoryId: "cat_income_salary",
    accountId: "acc_husband_vietinbank",
    memberId: "HUSBAND",
    scope: "FAMILY",
    note: "Lương tháng 9 Tech Corp (Anh Chuột)",
    createdAt: "2026-10-05T08:00:00.000Z",
    updatedAt: "2026-10-05T08:00:00.000Z",
  },
  {
    id: "TX261005083002",
    amount: 22000000,
    date: "2026-10-05",
    type: "INCOME",
    categoryId: "cat_income_salary",
    accountId: "acc_wife_vcb",
    memberId: "WIFE",
    scope: "FAMILY",
    note: "Lương tháng 9 Vingroup (Bé Mèo)",
    createdAt: "2026-10-05T08:30:00.000Z",
    updatedAt: "2026-10-05T08:30:00.000Z",
  },

  // --- CHUYỂN KHOẢN TIỀN VÀO CÁC VÍ CHI TIÊU & QUỸ GIA ĐÌNH ---
  {
    id: "TX261006090003",
    amount: 8000000,
    date: "2026-10-06",
    type: "TRANSFER",
    categoryId: "cat_expense_other",
    accountId: "acc_husband_vietinbank",
    toAccountId: "acc_husband_bidv",
    memberId: "HUSBAND",
    scope: "FAMILY",
    note: "Chuyển tiền vào tài khoản BIDV chi tiêu sinh hoạt",
    createdAt: "2026-10-06T09:00:00.000Z",
    updatedAt: "2026-10-06T09:00:00.000Z",
  },
  {
    id: "TX261006091504",
    amount: 7000000,
    date: "2026-10-06",
    type: "TRANSFER",
    categoryId: "cat_expense_other",
    accountId: "acc_wife_vcb",
    toAccountId: "acc_wife_acb",
    memberId: "WIFE",
    scope: "FAMILY",
    note: "Chuyển tiền vào tài khoản ACB đi chợ & chi tiêu",
    createdAt: "2026-10-06T09:15:00.000Z",
    updatedAt: "2026-10-06T09:15:00.000Z",
  },
  {
    id: "TX261006093005",
    amount: 3000000,
    date: "2026-10-06",
    type: "TRANSFER",
    categoryId: "cat_expense_other",
    accountId: "acc_husband_vietinbank",
    toAccountId: "acc_family_cash",
    memberId: "HUSBAND",
    scope: "FAMILY",
    note: "Rút tiền mặt bỏ hòm tiết kiệm gia đình",
    createdAt: "2026-10-06T09:30:00.000Z",
    updatedAt: "2026-10-06T09:30:00.000Z",
  },

  // --- CÁC KHOẢN CHI TIÊU GIA ĐÌNH CHUNG ---
  {
    id: "TX261006100006",
    amount: 6500000,
    date: "2026-10-06",
    type: "EXPENSE",
    categoryId: "cat_expense_rent",
    accountId: "acc_husband_vietinbank",
    memberId: "HUSBAND",
    scope: "FAMILY",
    note: "Tiền thuê chung cư & phí dịch vụ tháng 10",
    createdAt: "2026-10-06T10:00:00.000Z",
    updatedAt: "2026-10-06T10:00:00.000Z",
  },
  {
    id: "TX261008112007",
    amount: 1250000,
    date: "2026-10-08",
    type: "EXPENSE",
    categoryId: "cat_expense_bills",
    accountId: "acc_wife_acb",
    memberId: "WIFE",
    scope: "FAMILY",
    note: "Hóa đơn tiền điện & nước tháng 9",
    createdAt: "2026-10-08T11:20:00.000Z",
    updatedAt: "2026-10-08T11:20:00.000Z",
  },
  {
    id: "TX261010173008",
    amount: 2450000,
    date: "2026-10-10",
    type: "EXPENSE",
    categoryId: "cat_expense_food",
    accountId: "acc_wife_acb",
    memberId: "WIFE",
    scope: "FAMILY",
    note: "Đi siêu thị WinMart mua đồ ăn tuần cho cả nhà",
    createdAt: "2026-10-10T17:30:00.000Z",
    updatedAt: "2026-10-10T17:30:00.000Z",
  },
  {
    id: "TX261012190009",
    amount: 2100000,
    date: "2026-10-12",
    type: "EXPENSE",
    categoryId: "cat_expense_shopping",
    accountId: "acc_wife_bidv_credit",
    memberId: "WIFE",
    scope: "FAMILY",
    note: "Shopee sắm chăn ga gối nệm phòng ngủ (Quẹt BIDV Credit Bé Mèo)",
    createdAt: "2026-10-12T19:00:00.000Z",
    updatedAt: "2026-10-12T19:00:00.000Z",
  },
  {
    id: "TX261014203010",
    amount: 850000,
    date: "2026-10-14",
    type: "EXPENSE",
    categoryId: "cat_expense_entertainment",
    accountId: "acc_husband_bidv_credit",
    memberId: "HUSBAND",
    scope: "FAMILY",
    note: "Hẹn hò ăn tối lẩu Haidilao 2 vợ chồng (Quẹt BIDV Credit Anh Chuột)",
    createdAt: "2026-10-14T20:30:00.000Z",
    updatedAt: "2026-10-14T20:30:00.000Z",
  },
  {
    id: "TX261016140011",
    amount: 1200000,
    date: "2026-10-16",
    type: "EXPENSE",
    categoryId: "cat_expense_transport",
    accountId: "acc_husband_bidv_credit",
    memberId: "HUSBAND",
    scope: "FAMILY",
    note: "Bảo dưỡng & thay nhớt xe ô tô gia đình (Quẹt BIDV Credit Anh Chuột)",
    createdAt: "2026-10-16T14:00:00.000Z",
    updatedAt: "2026-10-16T14:00:00.000Z",
  },
  {
    id: "TX261018164512",
    amount: 1350000,
    date: "2026-10-18",
    type: "EXPENSE",
    categoryId: "cat_expense_food",
    accountId: "acc_wife_acb",
    memberId: "WIFE",
    scope: "FAMILY",
    note: "Đi chợ đầu mối mua hải sản tẩm bổ cuối tuần",
    createdAt: "2026-10-18T16:45:00.000Z",
    updatedAt: "2026-10-18T16:45:00.000Z",
  },
  {
    id: "TX261020083013",
    amount: 250000,
    date: "2026-10-20",
    type: "EXPENSE",
    categoryId: "cat_expense_bills",
    accountId: "acc_husband_bidv",
    memberId: "HUSBAND",
    scope: "FAMILY",
    note: "Cước internet cáp quang gia đình",
    createdAt: "2026-10-20T08:30:00.000Z",
    updatedAt: "2026-10-20T08:30:00.000Z",
  },

  // --- CÁC KHOẢN CHI TIÊU CÁ NHÂN RIÊNG CỦA CHỒNG HOẶC VỢ ---
  {
    id: "TX261015090014",
    amount: 450000,
    date: "2026-10-15",
    type: "EXPENSE",
    categoryId: "cat_expense_food",
    accountId: "acc_husband_bidv",
    memberId: "HUSBAND",
    scope: "PERSONAL",
    note: "Cà phê & ăn sáng làm việc với đối tác (Chồng)",
    createdAt: "2026-10-15T09:00:00.000Z",
    updatedAt: "2026-10-15T09:00:00.000Z",
  },
  {
    id: "TX261017113015",
    amount: 680000,
    date: "2026-10-17",
    type: "EXPENSE",
    categoryId: "cat_expense_shopping",
    accountId: "acc_wife_acb",
    memberId: "WIFE",
    scope: "PERSONAL",
    note: "Mỹ phẩm dưỡng da chăm sóc sắc đẹp (Vợ)",
    createdAt: "2026-10-17T11:30:00.000Z",
    updatedAt: "2026-10-17T11:30:00.000Z",
  },
];
