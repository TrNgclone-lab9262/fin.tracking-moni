# Design Tokens & Component Specs - LOVELY MONEY

## 1. Color Palette

| Token | Hex | Tailwind Class | Sử dụng |
|:---|:---|:---|:---|
| Primary Brand | `#1E3A8A` | `bg-[#1E3A8A]` | Sidebar background |
| Brand Accent | `#2563EB` | `bg-blue-600` | Primary buttons, Active items, Link |
| Income / Positive | `#10B981` | `bg-emerald-500`, `text-emerald-600` | Tiền thu, Đạt mục tiêu, Lợi nhuận |
| Expense / Negative | `#F43F5E` | `bg-rose-500`, `text-rose-600` | Tiền chi, Khoản nợ còn tồn |
| Warning / Amber | `#F59E0B` | `bg-amber-500`, `text-amber-600` | Tỷ lệ tiết kiệm, Sắp hết hạn |
| Surface Light | `#FFFFFF` | `bg-white` | Card container background |
| App Canvas | `#F8FAFC` | `bg-[#F8FAFC]` | Body background (Slate-50) |
| Border Subdued | `#F1F5F9` | `border-slate-100` | Card internal dividers |
| Border Standard | `#E2E8F0` | `border-slate-200/80` | Card external boundaries |

## 2. Typography Hierarchy

- **Page Titles / Major Headings:** `text-xl sm:text-2xl font-black text-slate-900 tracking-tight`
- **Section Headings:** `text-base font-bold text-slate-800`
- **Metric Big Numbers:** `text-2xl sm:text-3xl font-black tracking-tight`
- **Form Amount Input:** `text-3xl sm:text-4xl font-black text-slate-900`
- **Label / Subtext:** `text-xs font-semibold text-slate-500 uppercase tracking-wider`
- **Body / Metadata:** `text-xs text-slate-400 font-medium`

## 3. Shadows & Radii

- Cards: `rounded-3xl shadow-xs border border-slate-200/80`
- Buttons: `rounded-xl font-bold shadow-xs active:scale-95 transition-all`
- Dropdowns / Inputs: `rounded-xl border border-slate-200 bg-slate-50 focus:border-blue-500`
- Modals: `rounded-3xl shadow-2xl border border-slate-100`
