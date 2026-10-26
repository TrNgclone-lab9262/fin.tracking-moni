# Design Tokens & Component Specs — HOME MONI

## 1. Design Philosophy

**Direction:** Calm Premium Fintech  
**Principles:** Clarity, Trust, Consistency, Delight.

- Use flat surfaces, restrained shadows, subtle borders, and intentional whitespace.
- Prioritize financial readability over decoration.
- Use semantic colors consistently across cards, charts, transactions, and alerts.
- Avoid excessive gradients, oversized radii, unnecessary visual effects, and competing accent colors.
- Preserve existing business logic and functionality during visual refactoring.

## 2. Color Palette

| Token | Hex | Tailwind Class | Usage |
|---|---|---|---|
| Primary Navy | `#172B4D` | `bg-[#172B4D]` | Sidebar, primary headings |
| Brand Blue | `#3978F6` | `bg-[#3978F6]` | Primary CTA, active navigation, links |
| Income / Positive | `#158566` | `text-[#158566]` | Income, positive balances, completed goals |
| Expense / Negative | `#D94F65` | `text-[#D94F65]` | Expenses, overdue debt, negative balances |
| Warning / Amber | `#B7791F` | `text-[#B7791F]` | Budget warnings, upcoming deadlines |
| App Canvas | `#F6F8FB` | `bg-[#F6F8FB]` | Main application background |
| Surface | `#FFFFFF` | `bg-white` | Cards, dialogs, dropdowns |
| Surface Subtle | `#F1F5F9` | `bg-slate-100` | Secondary panels, input backgrounds |
| Text Primary | `#172B4D` | `text-[#172B4D]` | Main content and financial values |
| Text Secondary | `#526178` | `text-[#526178]` | Supporting text and descriptions |
| Text Muted | `#64748B` | `text-slate-500` | Metadata and secondary labels |
| Border Subtle | `#E9EEF5` | `border-[#E9EEF5]` | Internal dividers |
| Border Standard | `#DCE4EE` | `border-[#DCE4EE]` | Card boundaries and form controls |
| Focus Ring | `#3978F6` | `ring-[#3978F6]` | Keyboard focus and accessible controls |

### Color Usage Rules

- Use navy and neutral surfaces as the dominant visual foundation.
- Use blue for actions and interactive states, not every highlighted metric.
- Use emerald for income and positive financial outcomes.
- Use rose for expenses, negative balances, and critical warnings.
- Use amber for approaching limits and deadlines.
- Never communicate financial status using color alone; pair it with labels, icons, signs, or status text.
- Avoid using low-contrast muted text for essential financial information.
- Use darker semantic colors for text and appropriately tested lighter tints for backgrounds.
- Verify text and control contrast against WCAG 2.2 AA requirements.

## 3. Typography Hierarchy

**Font family:** Inter, with a sans-serif fallback.

| Element | Tailwind Specification | Purpose |
|---|---|---|
| Page Title | `text-xl sm:text-2xl font-bold tracking-tight text-[#172B4D]` | Main page heading |
| Section Heading | `text-base font-semibold text-[#172B4D]` | Section titles |
| Card Heading | `text-sm font-semibold text-[#172B4D]` | Widget and card titles |
| Primary Metric | `text-2xl sm:text-3xl font-bold tracking-tight` | Total balance and major KPIs |
| Form Amount | `text-3xl sm:text-4xl font-bold tracking-tight` | Transaction amount entry |
| Body | `text-sm text-slate-700` | Main descriptions |
| Label | `text-xs font-medium text-slate-600` | Form and chart labels |
| Metadata | `text-xs text-slate-500` | Timestamps and supporting details |

### Typography Rules

- Reserve `font-bold` or heavier weights for important headings and financial values.
- Avoid `font-black` as the default.
- Use sentence case for labels and headings; avoid excessive uppercase tracking.
- Prevent currency values from wrapping or clipping.
- Use consistent Vietnamese number formatting and the `vi-VN` locale for VND.
- Ensure small labels remain readable at normal zoom and on mobile.

## 4. Spacing & Layout

- Base spacing unit: 4px.
- Prefer an 8px spacing rhythm for major layout decisions.
- Page padding: 16px on small screens; 24–32px on desktop.
- Card padding: 16–24px, adjusted to component density.
- Section spacing: 24–32px.
- Use consistent grid gaps and alignment across sibling components.
- Avoid unnecessary separators and excessive empty space inside data-dense widgets.

## 5. Borders, Radii & Shadows

