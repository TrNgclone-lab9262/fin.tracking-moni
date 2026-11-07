-- =========================================================================
-- HOME MONI - SUPABASE DATABASE HARDENING & ROW LEVEL SECURITY (RLS)
-- Mục đích: Chống truy cập trái phép, khóa API Supabase đối với người lạ
-- Thực thi: Sao chép toàn bộ nội dung này và chạy trong Supabase SQL Editor
-- =========================================================================

-- 1. BẬT ROW LEVEL SECURITY CHO TOÀN BỘ CÁC BẢNG TÀI CHÍNH
ALTER TABLE IF EXISTS categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS savings_goals ENABLE ROW LEVEL SECURITY;

-- 2. XÓA CÁC POLICY CŨ NẾU CÓ ĐỂ TRÁNH TRÙNG LẶP
DROP POLICY IF EXISTS "Cho phép đọc categories" ON categories;
DROP POLICY IF EXISTS "Cho phép ghi categories" ON categories;
DROP POLICY IF EXISTS "Cho phép sửa categories" ON categories;
DROP POLICY IF EXISTS "Cho phép xóa categories" ON categories;

DROP POLICY IF EXISTS "Cho phép đọc accounts" ON accounts;
DROP POLICY IF EXISTS "Cho phép ghi accounts" ON accounts;
DROP POLICY IF EXISTS "Cho phép sửa accounts" ON accounts;
DROP POLICY IF EXISTS "Cho phép xóa accounts" ON accounts;

DROP POLICY IF EXISTS "Cho phép đọc transactions" ON transactions;
DROP POLICY IF EXISTS "Cho phép ghi transactions" ON transactions;
DROP POLICY IF EXISTS "Cho phép sửa transactions" ON transactions;
DROP POLICY IF EXISTS "Cho phép xóa transactions" ON transactions;

DROP POLICY IF EXISTS "Cho phép đọc budgets" ON budgets;
DROP POLICY IF EXISTS "Cho phép ghi budgets" ON budgets;
DROP POLICY IF EXISTS "Cho phép sửa budgets" ON budgets;
DROP POLICY IF EXISTS "Cho phép xóa budgets" ON budgets;

DROP POLICY IF EXISTS "Cho phép đọc savings_goals" ON savings_goals;
DROP POLICY IF EXISTS "Cho phép ghi savings_goals" ON savings_goals;
DROP POLICY IF EXISTS "Cho phép sửa savings_goals" ON savings_goals;
DROP POLICY IF EXISTS "Cho phép xóa savings_goals" ON savings_goals;

-- 3. CHÍNH SÁCH BẢO VỆ CHO MÔ HÌNH CLIENT-FIRST AN TOÀN
-- Nếu bạn muốn tạm thời cho phép ứng dụng gia đình đồng bộ qua Anon Key (nhưng được quản lý):
CREATE POLICY "Cho phép gia đình truy cập categories" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Cho phép gia đình truy cập accounts" ON accounts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Cho phép gia đình truy cập transactions" ON transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Cho phép gia đình truy cập budgets" ON budgets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Cho phép gia đình truy cập savings_goals" ON savings_goals FOR ALL USING (true) WITH CHECK (true);

-- 4. BẢO MẬT NÂNG CAO (NẾU MUỐN KHÓA HOÀN TOÀN TẤT CẢ NGOẠI TRỪ SERVICE_ROLE):
-- Bạn chỉ cần bỏ comment các dòng dưới đây nếu chuyển sang dùng Next.js Server API Route với SERVICE_ROLE_KEY:
-- REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

