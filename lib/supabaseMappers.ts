import {
  Account,
  Category,
  Transaction,
  CategoryBudget,
  SavingsGoal,
  DebtItem,
  InvestmentItem,
  AppSettings,
  AppNotification,
  FamilyMember,
  ExpenseScope,
  TransactionType,
  AccountType,
  DebtType,
  InvestmentType,
  ThemeColor,
} from '@/types/finance';

// ============================================================================
// 1. CATEGORY MAPPERS
// ============================================================================
export interface DbCategory {
  id: string;
  name: string;
  type: string;
  color: string;
  icon: string | null;
  is_default: boolean;
  created_at?: string;
}

export function mapDbToCategory(row: DbCategory): Category {
  return {
    id: row.id,
    name: row.name,
    type: row.type as 'INCOME' | 'EXPENSE',
    color: row.color,
    icon: row.icon || undefined,
    isDefault: Boolean(row.is_default),
  };
}

export function mapCategoryToDb(cat: Category): Omit<DbCategory, 'created_at'> {
  return {
    id: cat.id,
    name: cat.name,
    type: cat.type,
    color: cat.color,
    icon: cat.icon || null,
    is_default: Boolean(cat.isDefault),
  };
}

// ============================================================================
// 2. ACCOUNT MAPPERS
// ============================================================================
export interface DbAccount {
  id: string;
  name: string;
  type: string;
  owner: string;
  is_salary_account: boolean;
  credit_limit: number | string;
  initial_balance: number | string;
  current_balance: number | string;
  account_number: string | null;
  color: string | null;
  icon: string | null;
  updated_at?: string;
}

export function mapDbToAccount(row: DbAccount): Account {
  return {
    id: row.id,
    name: row.name,
    type: row.type as AccountType,
    owner: row.owner as FamilyMember,
    isSalaryAccount: Boolean(row.is_salary_account),
    creditLimit: Number(row.credit_limit) || 0,
    initialBalance: Number(row.initial_balance) || 0,
    currentBalance: Number(row.current_balance) || 0,
    accountNumber: row.account_number || undefined,
    color: row.color || undefined,
    icon: row.icon || undefined,
  };
}

export function mapAccountToDb(acc: Account): Omit<DbAccount, 'updated_at'> {
  return {
    id: acc.id,
    name: acc.name,
    type: acc.type,
    owner: acc.owner,
    is_salary_account: Boolean(acc.isSalaryAccount),
    credit_limit: acc.creditLimit ?? 0,
    initial_balance: acc.initialBalance,
    current_balance: acc.currentBalance,
    account_number: acc.accountNumber || null,
    color: acc.color || null,
    icon: acc.icon || null,
  };
}

// ============================================================================
// 3. TRANSACTION MAPPERS
// ============================================================================
export interface DbTransaction {
  id: string;
  amount: number | string;
  date: string;
  type: string;
  category_id: string | null;
  account_id: string;
  to_account_id: string | null;
  member_id: string;
  scope: string;
  note: string | null;
  tag: string | null;
  created_at?: string;
  updated_at?: string;
}

