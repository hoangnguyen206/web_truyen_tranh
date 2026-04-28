FROM php:8.2-apache

# Cài đặt các thư viện cần thiết và PHP extensions
RUN apt-get update && apt-get install -y \
    libzip-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo pdo_mysql zip

# Kích hoạt module rewrite của Apache
RUN a2enmod rewrite

# --- ĐOẠN SỬA ĐỔI ĐỂ CHẠY TRÊN CLOUD RUN ---
# 1. Đổi cổng Apache từ 80 sang 8080 trong cấu hình hệ thống
RUN sed -i 's/80/8080/g' /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf

# 2. Cấu hình DocumentRoot trỏ vào thư mục public
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Sao chép mã nguồn
COPY . /var/www/html/

# Cấp quyền cho thư mục
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# 3. Mở cổng 8080 thay vì 80
EXPOSE 8080