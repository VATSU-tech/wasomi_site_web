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
  `email` varchar(254) NOT NULL,
  `phone` varchar(60) NOT NULL,
  `program_id` varchar(191) DEFAULT NULL,
  `message` text,
  `status` varchar(40) NOT NULL DEFAULT 'new',
  `admin_notes` text,
  `deleted_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `AdmissionRequest_status_idx` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
