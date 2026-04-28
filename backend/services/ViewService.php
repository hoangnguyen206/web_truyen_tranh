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
        
        if (!$stmt) {
            // Auto-create table if missing and retry
            $this->createTablesIfMissing();
            $stmt = $conn->prepare("
                INSERT INTO chapter_views (manga_slug, chapter_api_data, chapter_name, views) 
                VALUES (?, ?, ?, 1) 
                ON DUPLICATE KEY UPDATE views = views + 1
            ");
        }
        
        if ($stmt) {
            $stmt->bind_param("sss", $slug, $chapterApiData, $chapterName);
            $stmt->execute();
        }
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
        if ($stmt) {
            $stmt->bind_param("s", $slug);
            $stmt->execute();
            $res = $stmt->get_result();
            if ($row = $res->fetch_assoc()) {
                $result['total_views'] = (int)$row['total_views'];
            }
        }
        
        // Get chapters views
        $stmt = $conn->prepare("SELECT chapter_api_data, views FROM chapter_views WHERE manga_slug = ?");
        if ($stmt) {
            $stmt->bind_param("s", $slug);
            $stmt->execute();
            $res = $stmt->get_result();
            while ($row = $res->fetch_assoc()) {
                $result['chapters'][$row['chapter_api_data']] = (int)$row['views'];
            }
        }
        
        return $result;
    }
    
    /**
     * Auto create tables if they are missing
     */
    private function createTablesIfMissing() {
        global $conn;
        $conn->query("
            CREATE TABLE IF NOT EXISTS `manga_views` (
              `manga_slug` varchar(255) NOT NULL,
              `total_views` int(11) DEFAULT 0,
              PRIMARY KEY (`manga_slug`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ");
        
        $conn->query("
            CREATE TABLE IF NOT EXISTS `chapter_views` (
              `id` int(11) NOT NULL AUTO_INCREMENT,
              `manga_slug` varchar(255) NOT NULL,
              `chapter_api_data` varchar(255) NOT NULL,
              `chapter_name` varchar(255) NOT NULL,
              `views` int(11) DEFAULT 0,
              PRIMARY KEY (`id`),
              UNIQUE KEY `unique_manga_chapter` (`manga_slug`, `chapter_api_data`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ");
    }
}
