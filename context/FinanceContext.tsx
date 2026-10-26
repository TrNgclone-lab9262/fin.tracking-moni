"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import {
  Category,
  Account,
  Transaction,
  CategoryBudget,
  SavingsGoal,
  DebtItem,
  InvestmentItem,
  AppSettings,
  AppNotification,
  TransactionType,
  FinancialSummary,
  CategoryExpenseStat,
  FamilyMember,
  ExpenseScope,
} from "@/types/finance";
import {
  loadStoredDataV3,
  saveStoredDataV3,
  seedInitialDataV3,
  exportDataToJsonV3,
  importDataFromJsonV3,
  recalculateAccountBalances,
} from "@/lib/storage";
import { getCurrentMonthKey } from "@/lib/formatters";
import { DEFAULT_CATEGORIES } from "@/constants/defaultCategories";
import {
  DEFAULT_ACCOUNTS,
  DEFAULT_BUDGETS,
  DEFAULT_SAVINGS_GOALS,
  DEFAULT_DEBTS,
  DEFAULT_INVESTMENTS,
  DEFAULT_SETTINGS,
  DEFAULT_NOTIFICATIONS,
} from "@/constants/mockData";

export type NavTab =
  | "overview"
  | "transactions"
  | "accounts"
  | "planning"
  | "debts_invest"
  | "guide"
  | "settings";

export type PerspectiveMode = "ALL" | "HUSBAND" | "WIFE";

interface TransactionInput {
  amount: number;
  date: string;
  type: TransactionType;
  categoryId: string;
  accountId: string;
  toAccountId?: string;
  memberId: FamilyMember;
  scope: ExpenseScope;
  note?: string;
  tag?: "NORMAL" | "DEBT" | "INVESTMENT" | "RECURRING";
}

interface MonthlyTrendItem {
  month: string;
  label: string;
  income: number;
  expense: number;
}

interface BudgetProgressItem {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  limitAmount: number;
  spentAmount: number;
  remainingAmount: number;
  percentage: number;
}

interface BudgetSummary {
  totalBudget: number;
  totalSpent: number;
  remaining: number;
  daysRemaining: number;
  dailyAllowance: number;
  items: BudgetProgressItem[];
}

export interface CreditCardInfo {
  account: Account;
  creditLimit: number;
  usedAmount: number;
  availableAmount: number;
  usagePercentage: number;
}

interface FinanceContextType {
  isLoaded: boolean;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;

  // Góc nhìn thành viên (Cả nhà / Chồng / Vợ)
  activePerspective: PerspectiveMode;
  setActivePerspective: (mode: PerspectiveMode) => void;

  categories: Category[];
  accounts: Account[];
  transactions: Transaction[];
  budgets: CategoryBudget[];
  goals: SavingsGoal[];
  debts: DebtItem[];
  investments: InvestmentItem[];
  settings: AppSettings;
  notifications: AppNotification[];

  // Bộ lọc
  selectedMonth: string;
  selectedCategory: string;
  selectedType: "ALL" | TransactionType;
  selectedAccount: string;
  searchQuery: string;

  setSelectedMonth: (month: string) => void;
  setSelectedCategory: (catId: string) => void;
  setSelectedType: (type: "ALL" | TransactionType) => void;
  setSelectedAccount: (accId: string) => void;
  setSearchQuery: (query: string) => void;

  // CRUD Giao dịch
  addTransaction: (data: TransactionInput) => Transaction;
  updateTransaction: (id: string, data: Partial<TransactionInput>) => void;
  deleteTransaction: (id: string) => void;

  // Quản lý Tài khoản (Ví)
  addAccount: (acc: Omit<Account, "id" | "currentBalance">) => void;
  updateAccount: (id: string, acc: Partial<Account>) => void;
  deleteAccount: (id: string) => void;

  // Quản lý Ngân sách & Mục tiêu
  setCategoryBudget: (categoryId: string, limitAmount: number, month?: string) => void;
  addGoal: (goal: Omit<SavingsGoal, "id" | "isCompleted">) => void;
  updateGoal: (id: string, goal: Partial<SavingsGoal>) => void;
  deleteGoal: (id: string) => void;
  depositGoal: (id: string, amount: number) => void;

