# UX & Interaction Guidelines — HOME MONI

> Tài liệu hướng dẫn tiêu chuẩn Trải nghiệm Người dùng (UX) và Tương tác (Interaction) cho ứng dụng Quản lý Tài chính Gia đình **HOME MONI**.

---

## 1. Nguyên Tắc Trải Nghiệm Cốt Lõi (Core UX Principles)

### 1.1. Thấu hiểu tài chính trong 3 giây (3-Second Rule)
Khi mở ứng dụng trên điện thoại hoặc máy tính, người dùng phải nắm bắt được bức tranh tài chính ngay lập tức:
- **Tài sản ròng hiện tại của cả nhà là bao nhiêu?** ➔ Thẻ Tài sản ròng (Net Worth) tại hàng KPI đầu trang.
- **Tháng này tổng thu và chi bao nhiêu?** ➔ Thẻ Thu nhập (Emerald) & Chi tiêu (Rose) kèm tỷ lệ tiết kiệm.
- **Hôm nay còn được tiêu bao nhiêu tiền?** ➔ Chỉ số Daily Allowance tại màn hình Kế hoạch ngân sách.

### 1.2. Phân tách minh bạch góc nhìn Gia đình (Family Perspective UX)
- **Góc nhìn `ALL` (🏡 My Home):** Tổng hợp toàn bộ dòng tiền, tài khoản cá nhân của cả 2 vợ chồng và quỹ tiền mặt chung.
- **Góc nhìn `HUSBAND` (👨 Anh Chuột):** Lọc riêng thu nhập, tài khoản Vietinbank, BIDV và thẻ tín dụng BIDV Credit 50M do Anh Chuột đứng tên.
- **Góc nhìn `WIFE` (👩 Bé Mèo):** Lọc riêng thu nhập, tài khoản Vietcombank, ACB và thẻ tín dụng BIDV Credit 20M do Bé Mèo phụ trách.
- **Nguyên tắc tương tác:** Mọi biểu đồ Donut, thanh hạn mức và danh sách giao dịch phải phản hồi đồng bộ tức thì khi người dùng chuyển đổi góc nhìn tại Header `TopBar`.

---

## 2. Chuẩn Mực UX Quản Trị Thẻ Tín Dụng (Dual Credit Cards UX)

### 2.1. Bản chất số dư thẻ tín dụng
- Thẻ tín dụng **KHÔNG PHẢI** là tài sản sẵn có.
- Trường `currentBalance` đại diện cho **DƯ NỢ ĐANG DÙNG**:
  - Giao dịch chi tiêu bằng thẻ ➔ **TĂNG** dư nợ (`currentBalance += amount`).
  - Giao dịch chuyển khoản thanh toán thẻ ➔ **GIẢM** dư nợ (`currentBalance -= amount`).
- **Hạn mức khả dụng (Available):** `limit - currentBalance`.

### 2.2. Chỉ báo trực quan 3 cấp độ (Utilization Gauge)
- **Mức An toàn (`< 70%`):** Thanh tiến độ màu Xanh Navy/Blue hoặc Emerald. Thẻ ở trạng thái chi tiêu lành mạnh.
- **Mức Cảnh báo (`70% - 90%`):** Thanh tiến độ màu Vàng Cam (`#F59E0B`). Gợi ý người dùng hạn chế quẹt thêm.
- **Mức Nguy hiểm (`>= 90%` hoặc vượt hạn mức):** Thanh tiến độ màu Đỏ Hồng (`#F43F5E`), hiển thị badge cảnh báo sát nút hạn mức.

### 2.3. Nhắc nhở chu kỳ sao kê & ngày thanh toán
- **Thẻ 👨 Anh Chuột:** Chốt sao kê ngày 20 hàng tháng, hạn chót thanh toán ngày 25.
- **Thẻ 👩 Bé Mèo:** Chốt sao kê ngày 22 hàng tháng, hạn chót thanh toán ngày 28.
- Trước ngày đến hạn dưới 7 ngày: Tự động hiển thị nhãn đếm ngược số ngày còn lại để hai vợ chồng chủ động thanh toán đúng hạn, tránh phát sinh lãi suất.

---

## 3. Tối Giản Ma Sát Nhập Liệu (Low-Friction Mobile Data Entry)

### 3.1. Form giao dịch thông minh
- Mặc định loại **Chi tiêu** (chiếm trên 85% tần suất nhập liệu hàng ngày).
- Mặc định ngày ghi nhận là **Hôm nay**.
- Tự động lọc danh mục tương ứng với Loại giao dịch (Thu / Chi / Chuyển khoản).
- Tự động định dạng số tiền phân tách hàng nghìn (ví dụ: `150.000 ₫`) theo thời gian thực khi nhập.

### 3.2. Bàn phím số Numpad tiện dụng trên điện thoại
- Cung cấp các nút nạp nhanh mệnh giá phổ biến: `+000`, `50k`, `100k`, `200k`, `500k`.
- Nút bấm lớn, khoảng cách thoải mái trong vùng ngón tay cái (Thumb Zone).
- Nút Floating Action Button (+) luôn ghim tại góc dưới bên phải (`fixed bottom-6 right-6 md:hidden`) để mở form chỉ với 1 chạm.

---

## 4. Trải Nghiệm Hybrid Local-First & Supabase Cloud Sync

### 4.1. Phản hồi thị giác 0ms (Optimistic UI)
- Mọi thao tác thêm/sửa/xóa giao dịch hoặc đổi góc nhìn đều cập nhật giao diện và lưu ngay vào `localStorage` (`HOME_MONI_DATA_V4`) với độ trễ 0ms.
- Tác vụ đồng bộ nền hai chiều với Supabase Cloud Database diễn ra tự động mà không làm đơ giật giao diện của người dùng.

### 4.2. Chỉ báo trạng thái kết nối Cloud (TopBar Badge)
- `🟢 Cloud Realtime`: Kết nối thông suốt, dữ liệu trên máy tính và điện thoại đã đồng bộ thời gian thực.
- `🟡 Đồng bộ cục bộ`: Đang có thay đổi lưu trên máy, chuẩn bị đẩy lên Supabase hoặc chế độ offline tạm thời.
- `🔴 Ngoại tuyến`: Mất kết nối mạng internet. Ứng dụng vẫn cho phép nhập thu chi bình thường và sẽ tự đồng bộ khi có mạng trở lại.

---

## 5. An Toàn Dữ Liệu & Xác Nhận Thao Tác Nguy Hiểm

1. **Hộp thoại xác nhận an toàn (`ConfirmDialog`):**
   - Mọi thao tác Xóa (giao dịch, tài khoản, khoản nợ, mục tiêu) hoặc Nạp lại dữ liệu demo đều bắt buộc hiển thị hộp thoại xác nhận với nút hành động màu đỏ cảnh báo.
2. **Sao lưu & Khôi phục 1 chạm (Export/Import JSON):**
   - Hỗ trợ xuất toàn bộ dữ liệu dự phòng ra tệp JSON chuẩn hóa.
   - Khi khôi phục: Luôn chạy qua bộ lọc kiểm thực Schema Zod nghiêm ngặt để ngăn chặn file hỏng hoặc sai cấu trúc làm lỗi ứng dụng.
