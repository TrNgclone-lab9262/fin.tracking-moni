import {
  Category,
  Account,
  Transaction,
  CategoryBudget,
  SavingsGoal,
  DebtItem,
  InvestmentItem,
  AppSettings,
  AppDataBackup,
} from "@/types/finance";
import { DEFAULT_CATEGORIES } from "@/constants/defaultCategories";
import {
  DEFAULT_ACCOUNTS,
  DEFAULT_TRANSACTIONS,
  DEFAULT_BUDGETS,
  DEFAULT_SAVINGS_GOALS,
  DEFAULT_DEBTS,
  DEFAULT_INVESTMENTS,
  DEFAULT_SETTINGS,
} from "@/constants/mockData";
import { AppDataBackupSchema } from "./validations";

export const STORAGE_KEY_V3 = "HOME_MONI_DATA_V4";

export interface StoredAppStateV3 {
  categories: Category[];
  accounts: Account[];
  transactions: Transaction[];
  budgets: CategoryBudget[];
  goals: SavingsGoal[];
  debts: DebtItem[];
  investments: InvestmentItem[];
  settings: AppSettings;
}

function isStorageAvailable(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

/**
 * Tự động tính toán lại số dư của từng tài khoản:
 * - Với tài khoản ngân hàng / tiền mặt: Số dư = Đầu kỳ + Thu - Chi - Chuyển đi + Chuyển đến
 * - Với thẻ tín dụng: Dư nợ = Đầu kỳ + Chi tiêu bằng thẻ - Thanh toán thẻ (chuyển vào)
 */
export function recalculateAccountBalances(
  accounts: Account[],
  transactions: Transaction[]
): Account[] {
  return accounts.map((acc) => {
    let balance = acc.initialBalance;
    const isCredit = acc.type === "CREDIT_CARD";

    for (const tx of transactions) {
      if (isCredit) {
        // Thẻ tín dụng: Chi tiêu làm TĂNG dư nợ, chuyển tiền vào làm GIẢM dư nợ
        if (tx.type === "EXPENSE" && tx.accountId === acc.id) {
          balance += tx.amount;
        } else if (tx.type === "TRANSFER" && tx.toAccountId === acc.id) {
          balance -= tx.amount;
        }
      } else {
        // Tài khoản thanh toán thường:
        if (tx.type === "INCOME" && tx.accountId === acc.id) {
          balance += tx.amount;
        } else if (tx.type === "EXPENSE" && tx.accountId === acc.id) {
          balance -= tx.amount;
        } else if (tx.type === "TRANSFER") {
          if (tx.accountId === acc.id) {
            balance -= tx.amount;
          }
          if (tx.toAccountId === acc.id) {
            balance += tx.amount;
          }
        }
      }
    }

    return {
      ...acc,
      currentBalance: balance,
    };
  });
}

/**
 * Khởi tạo dữ liệu mẫu chuẩn HOME MONI cho gia đình
 */
export function seedInitialDataV3(): StoredAppStateV3 {
  const initialData: StoredAppStateV3 = {
    categories: DEFAULT_CATEGORIES,
    accounts: DEFAULT_ACCOUNTS,
    transactions: DEFAULT_TRANSACTIONS,
    budgets: DEFAULT_BUDGETS,
    goals: DEFAULT_SAVINGS_GOALS,
    debts: DEFAULT_DEBTS,
    investments: DEFAULT_INVESTMENTS,
    settings: DEFAULT_SETTINGS,
  };

  initialData.accounts = recalculateAccountBalances(initialData.accounts, initialData.transactions);

  if (isStorageAvailable()) {
    try {
      window.localStorage.setItem(STORAGE_KEY_V3, JSON.stringify(initialData));
    } catch (e) {
      console.warn("Không thể lưu trữ vào localStorage:", e);
    }
  }

  return initialData;
}

/**
 * Đọc dữ liệu từ LocalStorage V3
 */
export function loadStoredDataV3(): StoredAppStateV3 {
  if (!isStorageAvailable()) {
    return seedInitialDataV3();
  }

  try {
    const rawV3 = window.localStorage.getItem(STORAGE_KEY_V3);
    if (rawV3) {
      const parsed = JSON.parse(rawV3);
      if (parsed.transactions && Array.isArray(parsed.transactions)) {
        return {
          categories: parsed.categories?.length ? parsed.categories : DEFAULT_CATEGORIES,
          accounts: parsed.accounts?.length ? parsed.accounts : DEFAULT_ACCOUNTS,
          transactions: parsed.transactions || [],
          budgets: parsed.budgets || DEFAULT_BUDGETS,
          goals: parsed.goals || DEFAULT_SAVINGS_GOALS,
          debts: parsed.debts || DEFAULT_DEBTS,
          investments: parsed.investments || DEFAULT_INVESTMENTS,
          settings: parsed.settings || DEFAULT_SETTINGS,
        };
      }
    }

    return seedInitialDataV3();
  } catch (err) {
    console.error("Lỗi khi đọc LocalStorage V3:", err);
    return seedInitialDataV3();
  }
}

/**
 * Lưu trạng thái vào LocalStorage V3
 */
export function saveStoredDataV3(state: StoredAppStateV3): boolean {
  if (!isStorageAvailable()) return false;
  try {
    window.localStorage.setItem(STORAGE_KEY_V3, JSON.stringify(state));
    return true;
  } catch (error) {
    console.error("Lỗi khi lưu LocalStorage V3:", error);
    return false;
  }
}

/**
 * Xuất dữ liệu sao lưu JSON
 */
export function exportDataToJsonV3(state: StoredAppStateV3): void {
  const backupPayload: AppDataBackup = {
    version: "3.0",
    exportedAt: new Date().toISOString(),
    categories: state.categories,
    accounts: state.accounts,
    transactions: state.transactions,
    budgets: state.budgets,
    goals: state.goals,
    debts: state.debts,
    investments: state.investments,
    settings: state.settings,
  };

  const jsonString = JSON.stringify(backupPayload, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const now = new Date();
  const dateFormatted = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}_${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
  const filename = `home_moni_family_backup_${dateFormatted}.json`;

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Nhập dữ liệu sao lưu JSON
 */
export async function importDataFromJsonV3(file: File): Promise<{
  success: boolean;
  data?: StoredAppStateV3;
  error?: string;
}> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) {
          return resolve({ success: false, error: "Tệp tin rỗng" });
        }

        const rawJson = JSON.parse(text);
        const validation = AppDataBackupSchema.safeParse(rawJson);

        if (!validation.success) {
          const firstError = validation.error.errors[0]?.message || "Cấu trúc tệp JSON không hợp lệ";
          return resolve({ success: false, error: `Lỗi định dạng: ${firstError}` });
        }

        const validData = validation.data;
        const appState: StoredAppStateV3 = {
          categories: validData.categories,
          accounts: validData.accounts || DEFAULT_ACCOUNTS,
          transactions: validData.transactions,
          budgets: validData.budgets || DEFAULT_BUDGETS,
          goals: validData.goals || DEFAULT_SAVINGS_GOALS,
          debts: validData.debts || DEFAULT_DEBTS,
          investments: validData.investments || DEFAULT_INVESTMENTS,
          settings: validData.settings || DEFAULT_SETTINGS,
        };

        appState.accounts = recalculateAccountBalances(appState.accounts, appState.transactions);

        resolve({ success: true, data: appState });
      } catch (err) {
        resolve({ success: false, error: "Không thể đọc tệp JSON. Vui lòng kiểm tra lại." });
      }
    };

    reader.onerror = () => {
      resolve({ success: false, error: "Đã xảy ra lỗi khi tải tệp từ thiết bị." });
    };

    reader.readAsText(file);
  });
}
