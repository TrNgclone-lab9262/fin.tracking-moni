export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';

export type AccountType = 'BANK' | 'CASH' | 'E_WALLET' | 'CREDIT_CARD';

export type DebtType = 'BORROW' | 'LEND';

export type InvestmentType = 'GOLD' | 'SAVINGS' | 'STOCK' | 'OTHER';

export type ThemeColor = 'blue' | 'purple' | 'pink' | 'green' | 'orange';

export type FamilyMember = 'HUSBAND' | 'WIFE' | 'SHARED';

export type ExpenseScope = 'FAMILY' | 'PERSONAL';

export interface Category {
  id: string;
  name: string;
  type: 'INCOME' | 'EXPENSE';
  color: string;
  icon?: string;
  isDefault?: boolean;
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  owner: FamilyMember;       // Chồng | Vợ | Chung
  isSalaryAccount?: boolean; // Tài khoản nhận lương chính
  creditLimit?: number;      // Hạn mức thẻ tín dụng (50tr Chồng, 20tr Vợ)
  initialBalance: number;
  currentBalance: number;    // Với thẻ tín dụng: dư nợ đang dùng
  accountNumber?: string;
  icon?: string;
  color?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  date: string;               // YYYY-MM-DD
  type: TransactionType;
  categoryId: string;
  accountId: string;          // Ví nguồn
  toAccountId?: string;       // Ví đích
  memberId: FamilyMember;     // Ai là người thực hiện (Chồng hay Vợ)
  scope: ExpenseScope;        // Chi cho việc chung gia đình hay cá nhân
  note?: string;
  tag?: 'NORMAL' | 'DEBT' | 'INVESTMENT' | 'RECURRING';
  createdAt: string;
  updatedAt: string;
}

export interface CategoryBudget {
  categoryId: string;
  month: string;              // YYYY-MM
  limitAmount: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  icon?: string;
  isCompleted: boolean;
  memberId?: FamilyMember;
}

export interface DebtItem {
  id: string;
  name: string;
  type: DebtType;
  totalAmount: number;
  paidAmount: number;
  interestRate: number;
  startDate: string;
  dueDate: string;
  status: 'ACTIVE' | 'PAID';
  memberId?: FamilyMember;
}

export interface InvestmentItem {
  id: string;
  name: string;
  type: InvestmentType;
  amount: number;
  currentValue?: number;
  expectedProfitRate: number;
  startDate: string;
  status: 'ACTIVE' | 'CLOSED';
  memberId?: FamilyMember;
}

export interface AppSettings {
  themeColor: ThemeColor;
  currency: 'VND';
  notificationsEnabled: boolean;
  husbandName: string;
  wifeName: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'info' | 'danger';
  date: string;
  read: boolean;
}

export interface AppDataBackup {
  version: '3.0';
  exportedAt: string;
  categories: Category[];
  accounts: Account[];
  transactions: Transaction[];
  budgets: CategoryBudget[];
  goals: SavingsGoal[];
  debts: DebtItem[];
  investments: InvestmentItem[];
  settings: AppSettings;
}

export interface FinancialSummary {
  currentBalance: number;   // Số dư khả dụng (Tiền trong các ví ngân hàng + tiền mặt)
  netWorth: number;         // Tài sản ròng = Số dư ví + Đầu tư - Nợ - Dư nợ thẻ tín dụng
  monthlyIncome: number;    // Tổng thu nhập gia đình
  monthlyExpense: number;   // Tổng chi tiêu gia đình
  savingsAmount: number;    // Tiết kiệm tháng = Thu - Chi
  savingsRate: number;      // % Tiết kiệm
  totalDebt: number;        // Nợ ngoài
  totalInvested: number;    // Tiền đang đầu tư

  // Phân tích thành viên
  husbandIncome: number;
  wifeIncome: number;
  husbandExpense: number;
  wifeExpense: number;
  familySharedExpense: number;
  totalCreditDebt: number;  // Tổng dư nợ thẻ BIDV Credit của cả 2
}

export interface CategoryExpenseStat {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  totalAmount: number;
  percentage: number;
}
