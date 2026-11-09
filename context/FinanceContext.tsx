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
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { supabaseService } from "@/lib/supabaseService";

export type NavTab =
  | "overview"
  | "transactions"
  | "accounts"
  | "planning"
  | "debts_invest"
  | "backend"
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

  // Trạng thái Cloud Database & Realtime
  isCloudConnected: boolean;
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  syncWithCloud: () => Promise<void>;
  pushLocalToCloud: () => Promise<{ success: boolean; count: number; error?: string }>;

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

  // Quản lý Danh mục (Categories) cho Master Data Backend
  addCategory: (cat: Omit<Category, "id">) => void;
  updateCategory: (id: string, cat: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

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
  updateDebt: (id: string, debt: Partial<DebtItem>) => void;
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

  // Supabase Cloud State
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(isSupabaseConfigured);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [accounts, setAccounts] = useState<Account[]>(DEFAULT_ACCOUNTS);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<CategoryBudget[]>(DEFAULT_BUDGETS);
  const [goals, setGoals] = useState<SavingsGoal[]>(DEFAULT_SAVINGS_GOALS);
  const [debts, setDebts] = useState<DebtItem[]>(DEFAULT_DEBTS);
  const [investments, setInvestments] = useState<InvestmentItem[]>(DEFAULT_INVESTMENTS);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  // Bộ lọc
  const [selectedMonth, setSelectedMonth] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<"ALL" | TransactionType>("ALL");
  const [selectedAccount, setSelectedAccount] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Hàm đẩy dữ liệu Local (320+ giao dịch) lên Supabase Cloud
  const pushLocalToCloud = useCallback(async (): Promise<{ success: boolean; count: number; error?: string }> => {
    if (!isSupabaseConfigured) {
      return { success: false, count: 0, error: "Chưa cấu hình kết nối Supabase Cloud" };
    }
    setIsSyncing(true);
    try {
      // 1. Đồng bộ các bảng cấu hình trước
      if (categories.length > 0) {
        categories.forEach((c) => supabaseService.upsertCategory(c));
      }
      if (accounts.length > 0) {
        await supabaseService.updateAccounts(accounts);
      }
      if (budgets.length > 0) {
        budgets.forEach((b) => supabaseService.upsertBudget(b));
      }
      if (goals.length > 0) {
        goals.forEach((g) => supabaseService.upsertGoal(g));
      }
      if (debts.length > 0) {
        debts.forEach((d) => supabaseService.upsertDebt(d));
      }
      if (investments.length > 0) {
        investments.forEach((i) => supabaseService.upsertInvestment(i));
      }
      if (settings) {
        await supabaseService.updateSettings(settings);
      }

      // 2. Batch upsert toàn bộ transactions (320+ records)
      const success = await supabaseService.batchUpsertTransactions(transactions);
      if (success) {
        setIsCloudConnected(true);
        setLastSyncedAt(new Date());
        return { success: true, count: transactions.length };
      } else {
        return { success: false, count: 0, error: "Đẩy giao dịch lên Cloud thất bại" };
      }
    } catch (err: any) {
      console.error("pushLocalToCloud error:", err);
      return { success: false, count: 0, error: err?.message || "Lỗi khi đẩy lên Cloud" };
    } finally {
      setIsSyncing(false);
    }
  }, [categories, accounts, budgets, goals, debts, investments, settings, transactions]);

  // Hàm đồng bộ dữ liệu từ Supabase Cloud về Local State
  const syncWithCloud = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setIsCloudConnected(false);
      return;
    }

    setIsSyncing(true);
    try {
      const cloudData = await supabaseService.fetchAllData();
      if (cloudData) {
        setIsCloudConnected(true);
        setLastSyncedAt(new Date());

        // KIỂM TRA BẢO VỆ: Nếu Local đang có 320+ giao dịch thực tế mà Cloud chỉ có dữ liệu mẫu cũ (< 50 dòng)
        // thì KHÔNG ghi đè Local bằng Cloud, mà ngược lại tự động đẩy Local lên Cloud để đưa cả 2 về trạng thái chuẩn!
        const currentLocal = loadStoredDataV3();
        if (currentLocal.transactions.length >= 300 && cloudData.transactions.length < 50) {
          console.warn(
            `[Cloud Sync Guard] Phát hiện Local có ${currentLocal.transactions.length} giao dịch thực tế nhưng Cloud chỉ có ${cloudData.transactions.length} dòng cũ. Tự động đồng bộ Local lên Cloud...`
          );
          await supabaseService.batchUpsertTransactions(currentLocal.transactions);
          await supabaseService.updateAccounts(currentLocal.accounts);
          return;
        }

        // Nếu trên Cloud đã có dữ liệu hợp lệ và đầy đủ, hợp nhất vào State
        if (cloudData.accounts.length > 0 || cloudData.transactions.length > 0) {
          if (cloudData.categories.length > 0) setCategories(cloudData.categories);
          if (cloudData.budgets.length > 0) setBudgets(cloudData.budgets);
          if (cloudData.goals.length > 0) setGoals(cloudData.goals);
          if (cloudData.debts.length > 0) setDebts(cloudData.debts);
          if (cloudData.investments.length > 0) setInvestments(cloudData.investments);
          if (cloudData.settings) setSettings(cloudData.settings);

          const recalcAccounts = recalculateAccountBalances(cloudData.accounts, cloudData.transactions);
          setTransactions(cloudData.transactions);
          setAccounts(recalcAccounts);

          // Cập nhật lại cache LocalStorage để lần tải sau nhanh 0ms
          saveStoredDataV3({
            categories: cloudData.categories.length > 0 ? cloudData.categories : categories,
            accounts: recalcAccounts,
            transactions: cloudData.transactions,
            budgets: cloudData.budgets.length > 0 ? cloudData.budgets : budgets,
            goals: cloudData.goals.length > 0 ? cloudData.goals : goals,
            debts: cloudData.debts.length > 0 ? cloudData.debts : debts,
            investments: cloudData.investments.length > 0 ? cloudData.investments : investments,
            settings: cloudData.settings || settings,
          });
        }
      } else {
        setIsCloudConnected(false);
      }
    } catch (err) {
      console.error("Cloud sync error:", err);
      setIsCloudConnected(false);
    } finally {
      setIsSyncing(false);
    }
  }, [categories, budgets, goals, debts, investments, settings]);

  // Khởi tạo từ LocalStorage khi mount (0ms) sau đó đồng bộ Cloud
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

    // Kích hoạt đồng bộ Cloud nếu đã cấu hình
    if (isSupabaseConfigured) {
      syncWithCloud();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 1. Tạo re~f lưu trữ hàm syncWithCloud ổn định để không trigger re-subscribe
  const syncWithCloudRef = React.useRef(syncWithCloud);
  syncWithCloudRef.current = syncWithCloud;

  // 2. Lắng nghe Supabase Realtime Replication ổn định (Chỉ lắng nghe transactions & accounts)
  useEffect(() => {
    if (!supabase || !isSupabaseConfigured) return;

    const channel = supabase
      .channel("home_moni_realtime_stable")
      .on("postgres_changes", { event: "*", schema: "public", table: "transactions" }, () => {
        syncWithCloudRef.current();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "accounts" }, () => {
        syncWithCloudRef.current();
      })
      .subscribe((status, err) => {
        if (status === "SUBSCRIBED") {
          setIsCloudConnected(true);
        } else if (status === "CHANNEL_ERROR") {
          console.warn("[Supabase Realtime] Lỗi kênh Realtime, duy trì trạng thái Local-first:", err);
          // KHÔNG gán false đột ngột để tránh giật nháy UI do retry loop của socket
        } else if (status === "CLOSED") {
          // Chỉ ngắt khi kênh thực sự bị đóng chủ động
        }
      });

    return () => {
      if (supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  // Tự động lưu vào LocalStorage V3 để đảm bảo offline
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

  // Tối ưu hóa tra cứu O(1) bằng Map thay vì duyệt mảng O(N)
  const categoryMap = useMemo(() => {
    return new Map<string, Category>(categories.map((c) => [c.id, c]));
  }, [categories]);

  const accountMap = useMemo(() => {
    return new Map<string, Account>(accounts.map((a) => [a.id, a]));
  }, [accounts]);

  const getCategoryById = useCallback(
    (id: string) => categoryMap.get(id),
    [categoryMap]
  );

  const getAccountById = useCallback(
    (id: string) => accountMap.get(id),
    [accountMap]
  );

  // CRUD Giao dịch (Optimistic UI + Background Cloud Sync)
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
        setAccounts((prevAccs) => {
          const recalc = recalculateAccountBalances(prevAccs, next);
          if (isSupabaseConfigured) {
            supabaseService.upsertTransaction(newTx);
            supabaseService.updateAccounts(recalc);
          }
          return recalc;
        });
        return next;
      });

      return newTx;
    },
    []
  );

  const updateTransaction = useCallback(
    (id: string, input: Partial<TransactionInput>) => {
      let updatedTx: Transaction | undefined;
      setTransactions((prev) => {
        const next = prev.map((tx) => {
          if (tx.id !== id) return tx;
          updatedTx = {
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
          return updatedTx;
        });

        setAccounts((prevAccs) => {
          const recalc = recalculateAccountBalances(prevAccs, next);
          if (isSupabaseConfigured && updatedTx) {
            supabaseService.upsertTransaction(updatedTx);
            supabaseService.updateAccounts(recalc);
          }
          return recalc;
        });

        return next;
      });
    },
    []
  );

  const deleteTransaction = useCallback(
    (id: string) => {
      setTransactions((prev) => {
        const next = prev.filter((tx) => tx.id !== id);
        setAccounts((prevAccs) => {
          const recalc = recalculateAccountBalances(prevAccs, next);
          if (isSupabaseConfigured) {
            supabaseService.deleteTransaction(id);
            supabaseService.updateAccounts(recalc);
          }
          return recalc;
        });
        return next;
      });
    },
    []
  );

  // Quản lý Danh mục (Categories) cho UI Backend
  const addCategory = useCallback((cat: Omit<Category, "id">) => {
    const newCat: Category = {
      ...cat,
      id: `cat_${Date.now()}`,
    };
    setCategories((prev) => {
      const next = [...prev, newCat];
      if (isSupabaseConfigured) {
        supabaseService.upsertCategory(newCat);
      }
      return next;
    });
  }, []);

  const updateCategory = useCallback((id: string, cat: Partial<Category>) => {
    setCategories((prev) => {
      let target: Category | undefined;
      const next = prev.map((c) => {
        if (c.id === id) {
          target = { ...c, ...cat };
          return target;
        }
        return c;
      });
      if (isSupabaseConfigured && target) {
        supabaseService.upsertCategory(target);
      }
      return next;
    });
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // Quản lý Tài khoản (Ví)
  const addAccount = useCallback((acc: Omit<Account, "id" | "currentBalance">) => {
    const newId = `acc_${Date.now()}`;
    const newAccount: Account = {
      ...acc,
      id: newId,
      currentBalance: acc.initialBalance,
    };
    setAccounts((prev) => {
      const next = [...prev, newAccount];
      if (isSupabaseConfigured) {
        supabaseService.upsertAccount(newAccount);
      }
      return next;
    });
  }, []);

  const updateAccount = useCallback((id: string, acc: Partial<Account>) => {
    setAccounts((prev) => {
      let target: Account | undefined;
      const next = prev.map((a) => {
        if (a.id === id) {
          target = { ...a, ...acc };
          return target;
        }
        return a;
      });
      if (isSupabaseConfigured && target) {
        supabaseService.upsertAccount(target);
      }
      return next;
    });
  }, []);

  const deleteAccount = useCallback((id: string) => {
    setAccounts((prev) => {
      const next = prev.filter((a) => a.id !== id);
      if (isSupabaseConfigured) {
        supabaseService.updateAccounts(next);
      }
      return next;
    });
  }, []);

  // Ngân sách
  const setCategoryBudget = useCallback(
    (categoryId: string, limitAmount: number, month?: string) => {
      const targetMonth = month || selectedMonth || "2026-10";
      const targetBudget: CategoryBudget = { categoryId, limitAmount, month: targetMonth };

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
        return [...prev, targetBudget];
      });

      if (isSupabaseConfigured) {
        supabaseService.upsertBudget(targetBudget);
      }
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
    if (isSupabaseConfigured) {
      supabaseService.upsertGoal(newGoal);
    }
  }, []);

  const updateGoal = useCallback((id: string, goal: Partial<SavingsGoal>) => {
    setGoals((prev) => {
      let target: SavingsGoal | undefined;
      const next = prev.map((g) => {
        if (g.id !== id) return g;
        target = { ...g, ...goal };
        target.isCompleted = target.currentAmount >= target.targetAmount;
        return target;
      });
      if (isSupabaseConfigured && target) {
        supabaseService.upsertGoal(target);
      }
      return next;
    });
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    if (isSupabaseConfigured) {
      supabaseService.deleteGoal(id);
    }
  }, []);

  const depositGoal = useCallback((id: string, amount: number) => {
    setGoals((prev) => {
      let target: SavingsGoal | undefined;
      const next = prev.map((g) => {
        if (g.id !== id) return g;
        const newCurrent = g.currentAmount + amount;
        target = {
          ...g,
          currentAmount: newCurrent,
          isCompleted: newCurrent >= g.targetAmount,
        };
        return target;
      });
      if (isSupabaseConfigured && target) {
        supabaseService.upsertGoal(target);
      }
      return next;
    });
  }, []);

  // Nợ & Đầu tư
  const addDebt = useCallback((debt: Omit<DebtItem, "id">) => {
    const newDebt: DebtItem = { ...debt, id: `debt_${Date.now()}` };
    setDebts((prev) => [...prev, newDebt]);
    if (isSupabaseConfigured) {
      supabaseService.upsertDebt(newDebt);
    }
  }, []);

  const updateDebt = useCallback((id: string, debt: Partial<DebtItem>) => {
    setDebts((prev) => {
      let target: DebtItem | undefined;
      const next = prev.map((d) => {
        if (d.id !== id) return d;
        target = { ...d, ...debt };
        return target;
      });
      if (isSupabaseConfigured && target) {
        supabaseService.upsertDebt(target);
      }
      return next;
    });
  }, []);

  const payDebt = useCallback((id: string, amount: number) => {
    setDebts((prev) => {
      let target: DebtItem | undefined;
      const next = prev.map((d) => {
        if (d.id !== id) return d;
        const newPaid = d.paidAmount + amount;
        target = {
          ...d,
          paidAmount: newPaid,
          status: newPaid >= d.totalAmount ? "PAID" : "ACTIVE",
        };
        return target;
      });
      if (isSupabaseConfigured && target) {
        supabaseService.upsertDebt(target);
      }
      return next;
    });
  }, []);

  const deleteDebt = useCallback((id: string) => {
    setDebts((prev) => prev.filter((d) => d.id !== id));
    if (isSupabaseConfigured) {
      supabaseService.deleteDebt(id);
    }
  }, []);

  const addInvestment = useCallback((inv: Omit<InvestmentItem, "id">) => {
    const newInv: InvestmentItem = { ...inv, id: `inv_${Date.now()}` };
    setInvestments((prev) => [...prev, newInv]);
    if (isSupabaseConfigured) {
      supabaseService.upsertInvestment(newInv);
    }
  }, []);

  const updateInvestment = useCallback((id: string, inv: Partial<InvestmentItem>) => {
    setInvestments((prev) => {
      let target: InvestmentItem | undefined;
      const next = prev.map((i) => {
        if (i.id === id) {
          target = { ...i, ...inv };
          return target;
        }
        return i;
      });
      if (isSupabaseConfigured && target) {
        supabaseService.upsertInvestment(target);
      }
      return next;
    });
  }, []);

  const deleteInvestment = useCallback((id: string) => {
    setInvestments((prev) => prev.filter((i) => i.id !== id));
    if (isSupabaseConfigured) {
      supabaseService.deleteInvestment(id);
    }
  }, []);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...newSettings };
      if (isSupabaseConfigured) {
        supabaseService.updateSettings(next);
      }
      return next;
    });
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

        // Đẩy lên cloud nếu đã cấu hình
        if (isSupabaseConfigured) {
          res.data.accounts.forEach((a) => supabaseService.upsertAccount(a));
          res.data.transactions.forEach((t) => supabaseService.upsertTransaction(t));
          res.data.budgets.forEach((b) => supabaseService.upsertBudget(b));
          res.data.goals.forEach((g) => supabaseService.upsertGoal(g));
          res.data.debts.forEach((d) => supabaseService.upsertDebt(d));
          res.data.investments.forEach((i) => supabaseService.upsertInvestment(i));
          supabaseService.updateSettings(res.data.settings);
        }

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
    const filteredAccounts = accounts.filter((a) => {
      if (activePerspective === "ALL") return true;
      if (activePerspective === "HUSBAND") return a.owner === "HUSBAND" || a.owner === "SHARED";
      if (activePerspective === "WIFE") return a.owner === "WIFE" || a.owner === "SHARED";
      return true;
    });

    const currentBalance = filteredAccounts
      .filter((a) => a.type !== "CREDIT_CARD")
      .reduce((sum, a) => sum + Math.max(0, a.currentBalance), 0);

    const totalCreditDebt = filteredAccounts
      .filter((a) => a.type === "CREDIT_CARD")
      .reduce((sum, a) => sum + Math.max(0, a.currentBalance), 0);

    const totalDebt = debts
      .filter((d) => d.status === "ACTIVE")
      .filter((d) => {
        if (activePerspective === "ALL") return true;
        if (activePerspective === "HUSBAND") return d.memberId === "HUSBAND" || d.memberId === "SHARED";
        if (activePerspective === "WIFE") return d.memberId === "WIFE" || d.memberId === "SHARED";
        return true;
      })
      .reduce((sum, d) => sum + (d.totalAmount - d.paidAmount), 0);

    const totalInvested = investments
      .filter((i) => i.status === "ACTIVE")
      .filter((i) => {
        if (activePerspective === "ALL") return true;
        if (activePerspective === "HUSBAND") return i.memberId === "HUSBAND" || i.memberId === "SHARED";
        if (activePerspective === "WIFE") return i.memberId === "WIFE" || i.memberId === "SHARED";
        return true;
      })
      .reduce((sum, i) => sum + (i.currentValue || i.amount), 0);

    const netWorth = currentBalance + totalInvested - totalDebt - totalCreditDebt;

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

  // Xu hướng thu chi (Hiển thị 6-12 tháng gần nhất từ dữ liệu thực tế)
  const monthlyTrendData = useMemo<MonthlyTrendItem[]>(() => {
    // Trích xuất các tháng thực tế hoặc mặc định 6 tháng
    const months = availableMonths.length > 0
      ? availableMonths.slice(-6)
      : ["2026-05", "2026-06", "2026-07", "2026-08", "2026-09", "2026-10"];
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
      const parts = m.split("-");
      const monthNum = parseInt(parts[1], 10);
      const yearStr = parts[0] ? `'${parts[0].slice(2)}` : "";
      return {
        month: m,
        label: `T${monthNum} ${yearStr}`,
        income: item.income,
        expense: item.expense,
      };
    });
  }, [availableMonths, transactions, activePerspective]);

  // Thông báo
  const notifications = useMemo<AppNotification[]>(() => {
    const list: AppNotification[] = [...DEFAULT_NOTIFICATIONS];

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

    if (wifeCreditCard && wifeCreditCard.usagePercentage >= 70) {
      list.push({
        id: "warn_wife_credit_high",
        title: "Cảnh báo hạn mức thẻ Vợ",
        message: `Thẻ BIDV Credit Vợ đã dùng ${wifeCreditCard.usagePercentage}% hạn mức (vượt ngưỡng 70%)`,
        type: "warning",
        date: "2026-10-22",
        read: false,
      });
    }

    return list;
  }, [husbandCreditCard, wifeCreditCard]);

  const markNotificationRead = useCallback((id: string) => {
    if (isSupabaseConfigured) {
      supabaseService.markNotificationRead(id);
    }
  }, []);

  const value = {
    isLoaded,
    activeTab,
    setActiveTab,
    isCloudConnected,
    isSyncing,
    lastSyncedAt,
    syncWithCloud,
    pushLocalToCloud,
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
    addCategory,
    updateCategory,
    deleteCategory,
    addAccount,
    updateAccount,
    deleteAccount,
    setCategoryBudget,
    addGoal,
    updateGoal,
    deleteGoal,
    depositGoal,
    addDebt,
    updateDebt,
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
