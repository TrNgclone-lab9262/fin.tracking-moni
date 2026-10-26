---
name: lovely-money-uiux
description: >-
  Chuyên gia thiết kế và lập trình UI/UX cho ứng dụng Quản lý Tài chính Cá nhân (LOVELY MONEY).
  Sử dụng skill này khi cần tạo mới, tinh chỉnh, nâng cấp giao diện, biểu đồ Recharts, bảng màu Fintech,
  animation, responsive trên mobile/desktop, hoặc tối ưu hóa trải nghiệm người dùng (UX) theo bộ ảnh tham khảo.
---

# LOVELY MONEY - UI/UX Design & Engineering Skill

Skill này đóng vai trò là **UI/UX Designer & Frontend Architect**, đảm bảo mọi thành phần giao diện của ứng dụng **LOVELY MONEY** luôn đạt chuẩn thẩm mỹ Fintech cao cấp, đồng bộ với bộ tài liệu tham khảo tại `\storage\reference-ux-ui`.

---

## 🎨 1. Hệ thống Design Tokens (Fintech Clean Palette)

### Bảng màu Nhận diện Thương hiệu
- **Primary Navy / Deep Blue:** `#1E3A8A` (Sidebar background, thương hiệu chính)
- **Active Blue:** `#2563EB` (Nút bấm chính, liên kết, số dư, thẻ tài sản ròng)
- **Income Emerald:** `#10B981` / `#059669` (Khoản thu, trạng thái hoàn thành, tỷ lệ tiết kiệm)
- **Expense Rose:** `#F43F5E` / `#E11D48` (Khoản chi, cảnh báo vượt hạn mức, nợ quá hạn)
- **Savings & Warning Amber:** `#F59E0B` / `#D97706` (Tỷ lệ tiết kiệm, cảnh báo nợ đến hạn)
- **Neutral Light Background:** `#F8FAFC` (Slate-50 - nền ứng dụng tạo cảm giác nhẹ nhàng, hiện đại)
- **Card Surfaces:** `#FFFFFF` với border `border-slate-200/80` và shadow `shadow-xs`

### Hình khối & Bo góc (Border Radius)
- **Cards & Widgets:** `rounded-3xl` (1.5rem / 24px) - Bo góc lớn, thân thiện, mềm mại.
- **Buttons & Inputs:** `rounded-xl` (0.75rem / 12px) hoặc `rounded-2xl` (1rem / 16px).
- **Floating Action Button (Mobile):** `rounded-full` (kích thước `w-14 h-14` với shadow lớn `shadow-xl shadow-blue-600/40`).

---

## 📊 2. Quy chuẩn Trực quan hóa Dữ liệu (Recharts)

1. **Donut / PieChart:**
   - Luôn sử dụng tỷ lệ `innerRadius={55-65}` và `outerRadius={80-95}` để tạo khoảng trống tròn ở tâm.
   - **Tâm Donut:** Luôn hiển thị chữ số rút gọn của tổng giá trị (ví dụ: `7.5tr` cho tổng chi, `21.6tr` cho tổng thu, `84.7tr` cho cơ cấu tài sản).
   - **Custom Tooltip:** Phải có backdrop mờ `bg-slate-900/95 backdrop-blur-md`, hiển thị số tiền có định dạng VND `formatVND(val)` và tỷ lệ phần trăm `%`.
2. **BarChart & LineChart:**
   - Trục hoành (`XAxis`) và trục tung (`YAxis`) sử dụng màu trung tính nhạt `#94A3B8`, cỡ chữ `10-11px`.
   - Các cột Bar luôn có bo góc trên `radius={[6, 6, 0, 0]}`.
   - Luôn bọc trong `<ResponsiveContainer width="100%" height="100%">` và kiểm tra cờ `isMounted` để tránh lỗi tính toán kích thước DOM khi render SSR.

---

## 📱 3. Nguyên tắc Trải nghiệm Mobile-First (Mobile UX)

1. **Thao tác một tay (Thumb Zone):**
   - Đặt Floating Action Button (+) ở góc dưới bên phải (`fixed bottom-6 right-6 md:hidden`).
   - Bảng biểu dạng Desktop Table (`overflow-x-auto`) phải có phiên bản thu gọn dạng Thẻ (`Card View`) trên mobile để tránh cuộn ngang gây ức chế.
2. **Bộ lọc trên điện thoại:**
   - Dùng icon phễu hoặc thanh cuộn ngang mượt mà (`overflow-x-auto scrollbar-none`) cho các tab tháng.
3. **Drawer Menu:**
   - Sử dụng hiệu ứng trượt từ bên trái (`slide-in-from-left duration-200`) với nền mờ tối (`bg-black/60 backdrop-blur-xs`).

---

## 💡 4. Quy tắc Nghiệp vụ UX Tài chính

1. **Phân biệt Thu - Chi - Chuyển khoản:**
   - **Chi tiêu:** Số tiền hiển thị kèm dấu âm `-` màu đỏ hồng (`text-rose-600`).
   - **Thu nhập:** Số tiền hiển thị kèm dấu dương `+` màu xanh lá (`text-emerald-600`).
   - **Chuyển khoản:** Số tiền màu xanh dương (`text-blue-600`), không cộng trừ vào dòng thu/chi tổng kỳ.
2. **Cảnh báo Thông minh:**
   - Ngân sách dùng `> 80%` chuyển sang màu cam, `>= 100%` chuyển sang đỏ và đẩy cảnh báo lên chuông thông báo.
   - Nợ còn dưới 7 ngày đến hạn phải tự động gán badge cảnh báo.
3. **An toàn dữ liệu:**
   - Mọi thao tác Xóa (Giao dịch, Tài khoản, Nợ, Mục tiêu) đều **bắt buộc** phải có `ConfirmDialog` xác nhận trước khi xóa trong LocalStorage.
