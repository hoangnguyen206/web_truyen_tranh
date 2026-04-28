<?php
// backend/api/coming_soon.php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../services/OTruyenService.php';

function handleGetComingSoon() {
    $page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
    
    $service = new OTruyenService();
    $data = $service->getComingSoon($page);
    
    if (!$data) {
        errorResponse('Không thể lấy danh sách truyện sắp ra mắt', 500);
    }
    
    jsonResponse($data);
}
