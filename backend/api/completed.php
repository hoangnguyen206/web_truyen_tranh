<?php
// backend/api/completed.php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../services/OTruyenService.php';

function handleGetCompleted() {
    $page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
    
    $service = new OTruyenService();
    $data = $service->getCompleted($page);
    
    if (!$data) {
        errorResponse('Không thể lấy danh sách truyện hoàn thành', 500);
    }
    
    jsonResponse($data);
}
