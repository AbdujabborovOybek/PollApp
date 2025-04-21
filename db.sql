-- 0. Foreign key cheklovlarini vaqtincha o'chirish
SET
    foreign_key_checks = 0;

-- 1. SQL sozlamalari
SET
    SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

SET
    time_zone = "+00:00";

-- 2. Userlar jadvali
CREATE TABLE
    IF NOT EXISTS `users` (
        `id` CHAR(36) NOT NULL,
        `first_name` VARCHAR(64) NOT NULL,
        `last_name` VARCHAR(64) NOT NULL,
        `email` VARCHAR(128) NOT NULL,
        `telegram_id` VARCHAR(64) NOT NULL,
        `phone` VARCHAR(64) NOT NULL,
        `joined_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY `unique_email` (`email`),
        UNIQUE KEY `unique_telegram` (`telegram_id`),
        UNIQUE KEY `unique_phone` (`phone`),
        INDEX `idx_joined_at` (`joined_at`),
        PRIMARY KEY (`id`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 3. So'rovnomalar jadvali
CREATE TABLE
    IF NOT EXISTS `polls` (
        `id` CHAR(36) NOT NULL,
        `user_id` CHAR(36) NOT NULL,
        `status` ENUM ('active', 'pending', 'completed', 'deleted') NOT NULL DEFAULT 'pending',
        `question` TEXT NOT NULL,
        `poll_type` ENUM ('single_choice', 'multiple_choice') NOT NULL DEFAULT 'single_choice',
        `type_of_poll` ENUM ('public', 'private') NOT NULL DEFAULT 'public',
        `start_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `end_time` TIMESTAMP NULL DEFAULT NULL,
        `vote_count` INT NOT NULL DEFAULT 0,
        `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        `deleted_at` TIMESTAMP NULL DEFAULT NULL,
        PRIMARY KEY (`id`),
        INDEX `idx_status` (`status`),
        INDEX `idx_created_at` (`created_at`),
        INDEX `idx_end_time` (`end_time`),
        KEY `user_id` (`user_id`),
        CONSTRAINT `polls_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 4. Poll variantlari (options) jadvali
CREATE TABLE
    IF NOT EXISTS `poll_options` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `poll_id` CHAR(36) NOT NULL,
        `option_text` VARCHAR(255) NOT NULL,
        INDEX `idx_poll_id` (`poll_id`),
        FOREIGN KEY (`poll_id`) REFERENCES `polls` (`id`) ON DELETE CASCADE
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 5. So'rovnoma natijalari
CREATE TABLE
    IF NOT EXISTS `poll_results` (
        `id` CHAR(36) NOT NULL,
        `poll_id` CHAR(36) NOT NULL,
        `user_id` CHAR(36) NOT NULL,
        `option_id` INT NOT NULL,
        `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        INDEX `idx_poll_user` (`poll_id`, `user_id`),
        INDEX `idx_option_id` (`option_id`),
        CONSTRAINT `poll_results_ibfk_1` FOREIGN KEY (`poll_id`) REFERENCES `polls` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT `poll_results_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT `poll_results_ibfk_3` FOREIGN KEY (`option_id`) REFERENCES `poll_options` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 6. Verification kodlari jadvali
CREATE TABLE
    IF NOT EXISTS `verification_codes` (
        `id` CHAR(36) NOT NULL,
        `action` ENUM (
            'login',
            'register',
            'reset_password',
            'update_profile',
            'update_poll'
        ) NOT NULL,
        `user_id` CHAR(36) DEFAULT NULL,
        `data` JSON DEFAULT NULL,
        `is_used` TINYINT (1) NOT NULL DEFAULT 0,
        `code` VARCHAR(10) NOT NULL,
        `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `confirmed_at` TIMESTAMP NULL DEFAULT NULL,
        `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        INDEX `idx_code_used` (`code`, `is_used`),
        INDEX `idx_created_at` (`created_at`),
        KEY `user_id` (`user_id`),
        CONSTRAINT `verification_codes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 7. Foreign key cheklovlarini qayta yoqish
SET
    foreign_key_checks = 1;