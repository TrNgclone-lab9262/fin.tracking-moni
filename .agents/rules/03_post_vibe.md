# CỔNG 3: POST-VIBE VERIFICATION & ĐỒNG BỘ TRẠNG THÁI DỰ ÁN

> File này quy định các bước bắt buộc sau khi HOÀN THÀNH SINH MÃ NGUỒN.

---

## 1. Kiểm Thử Biên Dịch Bắt Buộc (Automated Build Test)

Mỗi khi kết thúc việc thêm/sửa code, AI Agent **BẮT BUỘC** chạy lệnh:

```powershell
npm run build
```

### Quy tắc xử lý kết quả:
- **Nếu mã thoát là `0` (`Compiled successfully`):**
  - Chúc mừng! Mã nguồn đã đạt chuẩn TypeScript và Next.js App Router.
- **Nếu mã thoát khác `0` (Có lỗi compile/type/lint):**
  - **TUYỆT ĐỐI KHÔNG DỪNG LẠI HOẶC BÁO CÁO HOÀN THÀNH.**
  - Đọc kỹ log lỗi (file nào, dòng nào, thuộc tính nào bị thiếu hoặc sai type).
  - Tự động sửa chữa ngay lập tức bằng các công cụ chỉnh sửa file.
  - Chạy lại `npm run build` cho đến khi vượt qua 100%.

---

## 2. Quy Trình Cập Nhật State Ledger (`PROJECT_STATE.md`)

Sau khi `npm run build` thành công, AI Agent **BẮT BUỘC** cập nhật tệp `PROJECT_STATE.md`:

1. **Cập nhật Timestamp & Build Status:**
   - Cập nhật dòng `> **Last Synchronized:** [ISO Timestamp]`
   - Xác nhận `> **Build Status:** 🟢 PASSING (npm run build verified)`
2. **Ghi nhận vào Mục `4. Nhật Ký Biến Thiên Vibe Coding`:**
   - Thêm một dòng mới với mã `VIBE-XX`:
     - Tóm tắt mục tiêu thay đổi.
     - Danh sách các file cụ thể đã được thêm mới hoặc chỉnh sửa.
     - Đánh dấu trạng thái `🟢 Verified`.
3. **Cập nhật Danh Sách Files & Cấu Trúc (nếu có file mới):**
   - Nếu có tạo component, hook hoặc view mới, thêm đường dẫn và mô tả ngắn gọn vào cây thư mục ở Mục `1. Bản Đồ Cấu Trúc Toàn Hệ Thống`.

---

## 3. Bàn Giao & Phản Hồi Người Dùng

- Trả lời người dùng ngắn gọn, súc tích.
- Liệt kê các file vừa chỉnh sửa dưới dạng **clickable markdown links** (ví dụ: `[Sidebar.tsx](file:///d:/NTT-2026/dev.app/fi.tracking-moni/components/common/Sidebar.tsx)`).
- Khẳng định rằng toàn bộ hệ thống đã được kiểm thử biên dịch và đồng bộ vào `PROJECT_STATE.md`, sẵn sàng 100% cho lượt vibe coding tiếp theo.
