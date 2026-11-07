# 🧩 TIÊU CHUẨN KỸ THUẬT: QUẢN TRỊ & TÍCH HỢP SHADCN/UI (SHADCN/UI PROTOCOL)
> **Mã tiêu chuẩn:** `STD-08-SHADCN-UI`  
> **Áp dụng:** Bắt buộc cho toàn bộ AI Agent khi thêm, sửa hoặc tùy biến component từ shadcn/ui trong dự án **HOME MONI**.

---

## 1. Bối Cảnh Kiến Trúc & Cảnh Báo Xung Đột Phiên Bản (Critical Knowledge)
> [!CAUTION]
> **Bẫy Xung Đột Phiên Bản (Tailwind v3 vs shadcn v3/base-nova):**
> - Dự án HOME MONI chạy **Next.js 14 App Router** và **Tailwind CSS 3.4**.
> - Lệnh mặc định `npx shadcn@latest init` hiện nay có thể tự đề xuất style `base-nova` sử dụng cú pháp `@import "shadcn/tailwind.css"` và thư viện `@base-ui`. Điều này **GÂY LỖI BIÊN DỊCH NGAY LẬP TỨC** trên Tailwind CSS 3.
> - **Nguyên tắc vĩnh cửu:** Luôn khóa cấu hình style ở mức `default` (tương thích Tailwind v3), sử dụng `@radix-ui/react-slot`, `class-variance-authority` (cva), và hàm `cn()` từ `@/lib/utils`.

---

## 2. Bản Đồ Cấu Trúc File & Quy Ước Đặt Chỗ
- **File cấu hình gốc:** [`components.json`](file:///d:/NTT-2026/dev.app/fi.tracking-moni/components.json)
  - `style`: `"default"`
  - `tailwind.config`: `"tailwind.config.ts"`
  - `tailwind.css`: `"app/globals.css"`
  - `aliases.ui`: `"@/components/ui"`
  - `aliases.utils`: `"@/lib/utils"`
- **Thư mục Component:** Toàn bộ component UI do shadcn sinh ra bắt buộc nằm tại [`components/ui/`](file:///d:/NTT-2026/dev.app/fi.tracking-moni/components/ui/).
- **Hàm tiện ích:** [`lib/utils.ts`](file:///d:/NTT-2026/dev.app/fi.tracking-moni/lib/utils.ts) dùng `clsx` kết hợp `tailwind-merge`.

---

## 3. Quy Trình 3 Bước Thêm Component shadcn/ui An Toàn
1. **Bước 1: Cài đặt qua CLI hoặc tạo Component chuẩn Radix UI:**
   ```bash
   npx shadcn@latest add <component-name>
   ```
2. **Bước 2: Audit Tương Thích & Token Purity:**
   - Kiểm tra mã nguồn component vừa sinh ra:
     - Đảm bảo dùng `@radix-ui` primitives và `cva`.
     - Tuyệt đối không import các package chưa hỗ trợ trong Tailwind v3 (như `@base-ui`).
     - Ánh xạ đúng tokens bo góc: `rounded-md` (6px) cho buttons, `rounded-lg` (8px) cho input/badge, `rounded-xl` (12px) cho card/modal.
3. **Bước 3: Xác Thực Biên Dịch Bắt Buộc:**
   - Chạy `npx tsc --noEmit && npm run lint && npm run build` để đảm bảo không có bất kỳ regression bug nào trước khi bàn giao.

---

## 4. Tự Học & Khắc Phục Lỗi (Self-Correction Matrix)
| Lỗi Gặp Phải | Nguyên Nhân | Giải Pháp Đã Được Thẩm Định |
| :--- | :--- | :--- |
| `Unknown font Geist` trong `app/layout.tsx` | CLI shadcn tự ý thay font Inter thành Geist | Giữ nguyên font `Inter` từ `next/font/google`, truyền biến `--font-sans` |
| `border-border does not exist` | globals.css bị chèn `@import "shadcn/tailwind.css"` | Giữ `@tailwind base; components; utilities;` và khai báo CSS variables chuẩn HSL |
| CLI treo interactive prompt khi add | Thiếu cờ xác nhận hoặc xung đột npm network | Tự bổ sung package Radix tương ứng + tạo component file sạch chuẩn Radix + cva |

