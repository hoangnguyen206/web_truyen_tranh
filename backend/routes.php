<?php
// backend/routes.php

$router->get('/api/home', function() {
    require_once __DIR__ . '/api/home.php';
    handleGetHome();
});

$router->get('/api/manga/{slug}', function($params) {
    require_once __DIR__ . '/api/manga.php';
    handleGetManga($params['slug']);
});

$router->get('/api/chapter', function() {
    require_once __DIR__ . '/api/chapter.php';
    handleGetChapter();
});

$router->get('/api/latest', function() {
    require_once __DIR__ . '/api/latest.php';
    handleGetLatest();
});

$router->get('/api/trending', function() {
    require_once __DIR__ . '/api/trending.php';
    handleGetTrending();
});

$router->get('/api/completed', function() {
    require_once __DIR__ . '/api/completed.php';
    handleGetCompleted();
});

$router->get('/api/coming-soon', function() {
    require_once __DIR__ . '/api/coming_soon.php';
    handleGetComingSoon();
});

$router->get('/api/new-manga', function() {
    require_once __DIR__ . '/api/new_manga.php';
    handleGetNewManga();
});

$router->get('/api/genres', function() {
    require_once __DIR__ . '/api/genres.php';
    handleGetGenres();
});

$router->get('/api/genres/{slug}', function($params) {
    require_once __DIR__ . '/api/genres.php';
    handleGetGenreList($params['slug']);
});

$router->get('/api/search', function() {
    require_once __DIR__ . '/api/search.php';
    handleSearch();
});

// Auth Routes
$router->post('/api/auth/login', function() {
    require_once __DIR__ . '/api/auth.php';
    handleLogin();
});

$router->post('/api/auth/register', function() {
    require_once __DIR__ . '/api/auth.php';
    handleRegister();
});

$router->post('/api/auth/logout', function() {
    require_once __DIR__ . '/api/auth.php';
    handleLogout();
});

$router->get('/api/auth/me', function() {
    require_once __DIR__ . '/api/auth.php';
    handleGetMe();
});

// Google OAuth Routes
$router->get('/api/auth/google/url', function() {
    require_once __DIR__ . '/api/auth.php';
    handleGoogleAuthUrl();
});

$router->post('/api/auth/google/callback', function() {
    require_once __DIR__ . '/api/auth.php';
    handleGoogleCallback();
});

// Library Routes
$router->get('/api/library', function() {
    require_once __DIR__ . '/api/library.php';
    handleGetLibrary();
});

$router->post('/api/library', function() {
    require_once __DIR__ . '/api/library.php';
    handleAddLibrary();
});

$router->post('/api/library/progress', function() {
    require_once __DIR__ . '/api/library.php';
    handleUpdateProgress();
});

$router->post('/api/library/tab', function() {
    require_once __DIR__ . '/api/library.php';
    handleChangeTab();
});

$router->get('/api/library/check/{slug}', function($params) {
    require_once __DIR__ . '/api/library.php';
    handleCheckLibrary($params);
});

$router->delete('/api/library/{id}', function($params) {
    require_once __DIR__ . '/api/library.php';
    handleRemoveLibrary($params);
});