### Quy chuẩn Bo góc Nhất quán Toàn Hệ thống (Standard Border Radii)
- **Cards, Widgets & Modals:** `rounded-xl` (12px / 0.75rem) kèm `border border-[#DCE4EE] bg-white shadow-xs`.
- **Buttons (Primary, Secondary, Filter, Toggle):** `rounded-md` (6px / 0.375rem) kèm `transition-all duration-150`.
- **Controls & Còn lại (Inputs, Selects, Dropdowns, Badges, Sub-panels):** `rounded-lg` (8px / 0.5rem).

### Cards and Widgets
`rounded-xl border border-[#DCE4EE] bg-white shadow-xs`

- Standard card radius: 12px (`rounded-xl`).
- Use consistent padding and alignment across equivalent cards.
- Avoid large decorative shadows; prefer subtle hairline borders `border-[#DCE4EE]` or `border-[#E9EEF5]`.
- Modals and overlay dialogs: `rounded-xl border border-[#DCE4EE] shadow-xl`.

### Buttons
`rounded-md font-semibold transition-all duration-150`

- Standard button radius: 6px (`rounded-md`).
- Minimum recommended height: 38-40px for standard controls.
- Prefer 44px for primary mobile actions.
- Use clear hover, active, disabled, loading, and focus-visible states.

### Form Inputs, Dropdowns & Badges
`rounded-lg border border-[#DCE4EE] bg-slate-50/50`

- Input & Select radius: 8px (`rounded-lg`).
- Status badges and pills: `rounded-lg` (hoặc `rounded-full` cho chấm trạng thái tròn).

### Inputs and Dropdowns

`rounded-xl border border-[#DCE4EE] bg-white`

- Use a visible focus ring.
- Show validation messages next to the relevant fields.
- Preserve entered values when validation fails.
- Distinguish disabled, read-only, invalid, and loading states.

### Modals and Drawers

`rounded-2xl border border-[#E9EEF5] bg-white shadow-xl`

- Maintain a clear title, content area, and action footer.
- Use appropriate responsive sizing.
- Support keyboard focus management and Escape-to-close where appropriate.
- Require explicit confirmation for destructive actions.

## 6. Data Visualization

- Use a consistent chart palette across the entire application.
- Income: semantic emerald.
- Expenses: semantic rose.
- Transfers: brand blue, excluded from income and expense totals unless the existing business rules explicitly specify otherwise.
- Supporting categories: coordinated blue, violet, slate, and amber tones.
- Avoid using multiple saturated colors without a clear data meaning.

### Donut and Pie Charts

- Select `innerRadius` and `outerRadius` based on available dimensions.
- Display a meaningful total or summary in the center only when it improves comprehension.
- Use a responsive legend and custom tooltip with formatted VND values, category names, and percentages.
- Ensure labels remain legible and avoid collisions on small screens.

### Bar and Line Charts

- Use subtle grid lines and restrained axis labels.
- Use rounded bar corners where supported and visually appropriate.
- Apply consistent line thickness, point markers, tooltip styling, and axis formatting.
- Preserve data accuracy; do not visually imply misleading comparisons.
- Use `ResponsiveContainer` with a parent that has a measurable width and height.
- Guard against zero-sized containers and SSR or hydration issues where applicable.
- Respect the installed Recharts version and existing chart architecture.

## 7. Interaction & Motion

- Standard hover and focus transitions: approximately 150–200ms.
- Use subtle opacity, color, and elevation changes.
- Use short, restrained entrance animations for charts and newly revealed content.
- Avoid repetitive animations, exaggerated scaling, and unnecessary parallax.
- Respect `prefers-reduced-motion`.
- Provide immediate feedback for save, update, delete, and validation operations.

## 8. Responsive & Accessibility Requirements

- Design mobile-first and progressively enhance for larger screens.
- Prevent horizontal overflow and clipped financial values.
- Use card-based mobile alternatives for dense desktop tables when appropriate.
- Ensure keyboard navigation and visible focus indicators.
- Provide accessible names for icon-only controls.
- Maintain adequate touch targets and contrast.
- Verify desktop, tablet, and mobile layouts before release.

## 9. Implementation Rules

- Treat this document as the source of truth for shared visual tokens.
- Prefer reusable semantic tokens over scattered hardcoded colors.
- Follow the existing styling framework and component conventions.
- Do not introduce duplicate design systems or unnecessary dependencies.
- Preserve current business logic, data models, APIs, authentication, and integrations.
- Update this document when approved design-system changes are implemented.