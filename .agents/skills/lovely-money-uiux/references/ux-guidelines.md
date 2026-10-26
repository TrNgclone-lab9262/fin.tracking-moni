# UX & Interaction Guidelines - LOVELY MONEY

## 1. Nguyên Tắc Trải Nghiệm Người Dùng (UX Principles)

### 1.1. Thấu hiểu dòng tiền (Financial Clarity)
- Người dùng mở app lên phải nắm bắt được tình hình tài chính trong vòng **3 giây** (3-second rule):
  - *Hiện tại tôi còn bao nhiêu tiền?* -> Thẻ Tài sản ròng & Thẻ Số dư.
  - *Tháng này tôi thu chi thế nào?* -> Thẻ Thu nhập & Chi tiêu.
  - *Tôi còn được tiêu bao nhiêu tiền mỗi ngày?* -> Chỉ số Daily Allowance trong Kế hoạch.

### 1.2. Giảm thiểu ma sát khi nhập liệu (Low Friction Data Entry)
- Form nhập giao dịch phải tối giản số lượng click:
  - Mặc định ngày hôm nay.
  - Mặc định loại Chi tiêu (chiếm 85% tần suất nhập liệu).
  - Tự động lọc danh mục tương ứng với Loại Thu/Chi.
  - Tự động định dạng số tiền hàng nghìn (1.000.000) ngay khi người dùng gõ phím.

### 1.3. Phản hồi thị giác tức thì (Instant Visual Feedback)
- Khi thêm, sửa, xóa giao dịch:
  - Số dư các ví cập nhật ngay lập tức không cần tải lại trang.
  - Biểu đồ Donut và thanh tiến độ ngân sách tự động co giãn theo số liệu mới.
  - Các thao tác nguy hiểm (Xóa ví, Xóa mục tiêu, Nạp lại dữ liệu demo) luôn có modal xác nhận rõ ràng với nút đỏ nổi bật.

### 1.4. Trải nghiệm Offline & Lưu trữ An toàn (Local-First Reliability)
- Luôn hiển thị nhãn `🟢 Đã đồng bộ` để người dùng an tâm rằng dữ liệu đã được lưu trữ vào LocalStorage.
- Cung cấp tính năng 1-Click Backup JSON để người dùng dễ dàng chuyển đổi thiết bị hoặc sao lưu định kỳ.
