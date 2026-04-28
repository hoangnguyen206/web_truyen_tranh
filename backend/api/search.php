<?php
// backend/api/search.php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../services/OTruyenService.php';

function handleSearch() {
    $keyword = isset($_GET['keyword']) ? trim($_GET['keyword']) : '';
    $page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
    
    if (empty($keyword)) {
        errorResponse('Vui lòng nhập từ khóa tìm kiếm', 400);
    }
    
    $service = new OTruyenService();
    $data = $service->searchManga($keyword, $page);
    
    if (!$data) {
        jsonResponse(['items' => [], 'cdnImageUrl' => 'https://img.otruyenapi.com', 'pagination' => null]);
        return;
    }
    
    jsonResponse($data);
}
