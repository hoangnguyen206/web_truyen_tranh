<?php
require_once 'backend/config/database.php';
$stmt = $conn->query("SHOW TABLES LIKE 'chapter_views'");
var_dump($stmt->fetch_assoc());
