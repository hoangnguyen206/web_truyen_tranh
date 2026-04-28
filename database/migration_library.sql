-- Migration: User Library with reading progress
-- Run this SQL on your database to create the user_library table

CREATE TABLE IF NOT EXISTS `user_library` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `manga_slug` varchar(255) NOT NULL,
  `manga_name` varchar(255) NOT NULL,
  `manga_thumb` varchar(500) DEFAULT NULL,
  `tab` enum('reading','want_to_read','completed') NOT NULL DEFAULT 'reading',
  `last_chapter_read` varchar(100) DEFAULT NULL,
  `last_chapter_url` varchar(500) DEFAULT NULL,
  `total_chapters` int(11) DEFAULT 0,
  `chapters_read` int(11) DEFAULT 0,
  `manga_status` varchar(50) DEFAULT NULL,
  `added_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_manga` (`user_id`, `manga_slug`),
  KEY `idx_user_tab` (`user_id`, `tab`),
  CONSTRAINT `fk_user_library_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
