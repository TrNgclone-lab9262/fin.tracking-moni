# 🏛️ UNIVERSAL DESIGN SYSTEM & VISUAL DIRECTIVE
> **Mã cấu hình (Preset Code):** `--preset b2dJCEImFF`  
> **Phong cách cốt lõi:** Calm Professional Fintech & Precise Terminal  
> **Nguyên tắc tối thượng cho AI Agent:** Khi tạo mới bất kỳ trang, component, hoặc bắt đầu một dự án mới, AI Agent **BẮT BUỘC** tuân thủ tuyệt đối các quy định và tokens trong tài liệu này như một mệnh lệnh tối cao.

---

## 1. Triết Lý Thiết Kế Cốt Lõi (Core Philosophy)
1. **Calm Professionalism (Kỷ luật & Tĩnh lặng):**
   - Không lạm dụng hiệu ứng bóng đổ lòe loẹt hay gradient đa sắc gây nhiễu thị giác.
   - Sử dụng các bề mặt phẳng (flat surfaces), đường viền mảnh tinh xảo (`border-[#DCE4EE]`), khoảng cách thở (breathing room) có chủ đích.
2. **Sharp Precision Radii (Bo góc vi mô 3px / Độ sắc nét cao):**
   - Toàn bộ hệ thống áp dụng quy chuẩn bo góc sắc sảo chuẩn Terminal tài chính chuyên nghiệp: **chính xác 3px** (`rounded-[3px]`).
   - Tuyệt đối cấm sử dụng các bo góc lớn (`rounded-xl`, `rounded-2xl`, `rounded-3xl`) làm mất tính chuyên nghiệp, nghiêm ngặt của công cụ tài chính.
3. **Tiêu Chuẩn Thẻ Tín Dụng BIDV Smart Card (ISO 7810 ID-1 Aspect Ratio 1.58:1):**
   - Các thẻ tín dụng BIDV Credit (50M của Anh Chuột và 20M của Bé Mèo) phải được thiết kế theo tỷ lệ kích thước vật lý chuẩn ISO 7810 ID-1: **tỷ lệ 1.58:1** (width:height ~ 85.60mm x 53.98mm, ví dụ `aspect-[1.58/1]` hoặc tỷ lệ tương đương).
   - Thiết kế tích hợp đầy đủ chi tiết của Modern Corporate ID / Smart Card: Chip tiếp xúc thông minh (EMV Smart Chip kim loại), vạch cảm ứng từ Contactless Wave, Logo tổ chức phát hành (BIDV), dải phân loại (Platinum / Flexi Gold), mã che số thẻ `•••• •••• •••• 5050`, tên chủ thẻ nổi bật in hoa `LE VAN CHUOT / TRAN THI MEO`, và hạn sử dụng `VALID THRU`.
4. **Phối Màu Minh Bạch & Cảm Xúc Gia Đình (Gender Harmony):**
   - Phối hợp giữa sắc xanh Navy/Slate uy nghiêm của trụ cột nam tính với sắc Hồng phấn/Tím hoa cà (Feminine Rose/Fuchsia `#F43F5E` / `#FFF1F2`) thanh lịch, mềm mại cho các yếu tố liên quan đến vợ (Bé Mèo) hoặc chi tiêu tổ ấm.

---

## 2. Bảng Mã Màu Toàn Hệ Thống (Semantic Color Palette)

### 2.1 Bảng Màu Nền & Cấu Trúc (Canvas & Structural)
| Tên Token | Mã Hex | Lớp Tailwind | Ứng Dụng |
| :--- | :--- | :--- | :--- |
| **App Canvas** | `#F6F8FB` | `bg-[#F6F8FB]` | Nền ứng dụng toàn màn hình |
| **Surface Pure** | `#FFFFFF` | `bg-white` | Bề mặt thẻ, bảng điều khiển, hộp thoại |
| **Surface Subtle** | `#F8FAFC` | `bg-slate-50` | Nền input, panel phụ, thanh công cụ |
| **Border Standard** | `#DCE4EE` | `border-[#DCE4EE]` | Đường viền thẻ, form control, bảng dữ liệu |
| **Border Subtle** | `#E9EEF5` | `border-[#E9EEF5]` | Dải phân cách nội dung bên trong thẻ |
| **Focus Ring** | `#2563EB` | `ring-[#2563EB]` | Chỉ báo focus bàn phím chuẩn a11y |

### 2.2 Bảng Màu Thương Hiệu & Trụ Cột (Navy & Active Blue)
| Tên Token | Mã Hex | Lớp Tailwind | Ứng Dụng |
| :--- | :--- | :--- | :--- |
| **Deep Navy (Chủ đạo)** | `#172B4D` | `text-[#172B4D]` / `bg-[#172B4D]` | Sidebar, tiêu đề chính, chỉ số KPI quan trọng |
| **Midnight Navy** | `#0F172A` | `bg-[#0F172A]` | Thẻ Hero, nền tương phản cao |
| **Brand Primary Blue** | `#2563EB` | `bg-[#2563EB]` / `text-[#2563EB]` | Nút hành động chính (Primary CTA), link active |
| **Brand Blue Hover** | `#1D4ED8` | `hover:bg-[#1D4ED8]` | Trạng thái hover của nút bấm |
| **Brand Light Tint** | `#EFF6FF` | `bg-blue-50` | Nền badge active, vùng chọn focus |

