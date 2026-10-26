# 🌿 TIÊU CHUẨN QUẢN TRỊ MÃ NGUỒN (GIT & GITHUB COLLABORATION)
> Áp dụng cho: Mọi thao tác phân nhánh, commit, đánh thẻ phiên bản và làm việc nhóm/AI trên GitHub repository [TrNgclone-lab9262/fin.tracking-moni](https://github.com/TrNgclone-lab9262/fin.tracking-moni).

---

## 1. Chiến Lược Phân Nhánh (Branching Model)

Dự án áp dụng mô hình **GitHub Flow Tinh Gọn**:
- **`main`:** Nhánh chính duy nhất, đại diện cho bản phát hành ổn định (Production). Chỉ merge vào `main` khi đã chạy `npm run build` không có lỗi.
- **`feat/<tên-tính-năng>`:** Dùng khi phát triển tính năng mới.
  - Ví dụ: `feat/supabase-cloud-sync`, `feat/export-pdf-report`.
- **`fix/<tên-lỗi>`:** Dùng khi sửa lỗi hiển thị hoặc tính toán.
  - Ví dụ: `fix/credit-card-usage-percent`.

---

## 2. Tiêu Chuẩn Commit Message (Conventional Commits)

Mỗi commit phải có tiền tố rõ ràng theo cú pháp:
`<tiền-tố>(<phạm-vi>): <mô tả ngắn gọn bằng tiếng Anh hoặc tiếng Việt>`

### Các loại tiền tố chuẩn:
- `feat`: Tính năng mới cho người dùng.
- `fix`: Sửa lỗi phát sinh trong hệ thống.
- `ui`: Tinh chỉnh giao diện, màu sắc, animation, responsive.
- `docs`: Cập nhật tài liệu, `PROJECT_STATE.md`, `AGENTS.md`.
- `refactor`: Tái cấu trúc mã nguồn mà không đổi hành vi nghiệp vụ.
- `perf`: Tối ưu hóa hiệu năng, giảm dung lượng bộ nhớ.
- `ci`: Thay đổi cấu hình GitHub Actions hoặc kịch bản tự động hóa.

---

## 3. Quy Trình Gắn Tag & Tạo GitHub Release

Mỗi khi hệ thống đạt được một cột mốc lớn (tương ứng với một phiên bản trong `PROJECT_STATE.md`):

1. **Tạo Git Tag tại local:**
   ```bash
   git tag -a v3.4 -m "HOME MONI v3.4: Cloud Sync Supabase & GitHub Actions CI"
   ```
2. **Đẩy Tag lên GitHub:**
   ```bash
   git push origin v3.4
   ```
3. **Tạo Release trên GitHub:**
   - Vào mục **Releases** trên GitHub ➔ Chọn **Draft a new release**.
   - Chọn tag `v3.4`.
   - Copy tóm tắt thay đổi từ `PROJECT_STATE.md` dán vào phần ghi chú phát hành (Release Notes).

---

## 4. Quản Lý Tính Năng Qua GitHub Issues

1. Chuyển các đầu việc trong mục `5. Danh Sách Tính Năng Tiềm Năng` của `PROJECT_STATE.md` thành các **Issues**.
2. Khi commit giải quyết một issue, thêm cú pháp `(closes #ID)` hoặc `(fixes #ID)` vào cuối tin nhắn commit để GitHub tự động đóng issue khi gộp vào `main`.
