# CỔNG 1: PRE-VIBE CHECKLIST & QUY CHUẨN TIẾP NHẬN YÊU CẦU

> File này quy định các bước bắt buộc mà AI Agent phải thực hiện TRƯỚC KHI bắt đầu sinh mã nguồn cho bất kỳ yêu cầu mới nào.

---

## 1. Danh Sách Kiểm Tra Đầu Vào (Pre-flight Checklist)

Trước khi thực hiện bất kỳ lệnh chỉnh sửa file hay cài đặt thư viện nào, hãy tự trả lời 4 câu hỏi:

1. **Đã đọc `PROJECT_STATE.md` chưa?**
   - Đọc phiên bản hiện tại, key lưu trữ (`HOME_MONI_DATA_V4`), và danh sách các component hiện có.
   - Nhớ đúng danh xưng: **Anh Chuột** (Chồng), **Bé Mèo** (Vợ), **My Home** (Tổ ấm).
2. **Yêu cầu mới có phá vỡ các Ràng buộc Bất biến (Constraints) không?**
   - Có yêu cầu chuyển sang Backend / Database server ngoài không? *(Nếu có: TỪ CHỐI và giải thích nguyên tắc Local-First).*
   - Có vi phạm logic dư nợ của thẻ tín dụng BIDV Credit không? *(Chi tiêu thẻ = Tăng nợ; Chuyển tiền vào thẻ = Giảm nợ).*
3. **Phạm vi tác động (Impact Radius) trải qua những file nào?**
   - Cần cập nhật theo thứ tự logic:
     `Types` ➔ `MockData / Storage` ➔ `FinanceContext` ➔ `Widgets / Components` ➔ `Views`.
4. **Có cần tạo file mới không hay tái sử dụng component đã có?**
   - Ưu tiên tái sử dụng các component dùng chung tại `components/common/` (`CategoryIcon`, `ConfirmDialog`, `TopBar`, `Sidebar`).

---

## 2. Ma Trận Phân Tích Tác Động (Impact Matrix Template)

Khi tiếp nhận một tính năng lớn, hãy phác thảo nhanh phạm vi:

| Tầng Kiến Trúc | File Cần Tác Động | Rủi Ro Tiềm Tàng | Biện Pháp Kiểm Soát |
| :--- | :--- | :--- | :--- |
| **Data Layer** | `types/finance.ts`, `lib/validations.ts` | Gãy kiểu dữ liệu của các view cũ | Khớp nối chặt chẽ Zod schema & TypeScript interface |
| **Storage Layer** | `constants/mockData.ts`, `lib/storage.ts` | LocalStorage không tự nạp schema mới | Nâng cấp storage key nếu cấu trúc dữ liệu cốt lõi thay đổi |
| **State Layer** | `context/FinanceContext.tsx` | Quên cung cấp hàm dispatch hoặc selector | Export đầy đủ qua `FinanceContext.Provider` |
| **UI Layer** | `components/*`, `app/*` | Lỗi vỡ giao diện trên mobile hoặc SSR hydration | Tuân thủ Skill `.agents/skills/home-moni-uiux/` |
