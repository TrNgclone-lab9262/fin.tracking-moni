# 🔄 TIÊU CHUẨN ĐỒNG BỘ DỮ LIỆU CLOUD (SUPABASE SYNC)
> Áp dụng cho: Cơ chế đồng bộ hóa dữ liệu tài chính gia đình giữa Local-First (`localStorage`) và Supabase Cloud Database.

---

## 1. Nguyên Tắc Cốt Lõi: Local-First Đồng Hành Cùng Cloud

```mermaid
flowchart TD
    subgraph Client Device (Mobile/Desktop)
        A["Thao tác người dùng (Thêm/Sửa/Xóa)"] --> B["Cập nhật tức thì vào LocalStorage<br/>(HOME_MONI_DATA_V4)"]
        B --> C["Giao diện cập nhật ngay (0ms latency, chạy offline)"]
    end

    subgraph Sync Engine
        B --> D{"Có kết nối mạng &<br/>Cấu hình Supabase?"}
        D -->|Có| E["supabaseService.syncLocalToCloud()"]
        D -->|Không| F["Lưu cờ đợi mạng (Sync Queue)"]
        E --> G["Ghi nhận Supabase Cloud Database"]
    end

    subgraph Supabase Cloud Database
        G --> H["fi_accounts"]
        G --> I["fi_transactions"]
        G --> J["fi_debts_investments"]
        G --> K["fi_budgets"]
        G --> L["fi_savings_goals"]
    end
```

### 3 Điều Răn Bất Biến Về Dữ Liệu:
1. **Không chặn giao diện người dùng:** Mọi thao tác ghi nhận thu chi phải lưu ngay vào `localStorage` để vợ chồng ghi chép tức thì, không bị giật lag nếu mạng 4G yếu.
2. **Nguyên tắc "Append-First / Merge Safely":** Khi tải dữ liệu từ Cloud về máy, không được làm mất các giao dịch vừa tạo tại local.
3. **Phân quyền Chủ thể:** Giữ nguyên danh tính `family_member` (`HUSBAND` / `WIFE` / `SHARED`) và `expense_scope` (`FAMILY` / `PERSONAL`) cho từng bản ghi.

---

## 2. Bảng Ánh Xạ Dữ Liệu (Data Schema Mapping)

Hệ thống quản lý 5 bảng dữ liệu tương ứng:

| Bảng Local (`localStorage`) | Bảng Cloud Supabase | Mục đích & Lưu ý |
| :--- | :--- | :--- |
| `accounts` | `fi_accounts` | 6 tài khoản + quỹ tiền mặt, hạn mức thẻ tín dụng BIDV |
| `transactions` | `fi_transactions` | Toàn bộ giao dịch thu chi của 2 vợ chồng |
| `debtsInvestments` | `fi_debts_investments` | Danh mục nợ vay và các khoản đầu tư tích lũy (Vàng, Sổ tiết kiệm) |
| `monthlyBudgets` | `fi_budgets` | Hạn mức ngân sách chi tiêu tháng theo danh mục |
| `savingsGoals` | `fi_savings_goals` | Các mục tiêu tiết kiệm chung của gia đình |

---

## 3. Tiêu Chuẩn Cho AI Agent Khi Mở Rộng Service
1. Mọi truy vấn Supabase phải đi qua lớp trung gian tại [`lib/supabaseService.ts`](file:///d:/NTT-2026/dev.app/fi.tracking-moni/lib/supabaseService.ts).
2. Mọi chuyển đổi schema giữa giao diện và bảng cơ sở dữ liệu phải định nghĩa trong [`lib/supabaseMappers.ts`](file:///d:/NTT-2026/dev.app/fi.tracking-moni/lib/supabaseMappers.ts).
3. Luôn bọc các lệnh gọi Supabase trong khối `try/catch` an toàn để đảm bảo dù lỗi mạng xảy ra, ứng dụng vẫn hoạt động bình thường trên nền `localStorage`.
