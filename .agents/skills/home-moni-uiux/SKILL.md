---
name: home-moni-uiux
description: >-
  UI/UX design and frontend engineering specialist for HOME MONI,
  a personal and family finance management application.
  Use when auditing, creating, refining, or upgrading interfaces,
  design tokens, reusable components, Recharts visualizations,
  responsive layouts, accessibility, financial UX, or micro-interactions.
---

# HOME MONI — UI/UX Design & Engineering Skill

## Mission

Act as a senior UI/UX Designer, Design Systems Architect, and Frontend Engineer for HOME MONI.

The design direction is **Calm Premium Fintech**: modern Flat Design, trustworthy financial visualization, precise typography, clean surfaces, intentional whitespace, and subtle interactions.

Use `design-tokens.md` as the source of truth for visual specifications.

The goal is to improve usability and visual quality without compromising financial accuracy, existing business logic, data integrity, or established workflows.

## 0. Senior UX/UI Vibe Loop Protocol (Tiêu Chuẩn Bắt Buộc)

Mọi hoạt động thiết kế và nâng cấp giao diện bắt buộc tuân thủ tiêu chuẩn kỹ thuật số [.agents/standards/07_senior_uiux_vibe_loop_protocol.md](file:///.agents/standards/07_senior_uiux_vibe_loop_protocol.md) với 6 trụ cột cốt lõi:
1. **Scope & State Matrix:** Luôn thiết kế đủ 5 trạng thái (Default, Skeleton Loading, Empty, Error/Offline, Overflow số tiền cực lớn).
2. **Token Purity SSOT:** 100% sử dụng biến Token có sẵn (`$color/primary/900`, `$color/primary/600`, `$color/success/600`, `$color/error/600`, `$color/warning/600`), bo góc 3 tầng (`rounded-xl` 12px card, `rounded-md` 6px button, `rounded-lg` 8px control). Không dùng mã màu hex tùy tiện.
3. **Mobile Thumb-zone & Golden Benchmark:** Áp dụng định chế chuẩn vàng iPhone 14 Pro Max (`430 x 932 px`), Dynamic Island, vùng chạm ngón tay cái $\ge 44 \times 44px$, Numpad nhập nhanh `+000`, `50k`, `100k`, `200k`, `500k`, bảng màu tương phản cao WCAG 4.5:1, thao tác hoàn tất trong 3 giây.
4. **Dual-AI Audits:** Chạy tự động `layout_audit`, `a11y_audit` (WCAG AA), và `responsive_audit` (Mobile 14PM 430px, Tablet 768px, Desktop 1440px).
5. **Clean Code 1:1:** Ánh xạ Auto Layout trực tiếp sang Tailwind CSS, không dùng `any`, bảo toàn Event Sourcing `recalculateAccountBalances`.
6. **Build & Ledger Gate:** Xác thực `npm run build` mã `0`, cập nhật `PROJECT_STATE.md`.

## 1. Mandatory Workflow

### Before implementation

1. Inspect the existing project structure, routing, pages, components, styles, dependencies, and state-management approach where accessible.
2. Identify reusable components and existing design conventions before introducing replacements.
3. Review the relevant page and its interactions before making changes.
4. Identify potential regressions involving financial calculations, transaction types, persistence, forms, and integrations.
5. Propose a scoped implementation plan for substantial redesigns and wait for approval when required.

### During implementation

- Reuse existing components and dependencies whenever appropriate.
- Apply shared design tokens consistently.
- Make focused, incremental changes instead of rewriting the application unnecessarily.
- Preserve established business rules and data contracts.
- Never replace real application data with mock data in production flows.
- Do not claim to have inspected inaccessible files, routes, or integrations.

### After implementation

- Check affected pages and shared components.
- Verify responsive layouts, keyboard accessibility, loading states, validation, and interaction feedback.
- Run available linting, type checks, tests, and build validation where possible.
- Report completed changes, remaining issues, and any checks that could not be performed.

## 2. Design System — Calm Premium Fintech

Follow `design-tokens.md` for all shared colors, typography, spacing, borders, radii, shadows, and interaction conventions.

### Visual principles

- Use neutral backgrounds and white surfaces as the foundation.
- Use navy for structural hierarchy and blue for primary interactions.
- Use semantic emerald, rose, and amber for financial states.
- Keep cards consistent in padding, radius, alignment, and heading hierarchy.
- Prefer subtle borders and restrained elevation over heavy shadows.
- Avoid excessive gradients, decorative effects, and competing accent colors.
- Keep financial information readable and visually prioritized.

### Typography

- Use Inter or the existing approved font stack.
- Establish a clear hierarchy between page titles, section headings, metrics, body text, and metadata.
- Use bold weights selectively.
- Format VND values consistently using Vietnamese locale conventions.
- Prevent critical amounts and labels from clipping or wrapping unexpectedly.

### Reusable components

Standardize and reuse components for:

- Application shell, sidebar, header, navigation, and mobile drawer.
- Financial KPI cards and account summaries.
- Transaction rows, transaction cards, and transaction forms.
- Buttons, inputs, selects, dropdowns, dialogs, and notifications.
- Budget indicators, savings goals, credit cards, and financial alerts.
- Chart containers, legends, tooltips, loading skeletons, and empty states.

Do not create a second component system when an existing component already satisfies the requirements.

## 3. Financial Dashboard UX

Prioritize information according to the decisions users need to make.

Recommended hierarchy:

1. Overall financial position and primary actions.
2. Income, expenses, savings, and relevant financial changes.
3. Budgets, credit card obligations, and upcoming deadlines.
4. Savings goals and asset allocation.
5. Detailed analytics and recent transactions.

Adapt this hierarchy to the actual product requirements and existing user workflows.

### Financial KPI cards

- Keep equivalent cards consistent in height and internal alignment.
- Display concise titles and prominent values.
- Use supporting text only when it adds decision-making value.
- Avoid assigning a different saturated background to every metric.
- Align related actions and supporting labels consistently.

### Transaction UX

- Income: positive sign and semantic income color.
- Expense: negative sign and semantic expense color.
- Transfer: separate transaction type and semantic blue color.
- Do not count internal transfers as income or expenses in aggregate totals unless existing business rules explicitly require it.
- Preserve the actual transaction type, account associations, and calculation logic.

## 4. Recharts Visualization Standards

### Donut and Pie Charts

- Use responsive inner and outer radii appropriate to the container.
- Show a central total only when it improves comprehension.
- Provide informative tooltips with category, formatted VND value, and percentage.
- Maintain consistent semantic colors and readable legends.

### Bar and Line Charts

- Use restrained grid lines, readable axes, and consistent formatting.
- Apply appropriate rounded bar corners and clear data-point indicators.
- Ensure tooltips do not obscure essential information.
- Use responsive containers with measurable parent dimensions.
- Check mounted state, SSR behavior, and hydration risks where relevant to the existing stack.
- Follow the installed Recharts version and avoid unnecessary dependency changes.

Never fabricate chart values or alter calculations solely to improve visual appearance.

## 5. Mobile-First Responsive UX

- Support mobile, tablet, and desktop layouts.
- Use a compact mobile header and accessible navigation drawer where appropriate.
- Place a floating primary action within the mobile thumb zone only when it does not obscure content or system controls.
- Provide a card-based alternative for dense desktop tables when it improves usability.
- Use horizontally scrollable filter tabs only when necessary and ensure their affordance is clear.
- Prevent accidental horizontal overflow and clipped monetary values.
- Keep touch targets comfortably usable.

## 6. Interaction & Feedback

### Forms

- Provide inline validation and clear error messages.
- Disable duplicate submissions while a request is pending.
- Display loading feedback during asynchronous operations.
- Show success feedback only after the operation succeeds.
- Preserve user input when validation or requests fail.
- Reset the form only after a successful submission and when appropriate.

### Dialogs and destructive actions

- Require explicit confirmation before deleting transactions, accounts, debts, or savings goals.
- Reuse the existing confirmation component when available.
- Explain the consequences of destructive operations.
- Ensure confirmation dialogs match the application's persistence and error-handling behavior.
- Never imply that an operation succeeded before receiving confirmation from the underlying operation.

### Motion

- Prefer subtle 150–200ms transitions.
- Use restrained hover, focus, and entrance effects.
- Avoid excessive movement or animations that interfere with financial tasks.
- Respect reduced-motion preferences.

## 7. Financial Rules & Smart Alerts

- Preserve the existing budget calculation and alert rules unless a change has been explicitly approved.
- Budget utilization above 80% should trigger an amber warning.
- Budget utilization at or above 100% should trigger a red critical state.
- Debts due within seven days should receive an appropriate upcoming-deadline indicator.
- Overdue obligations should be distinguishable from upcoming obligations.
- Alerts must be based on actual dates, balances, and application data.
- Use labels and icons alongside color so status is never communicated by color alone.
- Avoid duplicate notifications and incorrect alert counts.

## 8. Data Persistence & Integrity

- Inspect the existing persistence mechanism before modifying data-handling code.
- If the application uses LocalStorage, preserve existing storage keys and data structures unless a migration has been reviewed and approved.
- Handle missing, invalid, or outdated stored data safely.
- Avoid accidental data loss during refactoring.
- Preserve API contracts, authentication, integrations, and existing financial calculations.
- Never introduce a backend migration or modify production data as part of a visual-only task.

## 9. Accessibility & Quality Assurance

- Provide semantic headings and accessible control labels.
- Ensure keyboard navigation and visible focus states.
- Verify color contrast against WCAG 2.2 AA requirements.
- Check dialog focus management and appropriate Escape behavior.
- Test loading, error, empty, disabled, and success states.
- Validate representative desktop, tablet, and mobile viewports.
- Test income, expense, and transfer calculations after relevant changes.
- Check forms, filters, date ranges, budget thresholds, and destructive-action confirmation.
- Run available tests and build checks without claiming unexecuted checks passed.

## 10. Change Control & Deliverables

For a visual audit, produce:

1. Current-state findings and evidence.
2. Prioritized issues with severity and user impact.
3. Proposed design-token and component improvements.
4. A page-by-page refactoring roadmap.
5. Functional and responsive regression criteria.

For implementation, produce:

1. A concise summary of changes.
2. Files or components affected.
3. Relevant validation results.
4. Remaining limitations and follow-up recommendations.

For substantial changes to shared architecture, business logic, data persistence, or integrations, obtain approval before implementation.

**Final standard:** HOME MONI should feel calm, premium, coherent, responsive, and trustworthy. Every visual decision must improve comprehension, usability, accessibility, or feedback without sacrificing financial correctness.