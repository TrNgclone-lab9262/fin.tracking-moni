import { supabase, isSupabaseConfigured } from './supabaseClient';
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
} from '@/types/finance';
import {
  mapDbToCategory,
  mapCategoryToDb,
  mapDbToAccount,
  mapAccountToDb,
  mapDbToTransaction,
  mapTransactionToDb,
  mapDbToBudget,
  mapBudgetToDb,
  mapDbToGoal,
  mapGoalToDb,
  mapDbToDebt,
  mapDebtToDb,
  mapDbToInvestment,
  mapInvestmentToDb,
  mapDbToSettings,
  mapSettingsToDb,
  mapDbToNotification,
  DbCategory,
  DbAccount,
  DbTransaction,
  DbCategoryBudget,
  DbSavingsGoal,
  DbDebt,
  DbInvestment,
  DbAppSettings,
  DbNotification,
} from './supabaseMappers';

export interface SupabaseFullData {
  categories: Category[];
  accounts: Account[];
  transactions: Transaction[];
  budgets: CategoryBudget[];
  goals: SavingsGoal[];
  debts: DebtItem[];
  investments: InvestmentItem[];
  settings?: AppSettings;
  notifications?: AppNotification[];
}

export const supabaseService = {
  /**
   * Lấy toàn bộ dữ liệu từ Supabase Cloud Database
   */
  async fetchAllData(): Promise<SupabaseFullData | null> {
    if (!supabase || !isSupabaseConfigured) return null;

    try {
      const [
        catRes,
        accRes,
        txRes,
        budgetRes,
        goalRes,
        debtRes,
        invRes,
        settingRes,
        notifRes,
      ] = await Promise.all([
        supabase.from('categories').select('*'),
        supabase.from('accounts').select('*'),
        supabase.from('transactions').select('*').order('date', { ascending: false }),
        supabase.from('category_budgets').select('*'),
        supabase.from('savings_goals').select('*'),
        supabase.from('debts').select('*'),
        supabase.from('investments').select('*'),
        supabase.from('app_settings').select('*').limit(1).maybeSingle(),
        supabase.from('app_notifications').select('*').order('date', { ascending: false }),
      ]);

      if (catRes.error) throw catRes.error;
      if (accRes.error) throw accRes.error;
      if (txRes.error) throw txRes.error;
      if (budgetRes.error) throw budgetRes.error;
      if (goalRes.error) throw goalRes.error;
      if (debtRes.error) throw debtRes.error;
      if (invRes.error) throw invRes.error;

      const categories = (catRes.data as DbCategory[] || []).map(mapDbToCategory);
      const accounts = (accRes.data as DbAccount[] || []).map(mapDbToAccount);
      const transactions = (txRes.data as DbTransaction[] || []).map(mapDbToTransaction);
      const budgets = (budgetRes.data as DbCategoryBudget[] || []).map(mapDbToBudget);
      const goals = (goalRes.data as DbSavingsGoal[] || []).map(mapDbToGoal);
      const debts = (debtRes.data as DbDebt[] || []).map(mapDbToDebt);
      const investments = (invRes.data as DbInvestment[] || []).map(mapDbToInvestment);

      const settings = settingRes.data
        ? mapDbToSettings(settingRes.data as DbAppSettings)
        : undefined;

      const notifications = (notifRes.data as DbNotification[] || []).map(mapDbToNotification);

      return {
        categories,
        accounts,
        transactions,
        budgets,
        goals,
        debts,
        investments,
        settings,
        notifications,
      };
    } catch (error) {
      console.error('Error fetching data from Supabase:', error);
      return null;
    }
  },

  /**
   * Đồng bộ / Lưu giao dịch (Thêm mới hoặc Cập nhật)
   */
  async upsertTransaction(tx: Transaction): Promise<boolean> {
    if (!supabase || !isSupabaseConfigured) return false;
    try {
      const dbRow = mapTransactionToDb(tx);
      const { error } = await supabase.from('transactions').upsert(dbRow, { onConflict: 'id' });
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Failed to upsert transaction to Supabase:', err);
      return false;
    }
  },

  /**
   * Xóa giao dịch
   */
  async deleteTransaction(id: string): Promise<boolean> {
    if (!supabase || !isSupabaseConfigured) return false;
    try {
      const { error } = await supabase.from('transactions').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Failed to delete transaction on Supabase:', err);
      return false;
    }
  },

  /**
   * Cập nhật số dư danh sách tài khoản
   */
  async updateAccounts(accounts: Account[]): Promise<boolean> {
    if (!supabase || !isSupabaseConfigured) return false;
    try {
      const dbRows = accounts.map(mapAccountToDb);
      const { error } = await supabase.from('accounts').upsert(dbRows, { onConflict: 'id' });
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Failed to update accounts on Supabase:', err);
      return false;
    }
  },

  /**
   * Thêm hoặc cập nhật một tài khoản
   */
  async upsertAccount(account: Account): Promise<boolean> {
    if (!supabase || !isSupabaseConfigured) return false;
    try {
      const dbRow = mapAccountToDb(account);
      const { error } = await supabase.from('accounts').upsert(dbRow, { onConflict: 'id' });
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Failed to upsert account on Supabase:', err);
      return false;
    }
  },

  /**
   * Thêm hoặc cập nhật ngân sách danh mục tháng
   */
  async upsertBudget(budget: CategoryBudget): Promise<boolean> {
    if (!supabase || !isSupabaseConfigured) return false;
    try {
      const dbRow = mapBudgetToDb(budget);
      const { error } = await supabase
        .from('category_budgets')
        .upsert(dbRow, { onConflict: 'category_id,month' });
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Failed to upsert budget on Supabase:', err);
      return false;
    }
  },

  /**
   * Thêm hoặc cập nhật Mục tiêu tiết kiệm
   */
  async upsertGoal(goal: SavingsGoal): Promise<boolean> {
    if (!supabase || !isSupabaseConfigured) return false;
    try {
      const dbRow = mapGoalToDb(goal);
      const { error } = await supabase.from('savings_goals').upsert(dbRow, { onConflict: 'id' });
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Failed to upsert goal on Supabase:', err);
      return false;
    }
  },

  /**
   * Xóa Mục tiêu tiết kiệm
   */
  async deleteGoal(id: string): Promise<boolean> {
    if (!supabase || !isSupabaseConfigured) return false;
    try {
      const { error } = await supabase.from('savings_goals').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Failed to delete goal on Supabase:', err);
      return false;
    }
  },

  /**
   * Thêm hoặc cập nhật Khoản nợ
   */
  async upsertDebt(debt: DebtItem): Promise<boolean> {
    if (!supabase || !isSupabaseConfigured) return false;
    try {
      const dbRow = mapDebtToDb(debt);
      const { error } = await supabase.from('debts').upsert(dbRow, { onConflict: 'id' });
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Failed to upsert debt on Supabase:', err);
      return false;
    }
  },

  /**
   * Xóa Khoản nợ
   */
  async deleteDebt(id: string): Promise<boolean> {
    if (!supabase || !isSupabaseConfigured) return false;
    try {
      const { error } = await supabase.from('debts').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Failed to delete debt on Supabase:', err);
      return false;
    }
  },

  /**
   * Thêm hoặc cập nhật Khoản đầu tư
   */
  async upsertInvestment(inv: InvestmentItem): Promise<boolean> {
    if (!supabase || !isSupabaseConfigured) return false;
    try {
      const dbRow = mapInvestmentToDb(inv);
      const { error } = await supabase.from('investments').upsert(dbRow, { onConflict: 'id' });
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Failed to upsert investment on Supabase:', err);
      return false;
    }
  },

  /**
   * Xóa Khoản đầu tư
   */
  async deleteInvestment(id: string): Promise<boolean> {
    if (!supabase || !isSupabaseConfigured) return false;
    try {
      const { error } = await supabase.from('investments').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Failed to delete investment on Supabase:', err);
      return false;
    }
  },

  /**
   * Cập nhật Cài đặt ứng dụng
   */
  async updateSettings(settings: AppSettings): Promise<boolean> {
    if (!supabase || !isSupabaseConfigured) return false;
    try {
      const dbRow = mapSettingsToDb(settings);
      const { error } = await supabase.from('app_settings').upsert(dbRow, { onConflict: 'id' });
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Failed to update app settings on Supabase:', err);
      return false;
    }
  },

  /**
   * Đánh dấu đã đọc thông báo
   */
  async markNotificationRead(id: string): Promise<boolean> {
    if (!supabase || !isSupabaseConfigured) return false;
    try {
      const { error } = await supabase
        .from('app_notifications')
        .update({ read: true })
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Failed to mark notification read on Supabase:', err);
      return false;
    }
  },
};
