<?php
// backend/api/new_manga.php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../services/OTruyenService.php';

function handleGetNewManga() {
    $page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
    
    $service = new OTruyenService();
    $data = $service->getNewManga($page);
    
    if (!$data) {
        errorResponse('Không thể lấy danh sách truyện mới', 500);
    }
    
    jsonResponse($data);
}
