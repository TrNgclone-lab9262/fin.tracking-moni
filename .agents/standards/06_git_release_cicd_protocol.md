# 🚀 TIÊU CHUẨN PHÁT HÀNH MÃ NGUỒN & CI/CD PROTOCOL (HOME MONI)
> Áp dụng cho: Mọi phiên phát hành mã nguồn, đẩy code lên GitHub, kích hoạt kiểm thử CI và triển khai CD Vercel cho dự án **HOME MONI**.

---

## 1. Giao Thức Tương Tác 3 Giai Đoạn (3-Phase Release Protocol)

Để bảo đảm tính an toàn, linh hoạt tuyệt đối và quyền kiểm soát của người dùng, mọi lần phát hành mã nguồn đều tuân theo 3 giai đoạn:

```mermaid
flowchart TD
    subgraph Giai Đoạn 1: Chuẩn Bị & Đẩy Nhánh
        A["1. AI Agent kiểm thử npm run build = 0 errors"] --> B["2. AI Agent hỏi chọn nhánh (hiện tại hay nhánh khác)"]
        B --> C["3. AI Agent sinh khối lệnh Terminal (Conventional Commit tiếng Việt tinh gọn)"]
        C --> D["4. Người dùng Copy lệnh & Paste vào Terminal chạy"]
    end

    subgraph Giai Đoạn 2: PR & CI Gate Trên GitHub
        D --> E["5. Người dùng mở link Pull Request vào main trên GitHub"]
        E --> F["6. GitHub Actions CI tự động kiểm thử npm run build"]
        F --> G{"CI Check Pass 🟢?"}
        G -->|Pass| H["7. Người dùng bấm Merge Pull Request vào main"]
        H --> I["8. Người dùng thông báo cho AI: Đã merge PR xong"]
    end

    subgraph Giai Đoạn 3: Sync Local & Tag SemVer vX.X
        I --> J["9. AI Agent sinh khối lệnh Terminal Giai Đoạn 3"]
        J --> K["10. Người dùng chạy lệnh: Pull main, gắn Tag vX.X, push Tag"]
        K --> L["11. Vercel CD tự động cập nhật app lên điện thoại 2 vợ chồng (~45s)"]
    end
```

---

## 2. Tiêu Chuẩn Tag Phiên Bản Thống Nhất (`vX.X`)

- Toàn bộ các mốc phát hành của dự án HOME MONI đều thống nhất sử dụng định dạng Tag: **`vX.X`** (ví dụ: `v3.3`, `v3.4`, `v4.0`, `v4.1`).
- Tag bắt buộc phải là **Annotated Tag** (có cờ `-a` và chú thích `-m` tóm tắt tên phiên bản).
- Khi đẩy Tag lên GitHub bằng `git push origin vX.X`, GitHub sẽ lưu lại một Snapshot lịch sử vĩnh viễn và Vercel có thể nhận diện phiên bản phát hành chính thức.

---

## 3. Câu Lệnh Kích Hoạt Kỹ Năng (Trigger Phrases)
Khi người dùng đưa ra các câu lệnh sau, AI Agent sẽ tự động nạp Skill `home-moni-git-release` và kích hoạt quy trình 3 giai đoạn:
1. *"hãy chạy release code"*
2. *"hãy đẩy lên github"*
3. *"hãy commit đẩy lên github"*
4. *"hãy commit và đẩy nhánh lên GitHub"*