export function mapDbToTransaction(row: DbTransaction): Transaction {
  return {
    id: row.id,
    amount: Number(row.amount),
    date: row.date,
    type: row.type as TransactionType,
    categoryId: row.category_id || '',
    accountId: row.account_id,
    toAccountId: row.to_account_id || undefined,
    memberId: row.member_id as FamilyMember,
    scope: row.scope as ExpenseScope,
    note: row.note || undefined,
    tag: (row.tag as Transaction['tag']) || 'NORMAL',
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

export function mapTransactionToDb(tx: Transaction): DbTransaction {
  return {
    id: tx.id,
    amount: tx.amount,
    date: tx.date,
    type: tx.type,
    category_id: tx.categoryId || null,
    account_id: tx.accountId,
    to_account_id: tx.toAccountId || null,
    member_id: tx.memberId,
    scope: tx.scope,
    note: tx.note || null,
    tag: tx.tag || 'NORMAL',
    created_at: tx.createdAt,
    updated_at: tx.updatedAt || new Date().toISOString(),
  };
}

// ============================================================================
// 4. CATEGORY BUDGET MAPPERS
// ============================================================================
export interface DbCategoryBudget {
  id?: number;
  category_id: string;
  month: string;
  limit_amount: number | string;
}

export function mapDbToBudget(row: DbCategoryBudget): CategoryBudget {
  return {
    categoryId: row.category_id,
    month: row.month,
    limitAmount: Number(row.limit_amount),
  };
}

export function mapBudgetToDb(b: CategoryBudget): Omit<DbCategoryBudget, 'id'> {
  return {
    category_id: b.categoryId,
    month: b.month,
    limit_amount: b.limitAmount,
  };
}

// ============================================================================
// 5. SAVINGS GOAL MAPPERS
// ============================================================================
export interface DbSavingsGoal {
  id: string;
  name: string;
  target_amount: number | string;
  current_amount: number | string;
  deadline: string | null;
  icon: string | null;
  is_completed: boolean;
  member_id: string;
  created_at?: string;
}

export function mapDbToGoal(row: DbSavingsGoal): SavingsGoal {
  return {
    id: row.id,
    name: row.name,
    targetAmount: Number(row.target_amount),
    currentAmount: Number(row.current_amount),
    deadline: row.deadline || undefined,
    icon: row.icon || undefined,
    isCompleted: Boolean(row.is_completed),
    memberId: (row.member_id as FamilyMember) || 'SHARED',
  };
}

export function mapGoalToDb(g: SavingsGoal): Omit<DbSavingsGoal, 'created_at'> {
  return {
    id: g.id,
    name: g.name,
    target_amount: g.targetAmount,
    current_amount: g.currentAmount,
    deadline: g.deadline || null,
    icon: g.icon || null,
    is_completed: Boolean(g.isCompleted),
    member_id: g.memberId || 'SHARED',
  };
}

// ============================================================================
// 6. DEBT MAPPERS
// ============================================================================
export interface DbDebt {
  id: string;
  name: string;
  type: string;
  total_amount: number | string;
  paid_amount: number | string;
  interest_rate: number | string;
  start_date: string;
  due_date: string;
  status: string;
  member_id: string;
  created_at?: string;
}

export function mapDbToDebt(row: DbDebt): DebtItem {
  return {
    id: row.id,
    name: row.name,
    type: row.type as DebtType,
    totalAmount: Number(row.total_amount),
    paidAmount: Number(row.paid_amount),
    interestRate: Number(row.interest_rate) || 0,
    startDate: row.start_date,
    dueDate: row.due_date,
    status: row.status as 'ACTIVE' | 'PAID',
    memberId: (row.member_id as FamilyMember) || 'SHARED',
  };
}

export function mapDebtToDb(d: DebtItem): Omit<DbDebt, 'created_at'> {
  return {
    id: d.id,
    name: d.name,
    type: d.type,
    total_amount: d.totalAmount,
    paid_amount: d.paidAmount,
    interest_rate: d.interestRate,
    start_date: d.startDate,
    due_date: d.dueDate,
    status: d.status,
    member_id: d.memberId || 'SHARED',
  };
}

// ============================================================================
// 7. INVESTMENT MAPPERS
// ============================================================================
export interface DbInvestment {
  id: string;
  name: string;
  type: string;
  amount: number | string;
  current_value: number | string | null;
  expected_profit_rate: number | string;
  start_date: string;
  status: string;
  member_id: string;
  created_at?: string;
}

export function mapDbToInvestment(row: DbInvestment): InvestmentItem {
  return {
    id: row.id,
    name: row.name,
    type: row.type as InvestmentType,
    amount: Number(row.amount),
    currentValue: row.current_value !== null ? Number(row.current_value) : undefined,
    expectedProfitRate: Number(row.expected_profit_rate) || 0,
    startDate: row.start_date,
    status: row.status as 'ACTIVE' | 'CLOSED',
    memberId: (row.member_id as FamilyMember) || 'SHARED',
  };
}

export function mapInvestmentToDb(inv: InvestmentItem): Omit<DbInvestment, 'created_at'> {
  return {
    id: inv.id,
    name: inv.name,
    type: inv.type,
    amount: inv.amount,
    current_value: inv.currentValue !== undefined ? inv.currentValue : null,
    expected_profit_rate: inv.expectedProfitRate,
    start_date: inv.startDate,
    status: inv.status,
    member_id: inv.memberId || 'SHARED',
  };
}

// ============================================================================
// 8. APP SETTINGS & NOTIFICATIONS MAPPERS
// ============================================================================
export interface DbAppSettings {
  id: string;
  theme_color: string;
  currency: string;
  notifications_enabled: boolean;
  husband_name: string;
  wife_name: string;
  updated_at?: string;
}

export function mapDbToSettings(row: DbAppSettings): AppSettings {
  return {
    themeColor: (row.theme_color as ThemeColor) || 'blue',
    currency: 'VND',
    notificationsEnabled: Boolean(row.notifications_enabled),
    husbandName: row.husband_name || 'Anh Chuột',
    wifeName: row.wife_name || 'Bé Mèo',
  };
}

export function mapSettingsToDb(s: AppSettings): Omit<DbAppSettings, 'updated_at'> {
  return {
    id: 'default',
    theme_color: s.themeColor,
    currency: s.currency,
    notifications_enabled: s.notificationsEnabled,
    husband_name: s.husbandName,
    wife_name: s.wifeName,
  };
}

export interface DbNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  date: string;
  read: boolean;
  created_at?: string;
}

export function mapDbToNotification(row: DbNotification): AppNotification {
  return {
    id: row.id,
    title: row.title,
    message: row.message,
    type: row.type as 'warning' | 'info' | 'danger',
    date: row.date,
    read: Boolean(row.read),
  };
}

export function mapNotificationToDb(n: AppNotification): Omit<DbNotification, 'created_at'> {
  return {
    id: n.id,
    title: n.title,
    message: n.message,
    type: n.type,
    date: n.date,
    read: n.read,
  };
}
