# Trip Vote MVP — “Đi Đâu Ở Đâu”

Prototype web responsive để một nhóm cùng duyệt, so sánh và bình chọn nơi ở / địa điểm ăn uống.

## Chạy ngay

Không cần cài package:

```bash
cd trip-vote-mvp
python3 -m http.server 8080
```

Mở `http://localhost:8080`.

## Chức năng có trong prototype

- Hai danh mục: Nơi ở và Ăn uống.
- Tìm kiếm, lọc mức giá, sắp xếp theo điểm / giá / rating.
- Thẻ địa điểm có ảnh, vị trí, mức giá, tag, Google Maps.
- Ba mức bình chọn: Ưu tiên, Cân nhắc, Không hợp.
- Điểm tạm tính: `2 × Ưu tiên + 1 × Cân nhắc − 2 × Không hợp`.
- So sánh tối đa 3 lựa chọn.
- Bảng kết quả theo từng danh mục.
- Lưu tên và lượt bình chọn bằng `localStorage`.
- Tải dữ liệu từ hai URL CSV công khai của Google Sheets.

## Kết nối Google Sheets trong prototype

1. Trong Google Sheets, tách thành hai tab: `Nơi ở` và `Ăn uống`.
2. Dùng cấu trúc cột trong `sheet-template.csv`.
3. Publish từng tab ra CSV hoặc dùng URL dạng:

```text
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/export?format=csv&gid=SHEET_GID
```

4. Trong ứng dụng, chọn **Nguồn dữ liệu** và dán URL của hai tab.

> Lưu ý: Đây là cách dành cho demo. Bản production nên đọc Sheet ở phía server, kiểm tra dữ liệu, sau đó đồng bộ sang database. Không nên để mọi trình duyệt gọi Google Sheets trực tiếp.

## Quy ước dữ liệu

- `id`: mã duy nhất, không đổi khi sửa tên.
- `image`: URL ảnh đại diện.
- `price`: số nguyên VND, không chứa dấu chấm/phẩy.
- `price_unit`: ví dụ `2 đêm / căn`, `ước tính / người`.
- `price_tier`: `budget`, `mid`, hoặc `premium`.
- `tags`: phân tách bằng ký tự `|`.
- `maps_url`: link Google Maps gốc.
- `score_seed`, `yes_seed`, `maybe_seed`, `no_seed`: chỉ phục vụ demo; production lấy từ bảng votes.

## Bước tiếp theo để thành sản phẩm thật

- Next.js App Router + TypeScript.
- Supabase Postgres, Auth, Realtime và Row Level Security.
- API `/api/sync-sheet` đọc Google Sheets bằng service account.
- Cron hoặc nút admin để đồng bộ và báo lỗi dòng dữ liệu.
- Anonymous sign-in + tên hiển thị hoặc magic link.
- Vote có unique constraint `(trip_id, candidate_id, user_id)`.
- Trạng thái cuộc bình chọn: `draft → open → locked → finalized`.
- Log thay đổi và màn hình quản trị nguồn dữ liệu.
