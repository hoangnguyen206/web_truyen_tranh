<?php
// backend/api/library.php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../services/LibraryService.php';

/**
 * Helper: get logged-in user ID from session
 */
function requireAuth() {
    if (!isset($_SESSION['user_id'])) {
        errorResponse('Vui lòng đăng nhập để sử dụng thư viện', 401);
    }
    return (int)$_SESSION['user_id'];
}

/**
 * GET /api/library?tab=reading
 * Returns library items for the current user
 */
function handleGetLibrary() {
    $userId = requireAuth();
    $tab = isset($_GET['tab']) ? $_GET['tab'] : 'reading';
    
    $service = new LibraryService();
    $items = $service->getUserLibrary($userId, $tab);
    $counts = $service->getTabCounts($userId);
    
    jsonResponse([
        'items'  => $items,
        'counts' => $counts,
        'tab'    => $tab
    ]);
}

/**
 * POST /api/library
 * Add or update a manga in user's library
 * Body: { manga_slug, manga_name, manga_thumb, tab, last_chapter_read, last_chapter_url, total_chapters, chapters_read, manga_status }
 */
function handleAddLibrary() {
    $userId = requireAuth();
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['manga_slug']) || empty($input['manga_name'])) {
        errorResponse('Thiếu thông tin manga_slug hoặc manga_name', 400);
    }
    
    $service = new LibraryService();
    $result = $service->addToLibrary($userId, $input);
    
    if (!$result) {
        errorResponse('Không thể thêm vào thư viện', 500);
    }
    
    // Return the entry that was just saved
    $entry = $service->getEntry($userId, $input['manga_slug']);
    jsonResponse($entry, 'Đã thêm vào thư viện');
}

/**
 * DELETE /api/library/{slug}
 * Remove manga from library by slug
 */
function handleRemoveLibrary($params) {
    $userId = requireAuth();
    $slug = is_array($params) ? ($params['id'] ?? '') : $params;
    
    if (empty($slug)) {
        errorResponse('Thiếu slug', 400);
    }
    
    $service = new LibraryService();
    $service->removeFromLibrary($userId, $slug);
    
    jsonResponse(['status' => 'removed'], 'Đã xóa khỏi thư viện');
}

/**
 * POST /api/library/progress
 * Update reading progress
 * Body: { manga_slug, last_chapter_read, last_chapter_url, chapters_read }
 */
function handleUpdateProgress() {
    $userId = requireAuth();
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['manga_slug'])) {
        errorResponse('Thiếu manga_slug', 400);
    }
    
    $service = new LibraryService();
    
    // Check if entry exists first
    $entry = $service->getEntry($userId, $input['manga_slug']);
    if (!$entry) {
        errorResponse('Truyện không có trong thư viện', 404);
    }
    
    $service->updateProgress(
        $userId,
        $input['manga_slug'],
        $input['last_chapter_read'] ?? null,
        $input['last_chapter_url'] ?? null,
        $input['chapters_read'] ?? 0
    );
    
    $updated = $service->getEntry($userId, $input['manga_slug']);
    jsonResponse($updated, 'Đã cập nhật tiến trình');
}

/**
 * POST /api/library/tab
 * Move manga to a different tab
 * Body: { manga_slug, tab }
 */
function handleChangeTab() {
    $userId = requireAuth();
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['manga_slug']) || empty($input['tab'])) {
        errorResponse('Thiếu manga_slug hoặc tab', 400);
    }
    
    $service = new LibraryService();
    $result = $service->changeTab($userId, $input['manga_slug'], $input['tab']);
    
    if (!$result) {
        errorResponse('Tab không hợp lệ', 400);
    }
    
    jsonResponse(['status' => 'moved'], 'Đã chuyển tab');
}

/**
 * GET /api/library/check/{slug}
 * Check if a manga is in user's library
 */
function handleCheckLibrary($params) {
    $userId = requireAuth();
    $slug = is_array($params) ? ($params['slug'] ?? '') : $params;
    
    $service = new LibraryService();
    $entry = $service->getEntry($userId, $slug);
    
    jsonResponse([
        'in_library' => $entry !== null,
        'entry'      => $entry
    ]);
}