  // Quản lý Nợ & Đầu tư
  addDebt: (debt: Omit<DebtItem, "id">) => void;
  payDebt: (id: string, amount: number) => void;
  deleteDebt: (id: string) => void;

  addInvestment: (inv: Omit<InvestmentItem, "id">) => void;
  updateInvestment: (id: string, inv: Partial<InvestmentItem>) => void;
  deleteInvestment: (id: string) => void;

  // Cài đặt & Sao lưu
  updateSettings: (settings: Partial<AppSettings>) => void;
  markNotificationRead: (id: string) => void;
  resetToMockData: () => void;
  exportBackup: () => void;
  importBackup: (file: File) => Promise<{ success: boolean; error?: string }>;

  // Dữ liệu tính toán & Helpers
  availableMonths: string[];
  summary: FinancialSummary;
  budgetSummary: BudgetSummary;
  filteredTransactions: Transaction[];
  categoryExpenseStats: CategoryExpenseStat[];
  monthlyTrendData: MonthlyTrendItem[];
  getCategoryById: (id: string) => Category | undefined;
  getAccountById: (id: string) => Account | undefined;

  // Thông tin 2 thẻ BIDV Credit
  husbandCreditCard: CreditCardInfo | null;
  wifeCreditCard: CreditCardInfo | null;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<NavTab>("overview");
  const [activePerspective, setActivePerspective] = useState<PerspectiveMode>("ALL");

  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [accounts, setAccounts] = useState<Account[]>(DEFAULT_ACCOUNTS);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<CategoryBudget[]>(DEFAULT_BUDGETS);
  const [goals, setGoals] = useState<SavingsGoal[]>(DEFAULT_SAVINGS_GOALS);
  const [debts, setDebts] = useState<DebtItem[]>(DEFAULT_DEBTS);
  const [investments, setInvestments] = useState<InvestmentItem[]>(DEFAULT_INVESTMENTS);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  // Bộ lọc
  const [selectedMonth, setSelectedMonth] = useState<string>("2026-10");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<"ALL" | TransactionType>("ALL");
  const [selectedAccount, setSelectedAccount] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Khởi tạo từ LocalStorage khi mount
  useEffect(() => {
    const data = loadStoredDataV3();
    setCategories(data.categories);
    setTransactions(data.transactions);
    setBudgets(data.budgets);
    setGoals(data.goals);
    setDebts(data.debts);
    setInvestments(data.investments);
    setSettings(data.settings);

    const updatedAccounts = recalculateAccountBalances(data.accounts, data.transactions);
    setAccounts(updatedAccounts);

    setIsLoaded(true);
  }, []);

  // Tự động đồng bộ vào LocalStorage V3
  useEffect(() => {
    if (!isLoaded) return;
    saveStoredDataV3({
      categories,
      accounts,
      transactions,
      budgets,
      goals,
      debts,
      investments,
      settings,
    });
  }, [categories, accounts, transactions, budgets, goals, debts, investments, settings, isLoaded]);

