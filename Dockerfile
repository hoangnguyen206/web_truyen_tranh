FROM php:8.2-apache

# Cài đặt các thư viện cần thiết và PHP extensions
RUN apt-get update && apt-get install -y \
    libzip-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo pdo_mysql zip

# Kích hoạt module rewrite của Apache (để xử lý .htaccess)
RUN a2enmod rewrite

# Cấu hình DocumentRoot trỏ vào thư mục public
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Sao chép toàn bộ mã nguồn vào thư mục của Apache
COPY . /var/www/html/

# Cấp quyền cho Apache được phép ghi vào các thư mục cần thiết
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Mở cổng 80 (cổng mặc định của Apache)
EXPOSE 80