### 2.3 Bảng Màu Nữ Tính & Gia Đình (Feminine Rose & Warmth)
| Tên Token | Mã Hex | Lớp Tailwind | Ứng Dụng |
| :--- | :--- | :--- | :--- |
| **Feminine Primary Rose** | `#F43F5E` | `bg-[#F43F5E]` / `text-[#F43F5E]` | Nhãn Bé Mèo, hũ tích lũy cá nhân vợ |
| **Rose Hover / Deep** | `#E11D48` | `hover:bg-[#E11D48]` | Trạng thái tương tác thành phần nữ tính |
| **Blush Soft Tint** | `#FFF1F2` | `bg-rose-50` / `border-rose-200` | Nền thẻ tài khoản của vợ, badge danh mục riêng |
| **Lavender / Fuchsia Hint**| `#A855F7` / `#FAF5FF` | `text-purple-600` / `bg-purple-50`| Chi tiêu làm đẹp, mua sắm, gia đình gắn kết |

### 2.4 Bảng Màu Nghiệp Vụ Tài Chính (Fintech Semantics)
| Tên Token | Mã Hex | Lớp Tailwind | Ý Nghĩa Kế Toán |
| :--- | :--- | :--- | :--- |
| **Income (Thu nhập / Dương)** | `#10B981` | `text-emerald-600` / `bg-emerald-50` | Tiền vào, dòng tiền dương, đạt mục tiêu |
| **Expense (Chi tiêu / Âm)** | `#F43F5E` | `text-rose-600` / `bg-rose-50` | Tiền ra, quẹt thẻ tín dụng, nợ đến hạn |
| **Warning (Cảnh báo)** | `#F59E0B` | `text-amber-600` / `bg-amber-50` | Chạm ngưỡng 70% hạn mức thẻ, ngân sách sắp hết |

---

## 3. Quy Chuẩn Bo Góc Vi Mô (Sharp Precision 3px Radii)
Toàn bộ thành phần UI phải sử dụng class `rounded-[3px]` (hoặc tương đương biến `--radius: 3px`):

```css
/* Token Bo góc Chuẩn Toàn Hệ Thống */
--radius: 3px;
```

| Thành phần UI | Lớp Tailwind Bắt Buộc | Mô Tả |
| :--- | :--- | :--- |
| **Nút bấm (Buttons)** | `rounded-[3px]` | Nút sắc nét, vững chãi chuẩn Fintech |
| **Form Inputs & Select** | `rounded-[3px]` | Ô nhập số liệu chuẩn xác, không bo tròn |
| **Thẻ & Khối Widget** | `rounded-[3px]` | Card viền mảnh `border-[#DCE4EE]` |
| **Hộp thoại (Dialog/Modal)** | `rounded-[3px]` | Cửa sổ hành động kỷ luật, chuyên nghiệp |
| **Nhãn & Badge (Pills)** | `rounded-[3px]` | Huy hiệu phân loại góc vuông tinh tế |
| **Thẻ Tín Dụng BIDV Smart Card** | `aspect-[1.58/1] rounded-[6px]` | Chuẩn ISO 7810 ID-1 (1.58:1) với bo góc chuẩn thẻ vật lý 3.18mm |

---

## 4. Hệ Thống Chữ & Phân Cấp Nội Dung (Typography System)
- **Font chữ chính:** `Inter`, hỗ trợ đầy đủ bộ ký tự tiếng Việt với fallbacks `sans-serif`.
- **Cấu hình font-feature-settings:** `"cv02", "cv03", "cv04", "cv11"` giúp hiển thị số liệu tài chính rõ ràng, thẳng hàng.

| Cấp Bậc | Đặc Tả Tailwind | Mục Đích Sử Dụng |
| :--- | :--- | :--- |
| **H1 - Tiêu đề trang** | `text-xl sm:text-2xl font-bold tracking-tight text-[#172B4D]` | Đầu trang hoặc Dashboard chính |
| **H2 - Tiêu đề phân hệ** | `text-base font-semibold text-[#172B4D]` | Phân khu vực, tiêu đề bảng lớn |
| **H3 - Tiêu đề widget** | `text-sm font-semibold text-[#172B4D]` | Đầu thẻ card, widget phụ trợ |
| **KPI - Số tiền lớn** | `text-2xl sm:text-3xl font-bold tracking-tight text-[#172B4D] tabular-nums` | Tổng tài sản, dư nợ tổng |
| **Body - Nội dung chính** | `text-sm text-slate-700 leading-normal` | Văn bản mô tả, dòng giao dịch |
| **Caption & Labels** | `text-xs font-medium text-slate-500` | Nhãn phụ, thời gian, tên cột |

---

## 5. Quy Chuẩn Khoảng Cách & Lưới (Spacing Rhythm)
- **Hệ cơ số 4px & Nhịp điệu 8px:**
  - Khoảng cách các thành phần con trong component: `gap-2` (8px) hoặc `gap-3` (12px).
  - Khoảng cách giữa các cột/thẻ: `gap-4` (16px) hoặc `gap-5` (20px).
  - Padding nội bộ thẻ Card: `p-4 sm:p-5` (16px - 20px).
  - Padding trang tổng: `p-4 sm:p-6 lg:p-8`.

---

## 6. Mệnh Lệnh Thực Thi Cho AI Agent (AI Operational Directives)
Khi được giao bất kỳ yêu cầu code giao diện nào:
1. **Kiểm tra Preset Code:** Nhận diện `--preset b2dJCEImFF` để tự động kích hoạt bộ token trên.
2. **Không tự ý bo cong:** Tuyệt đối không dùng `rounded-lg`, `rounded-xl`, `rounded-full` (ngoại trừ avatar tròn cá nhân). Luôn dùng `rounded-[2px]`.
3. **Giữ bảng màu sạch:** Tuyệt đối không chèn mã hex tự do bên ngoài bảng màu trên.
4. **Kiểm thử khâu cuối:** Trước khi bàn giao, chạy bộ ba lệnh kiểm thử:
   ```bash
   npx tsc --noEmit && npm run lint && npm run build
   ```

