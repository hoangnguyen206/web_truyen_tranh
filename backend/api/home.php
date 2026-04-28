<?php
// backend/api/home.php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../services/OTruyenService.php';

function handleGetHome() {
    $service = new OTruyenService();
    $data = $service->getHome();
    
    if (!$data) {
        errorResponse('Không thể lấy dữ liệu từ API', 500);
    }
    
    jsonResponse($data);
}
