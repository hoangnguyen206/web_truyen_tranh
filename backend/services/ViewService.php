<?php
// backend/services/ViewService.php
require_once __DIR__ . '/../config/database.php';

class ViewService {
    
    /**
     * Increment views for a chapter
     */
    public function incrementChapterView($slug, $chapterApiData, $chapterName) {
        global $conn;
        
        // Increment chapter view
        $stmt = $conn->prepare("
            INSERT INTO chapter_views (manga_slug, chapter_api_data, chapter_name, views) 
            VALUES (?, ?, ?, 1) 
            ON DUPLICATE KEY UPDATE views = views + 1
        ");
        $stmt->bind_param("sss", $slug, $chapterApiData, $chapterName);
        $stmt->execute();
    }
    
    /**
     * Get views for a manga and all its chapters
     * Returns an array: ['total_views' => int, 'chapters' => ['url' => views]]
     */
    public function getMangaViews($slug) {
        global $conn;
        $result = [
            'total_views' => 0,
            'chapters' => []
        ];
        
        // Get manga total views as sum of chapter views
        $stmt = $conn->prepare("SELECT SUM(views) as total_views FROM chapter_views WHERE manga_slug = ?");
        $stmt->bind_param("s", $slug);
        $stmt->execute();
        $res = $stmt->get_result();
        if ($row = $res->fetch_assoc()) {
            $result['total_views'] = (int)$row['total_views'];
        }
        
        // Get chapters views
        $stmt = $conn->prepare("SELECT chapter_api_data, views FROM chapter_views WHERE manga_slug = ?");
        $stmt->bind_param("s", $slug);
        $stmt->execute();
        $res = $stmt->get_result();
        while ($row = $res->fetch_assoc()) {
            $result['chapters'][$row['chapter_api_data']] = (int)$row['views'];
        }
        
        return $result;
    }
}
