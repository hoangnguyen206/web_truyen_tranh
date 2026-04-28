<?php
// backend/api/trending.php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../services/OTruyenService.php';

function handleGetTrending() {
    $page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
    
    $service = new OTruyenService();
    $data = $service->getTrending($page);
    
    if (!$data) {
        errorResponse('Không thể lấy danh sách trending', 500);
    }
    
    jsonResponse($data);
}
