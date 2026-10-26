# 🚀 TIÊU CHUẨN TỰ ĐỘNG HÓA CI/CD (GITHUB ACTIONS)
> Áp dụng cho: Toàn bộ quá trình kiểm thử, build và tích hợp mã nguồn dự án **HOME MONI**.

---

## 1. Cơ Chế Hoạt Động Của GitHub Actions CI

Hệ thống CI tự động chạy thông qua workflow cấu hình tại [`.github/workflows/ci.yml`](file:///d:/NTT-2026/dev.app/fi.tracking-moni/.github/workflows/ci.yml):
- **Sự kiện kích hoạt:**
  - Mỗi khi có lệnh `git push` lên nhánh `main`.
  - Mỗi khi có `Pull Request` tạo vào nhánh `main`.
- **Môi trường thực thi:**
  - Máy ảo `ubuntu-latest`.
  - Node.js phiên bản `20.x` (khớp với môi trường phát triển hiện đại của Next.js 14).
  - Cài đặt phụ thuộc bằng `npm ci` (đảm bảo tính nhất quán tuyệt đối theo `package-lock.json`).

---

## 2. Tiêu Chuẩn Cho AI Agent & Lập Trình Viên Trước Khi Push

Mọi AI Agent hoặc lập trình viên trước khi tạo commit hoặc yêu cầu người dùng push code **BẮT BUỘC** phải:
1. Chạy lệnh kiểm thử biên dịch local:
   ```bash
   npm run build
   ```
2. Đảm bảo mã kết thúc là `0` và tạo đủ `4/4 static pages`.
3. Tuyệt đối không đẩy mã có lỗi TypeScript (cấm dùng `any`, cấm thiếu import, cấm sai kiểu dữ liệu).

---

## 3. Quản Lý Biến Môi Trường & GitHub Secrets

Trong file workflow, các biến môi trường cho Supabase được cấu hình với cơ chế **Fallback an toàn**:
```yaml
env:
  NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co' }}
  NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key' }}
```
- **Mục đích:** Giúp quá trình build tĩnh trên GitHub Actions luôn thành công 100%, kể cả khi người dùng chưa kịp cài đặt GitHub Secrets trong Settings.
- **Nếu muốn thêm Secret thật:**
  Vào GitHub Repo -> **Settings** -> **Secrets and variables** -> **Actions** -> Bấm **New repository secret**:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 4. Quy Trình Xử Lý Khi CI Báo Đỏ ❌

Nếu một lần push bị CI báo đỏ trên GitHub Actions:
1. Bấm vào tab **Actions** trên GitHub để xem bước nào bị fail (thường là bước `Verify Next.js Production Build`).
2. Đọc log lỗi cụ thể (ví dụ: gãy kiểu component, thiếu icon, sai cú pháp import).
3. Sửa lỗi tại local, chạy lại `npm run build` xác nhận pass, sau đó commit và push bản sửa lỗi lên `main`.
