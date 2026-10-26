import { z } from "zod";

export const FamilyMemberSchema = z.enum(["HUSBAND", "WIFE", "SHARED"]);
export const ExpenseScopeSchema = z.enum(["FAMILY", "PERSONAL"]);

export const TransactionInputSchema = z.object({
  amount: z
    .number({ invalid_type_error: "Vui lòng nhập số tiền hợp lệ" })
    .positive("Số tiền phải lớn hơn 0")
    .max(1_000_000_000_000, "Số tiền quá lớn"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày giao dịch phải có định dạng YYYY-MM-DD"),
  type: z.enum(["INCOME", "EXPENSE", "TRANSFER"], {
    errorMap: () => ({ message: "Loại giao dịch không hợp lệ" }),
  }),
  categoryId: z.string().min(1, "Vui lòng chọn danh mục"),
  accountId: z.string().min(1, "Vui lòng chọn tài khoản nguồn"),
  toAccountId: z.string().optional(),
  memberId: FamilyMemberSchema,
  scope: ExpenseScopeSchema,
  note: z.string().max(255, "Ghi chú không vượt quá 255 ký tự").optional(),
  tag: z.enum(["NORMAL", "DEBT", "INVESTMENT", "RECURRING"]).optional(),
});

export const CategorySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(["INCOME", "EXPENSE"]),
  color: z.string().min(1),
  icon: z.string().optional(),
  isDefault: z.boolean().optional(),
});

export const AccountSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(["BANK", "CASH", "E_WALLET", "CREDIT_CARD"]),
  owner: FamilyMemberSchema,
  isSalaryAccount: z.boolean().optional(),
  creditLimit: z.number().optional(),
  initialBalance: z.number(),
  currentBalance: z.number(),
  accountNumber: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
});

export const TransactionSchema = z.object({
  id: z.string().min(1),
  amount: z.number().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  type: z.enum(["INCOME", "EXPENSE", "TRANSFER"]),
  categoryId: z.string().min(1),
  accountId: z.string().min(1),
  toAccountId: z.string().optional(),
  memberId: FamilyMemberSchema,
  scope: ExpenseScopeSchema,
  note: z.string().optional(),
  tag: z.enum(["NORMAL", "DEBT", "INVESTMENT", "RECURRING"]).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const BudgetSchema = z.object({
  categoryId: z.string().min(1),
  month: z.string().regex(/^\d{4}-\d{2}$/),
  limitAmount: z.number().positive(),
});

export const SavingsGoalSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  targetAmount: z.number().positive(),
  currentAmount: z.number().nonnegative(),
  deadline: z.string().optional(),
  icon: z.string().optional(),
  isCompleted: z.boolean(),
  memberId: FamilyMemberSchema.optional(),
});

export const DebtItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(["BORROW", "LEND"]),
  totalAmount: z.number().positive(),
  paidAmount: z.number().nonnegative(),
  interestRate: z.number().nonnegative(),
  startDate: z.string(),
  dueDate: z.string(),
  status: z.enum(["ACTIVE", "PAID"]),
  memberId: FamilyMemberSchema.optional(),
});

export const InvestmentItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(["GOLD", "SAVINGS", "STOCK", "OTHER"]),
  amount: z.number().positive(),
  currentValue: z.number().optional(),
  expectedProfitRate: z.number(),
  startDate: z.string(),
  status: z.enum(["ACTIVE", "CLOSED"]),
  memberId: FamilyMemberSchema.optional(),
});

export const AppSettingsSchema = z.object({
  themeColor: z.enum(["blue", "purple", "pink", "green", "orange"]),
  currency: z.literal("VND"),
  notificationsEnabled: z.boolean(),
  husbandName: z.string(),
  wifeName: z.string(),
});

export const AppDataBackupSchema = z.object({
  version: z.string(),
  exportedAt: z.string(),
  categories: z.array(CategorySchema),
  accounts: z.array(AccountSchema).optional(),
  transactions: z.array(TransactionSchema),
  budgets: z.array(BudgetSchema).optional(),
  goals: z.array(SavingsGoalSchema).optional(),
  debts: z.array(DebtItemSchema).optional(),
  investments: z.array(InvestmentItemSchema).optional(),
  settings: AppSettingsSchema.optional(),
});

export type TransactionInput = z.infer<typeof TransactionInputSchema>;
export type AppDataBackupValid = z.infer<typeof AppDataBackupSchema>;
