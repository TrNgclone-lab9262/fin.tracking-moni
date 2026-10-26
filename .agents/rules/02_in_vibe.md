# CỔNG 2: IN-VIBE STANDARDS & CHUẨN MỰC SINH MÃ NGUỒN

> File này quy định các tiêu chuẩn kỹ thuật bắt buộc trong QUÁ TRÌNH SINH MÃ VÀ SỬA ĐỔI FILE.

---

## 1. Tiêu Chuẩn TypeScript & Clean Code

1. **Tuyệt đối không dùng `any`:**
   - Mọi biến, props, callback và tham số đều phải được định kiểu tường minh từ `types/finance.ts`.
   - Nếu xử lý form input, dùng parse an toàn (ví dụ: `parseFloat(val.replace(/[^0-9]/g, '')) || 0`).
2. **Nguyên tắc Sửa Đổi Khối Nhỏ (Atomic Block Replacements):**
   - Không được thay thế toàn bộ file nếu chỉ cần sửa 1 hoặc vài dòng.
   - Khi dùng tool `edit_file`, luôn đảm bảo chuỗi `Target` bao gồm đầy đủ khoảng trắng và thụt lề chính xác.
3. **Bảo tồn mã nguồn & Comments:**
   - Tuyệt đối không xóa các comments giải thích logic tài chính, các hook hoặc helper function hiện có trừ khi có yêu cầu cụ thể.

---

## 2. Tiêu Chuẩn Giao Diện (UI/UX Design Tokens)

Được kế thừa từ `.agents/skills/home-moni-uiux/SKILL.md`:

1. **Bảng màu Fintech:**
   - `bg-[#1E3A8A]` hoặc `bg-gradient-to-b from-[#1E3A8A] via-[#1D4ED8] to-[#172554]`: Nền Sidebar chính.
   - `bg-blue-600` (`#2563EB`): Nút hành động chính (Primary Action), nút Thêm giao dịch, Thẻ Tài sản ròng.
   - `bg-emerald-500` / `text-emerald-600`: Khoản thu nhập (+), hoàn thành mục tiêu, tỷ lệ tiết kiệm.
   - `bg-rose-500` / `text-rose-600`: Khoản chi tiêu (-), dư nợ thẻ tín dụng, cảnh báo nguy hiểm.
   - `bg-amber-500` / `text-amber-600`: Cảnh báo thẻ tín dụng > 70%, nợ đến hạn, chi tiêu > 80% ngân sách.
2. **Hình khối & Bo góc (Border Radius):**
   - Thẻ hiển thị / Widgets / Modals: `rounded-xl` (12px) kèm `border border-[#DCE4EE]` và `shadow-xs`.
   - Nút bấm (Buttons, CTA, Action Pills): `rounded-md` (6px) kèm hiệu ứng hover/active tinh tế.
   - Ô nhập liệu / Dropdowns / Inputs / Badges: `rounded-lg` (8px).
   - Nút bấm trên mobile: Floating Action Button `fixed bottom-6 right-6 md:hidden w-14 h-14 rounded-full bg-blue-600`.
3. **Recharts SSR Safety:**
   - Mọi component chứa biểu đồ Recharts (`PieChart`, `BarChart`, `LineChart`) **BẮT BUỘC** phải có hook `isMounted`:
     ```tsx
     const [isMounted, setIsMounted] = useState(false);
     useEffect(() => { setIsMounted(true); }, []);
     if (!isMounted) return <div className="h-64 animate-pulse bg-slate-100 rounded-xl" />;
     ```

---

## 3. Trải Nghiệm Mobile-First & Tiện Ích Nhập Liệu

1. **Bàn Phím Số Tiện Dụng (Mobile Numpad):**
   - Khi thiết kế form nhập số tiền, luôn cung cấp các phím bấm nhanh: `+000`, `50k`, `100k`, `200k`, `500k`.
2. **Đồng Bộ Sidebar & Mobile Drawer:**
   - Mọi thay đổi về phân nhóm, biểu tượng hoặc góc nhìn thành viên trên `Sidebar` phải được phản ánh tương ứng vào `MobileDrawer`.
