-- Migration: Manga and Chapter Views
CREATE TABLE IF NOT EXISTS `manga_views` (
  `manga_slug` varchar(255) NOT NULL,
  `total_views` int(11) DEFAULT 0,
  PRIMARY KEY (`manga_slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `chapter_views` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `manga_slug` varchar(255) NOT NULL,
  `chapter_api_data` varchar(255) NOT NULL,
  `chapter_name` varchar(255) NOT NULL,
  `views` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_manga_chapter` (`manga_slug`, `chapter_api_data`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