  const syncAccountBalances = useCallback((txList: Transaction[]) => {
    setAccounts((prev) => recalculateAccountBalances(prev, txList));
  }, []);

  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    set.add("2026-10");
    set.add(getCurrentMonthKey());
    transactions.forEach((tx) => {
      if (tx.date && tx.date.length >= 7) {
        set.add(tx.date.substring(0, 7));
      }
    });
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [transactions]);

  const getCategoryById = useCallback(
    (id: string) => categories.find((c) => c.id === id),
    [categories]
  );

  const getAccountById = useCallback(
    (id: string) => accounts.find((a) => a.id === id),
    [accounts]
  );

  // CRUD Giao dịch
  const addTransaction = useCallback(
    (input: TransactionInput): Transaction => {
      const now = new Date().toISOString();
      const newTx: Transaction = {
        id: `TX${new Date().toISOString().slice(2, 10).replace(/-/g, "")}${Math.floor(100000 + Math.random() * 900000)}`,
        amount: Math.abs(input.amount),
        date: input.date,
        type: input.type,
        categoryId: input.categoryId,
        accountId: input.accountId,
        toAccountId: input.toAccountId,
        memberId: input.memberId,
        scope: input.scope,
        note: input.note?.trim() || "",
        tag: input.tag || "NORMAL",
        createdAt: now,
        updatedAt: now,
      };

      setTransactions((prev) => {
        const next = [newTx, ...prev];
        syncAccountBalances(next);
        return next;
      });

      return newTx;
    },
    [syncAccountBalances]
  );

  const updateTransaction = useCallback(
    (id: string, input: Partial<TransactionInput>) => {
      setTransactions((prev) => {
        const next = prev.map((tx) => {
          if (tx.id !== id) return tx;
          return {
            ...tx,
            amount: input.amount !== undefined ? Math.abs(input.amount) : tx.amount,
            date: input.date !== undefined ? input.date : tx.date,
            type: input.type !== undefined ? input.type : tx.type,
            categoryId: input.categoryId !== undefined ? input.categoryId : tx.categoryId,
            accountId: input.accountId !== undefined ? input.accountId : tx.accountId,
            toAccountId: input.toAccountId !== undefined ? input.toAccountId : tx.toAccountId,
            memberId: input.memberId !== undefined ? input.memberId : tx.memberId,
            scope: input.scope !== undefined ? input.scope : tx.scope,
            note: input.note !== undefined ? input.note.trim() : tx.note,
            tag: input.tag !== undefined ? input.tag : tx.tag,
            updatedAt: new Date().toISOString(),
          };
        });
        syncAccountBalances(next);
        return next;
      });
    },
    [syncAccountBalances]
  );

  const deleteTransaction = useCallback(
    (id: string) => {
      setTransactions((prev) => {
        const next = prev.filter((tx) => tx.id !== id);
        syncAccountBalances(next);
        return next;
      });
    },
    [syncAccountBalances]
  );

  // Quản lý Tài khoản (Ví)
  const addAccount = useCallback((acc: Omit<Account, "id" | "currentBalance">) => {
    const newId = `acc_${Date.now()}`;
    const newAccount: Account = {
      ...acc,
      id: newId,
      currentBalance: acc.initialBalance,
    };
    setAccounts((prev) => [...prev, newAccount]);
  }, []);

  const updateAccount = useCallback((id: string, acc: Partial<Account>) => {
    setAccounts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...acc } : a))
    );
  }, []);

  const deleteAccount = useCallback((id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  // Ngân sách
  const setCategoryBudget = useCallback(
    (categoryId: string, limitAmount: number, month?: string) => {
      const targetMonth = month || selectedMonth || "2026-10";
      setBudgets((prev) => {
        const exists = prev.some(
          (b) => b.categoryId === categoryId && b.month === targetMonth
        );
        if (exists) {
          return prev.map((b) =>
            b.categoryId === categoryId && b.month === targetMonth
              ? { ...b, limitAmount }
              : b
          );
        }
        return [...prev, { categoryId, limitAmount, month: targetMonth }];
      });
    },
    [selectedMonth]
  );

  // Mục tiêu
  const addGoal = useCallback((goal: Omit<SavingsGoal, "id" | "isCompleted">) => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: `goal_${Date.now()}`,
      isCompleted: goal.currentAmount >= goal.targetAmount,
    };
    setGoals((prev) => [...prev, newGoal]);
  }, []);

  const updateGoal = useCallback((id: string, goal: Partial<SavingsGoal>) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        const updated = { ...g, ...goal };
        updated.isCompleted = updated.currentAmount >= updated.targetAmount;
        return updated;
      })
    );
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const depositGoal = useCallback((id: string, amount: number) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        const newCurrent = g.currentAmount + amount;
        return {
          ...g,
          currentAmount: newCurrent,
          isCompleted: newCurrent >= g.targetAmount,
        };
      })
    );
  }, []);

  // Nợ & Đầu tư
  const addDebt = useCallback((debt: Omit<DebtItem, "id">) => {
    setDebts((prev) => [...prev, { ...debt, id: `debt_${Date.now()}` }]);
  }, []);

  const payDebt = useCallback((id: string, amount: number) => {
    setDebts((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const newPaid = d.paidAmount + amount;
        return {
          ...d,
          paidAmount: newPaid,
          status: newPaid >= d.totalAmount ? "PAID" : "ACTIVE",
        };
      })
    );
  }, []);

  const deleteDebt = useCallback((id: string) => {
    setDebts((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const addInvestment = useCallback((inv: Omit<InvestmentItem, "id">) => {
    setInvestments((prev) => [...prev, { ...inv, id: `inv_${Date.now()}` }]);
  }, []);

  const updateInvestment = useCallback((id: string, inv: Partial<InvestmentItem>) => {
    setInvestments((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...inv } : i))
    );
  }, []);

  const deleteInvestment = useCallback((id: string) => {
    setInvestments((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  // Reset to Mock
  const resetToMockData = useCallback(() => {
    const seeded = seedInitialDataV3();
    setCategories(seeded.categories);
    setAccounts(seeded.accounts);
    setTransactions(seeded.transactions);
    setBudgets(seeded.budgets);
    setGoals(seeded.goals);
    setDebts(seeded.debts);
    setInvestments(seeded.investments);
    setSettings(seeded.settings);
    setSelectedMonth("2026-10");
    setActivePerspective("ALL");
  }, []);

  // Backup
  const exportBackup = useCallback(() => {
    exportDataToJsonV3({
      categories,
      accounts,
      transactions,
      budgets,
      goals,
      debts,
      investments,
      settings,
    });
  }, [categories, accounts, transactions, budgets, goals, debts, investments, settings]);

  const importBackup = useCallback(
    async (file: File): Promise<{ success: boolean; error?: string }> => {
      const res = await importDataFromJsonV3(file);
      if (res.success && res.data) {
        setCategories(res.data.categories);
        setAccounts(res.data.accounts);
        setTransactions(res.data.transactions);
        setBudgets(res.data.budgets);
        setGoals(res.data.goals);
        setDebts(res.data.debts);
        setInvestments(res.data.investments);
        setSettings(res.data.settings);
        saveStoredDataV3(res.data);
        return { success: true };
      }
      return { success: false, error: res.error || "Nhập file thất bại" };
    },
    []
  );

  // Tính toán Thông tin 2 thẻ BIDV Credit
  const husbandCreditCard = useMemo<CreditCardInfo | null>(() => {
    const acc = accounts.find((a) => a.id === "acc_husband_bidv_credit");
    if (!acc) return null;
    const limit = acc.creditLimit || 50000000;
    const used = Math.max(0, acc.currentBalance);
    const available = Math.max(0, limit - used);
    const pct = Math.min(100, Math.round((used / limit) * 100));
    return {
      account: acc,
      creditLimit: limit,
      usedAmount: used,
      availableAmount: available,
      usagePercentage: pct,
    };
  }, [accounts]);

  const wifeCreditCard = useMemo<CreditCardInfo | null>(() => {
    const acc = accounts.find((a) => a.id === "acc_wife_bidv_credit");
    if (!acc) return null;
    const limit = acc.creditLimit || 20000000;
    const used = Math.max(0, acc.currentBalance);
    const available = Math.max(0, limit - used);
    const pct = Math.min(100, Math.round((used / limit) * 100));
    return {
      account: acc,
      creditLimit: limit,
      usedAmount: used,
      availableAmount: available,
      usagePercentage: pct,
    };
  }, [accounts]);

  // Tính toán Tổng hợp Tài chính (theo góc nhìn activePerspective)
  const summary = useMemo<FinancialSummary>(() => {
    // 1. Phân loại tài khoản theo góc nhìn
    const filteredAccounts = accounts.filter((a) => {
      if (activePerspective === "ALL") return true;
      if (activePerspective === "HUSBAND") return a.owner === "HUSBAND" || a.owner === "SHARED";
      if (activePerspective === "WIFE") return a.owner === "WIFE" || a.owner === "SHARED";
      return true;
    });

    // Số dư khả dụng (chỉ tính ví tiền mặt và ngân hàng thường, không tính thẻ tín dụng)
    const currentBalance = filteredAccounts
      .filter((a) => a.type !== "CREDIT_CARD")
      .reduce((sum, a) => sum + Math.max(0, a.currentBalance), 0);

    // Tổng dư nợ thẻ tín dụng
    const totalCreditDebt = filteredAccounts
      .filter((a) => a.type === "CREDIT_CARD")
      .reduce((sum, a) => sum + Math.max(0, a.currentBalance), 0);

    // Nợ ngoài
    const totalDebt = debts
      .filter((d) => d.status === "ACTIVE")
      .filter((d) => {
        if (activePerspective === "ALL") return true;
        if (activePerspective === "HUSBAND") return d.memberId === "HUSBAND" || d.memberId === "SHARED";
        if (activePerspective === "WIFE") return d.memberId === "WIFE" || d.memberId === "SHARED";
        return true;
      })
      .reduce((sum, d) => sum + (d.totalAmount - d.paidAmount), 0);

    // Đầu tư
    const totalInvested = investments
      .filter((i) => i.status === "ACTIVE")
      .filter((i) => {
        if (activePerspective === "ALL") return true;
        if (activePerspective === "HUSBAND") return i.memberId === "HUSBAND" || i.memberId === "SHARED";
        if (activePerspective === "WIFE") return i.memberId === "WIFE" || i.memberId === "SHARED";
        return true;
      })
      .reduce((sum, i) => sum + (i.currentValue || i.amount), 0);

    // Tài sản ròng
    const netWorth = currentBalance + totalInvested - totalDebt - totalCreditDebt;

    // Thu - Chi theo kỳ và theo góc nhìn
    let monthlyIncome = 0;
    let monthlyExpense = 0;
    let husbandIncome = 0;
    let wifeIncome = 0;
    let husbandExpense = 0;
    let wifeExpense = 0;
    let familySharedExpense = 0;

    for (const tx of transactions) {
      const matchMonth = selectedMonth === "ALL" || tx.date.startsWith(selectedMonth);
      if (!matchMonth) continue;

      if (tx.type === "INCOME") {
        if (tx.memberId === "HUSBAND") husbandIncome += tx.amount;
        if (tx.memberId === "WIFE") wifeIncome += tx.amount;

        if (activePerspective === "ALL") monthlyIncome += tx.amount;
        else if (activePerspective === "HUSBAND" && tx.memberId === "HUSBAND") monthlyIncome += tx.amount;
        else if (activePerspective === "WIFE" && tx.memberId === "WIFE") monthlyIncome += tx.amount;
      } else if (tx.type === "EXPENSE") {
        if (tx.memberId === "HUSBAND") husbandExpense += tx.amount;
        if (tx.memberId === "WIFE") wifeExpense += tx.amount;
        if (tx.scope === "FAMILY") familySharedExpense += tx.amount;

        if (activePerspective === "ALL") monthlyExpense += tx.amount;
        else if (activePerspective === "HUSBAND" && tx.memberId === "HUSBAND") monthlyExpense += tx.amount;
        else if (activePerspective === "WIFE" && tx.memberId === "WIFE") monthlyExpense += tx.amount;
      }
    }

    const savingsAmount = monthlyIncome - monthlyExpense;
    const savingsRate =
      monthlyIncome > 0 ? Math.max(0, Math.round((savingsAmount / monthlyIncome) * 100)) : 0;

    return {
      currentBalance,
      netWorth,
      monthlyIncome,
      monthlyExpense,
      savingsAmount,
      savingsRate,
      totalDebt,
      totalInvested,
      husbandIncome,
      wifeIncome,
      husbandExpense,
      wifeExpense,
      familySharedExpense,
      totalCreditDebt,
    };
  }, [accounts, debts, investments, transactions, selectedMonth, activePerspective]);

  // Ngân sách tháng
  const budgetSummary = useMemo<BudgetSummary>(() => {
    const monthKey = selectedMonth === "ALL" ? "2026-10" : selectedMonth;
    const currentMonthBudgets = budgets.filter((b) => b.month === monthKey);

    const categorySpentMap = new Map<string, number>();
    for (const tx of transactions) {
      if (tx.type === "EXPENSE" && tx.date.startsWith(monthKey)) {
        if (activePerspective === "HUSBAND" && tx.memberId !== "HUSBAND") continue;
        if (activePerspective === "WIFE" && tx.memberId !== "WIFE") continue;

        const cur = categorySpentMap.get(tx.categoryId) || 0;
        categorySpentMap.set(tx.categoryId, cur + tx.amount);
      }
    }

    let totalBudget = 0;
    let totalSpent = 0;

    const items: BudgetProgressItem[] = currentMonthBudgets.map((b) => {
      const cat = getCategoryById(b.categoryId);
      const spent = categorySpentMap.get(b.categoryId) || 0;
      totalBudget += b.limitAmount;
      totalSpent += spent;

      const remaining = Math.max(0, b.limitAmount - spent);
      const percentage = Math.round((spent / b.limitAmount) * 100);

      return {
        categoryId: b.categoryId,
        categoryName: cat?.name || "Danh mục",
        categoryColor: cat?.color || "#94A3B8",
        limitAmount: b.limitAmount,
        spentAmount: spent,
        remainingAmount: remaining,
        percentage,
      };
    });

    const remaining = Math.max(0, totalBudget - totalSpent);
    const daysRemaining = 18;
    const dailyAllowance = daysRemaining > 0 ? Math.round(remaining / daysRemaining) : 0;

    return {
      totalBudget,
      totalSpent,
      remaining,
      daysRemaining,
      dailyAllowance,
      items,
    };
  }, [budgets, transactions, selectedMonth, activePerspective, getCategoryById]);

  // Danh sách giao dịch được lọc
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        if (selectedMonth !== "ALL" && !tx.date.startsWith(selectedMonth)) return false;
        if (selectedType !== "ALL" && tx.type !== selectedType) return false;
        if (selectedCategory !== "ALL" && tx.categoryId !== selectedCategory) return false;
        if (selectedAccount !== "ALL" && tx.accountId !== selectedAccount && tx.toAccountId !== selectedAccount)
          return false;

        // Lọc theo góc nhìn thành viên
        if (activePerspective === "HUSBAND" && tx.memberId !== "HUSBAND") return false;
        if (activePerspective === "WIFE" && tx.memberId !== "WIFE") return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const category = getCategoryById(tx.categoryId);
          const account = getAccountById(tx.accountId);
          const matchNote = tx.note?.toLowerCase().includes(q);
          const matchCat = category?.name.toLowerCase().includes(q);
          const matchAcc = account?.name.toLowerCase().includes(q);
          const matchAmount = tx.amount.toString().includes(q);
          if (!matchNote && !matchCat && !matchAcc && !matchAmount) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const dateCompare = b.date.localeCompare(a.date);
        if (dateCompare !== 0) return dateCompare;
        return (b.createdAt || "").localeCompare(a.createdAt || "");
      });
  }, [transactions, selectedMonth, selectedType, selectedCategory, selectedAccount, activePerspective, searchQuery, getCategoryById, getAccountById]);

  // Thống kê Donut chi tiêu
  const categoryExpenseStats = useMemo<CategoryExpenseStat[]>(() => {
    const expenseMap = new Map<string, number>();
    let totalExpense = 0;

    for (const tx of transactions) {
      if (tx.type !== "EXPENSE") continue;
      if (selectedMonth !== "ALL" && !tx.date.startsWith(selectedMonth)) continue;
      if (activePerspective === "HUSBAND" && tx.memberId !== "HUSBAND") continue;
      if (activePerspective === "WIFE" && tx.memberId !== "WIFE") continue;

      const current = expenseMap.get(tx.categoryId) || 0;
      expenseMap.set(tx.categoryId, current + tx.amount);
      totalExpense += tx.amount;
    }

    if (totalExpense === 0) return [];

    const stats: CategoryExpenseStat[] = [];
    expenseMap.forEach((amount, catId) => {
      const cat = getCategoryById(catId);
      stats.push({
        categoryId: catId,
        categoryName: cat?.name || "Chi khác",
        categoryColor: cat?.color || "#94A3B8",
        totalAmount: amount,
        percentage: Math.round((amount / totalExpense) * 100),
      });
    });

    return stats.sort((a, b) => b.totalAmount - a.totalAmount);
  }, [transactions, selectedMonth, activePerspective, getCategoryById]);

  // Monthly Trend
  const monthlyTrendData = useMemo<MonthlyTrendItem[]>(() => {
    const months = ["2026-05", "2026-06", "2026-07", "2026-08", "2026-09", "2026-10"];
    const map = new Map<string, { income: number; expense: number }>();

    months.forEach((m) => map.set(m, { income: 0, expense: 0 }));

    for (const tx of transactions) {
      const m = tx.date.substring(0, 7);
      if (map.has(m)) {
        if (activePerspective === "HUSBAND" && tx.memberId !== "HUSBAND") continue;
        if (activePerspective === "WIFE" && tx.memberId !== "WIFE") continue;

        const item = map.get(m)!;
        if (tx.type === "INCOME") item.income += tx.amount;
        if (tx.type === "EXPENSE") item.expense += tx.amount;
      }
    }

    return months.map((m) => {
      const item = map.get(m)!;
      const monthNum = parseInt(m.split("-")[1], 10);
      return {
        month: m,
        label: `Tháng ${monthNum}`,
        income: item.income,
        expense: item.expense,
      };
    });
  }, [transactions, activePerspective]);

  // Thông báo
  const notifications = useMemo<AppNotification[]>(() => {
    const list: AppNotification[] = [...DEFAULT_NOTIFICATIONS];

    // Cảnh báo hạn mức thẻ tín dụng nếu dùng > 70%
    if (husbandCreditCard && husbandCreditCard.usagePercentage >= 70) {
      list.push({
        id: "warn_husband_credit_high",
        title: "Cảnh báo hạn mức thẻ Chồng",
        message: `Thẻ BIDV Credit Chồng đã dùng ${husbandCreditCard.usagePercentage}% hạn mức (vượt ngưỡng 70%)`,
        type: "warning",
        date: "2026-10-21",
        read: false,
      });
    }

    return list;
  }, [husbandCreditCard]);

  const markNotificationRead = useCallback((id: string) => {}, []);

  const value = {
    isLoaded,
    activeTab,
    setActiveTab,
    activePerspective,
    setActivePerspective,
    categories,
    accounts,
    transactions,
    budgets,
    goals,
    debts,
    investments,
    settings,
    notifications,
    selectedMonth,
    selectedCategory,
    selectedType,
    selectedAccount,
    searchQuery,
    setSelectedMonth,
    setSelectedCategory,
    setSelectedType,
    setSelectedAccount,
    setSearchQuery,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addAccount,
    updateAccount,
    deleteAccount,
    setCategoryBudget,
    addGoal,
    updateGoal,
    deleteGoal,
    depositGoal,
    addDebt,
    payDebt,
    deleteDebt,
    addInvestment,
    updateInvestment,
    deleteInvestment,
    updateSettings,
    markNotificationRead,
    resetToMockData,
    exportBackup,
    importBackup,
    availableMonths,
    summary,
    budgetSummary,
    filteredTransactions,
    categoryExpenseStats,
    monthlyTrendData,
    getCategoryById,
    getAccountById,
    husbandCreditCard,
    wifeCreditCard,
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinance phải được sử dụng bên trong FinanceProvider");
  }
  return context;
}
