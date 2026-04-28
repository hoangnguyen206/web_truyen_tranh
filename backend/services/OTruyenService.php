<?php
// backend/services/OTruyenService.php

class OTruyenService {
    private $baseUrl = "https://otruyenapi.com/v1/api";
    private $cdnBaseUrl = "https://img.otruyenapi.com";
    private $cacheDir;
    
    public function __construct() {
        $this->cacheDir = __DIR__ . '/../../storage/cache/';
        if (!is_dir($this->cacheDir)) {
            mkdir($this->cacheDir, 0777, true);
        }
    }
    
    /**
     * Core: fetch with file-based cache
     */
    private function fetchFromApi($endpoint, $ttl = 3600) {
        $cacheFile = $this->cacheDir . md5($endpoint) . '.json';
        
        // Check cache
        if (file_exists($cacheFile) && (time() - filemtime($cacheFile)) < $ttl) {
            $cachedData = file_get_contents($cacheFile);
            $decoded = json_decode($cachedData, true);
            if ($decoded) return $decoded;
        }
        
        // Fetch from API
        $url = $this->baseUrl . $endpoint;
        $context = stream_context_create([
            'http' => [
                'timeout' => 10,
                'header' => "User-Agent: WebTruyen/2.0\r\n"
            ]
        ]);
        
        $response = @file_get_contents($url, false, $context);
        
        if ($response !== false) {
            $data = json_decode($response, true);
            if ($data && isset($data['status']) && $data['status'] === 'success') {
                // Save to cache
                file_put_contents($cacheFile, $response);
                return $data;
            }
        }
        
        // If API fails, try to return stale cache
        if (file_exists($cacheFile)) {
            $cachedData = file_get_contents($cacheFile);
            return json_decode($cachedData, true);
        }
        
        return null;
    }
    
    /**
     * Fetch raw URL (for chapter CDN links)
     */
    private function fetchUrl($url) {
        $context = stream_context_create([
            'http' => [
                'timeout' => 10,
                'header' => "User-Agent: WebTruyen/2.0\r\n"
            ]
        ]);
        
        $response = @file_get_contents($url, false, $context);
        
        if ($response !== false) {
            $data = json_decode($response, true);
            if ($data && isset($data['status']) && $data['status'] === 'success') {
                return $data;
            }
        }
        return null;
    }
    
    /**
     * Standard response format helper
     */
    private function formatListResponse($raw) {
        if (!$raw || !isset($raw['data'])) return null;
        
        $data = $raw['data'];
        $cdnUrl = $data['APP_DOMAIN_CDN_IMAGE'] ?? $this->cdnBaseUrl;
        
        return [
            'items' => $data['items'] ?? [],
            'cdnImageUrl' => $cdnUrl,
            'titlePage' => $data['titlePage'] ?? '',
            'pagination' => $data['params']['pagination'] ?? null
        ];
    }
    
    /**
     * GET /api/home → OTruyen /home
     */
    public function getHome() {
        $raw = $this->fetchFromApi('/home', 3600);
        if (!$raw || !isset($raw['data'])) return null;
        
        $data = $raw['data'];
        $cdnUrl = $data['APP_DOMAIN_CDN_IMAGE'] ?? $this->cdnBaseUrl;
        
        return [
            'items' => $data['items'] ?? [],
            'cdnImageUrl' => $cdnUrl,
            'pagination' => $data['params']['pagination'] ?? null
        ];
    }
    
    /**
     * GET /api/latest → OTruyen /danh-sach/dang-phat-hanh (ongoing)
     */
    public function getLatestReleases($page = 1) {
        $raw = $this->fetchFromApi("/danh-sach/dang-phat-hanh?page={$page}", 1800);
        return $this->formatListResponse($raw);
    }
    
    /**
     * GET /api/trending → same as latest (ongoing manga) for ranking
     */
    public function getTrending($page = 1) {
        return $this->getLatestReleases($page);
    }
    
    /**
     * GET /api/completed → OTruyen /danh-sach/hoan-thanh
     */
    public function getCompleted($page = 1) {
        $raw = $this->fetchFromApi("/danh-sach/hoan-thanh?page={$page}", 3600);
        return $this->formatListResponse($raw);
    }
    
    /**
     * GET /api/coming-soon → OTruyen /danh-sach/sap-ra-mat
     */
    public function getComingSoon($page = 1) {
        $raw = $this->fetchFromApi("/danh-sach/sap-ra-mat?page={$page}", 3600);
        return $this->formatListResponse($raw);
    }
    
    /**
     * GET /api/new-manga → OTruyen /danh-sach/truyen-moi
     */
    public function getNewManga($page = 1) {
        $raw = $this->fetchFromApi("/danh-sach/truyen-moi?page={$page}", 1800);
        return $this->formatListResponse($raw);
    }
    
    /**
     * GET /api/genres → OTruyen /the-loai
     */
    public function getGenres() {
        $raw = $this->fetchFromApi('/the-loai', 86400); // Cache 24h
        if (!$raw || !isset($raw['data'])) return null;
        
        return $raw['data']['items'] ?? [];
    }
    
    /**
     * GET /api/genres/{slug} → OTruyen /the-loai/{slug}
     */
    public function getGenreList($slug, $page = 1) {
        $raw = $this->fetchFromApi("/the-loai/" . urlencode($slug) . "?page={$page}", 3600);
        if (!$raw || !isset($raw['data'])) return null;
        
        $data = $raw['data'];
        $cdnUrl = $data['APP_DOMAIN_CDN_IMAGE'] ?? $this->cdnBaseUrl;
        
        return [
            'items' => $data['items'] ?? [],
            'cdnImageUrl' => $cdnUrl,
            'titlePage' => $data['titlePage'] ?? $slug,
            'breadCrumb' => $data['breadCrumb'] ?? [],
            'pagination' => $data['params']['pagination'] ?? null
        ];
    }
    
    /**
     * GET /api/search → OTruyen /tim-kiem
     */
    public function searchManga($keyword, $page = 1) {
        $raw = $this->fetchFromApi("/tim-kiem?keyword=" . urlencode($keyword) . "&page={$page}", 600);
        if (!$raw || !isset($raw['data'])) return null;
        
        $data = $raw['data'];
        $cdnUrl = $data['APP_DOMAIN_CDN_IMAGE'] ?? $this->cdnBaseUrl;
        
        return [
            'items' => $data['items'] ?? [],
            'cdnImageUrl' => $cdnUrl,
            'pagination' => $data['params']['pagination'] ?? null
        ];
    }
    
    /**
     * GET /api/manga/{slug} → OTruyen /truyen-tranh/{slug}
     */
    public function getMangaDetails($slug) {
        $raw = $this->fetchFromApi('/truyen-tranh/' . urlencode($slug), 3600);
        if (!$raw || !isset($raw['data'])) return null;
        
        $data = $raw['data'];
        $cdnUrl = $data['APP_DOMAIN_CDN_IMAGE'] ?? $this->cdnBaseUrl;
        $item = $data['item'] ?? null;
        
        if (!$item) return null;
        
        return [
            'item' => $item,
            'cdnImageUrl' => $cdnUrl,
            'breadCrumb' => $data['breadCrumb'] ?? []
        ];
    }
    
    /**
     * GET /api/chapter → Fetch chapter data from CDN URL
     */
    public function getChapter($chapterApiUrl) {
        $raw = $this->fetchUrl($chapterApiUrl);
        if (!$raw || !isset($raw['data'])) return null;
        
        return $raw['data'];
    }
}
