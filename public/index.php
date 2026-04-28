<?php
// public/index.php
session_start();

$requestUri = $_SERVER['REQUEST_URI'];

// Strip project folder if it exists in URI (e.g., if hosted in /WebTruyen - Copy/public)
// Since the rewrite base might handle this or we might be testing via PHP built-in server, 
// let's ensure we get the correct path.
$basePath = '/TruyenTranhNet'; // Fallback base path if needed, but normally we just parse URL.
$parsedUrl = parse_url($requestUri, PHP_URL_PATH);

// Simple check to detect API requests
if (strpos($parsedUrl, '/api/') !== false) {
    // It's an API request
    require_once __DIR__ . '/../backend/helpers/response.php';
    require_once __DIR__ . '/../backend/Router.php';
    
    // Configure CORS
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        http_response_code(200);
        exit;
    }

    $router = new Router();
    
    // Register API routes
    require_once __DIR__ . '/../backend/routes.php';
    
    // We only want the part starting from /api
    $apiPath = substr($parsedUrl, strpos($parsedUrl, '/api'));
    $router->dispatch($apiPath, $_SERVER['REQUEST_METHOD']);
    exit;
}

// Non-API Request -> Serve SPA shell
include __DIR__ . '/spa.html';
