# Kế Hoạch Chuyển Đổi & Triển Khai (Implementation Plan)
## Nền Tảng Quản Lý Tài Chính Gia Đình: **HOME MONI** (Home Moni)
### *"Tổ ấm hạnh phúc - Tài chính minh bạch - Vun vén tương lai"*

**Mentor & Lead Full-Stack Engineer:** Antigravity  
**Chủ thể sử dụng:** Gia đình 2 thành viên (**Chồng - Tôi** & **Vợ - Bà xã**)  
**Tên thương hiệu:** **HOME MONI** (Home Moni)  
**Mục tiêu chuyển đổi:** Tái cấu trúc toàn diện sang ứng dụng **Gia Đình Song Hành (`HOME MONI`)**, cấu hình chính xác 6 tài khoản ngân hàng và 2 thẻ tín dụng BIDV của 2 vợ chồng, bổ sung cơ chế phân loại thành viên, quỹ chung, và các tính năng UI/UX Fintech hiện đại.

---

## 1. Tên Thương Hiệu Mới & Định Vị Trải Nghiệm (Branding & UX)

- **Tên chính thức:** **HOME MONI** (Home Moni)
  - *Ý nghĩa:* Vừa giữ được âm điệu *"Moni"* thân thương, vừa thể hiện rõ bản chất *"Home - Mái ấm gia đình"*, ấm áp, dễ thương và rất gọn gàng.
- **Biểu tượng:** Ngôi nhà kết hợp trái tim và hai đồng xu đan xen (đại diện cho 2 vợ chồng cùng chung tay xây dựng tài chính).
- **Góc nhìn tài chính đa chiều (Perspective Switcher):**
  - `👨‍👩‍👧 Cả Nhà (Tổng hợp)`: Bức tranh tài sản ròng, tổng thu chi và ngân sách của toàn gia đình.
  - `👨 Chồng (Tôi)`: Góc nhìn chi tiết các tài khoản, chi tiêu và thẻ tín dụng của Chồng.
  - `👩 Vợ (Bà xã)`: Góc nhìn chi tiết các tài khoản, chi tiêu và thẻ tín dụng của Vợ.

---

## 2. Cấu Trúc Hệ Thống Tài Khoản Thực Tế Của Gia Đình

Thiết lập chính xác **6 tài khoản cốt lõi** theo yêu cầu của gia đình:

| STT | Tên Tài Khoản | Chủ Sở Hữu | Vai Trò | Hạn Mức / Phân Loại | Mã Màu Nhận Diện |
|:---:|:---|:---:|:---|:---:|:---:|
| 1 | **Vietinbank (Lương)** | Chồng | Chính - Nhận Salary Chồng | Tài khoản thanh toán | `#005CA9` (Xanh Vietinbank) |
| 2 | **BIDV (Chi tiêu)** | Chồng | Phụ - Chi tiêu thường ngày | Tài khoản thanh toán | `#0A6E3F` (Xanh BIDV) |
| 3 | **BIDV Credit (Chồng)** | Chồng | Thẻ tín dụng mua sắm / trả sau | **Hạn mức: 50.000.000 ₫** | `#1E3A8A` (Xanh Navy BIDV) |
| 4 | **Vietcombank (Lương)** | Vợ | Chính - Nhận Salary Vợ | Tài khoản thanh toán | `#008542` (Xanh lá VCB) |
| 5 | **ACB (Chi tiêu)** | Vợ | Phụ - Chi tiêu thường ngày / đi chợ | Tài khoản thanh toán | `#0060AF` (Xanh dương ACB) |
| 6 | **BIDV Credit (Vợ)** | Vợ | Thẻ tín dụng mua sắm / trả sau | **Hạn mức: 20.000.000 ₫** | `#D97706` (Vàng hổ phách BIDV) |
| *7* | *Tiền mặt Gia đình* | *Chung* | *Chi tiêu lặt vặt trong nhà* | *Quỹ tiền mặt gia đình* | `#10B981` (Xanh ngọc) |

---

## 3. Tái Cấu Trúc Mô Hình Dữ Liệu (TypeScript Schemas)

### 3.1. Thành viên gia đình (Family Member)
```typescript
export type FamilyMember = 'HUSBAND' | 'WIFE' | 'SHARED';
export type ExpenseScope = 'FAMILY' | 'PERSONAL'; // Chi tiêu việc chung hay riêng
```

### 3.2. Cấu trúc Tài khoản mở rộng (Account with Credit Limits)
```typescript
export interface Account {
  id: string;
  name: string;
  owner: FamilyMember;       // Chồng | Vợ | Chung
  type: 'BANK' | 'CREDIT_CARD' | 'CASH';
  isSalaryAccount?: boolean; // Đánh dấu tài khoản nhận lương chính
  creditLimit?: number;      // 50.000.000 ₫ (Chồng) hoặc 20.000.000 ₫ (Vợ)
  initialBalance: number;
  currentBalance: number;    // Đối với thẻ tín dụng: dư nợ đang dùng
  accountNumber?: string;
  color: string;
  icon?: string;
}
```

