<?php
// backend/api/manga.php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../services/OTruyenService.php';
require_once __DIR__ . '/../services/ViewService.php';

function handleGetManga($slug) {
    $service = new OTruyenService();
    $data = $service->getMangaDetails($slug);
    
    if (!$data || !isset($data['item'])) {
        errorResponse('Không tìm thấy truyện', 404);
    }
    
    // View Tracking
    $viewService = new ViewService();
    $views = $viewService->getMangaViews($slug);
    
    // Inject views into the response
    $data['item']['views'] = $views;
    
    jsonResponse($data);
}
