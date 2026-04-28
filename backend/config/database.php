<?php
// backend/config/database.php

$servername = $_ENV['DB_HOST'] ?? getenv('DB_HOST') ?: "localhost";
$username = $_ENV['DB_USER'] ?? getenv('DB_USER') ?: "root";
$password = $_ENV['DB_PASS'] ?? getenv('DB_PASS') ?: "";
$dbname = $_ENV['DB_NAME'] ?? getenv('DB_NAME') ?: "truyentranh1";
$port = $_ENV['DB_PORT'] ?? getenv('DB_PORT') ?: 3306;

global $conn;
try {
    $conn = new mysqli($servername, $username, $password, $dbname, (int)$port);
} catch (mysqli_sql_exception $e) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => false,
        'message' => 'Kết nối database thất bại: ' . $e->getMessage()
    ]);
    exit;
}

if ($conn->connect_error) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => false,
        'message' => 'Kết nối database thất bại: ' . $conn->connect_error
    ]);
    exit;
}

// Set charset to utf8mb4
$conn->set_charset("utf8mb4");