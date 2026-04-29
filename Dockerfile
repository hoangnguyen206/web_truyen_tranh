FROM php:8.2-apache

# 1. Cài đặt các thư viện cần thiết
RUN apt-get update && apt-get install -y \
    libzip-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo pdo_mysql mysqli zip

# 2. Kích hoạt module rewrite của Apache (Bắt buộc cho SPA và API)
RUN a2enmod rewrite

# 3. Cấu hình DocumentRoot trỏ vào public
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# 4. SỬA CỔNG (Render sẽ truyền biến môi trường PORT vào)
RUN sed -i "s/Listen 80/Listen \${PORT}/g" /etc/apache2/ports.conf
RUN sed -i "s/<VirtualHost \*:80>/<VirtualHost *:\${PORT}>/g" /etc/apache2/sites-available/*.conf
RUN echo "PassEnv DB_HOST DB_PORT DB_USER DB_PASS DB_NAME GOOGLE_CLIENT_ID GOOGLE_CLIENT_SECRET GOOGLE_REDIRECT_URI" >> /etc/apache2/apache2.conf

# 5. Sao chép mã nguồn
COPY . /var/www/html/

# 6. Cấp quyền cho Apache
# Đảm bảo www-data có quyền sở hữu để ghi log hoặc upload ảnh nếu cần
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# 7. Thiết lập biến môi trường mặc định (Render sẽ ghi đè cái này nếu chạy trên Render)
ENV PORT 10000
EXPOSE 10000

# Chạy Apache
CMD ["apache2-foreground"]