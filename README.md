## Chính thức chuyển hướng sang sử dụng Reqwise Figma từ bây giờ (27/10/2026) - đếm ngày #1 đầu tiên


# 🏠 HOME MONI - WebApp Quản lý Tài chính Gia đình (Tổ Ấm 2 Vợ Chồng)

**HOME MONI** (Home Moni) là ứng dụng WebApp Quản lý Tài chính & Chi tiêu Gia đình chuyên sâu, chuẩn Fintech, bảo mật tuyệt đối và tốc độ cao theo kiến trúc **Local-First**, chạy trực tiếp trên trình duyệt bằng **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, và **Recharts**.

Ứng dụng được thiết kế riêng cho **Tổ ấm 2 thành viên: Chồng (Tôi) & Vợ (Bà xã)** với hệ thống quản lý thẻ tín dụng kép BIDV và các tài khoản ngân hàng thực tế.

---

## 👨‍👩‍👧 Cấu Hình Thành Viên & Hệ Thống Tài Khoản Thực Tế

| Thành viên | Tài khoản / Thẻ | Vai trò & Mục đích | Hạn mức / Tính chất |
| :--- | :--- | :--- | :--- |
| **👨 Anh Chuột** | **Vietinbank** | Tài khoản Chính | Nhận lương hàng tháng của Anh Chuột |
| **👨 Anh Chuột** | **BIDV** | Tài khoản Phụ | Chi tiêu thường ngày, sinh hoạt cá nhân |
| **👨 Anh Chuột** | **BIDV Credit (Anh Chuột)** | Thẻ tín dụng | Hạn mức **50.000.000 ₫** (Sao kê 20, Thanh toán 25 hàng tháng) |
| **👩 Bé Mèo** | **Vietcombank** | Tài khoản Chính | Nhận lương hàng tháng của Bé Mèo |
| **👩 Bé Mèo** | **ACB** | Tài khoản Phụ | Chi tiêu thường ngày, mua sắm |
| **👩 Bé Mèo** | **BIDV Credit (Bé Mèo)** | Thẻ tín dụng | Hạn mức **20.000.000 ₫** (Sao kê 20, Thanh toán 25 hàng tháng) |
| **🏡 My Home** | **Tiền mặt Gia đình** | Quỹ chung | Chi tiêu chợ búa, tiền gửi xe, ăn vặt lặt vặt |

---

## ✨ 7 Tính Năng Đột Phá Chuẩn Fintech Cho Gia Đình

### 1. 🔄 Perspective Switcher (Bộ lọc Góc nhìn 3 Chế độ)
Chuyển đổi góc nhìn nhanh ngay trên thanh Sidebar hoặc Header TopBar:
- `🏡 My Home`: Hiển thị toàn bộ bức tranh tài chính hợp nhất của tổ ấm (Tổng thu, tổng chi, tài sản ròng, nợ thẻ 2 người).
- `👨 Anh Chuột`: Báo cáo dòng tiền, ngân sách, tài khoản (Vietinbank, BIDV) và thẻ tín dụng 50tr của Anh Chuột.
- `👩 Bé Mèo`: Báo cáo dòng tiền, ngân sách, tài khoản (Vietcombank, ACB) và thẻ tín dụng 20tr của Bé Mèo.

### 2. 💳 Dual Credit Cards Manager (Quản lý Thẻ Tín Dụng Kép BIDV)
- Theo dõi song song **BIDV Credit Chồng (50.000.000 ₫)** và **BIDV Credit Vợ (20.000.000 ₫)**.
- Hiển thị trực quan: Dư nợ hiện tại, Hạn mức khả dụng, Thước đo tỷ lệ sử dụng (cảnh báo đổi màu khi vượt quá ngưỡng an toàn **70%**).
- Đếm ngược chính xác ngày chốt sao kê và hạn chót thanh toán, giúp hai vợ chồng luôn thanh toán đúng hạn, bảo vệ điểm tín dụng CIC và tránh lãi phạt.

### 3. 📊 Family Cashflow & Spending Calendar Heatmap
- **Biểu đồ tỷ lệ đóng góp thu nhập:** Phân tích trực quan tỷ lệ đóng góp giữa Chồng và Vợ.
- **Lịch nhiệt chi tiêu (Calendar Heatmap 31 ngày):** Hiển thị mật độ dòng tiền chi tiêu theo từng ngày trong tháng, giúp phát hiện ngay các ngày chi tiêu đột biến.

### 4. ⚡ Ghi Chép Siêu Tốc & Bàn Phím Số Mobile (Numpad Shortcuts)
- Gắn thẻ người chi (`👨 Chồng` / `👩 Vợ`) và phạm vi (`🏠 Chung nhà` / `👤 Riêng cá nhân`).
- Bàn phím số Numpad tiện dụng trên điện thoại: Các phím bấm 1 chạm `+000`, `50k`, `100k`, `200k`, `500k` giúp ghi chép giao dịch chỉ mất 3 giây.

### 5. 🎯 Kế Hoạch Tài Chính & Mục Tiêu Tổ Ấm
- **Theo dõi hạn mức ngân sách:** Đặt hạn mức cho Tiền nhà, Ăn uống siêu thị, Điện nước internet, Con cái...
- **Chỉ số độc quyền:** 👉 *"Mỗi ngày còn được tiêu (X ngày): Y VND"* giúp vợ chồng không bị "cháy túi" cuối tháng.
- **Mục tiêu tiết kiệm:** Quỹ dự phòng khẩn cấp gia đình, Du lịch nghỉ dưỡng, Mua sắm nội thất tổ ấm...

### 6. 📱 PWA Ready (Progressive Web App)
- Cài đặt trực tiếp lên màn hình chính (Home Screen) của iPhone, iPad, Android hoặc Desktop như một ứng dụng native.
- Icon cưng, splash screen mượt mà, hỗ trợ thao tác chạm vuốt tối ưu cho mobile.

### 7. 🛡️ Local-First & Bảo Mật Tuyệt Đối
- Dữ liệu lưu trữ 100% trong `localStorage` trên trình duyệt thiết bị cá nhân, **không lưu trữ trên bất kỳ server trung gian nào**.
- Hỗ trợ **1-Click Sao lưu (Export) & Phục hồi (Import) file JSON** với kiểm thực nghiêm ngặt bằng **Zod Schema**.

---

## 🚀 Hướng Dẫn Khởi Chạy

### 1. Khởi chạy môi trường phát triển (Development):
```bash
# Cài đặt thư viện phụ thuộc (nếu chưa cài)
npm install

# Khởi chạy máy chủ phát triển
npm run dev
```

Truy cập ứng dụng tại: **[http://localhost:3000](http://localhost:3000)**

### 2. Kiểm tra biên dịch sản phẩm (Production Build):
```bash
npm run build
npm start
```

---

## 🛠️ Công Nghệ & Kiến Trúc

- **Core Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Lucide Icons + Inter Font
- **Charts & Data Viz:** Recharts (Responsive, Client-side Safe)
- **Validation:** Zod v3
- **Data Persistence:** Browser LocalStorage (Local-First Engine v3)
- **Application Type:** Progressive Web App (PWA Ready)
