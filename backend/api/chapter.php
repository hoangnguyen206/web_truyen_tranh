<?php
// backend/api/chapter.php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../services/OTruyenService.php';

function handleGetChapter() {
    if (!isset($_GET['url'])) {
        errorResponse('Missing chapter url', 400);
    }
    
    $chapterUrl = urldecode($_GET['url']);
    
    // Validate it's from otruyencdn
    if (strpos($chapterUrl, 'otruyencdn.com') === false && strpos($chapterUrl, 'otruyenapi.com') === false) {
        errorResponse('Invalid chapter source', 400);
    }
    
    $service = new OTruyenService();
    $data = $service->getChapter($chapterUrl);
    
    if (!$data || !isset($data['item'])) {
        errorResponse('Không thể tải chương', 404);
    }
    
    // Increment Views
    if (isset($_GET['slug'])) {
        require_once __DIR__ . '/../services/ViewService.php';
        $viewService = new ViewService();
        $slug = $_GET['slug'];
        $chapterName = $data['item']['chapter_name'] ?? 'Unknown';
        $viewService->incrementChapterView($slug, $chapterUrl, $chapterName);
    }
    
    jsonResponse($data);
}
