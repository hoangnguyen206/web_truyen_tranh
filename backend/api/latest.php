<?php
// backend/api/latest.php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../services/OTruyenService.php';

function handleGetLatest() {
    $page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
    
    $service = new OTruyenService();
    $data = $service->getLatestReleases($page);
    
    if (!$data) {
        errorResponse('Không thể lấy danh sách truyện mới', 500);
    }
    
    jsonResponse($data);
}