### 3.3. Giao dịch Gia đình (Family Transaction)
```typescript
export interface Transaction {
  id: string;
  amount: number;
  date: string;               // YYYY-MM-DD
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  categoryId: string;
  accountId: string;          // Ví nguồn
  toAccountId?: string;       // Ví đích (chuyển tiền giữa 2 vợ chồng hoặc nạp thẻ)
  memberId: FamilyMember;     // Ai là người thực hiện (Chồng hay Vợ)
  scope: ExpenseScope;        // Phục vụ cá nhân hay việc chung cả nhà
  note?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## 4. Các Tính Năng Đột Phá Được Tích Hợp (UX Innovations)

1. **Bộ Chuyển Đổi Thành Viên (Member Perspective Switcher):**
   - Nằm ngay thanh điều hướng trên cùng với avatar hoạt họa dễ thương của 2 vợ chồng: `[ 👨‍👩‍👧 Cả Nhà | 👨 Chồng | 👩 Vợ ]`.
   - Khi chọn Chồng: Dashboard lọc toàn bộ số dư, thẻ tín dụng BIDV 50tr, lương Vietinbank và các khoản chi của Chồng.
   - Khi chọn Vợ: Dashboard tập trung vào lương Vietcombank, thẻ ACB, thẻ tín dụng BIDV 20tr và chi tiêu của Vợ.
   - Khi chọn Cả Nhà: Thể hiện bức tranh tổng hợp sức khỏe tài chính toàn gia đình.
2. **Quản lý Thẻ Tín Dụng Chuyên Sâu (Dual Credit Cards Manager):**
   - Widget theo dõi riêng cho **2 thẻ BIDV Credit**:
     - Thẻ Chồng: Đã dùng `X / 50.000.000 ₫` (Hạn mức còn lại, tỷ lệ sử dụng an toàn < 30%).
     - Thẻ Vợ: Đã dùng `Y / 20.000.000 ₫`.
     - Cảnh báo ngày sao kê và hạn thanh toán để tránh phát sinh lãi thẻ.
3. **Number Counter Animation:**
   - Các con số số dư và tổng chi nhảy mượt mà (smooth counter) khi đổi tháng hoặc thêm giao dịch.
4. **Biểu Đồ Đóng Góp & Dòng Tiền Gia Đình:**
   - Mô phỏng trực quan cơ cấu thu nhập lương Chồng + lương Vợ, và chi tiêu gia đình vs chi tiêu riêng từng người.
5. **Lịch Chi Tiêu Tổ Ấm (Calendar Heatmap):**
   - Lịch 30 ngày trong tháng hiển thị ngày nào gia đình chi tiêu tiết kiệm (xanh) hoặc có khoản chi lớn (cam/đỏ).
6. **Bàn Phím Số Numpad Nhanh trên Mobile:**
   - Tích hợp phím bấm `+000`, `50k`, `100k`, `200k`, `500k` giúp vợ chồng ghi nhanh giao dịch chỉ mất 3 giây.
7. **PWA (Progressive Web App):**
   - Hỗ trợ cả 2 vợ chồng cài ứng dụng lên màn hình chính điện thoại (iPhone & Android) dùng mượt như ứng dụng gốc, lưu LocalStorage độc lập và bảo mật.

---

## 5. Lộ Trình Triển Khai Chi Tiết (Đã Hoàn Thành 100%)

- [x] **Bước 1:** Cập nhật tệp `implementation_plan.md` sang tên chính thức **HOME MONI**.
- [x] **Bước 2:** Cập nhật Data Models `types/finance.ts` bổ sung `FamilyMember`, `ExpenseScope`, `creditLimit`, `owner`.
- [x] **Bước 3:** Cập nhật `constants/mockData.ts` thiết lập chính xác 6 tài khoản ngân hàng và thẻ tín dụng BIDV của 2 vợ chồng, kèm các giao dịch gia đình tháng 10/2026.
- [x] **Bước 4:** Cập nhật `lib/storage.ts` tính toán số dư từng ví và dư nợ thẻ tín dụng.
- [x] **Bước 5:** Nâng cấp `FinanceContext.tsx` quản lý bộ lọc góc nhìn `activePerspective` (`ALL` | `HUSBAND` | `WIFE`), và các selectors tương ứng.
- [x] **Bước 6:** Xây dựng Component **DualCreditCardsWidget** quản lý 2 thẻ BIDV Credit 50tr & 20tr.
- [x] **Bước 7:** Xây dựng Component **FamilyCashflowWidget** & **CalendarHeatmap**.
- [x] **Bước 8:** Cập nhật `TopBar`, `Sidebar`, `MobileDrawer` với thương hiệu **HOME MONI** và thanh chuyển đổi góc nhìn `[ 👨‍👩‍👧 Cả Nhà | 👨 Chồng | 👩 Vợ ]`.
- [x] **Bước 9:** Nâng cấp `TransactionFormModal` với lựa chọn thành viên (Chồng/Vợ) và phím tắt Numpad trên mobile.
- [x] **Bước 10:** Nâng cấp `AccountsView`, `PlanningView`, `TransactionsView` theo phong cách gia đình.
- [x] **Bước 11:** Thiết lập PWA (`manifest.json`, icons, meta tags).
- [x] **Bước 12:** Build kiểm thử `npm run build` hoàn thiện 100%.
