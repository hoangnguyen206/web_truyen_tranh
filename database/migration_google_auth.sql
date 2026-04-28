-- MangaFlow Database Schema Update
-- Run this after the initial truyentranh1.sql import

-- Add google_id column to users table if not exists
ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `google_id` varchar(100) DEFAULT NULL AFTER `google_auth_secret`;

-- Ensure password column allows NULL (for Google-only accounts)
ALTER TABLE `users` MODIFY `password` varchar(255) DEFAULT NULL;

-- Add created_at column if not exists
ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `created_at` timestamp DEFAULT CURRENT_TIMESTAMP AFTER `score`;
