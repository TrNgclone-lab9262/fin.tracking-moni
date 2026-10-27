# 📖 CẨM NANG CONVENTIONAL COMMITS TIẾNG VIỆT TINH GỌN (HOME MONI)

> **Mục tiêu:** Bảng tra cứu các tiền tố commit chuẩn quốc tế kết hợp trích dẫn nội dung Tiếng Việt tinh gọn, giúp 2 vợ chồng và lập trình viên nhìn vào lịch sử GitHub là nắm ngay tiến độ phát triển của tổ ấm.

---

## 1. Bảng Tiền Tố Chuẩn Quốc Tế Cho HOME MONI

| Tiền Tố | Phạm Vi (`scope`) | Mục Đích | Mẫu Tiêu Đề Chuẩn |
| :--- | :--- | :--- | :--- |
| `feat` | `uiux`, `sync`, `mobile` | Thêm tính năng mới | `feat(uiux): upgrade triple-device responsive layout & mobile bottom bar (v4.1)` |
| `fix` | `calc`, `credit`, `sync` | Sửa lỗi tính toán / giao diện | `fix(credit): recalculate BIDV 50M balance on card payment` |
| `ui` | `sidebar`, `numpad`, `card` | Tinh chỉnh giao diện & styling | `ui(tokens): standardize rounded-xl cards and calm slate theme` |
| `sync` | `supabase`, `realtime` | Đồng bộ dữ liệu Cloud BaaS | `sync(supabase): implement two-way sync for husband & wife` |
| `perf` | `chart`, `storage` | Tối ưu hóa tốc độ tải trang | `perf(charts): memoize monthly trend calculations` |
| `refactor` | `context`, `components` | Tái cấu trúc mã nguồn sạch | `refactor(context): split transaction reducers for cleaner state` |
| `docs` | `state`, `standards` | Cập nhật tài liệu / State Ledger | `docs(state): record VIBE-13 changelog in PROJECT_STATE.md` |
| `ci` | `workflow`, `actions` | Cấu hình tự động hóa GitHub Actions | `ci(workflow): add Node 20 build and type check verification` |

---

## 2. Cấu Trúc Commit Message Tiếng Việt Tinh Gọn

Một commit chuẩn mực của HOME MONI luôn gồm 2 phần:

```powershell
git commit -m "<type>(<scope>): <tiêu đề ngắn gọn tiếng Anh/Việt kèm vX.X>" -m "- <Nâng cấp 1: Diễn giải tiếng Việt tinh gọn, súc tích>
- <Nâng cấp 2: Diễn giải tiếng Việt tinh gọn, súc tích>
- <Nâng cấp 3: Diễn giải tiếng Việt tinh gọn, súc tích>
- Đã kiểm thử biên dịch Next.js hoàn tất (0 errors)"
```

### Ví dụ thực tế cho phiên bản v4.1:
```powershell
git commit -m "feat(uiux): upgrade triple-device responsive layout and triad audit standards (v4.1)" -m "- Thêm thanh điều hướng di động BottomNavBar kèm nút FAB nhập nhanh giao dịch 3 giây
- Tối ưu Sidebar tự động thu gọn dạng mini-mode (w-20) trên màn hình Tablet
- Chuẩn hóa bộ màu Calm Slate Fintech (Xanh Navy #1E3A8A, Xanh Active #2563EB)
- Thể chế hóa Tam Giác Vai Trò Tối Cao (Architect, QA Thực Chiến, Người Chồng Tận Tụy)
- Đầy đủ tính năng sửa/xóa (CRUD) trên cả 5 phân hệ tài chính
- Đã kiểm thử biên dịch Next.js hoàn tất (0 errors, 4/4 static pages)"
```
