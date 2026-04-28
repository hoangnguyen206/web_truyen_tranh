FROM php:8.2-apache

# 1. Cài đặt các thư viện cần thiết
RUN apt-get update && apt-get install -y \
    libzip-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo pdo_mysql zip

# 2. Kích hoạt module rewrite của Apache
RUN a2enmod rewrite

# 3. Cấu hình DocumentRoot
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# 4. SỬA CỔNG (Cực kỳ quan trọng cho Cloud Run)
# Thay đổi cổng 80 thành biến môi trường $PORT (Cloud Run mặc định là 8080)
RUN sed -s -i 's/Listen 80/Listen ${PORT}/g' /etc/apache2/ports.conf
RUN sed -s -i 's/<VirtualHost \*:80>/<VirtualHost *:${PORT}>/g' /etc/apache2/sites-available/*.conf

# 5. Sao chép mã nguồn
COPY . /var/www/html/

# 6. Cấp quyền cho Apache
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Gán giá trị mặc định cho PORT nếu không có (giúp container vẫn chạy được)
ENV PORT 8080
EXPOSE 8080

# Chạy Apache ở chế độ foreground
CMD ["apache2-foreground"]