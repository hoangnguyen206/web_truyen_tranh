<?php
// backend/services/LibraryService.php
// Library service using JSON file storage (No Database Required)

class LibraryService {
    private $storageFile;
    
    public function __construct() {
        $this->storageFile = __DIR__ . '/../../database/library_data.json';
        if (!file_exists($this->storageFile)) {
            file_put_contents($this->storageFile, json_encode([]));
        }
    }

    private function loadData() {
        $json = file_get_contents($this->storageFile);
        return json_decode($json, true) ?: [];
    }

    private function saveData($data) {
        file_put_contents($this->storageFile, json_encode($data, JSON_PRETTY_PRINT));
    }
    
    /**
     * Get user library items filtered by tab
     */
    public function getUserLibrary($userId, $tab = 'reading') {
        $data = $this->loadData();
        $userItems = $data[$userId] ?? [];
        
        $filtered = [];
        foreach ($userItems as $item) {
            if (($item['tab'] ?? 'reading') === $tab) {
                $filtered[] = $item;
            }
        }
        
        // Sort by updated_at descending
        usort($filtered, function($a, $b) {
            return strtotime($b['updated_at']) - strtotime($a['updated_at']);
        });
        
        return $filtered;
    }
    
    /**
     * Get counts for all tabs
     */
    public function getTabCounts($userId) {
        $data = $this->loadData();
        $userItems = $data[$userId] ?? [];
        
        $counts = ['reading' => 0, 'want_to_read' => 0, 'completed' => 0];
        foreach ($userItems as $item) {
            $t = $item['tab'] ?? 'reading';
            if (isset($counts[$t])) {
                $counts[$t]++;
            }
        }
        return $counts;
    }
    
    /**
     * Add or update a manga in user's library
     */
    public function addToLibrary($userId, $input) {
        $slug = $input['manga_slug'] ?? '';
        if (empty($slug)) return false;

        $data = $this->loadData();
        if (!isset($data[$userId])) {
            $data[$userId] = [];
        }

        $now = date('Y-m-d H:i:s');
        
        // Find existing
        $foundIndex = -1;
        foreach ($data[$userId] as $index => $item) {
            if ($item['manga_slug'] === $slug) {
                $foundIndex = $index;
                break;
            }
        }

        if ($foundIndex >= 0) {
            // Update
            $data[$userId][$foundIndex] = array_merge($data[$userId][$foundIndex], [
                'manga_name' => $input['manga_name'] ?? $data[$userId][$foundIndex]['manga_name'],
                'manga_thumb' => $input['manga_thumb'] ?? $data[$userId][$foundIndex]['manga_thumb'],
                'tab' => $input['tab'] ?? $data[$userId][$foundIndex]['tab'],
                'last_chapter_read' => $input['last_chapter_read'] ?? $data[$userId][$foundIndex]['last_chapter_read'],
                'last_chapter_url' => $input['last_chapter_url'] ?? $data[$userId][$foundIndex]['last_chapter_url'],
                'total_chapters' => (int)($input['total_chapters'] ?? $data[$userId][$foundIndex]['total_chapters']),
                'chapters_read' => (int)($input['chapters_read'] ?? $data[$userId][$foundIndex]['chapters_read']),
                'manga_status' => $input['manga_status'] ?? $data[$userId][$foundIndex]['manga_status'],
                'updated_at' => $now
            ]);
        } else {
            // Insert
            $data[$userId][] = [
                'manga_slug' => $slug,
                'manga_name' => $input['manga_name'] ?? '',
                'manga_thumb' => $input['manga_thumb'] ?? null,
                'tab' => $input['tab'] ?? 'reading',
                'last_chapter_read' => $input['last_chapter_read'] ?? null,
                'last_chapter_url' => $input['last_chapter_url'] ?? null,
                'total_chapters' => (int)($input['total_chapters'] ?? 0),
                'chapters_read' => (int)($input['chapters_read'] ?? 0),
                'manga_status' => $input['manga_status'] ?? null,
                'added_at' => $now,
                'updated_at' => $now
            ];
        }

        $this->saveData($data);
        return true;
    }
    
    /**
     * Update reading progress (chapter read)
     */
    public function updateProgress($userId, $slug, $chapterName, $chapterUrl, $chaptersRead) {
        $data = $this->loadData();
        if (!isset($data[$userId])) return false;

        $now = date('Y-m-d H:i:s');
        foreach ($data[$userId] as &$item) {
            if ($item['manga_slug'] === $slug) {
                $item['last_chapter_read'] = $chapterName;
                $item['last_chapter_url'] = $chapterUrl;
                $item['chapters_read'] = (int)$chaptersRead;
                $item['tab'] = 'reading'; // Automatically move to reading
                $item['updated_at'] = $now;
                $this->saveData($data);
                return true;
            }
        }
        return false;
    }
    
    /**
     * Change tab for a manga
     */
    public function changeTab($userId, $slug, $newTab) {
        $validTabs = ['reading', 'want_to_read', 'completed'];
        if (!in_array($newTab, $validTabs)) return false;

        $data = $this->loadData();
        if (!isset($data[$userId])) return false;

        $now = date('Y-m-d H:i:s');
        foreach ($data[$userId] as &$item) {
            if ($item['manga_slug'] === $slug) {
                $item['tab'] = $newTab;
                $item['updated_at'] = $now;
                $this->saveData($data);
                return true;
            }
        }
        return false;
    }
    
    /**
     * Remove manga from library
     */
    public function removeFromLibrary($userId, $slug) {
        $data = $this->loadData();
        if (!isset($data[$userId])) return false;

        foreach ($data[$userId] as $index => $item) {
            if ($item['manga_slug'] === $slug) {
                array_splice($data[$userId], $index, 1);
                $this->saveData($data);
                return true;
            }
        }
        return false;
    }
    
    /**
     * Get a single library entry
     */
    public function getEntry($userId, $slug) {
        $data = $this->loadData();
        if (!isset($data[$userId])) return null;

        foreach ($data[$userId] as $item) {
            if ($item['manga_slug'] === $slug) {
                return $item;
            }
        }
        return null;
    }
}
