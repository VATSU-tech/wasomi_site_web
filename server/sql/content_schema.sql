-- Contenu CMS Wasomi (tables métier). Auth déjà présent (User, Role, Media, …).

CREATE TABLE IF NOT EXISTS `Post` (
  `id` varchar(191) NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `summary` text,
  `content` longtext NOT NULL,
  `category` varchar(120) DEFAULT NULL,
  `cover_image` varchar(2048) DEFAULT NULL,
  `author_name` varchar(120) DEFAULT NULL,
  `author_avatar` varchar(2048) DEFAULT NULL,
  `author_role` varchar(120) DEFAULT NULL,
  `tags_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags_json`) OR `tags_json` IS NULL),
  `is_published` tinyint(1) NOT NULL DEFAULT 0,
  `published_at` datetime(3) DEFAULT NULL,
  `reading_time` varchar(40) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Post_slug_key` (`slug`),
  KEY `Post_published_idx` (`is_published`,`published_at`),
  KEY `Post_deleted_at_idx` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Program` (
  `id` varchar(191) NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `summary` text,
  `description` longtext,
  `duration` varchar(80) DEFAULT NULL,
  `level` varchar(80) DEFAULT NULL,
  `category` varchar(120) DEFAULT NULL,
  `price` varchar(80) DEFAULT NULL,
  `image` varchar(2048) DEFAULT NULL,
  `icon` varchar(80) DEFAULT NULL,
  `students` varchar(40) DEFAULT NULL,
  `color` varchar(120) DEFAULT NULL,
  `features_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`features_json`) OR `features_json` IS NULL),
  `fees_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`fees_json`) OR `fees_json` IS NULL),
  `schedule_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`schedule_json`) OR `schedule_json` IS NULL),
  `modules_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`modules_json`) OR `modules_json` IS NULL),
  `sort_order` int NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `deleted_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Program_slug_key` (`slug`),
  KEY `Program_active_idx` (`is_active`,`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Staff` (
  `id` varchar(191) NOT NULL,
  `name` varchar(160) NOT NULL,
  `role` varchar(160) NOT NULL,
  `bio` text,
  `bio_short` varchar(500) DEFAULT NULL,
  `avatar` varchar(2048) DEFAULT NULL,
  `department` varchar(120) DEFAULT NULL,
  `qualification` varchar(255) DEFAULT NULL,
  `email` varchar(254) DEFAULT NULL,
  `phone` varchar(60) DEFAULT NULL,
  `social_links_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`social_links_json`) OR `social_links_json` IS NULL),
  `sort_order` int NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `deleted_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `Staff_active_idx` (`is_active`,`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `GalleryCategory` (
  `id` varchar(191) NOT NULL,
  `name` varchar(120) NOT NULL,
  `slug` varchar(160) NOT NULL,
  `sort_order` int NOT NULL DEFAULT 0,
  `deleted_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `GalleryCategory_slug_key` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `GalleryItem` (
  `id` varchar(191) NOT NULL,
  `title` varchar(255) NOT NULL,
  `image_url` varchar(2048) NOT NULL,
  `category_id` varchar(191) DEFAULT NULL,
  `category_name` varchar(120) DEFAULT NULL,
  `description` text,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `date` date DEFAULT NULL,
  `tags_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags_json`) OR `tags_json` IS NULL),
  `sort_order` int NOT NULL DEFAULT 0,
  `deleted_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `GalleryItem_category_idx` (`category_id`),
  KEY `GalleryItem_featured_idx` (`is_featured`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Page` (
  `id` varchar(191) NOT NULL,
  `key` varchar(160) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` longtext,
  `metadata_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata_json`) OR `metadata_json` IS NULL),
  `updated_by_user_id` varchar(191) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Page_key_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ContactMessage` (
  `id` varchar(191) NOT NULL,
  `name` varchar(160) NOT NULL,
  `email` varchar(254) NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `phone` varchar(60) DEFAULT NULL,
  `status` varchar(40) NOT NULL DEFAULT 'new',
  `admin_notes` text,
  `deleted_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `ContactMessage_status_idx` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `AdmissionRequest` (
  `id` varchar(191) NOT NULL,
  `name` varchar(160) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `age` int DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `class_level` varchar(120) DEFAULT NULL,
  `education_level` varchar(120) DEFAULT NULL,
  `program_id` varchar(191) DEFAULT NULL,
  `email` varchar(254) NOT NULL,
  `phone` varchar(60) NOT NULL,
  `guardian_name` varchar(160) DEFAULT NULL,
  `guardian_relation` varchar(80) DEFAULT NULL,
  `guardian_phone` varchar(60) DEFAULT NULL,
  `guardian_email` varchar(254) DEFAULT NULL,
  `emergency_phone` varchar(60) DEFAULT NULL,
  `preferred_schedule` varchar(80) DEFAULT NULL,
  `source` varchar(120) DEFAULT NULL,
  `payment_mode_preference` varchar(120) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `previous_school` varchar(255) DEFAULT NULL,
  `last_grade_result` varchar(120) DEFAULT NULL,
  `start_term` varchar(120) DEFAULT NULL,
  `special_needs` text DEFAULT NULL,
  `message` text,
  `status` varchar(40) NOT NULL DEFAULT 'new',
  `admin_notes` text,
  `deleted_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `AdmissionRequest_status_idx` (`status`),
  KEY `AdmissionRequest_created_idx` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Media` (
  `id` varchar(191) NOT NULL,
  `storage_key` varchar(255) NOT NULL,
  `public_url` varchar(2048) NOT NULL,
  `original_filename` varchar(255) NOT NULL,
  `mime_type` varchar(100) NOT NULL,
  `size_bytes` bigint NOT NULL DEFAULT 0,
  `kind` varchar(40) NOT NULL DEFAULT 'image',
  `title` varchar(255) DEFAULT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  `caption` text DEFAULT NULL,
  `category` varchar(100) DEFAULT 'general',
  `folder` varchar(100) DEFAULT 'misc',
  `width` int DEFAULT NULL,
  `height` int DEFAULT NULL,
  `uploaded_by_user_id` varchar(191) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `Media_kind_idx` (`kind`),
  KEY `Media_category_idx` (`category`),
  KEY `Media_deleted_at_idx` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `User` (
  `id` varchar(191) NOT NULL,
  `email` varchar(254) NOT NULL,
  `name` varchar(160) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `email_verified_at` datetime(3) DEFAULT NULL,
  `last_login_at` datetime(3) DEFAULT NULL,
  `password_changed_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Role` (
  `id` varchar(191) NOT NULL,
  `name` varchar(100) NOT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Role_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Permission` (
  `id` varchar(191) NOT NULL,
  `key` varchar(120) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Permission_key_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `RolePermission` (
  `id` varchar(191) NOT NULL,
  `role_id` varchar(191) NOT NULL,
  `permission_id` varchar(191) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `RolePermission_role_perm_key` (`role_id`, `permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `UserRole` (
  `id` varchar(191) NOT NULL,
  `user_id` varchar(191) NOT NULL,
  `role_id` varchar(191) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `UserRole_user_role_key` (`user_id`, `role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Setting` (
  `id` varchar(191) NOT NULL,
  `key` varchar(120) NOT NULL,
  `value_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `updated_by_user_id` varchar(191) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Setting_key_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `AuditLog` (
  `id` varchar(191) NOT NULL,
  `actor_user_id` varchar(191) DEFAULT NULL,
  `action` varchar(120) NOT NULL,
  `entity_type` varchar(120) DEFAULT NULL,
  `entity_id` varchar(191) DEFAULT NULL,
  `before_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `after_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `details_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `ip_address` varchar(64) DEFAULT NULL,
  `ip_hash` varchar(191) NOT NULL DEFAULT '',
  `user_agent` varchar(255) DEFAULT NULL,
  `request_id` varchar(64) NOT NULL DEFAULT '',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `AuditLog_user_idx` (`actor_user_id`),
  KEY `AuditLog_action_idx` (`action`),
  KEY `AuditLog_created_idx` (`created_at`),
  KEY `AuditLog_entity_idx` (`entity_type`,`entity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sessions de rafraîchissement (rotation des refresh tokens).
-- Indispensable : src/middleware/auth.js fait INSERT/UPDATE/SELECT sur cette table
-- à chaque connexion et chaque renouvellement de token.
CREATE TABLE IF NOT EXISTS `RefreshSession` (
  `id` varchar(191) NOT NULL,
  `user_id` varchar(191) NOT NULL,
  `token_hash` varchar(191) NOT NULL,
  `expires_at` datetime(3) NOT NULL,
  `revoked_at` datetime(3) DEFAULT NULL,
  `replaced_by_session_id` varchar(191) DEFAULT NULL,
  `ip_hash` varchar(191) NOT NULL,
  `user_agent` varchar(512) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `RefreshSession_token_hash_key` (`token_hash`),
  KEY `RefreshSession_user_id_expires_at_idx` (`user_id`,`expires_at`),
  KEY `RefreshSession_user_id_idx` (`user_id`),
  KEY `RefreshSession_expires_at_idx` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `PasswordResetToken` (
  `id` varchar(191) NOT NULL,
  `token_hash` varchar(191) NOT NULL,
  `user_id` varchar(191) NOT NULL,
  `used_at` datetime(3) DEFAULT NULL,
  `expires_at` datetime(3) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `PasswordResetToken_token_hash_key` (`token_hash`),
  KEY `PasswordResetToken_expires_at_idx` (`expires_at`),
  KEY `PasswordResetToken_user_id_idx` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `EmailVerificationToken` (
  `id` varchar(191) NOT NULL,
  `token_hash` varchar(191) NOT NULL,
  `user_id` varchar(191) NOT NULL,
  `used_at` datetime(3) DEFAULT NULL,
  `expires_at` datetime(3) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `EmailVerificationToken_token_hash_key` (`token_hash`),
  KEY `EmailVerificationToken_expires_at_idx` (`expires_at`),
  KEY `EmailVerificationToken_user_id_idx` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `HeroSlide` (
  `id` varchar(191) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `subtitle` text,
  `image_url` varchar(2048) DEFAULT NULL,
  `video_url` varchar(2048) DEFAULT NULL,
  `cta_label` varchar(120) DEFAULT NULL,
  `cta_href` varchar(512) DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `deleted_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `HeroSlide_active_idx` (`is_active`,`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Review` (
  `id` varchar(191) NOT NULL,
  `author_name` varchar(160) NOT NULL,
  `author_role` varchar(160) DEFAULT NULL,
  `content` text NOT NULL,
  `rating` tinyint NOT NULL DEFAULT 5,
  `status` varchar(40) NOT NULL DEFAULT 'pending',
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `sort_order` int NOT NULL DEFAULT 0,
  `admin_notes` text,
  `deleted_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `Review_status_idx` (`status`,`is_featured`,`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `SchoolClass` (
  `id` varchar(191) NOT NULL,
  `section` varchar(120) NOT NULL,
  `option_name` varchar(120) DEFAULT NULL,
  `class_name` varchar(160) NOT NULL,
  `label` varchar(255) DEFAULT NULL,
  `is_open` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int NOT NULL DEFAULT 0,
  `deleted_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `SchoolClass_open_idx` (`is_open`,`section`,`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

