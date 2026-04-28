<?php
// backend/api/genres.php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../services/OTruyenService.php';

function handleGetGenres() {
    $service = new OTruyenService();
    $genres = $service->getGenres();
    
    if ($genres === null) {
        errorResponse('Không thể lấy danh sách thể loại', 500);
    }
    
    jsonResponse($genres);
}

function handleGetGenreList($slug) {
    $page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
    
    $service = new OTruyenService();
    $data = $service->getGenreList($slug, $page);
    
    if (!$data) {
        errorResponse('Không thể lấy truyện theo thể loại', 500);
    }
    
    jsonResponse($data);
}
