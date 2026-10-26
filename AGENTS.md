# 🤖 NGUYÊN TẮC QUẢN TRỊ BẮT BUỘC CHO AI AGENT (AGENTS.md)
> Áp dụng cho toàn bộ dự án **HOME MONI** (`fi.tracking-moni`).  
> Mọi AI Agent tham gia lập trình, sửa đổi, refactor hoặc "vibe code" trong workspace này **BẮT BUỘC** tuân thủ quy trình 3 Cổng Quản Trị sau:

---

## 🚦 QUY TRÌNH 3 CỔNG QUẢN TRỊ VIBE CODING (3-GATE PROTOCOL)

```mermaid
flowchart LR
    A["CỔNG 1: PRE-VIBE<br/>(Đọc PROJECT_STATE.md & Phân tích tác động)"] --> B["CỔNG 2: IN-VIBE<br/>(Sinh mã Clean Code & UI/UX Tokens)"]
    B --> C["CỔNG 3: POST-VIBE<br/>(Build Test & Cập nhật PROJECT_STATE.md)"]
```

---

### CỔNG 1: PRE-VIBE GATE (Chuẩn Bị & Khóa Ngữ Cảnh)
1. **Đọc `PROJECT_STATE.md` Trước Tiên:**
   - Trước khi trả lời người dùng hoặc tạo file, AI Agent bắt buộc phải đọc file `PROJECT_STATE.md` tại thư mục gốc để nắm:
     - Phiên bản ứng dụng hiện tại và Storage Key đang active (`HOME_MONI_DATA_V4`).
     - Danh xưng và chủ thể: **👨 Anh Chuột** (Chồng), **👩 Bé Mèo** (Vợ), **🏡 My Home** (Tổ ấm).
     - Hệ thống 6 tài khoản + 1 quỹ chung và hạn mức 2 thẻ BIDV Credit (50M & 20M).
2. **Phân Tích Tác Động Full-Stack (Impact Matrix):**
   - Xác định rõ thay đổi sẽ tác động đến tầng nào:
     - Tầng dữ liệu: `types/finance.ts`, `lib/validations.ts`
     - Tầng lưu trữ: `constants/mockData.ts`, `lib/storage.ts`
     - Tầng nghiệp vụ: `context/FinanceContext.tsx`
     - Tầng giao diện: `components/*`, `app/*`
3. **Cảnh Báo Xung Đột:**
   - Nếu yêu cầu người dùng vi phạm các ràng buộc bất biến (đòi xóa LocalStorage, đổi sang SQL server, xóa thẻ tín dụng, v.v.), AI Agent phải cảnh báo và làm rõ ngay với người dùng trước khi tiến hành.
4. **Tra Cứu Bộ Tiêu Chuẩn Kỹ Thuật (`.agents/standards/`):**
   - Đọc và tuân thủ các tiêu chuẩn tương ứng trước khi triển khai:
     - CI/CD & GitHub Actions: `.agents/standards/01_ci_cd_automation.md`
     - Triển khai Vercel & PWA: `.agents/standards/02_deployment_vercel.md`
     - Đồng bộ Supabase Cloud Sync: `.agents/standards/03_supabase_cloud_sync.md`
     - Quản trị Git & Phân nhánh: `.agents/standards/04_git_collaboration.md`

---

### CỔNG 2: IN-VIBE GATE (Kiểm Soát Thực Thi & Chuẩn Mực Code)
1. **Tuân Thủ Tuyệt Đối Skill UI/UX (`.agents/skills/home-moni-uiux/`):**
   - Bảng màu Fintech Tokens:
     - Primary Navy: `#1E3A8A` / `#1D4ED8` (Sidebar gradient)
     - Active Blue: `#2563EB` (Primary buttons, active highlight)
     - Income Emerald: `#10B981` / `#059669` (Khoản thu, đạt mục tiêu)
     - Expense Rose: `#F43F5E` / `#E11D48` (Khoản chi, nợ thẻ)
     - Warning Amber: `#F59E0B` / `#D97706` (Hạn mức thẻ > 70%, nợ đến hạn)
   - Hình khối: `rounded-3xl` cho card/modal, `rounded-xl` cho buttons/inputs.
   - Thao tác di động: Bàn phím số Numpad (+000, 50k, 100k, 200k, 500k), Floating Action Button góc dưới phải.
2. **Chuẩn Mực TypeScript & Clean Code:**
   - Tuyệt đối cấm sử dụng `any`. Mọi props, state, event phải có type rõ ràng.
   - Recharts: Luôn có cờ `isMounted` để tránh lỗi SSR hydration của Next.js.
   - Bảo toàn tài liệu: Giữ nguyên các comments, docstrings và logic nghiệp vụ không liên quan đến thay đổi.
   - Chỉnh sửa chính xác (Atomic edits), không ghi đè mất mã nguồn của các turn trước.

---

### CỔNG 3: POST-VIBE GATE (Kiểm Thử & Tự Động Đồng Bộ State)
1. **Kiểm Thử Biên Dịch Tự Động:**
   - Sau khi hoàn thành việc viết mã, AI Agent **BẮT BUỘC** chạy lệnh:
     ```bash
     npm run build
     ```
   - Nếu có lỗi TypeScript, linting, hoặc lỗi trang: Phải tự động phân tích và khắc phục triệt để đến khi lệnh kết thúc với mã `0`.
2. **Đồng Bộ Hóa `PROJECT_STATE.md`:**
   - Cập nhật mục `4. Nhật Ký Biến Thiên Vibe Coding (Vibe Session Changelog)` trong `PROJECT_STATE.md`:
     - Ghi nhận `Vibe ID` mới, ngày giờ, mục tiêu và danh sách các file đã tác động.
     - Cập nhật số phiên bản nếu có bước tiến lớn.
3. **Phản Hồi Người Dùng:**
   - Trình bày kết quả ngắn gọn, rõ ràng, dẫn link clickable đến các file và code symbols vừa thay đổi.
