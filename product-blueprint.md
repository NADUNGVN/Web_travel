# Product Blueprint — Ứng dụng bình chọn cho chuyến đi nhóm

## 1. Job-to-be-done

“Khi cả nhóm chuẩn bị đi du lịch, chúng tôi muốn gom các lựa chọn ở và ăn vào một chỗ, xem cùng một bộ thông tin, thảo luận và chốt công bằng mà không phải lục lại hàng chục link trong chat.”

## 2. Nguyên tắc sản phẩm

1. **Vào được ngay:** người được mời không phải tạo tài khoản dài dòng.
2. **So sánh cùng tiêu chuẩn:** mọi nơi ở dùng cùng đơn vị giá; mọi nhà hàng dùng giá ước tính mỗi người.
3. **Không ép quyết định quá sớm:** vòng đầu có “Ưu tiên / Cân nhắc / Không hợp”.
4. **Minh bạch:** thấy tổng phiếu, deadline, trạng thái khóa và lý do lựa chọn.
5. **Sheet là nơi biên tập, database là nơi vận hành:** tránh lỗi tốc độ, quota và ghi đè.

## 3. Luồng chính

### Trưởng nhóm

- Tạo chuyến đi, ngày đi, số người, deadline.
- Gắn Google Sheet hoặc bấm đồng bộ.
- Kiểm tra lỗi dữ liệu và bản xem trước.
- Mời thành viên bằng link / mã.
- Mở bình chọn, khóa kết quả, xác nhận phương án cuối.

### Thành viên

- Mở link, nhập tên hoặc đăng nhập nhanh.
- Duyệt tab Nơi ở / Ăn uống.
- Xem ảnh, giá, vị trí, ưu nhược điểm.
- Lọc và chọn tối đa ba nơi để so sánh.
- Bình chọn, ghi chú, xem kết quả tạm thời.

## 4. Mô hình bình chọn đề xuất

### Vòng 1 — Approval có sắc thái

- Ưu tiên: +2
- Cân nhắc: +1
- Không hợp: −2
- Chưa chọn: 0

Mục tiêu là loại phương án có nhiều phản đối và tìm top 3 nhanh.

### Vòng 2 — Chốt

- Trưởng nhóm chọn 2–3 phương án vào vòng cuối.
- Mỗi người xếp hạng 1, 2, 3.
- Hệ thống hiển thị người chưa tham gia và tie-break theo: ít phiếu “Không hợp” hơn → giá phù hợp hơn → trưởng nhóm quyết định.

## 5. Information architecture

- `/trip/[slug]`: tổng quan chuyến đi.
- `/trip/[slug]/stays`: nơi ở.
- `/trip/[slug]/food`: ăn uống.
- `/trip/[slug]/results`: kết quả.
- `/trip/[slug]/admin`: dữ liệu, người tham gia, deadline, khóa phiếu.
- `/invite/[token]`: tham gia chuyến đi.

## 6. Data model

### trips

- id, slug, title, destination, start_date, end_date
- participant_count, vote_deadline, status
- created_by, created_at

### participants

- id, trip_id, user_id, display_name, role, joined_at

### candidates

- id, trip_id, category (`stay|food`), source_row_id
- name, description, image_url, gallery_urls
- price_amount, price_unit, currency, price_tier
- address, lat, lng, maps_url, place_id
- rating, review_count, tags, status, last_synced_at

### votes

- id, trip_id, candidate_id, participant_id
- value (`yes|maybe|no`) hoặc rank
- created_at, updated_at
- unique(trip_id, candidate_id, participant_id)

### comments

- id, candidate_id, participant_id, body, created_at

### sync_runs

- id, trip_id, source_url, status, row_count
- errors_json, started_at, completed_at

## 7. Google Sheet schema

Hai tab cùng schema, khác `category` hoặc map theo tab:

- `id` bắt buộc, ổn định.
- `name` bắt buộc.
- `source_url` link booking / bài tham khảo.
- `image`, `gallery`.
- `price`, `price_unit`, `currency`.
- `location`, `maps_url`, `lat`, `lng`.
- `rating`, `review_count`.
- `tags`, `pros`, `cons`, `note`.
- `active` để ẩn/hiện.

Validation quan trọng:

- Trùng `id` hoặc trùng `maps_url`.
- Giá không phải số.
- Ảnh chết / không phải HTTPS.
- Thiếu địa chỉ hoặc link bản đồ.
- Đơn vị giá không đồng nhất.

## 8. Kiến trúc production

```text
Google Sheets
   ↓ server-side sync
Next.js Route Handler / background job
   ↓ validate + normalize + upsert
Supabase Postgres
   ↕ RLS + Realtime
Next.js Web App / PWA
```

Không đọc Sheet ở mỗi lần mở trang. Dữ liệu địa điểm cache được; lượt bình chọn đi thẳng vào Postgres và cập nhật realtime.

## 9. MVP scope

### Phải có

- Tạo/join chuyến đi.
- Sync hai tab Sheet.
- Card + chi tiết + Google Maps.
- Bộ lọc giá / khu vực / tag.
- Vote ba mức, đổi phiếu, kết quả realtime.
- So sánh 2–3 lựa chọn.
- Deadline, khóa và chốt.
- Mobile-first.

### Chưa cần trong MVP

- Chat đầy đủ; dùng comment theo địa điểm.
- Tự động đặt phòng / đặt bàn.
- AI tự tìm địa điểm ngoài Sheet.
- Chia tiền và lịch trình hoàn chỉnh.
- Native mobile app.

## 10. Backlog triển khai

### Sprint 0 — Chuẩn hóa dữ liệu

- Chốt cột Sheet, dữ liệu mẫu và quy tắc validation.
- Chốt cách tính giá nơi ở theo số đêm / số người.
- Chốt phương thức tham gia: anonymous + tên hay magic link.

### Sprint 1 — Vertical slice

- Trip page, tab nơi ở, đọc dữ liệu đã sync.
- Auth nhẹ, vote và unique constraint.
- Kết quả realtime cơ bản.

### Sprint 2 — Ăn uống và quyết định

- Tab ăn uống, so sánh, comment.
- Deadline, khóa vote, trang kết quả.

### Sprint 3 — Admin và độ tin cậy

- Sync dashboard, lỗi từng dòng, retry.
- Audit log, chống spam, RLS review.
- Responsive QA, accessibility, analytics.

## 11. KPI MVP

- ≥80% người được mời hoàn tất ít nhất một lượt bình chọn.
- Thời gian từ mở link đến phiếu đầu tiên <2 phút.
- ≥70% chuyến đi chốt được phương án trước deadline.
- <5% dòng Sheet bị lỗi sau khi người quản trị dùng template.
- Không có vote trùng của cùng participant cho cùng candidate.
