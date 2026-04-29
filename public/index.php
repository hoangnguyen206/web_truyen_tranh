<?php
// public/index.php
session_start();

// Load .env variables manually
$envFile = __DIR__ . '/../.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (strpos($line, '=') !== false) {
            list($name, $value) = explode('=', $line, 2);
            $name = trim($name);
            $value = trim($value);
            if (!array_key_exists($name, $_SERVER) && !array_key_exists($name, $_ENV)) {
                putenv(sprintf('%s=%s', $name, $value));
                $_ENV[$name] = $value;
                $_SERVER[$name] = $value;
            }
        }
    }
}

// Lấy đường dẫn request sạch
$requestUri = $_SERVER['REQUEST_URI'];
$parsedUrl = parse_url($requestUri, PHP_URL_PATH);


// 1. Kiểm tra request API
if (strpos($parsedUrl, '/api/') !== false) {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        http_response_code(200);
        exit;
    }

    // Các file backend vẫn nằm ở thư mục ngoài (cùng cấp với public) nên giữ nguyên /../
    require_once __DIR__ . '/../backend/helpers/response.php';
    require_once __DIR__ . '/../backend/Router.php';
    
    $router = new Router();
    require_once __DIR__ . '/../backend/routes.php';
    
    $apiEntryPoint = strpos($parsedUrl, '/api');
    $apiPath = substr($parsedUrl, $apiEntryPoint);
    
    $router->dispatch($apiPath, $_SERVER['REQUEST_METHOD']);
    exit;
}

// 2. Serve SPA shell
// VÌ BẠN ĐÃ ĐỂ SPA TRONG PUBLIC, NÊN DÙNG __DIR__ TRỰC TIẾP (BỎ /../)
$spaPath = __DIR__ . '/spa.html';

if (file_exists($spaPath)) {
    include $spaPath;
} else {
    // Nếu vẫn lỗi, đoạn này sẽ in ra đường dẫn thật để bạn kiểm tra trong Log
    error_log("Lỗi: Không tìm thấy file spa.html tại đường dẫn thực tế: $spaPath");
    http_response_code(404);
    echo "Hệ thống không tìm thấy giao diện chính. Vui lòng kiểm tra cấu trúc thư mục.";
}