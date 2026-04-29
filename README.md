# WebTruyen - Website Đọc Truyện Tranh Trực Tuyến

Chào mừng bạn đến với **WebTruyen**, một ứng dụng web đọc truyện tranh hiện đại, mượt mà và đầy đủ tính năng. Dự án được xây dựng với mục tiêu mang lại trải nghiệm đọc truyện tốt nhất cho người dùng.

## 🔗 Demo
Bạn có thể xem bản demo trực tiếp tại: [https://web-truyen-tranh-7zt6.onrender.com/](https://web-truyen-tranh-7zt6.onrender.com/)

---

## 🚀 Công Nghệ Sử Dụng

Dự án sử dụng các công nghệ phổ biến để đảm bảo hiệu suất và khả năng mở rộng:

- **Backend**: PHP (Sử dụng Router tùy chỉnh, Middleware, Services).
- **Frontend**: JavaScript (Vanilla JS), HTML5, CSS3 (Tailwind CSS).
- **Cơ sở dữ liệu**: MySQL / MariaDB (Hỗ trợ cả môi trường Local và Cloud).
- **API bên ngoài**: Tích hợp API từ [OTruyen](https://otruyenapi.com/) để lấy dữ liệu truyện tranh khổng lồ.
- **Xác thực**: Hỗ trợ đăng nhập hệ thống và Đăng nhập bằng Google (Google OAuth 2.0).

---

## 🛠 Hướng Dẫn Cài Đặt (Clone & Setup)

Nếu bạn muốn chỉnh sửa mã nguồn hoặc chạy dự án trên môi trường local, hãy làm theo các bước sau:

### 1. Clone Project
```bash
git clone https://github.com/hoangnguyen206/web_truyen_tranh.git
cd web_truyen_tranh
```

### 2. Cấu Hình Biến Môi Trường
- Sao chép file `.env.example` thành `.env`:
  ```bash
  cp .env.example .env
  ```
- Mở file `.env` và cập nhật thông tin Database của bạn (Host, User, Pass, Name) và thông tin Google OAuth (Client ID, Secret, Redirect URI).

### 3. Thiết Lập Cơ Sở Dữ Liệu
- Tạo một database mới trong MySQL (ví dụ: `truyentranh1`).
- Import các file SQL trong thư mục `database/` theo thứ tự:
  1. `truyentranh1.sql` (Cấu trúc chính)
  2. Các file migration như `migration_library.sql`, `migration_google_auth.sql`, `migration_views.sql`.

### 4. Chạy Server Local
Bạn có thể sử dụng PHP built-in server để chạy nhanh:
```bash
php -S localhost:8000 server.php
```
Sau đó truy cập: `http://localhost:8000`

---

## ✨ Tính Năng Chính

- **Trang Chủ**: Hiển thị truyện mới cập nhật, truyện hot, truyện hoàn thành từ OTruyen API.
- **Tìm Kiếm**: Tìm kiếm truyện nhanh chóng theo từ khóa.
- **Phân Loại**: Lọc truyện theo thể loại (Action, Adventure, Comedy, ...).
- **Đọc Truyện**: Trình đọc truyện mượt mà, chuyển chương nhanh chóng, hiển thị ảnh từ CDN chất lượng cao.
- **Thư Viện Cá Nhân**:
  - Lưu truyện đang đọc, muốn đọc, đã đọc xong vào tài khoản cá nhân.
  - Tự động lưu tiến trình đọc (đang đọc đến chương nào).
- **Hệ Thống Thành Viên**: Đăng ký, đăng nhập, bảo mật với Session và Middleware. Hỗ trợ đăng nhập nhanh bằng Google.

---

## 🐳 Triển Khai (Deployment)
Dự án đã có sẵn `Dockerfile`, bạn có thể dễ dàng triển khai lên các nền tảng như Render, Railway hoặc Docker Hub. Lưu ý cấu hình biến môi trường trên các nền tảng này tương tự như file `.env`.

---

## 📝 Liên Hệ & Đóng Góp
Nếu bạn có bất kỳ câu hỏi nào hoặc muốn đóng góp cho dự án, vui lòng tạo **Issue** hoặc **Pull Request**.

*Chúc bạn có những giây phút đọc truyện vui vẻ!*