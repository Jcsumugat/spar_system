-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 30, 2025 at 02:55 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `spar_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `action` varchar(255) NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL,
  `description` text NOT NULL,
  `changes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`changes`)),
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `businesses`
--

CREATE TABLE `businesses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `business_name` varchar(255) NOT NULL,
  `owner_name` varchar(255) NOT NULL,
  `business_type` enum('Food Establishment','Non-Food Establishment') NOT NULL,
  `address` text NOT NULL,
  `barangay` varchar(255) NOT NULL,
  `contact_number` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `establishment_category` enum('Restaurant','Bakery','Sari-Sari Store','Carinderia','Food Cart','Grocery','Retail Store','Salon','Other') DEFAULT NULL,
  `number_of_employees` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `permit_status` enum('pending','renewal_pending','approved','renewed','rejected','expired') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `businesses`
--

INSERT INTO `businesses` (`id`, `business_name`, `owner_name`, `business_type`, `address`, `barangay`, `contact_number`, `email`, `establishment_category`, `number_of_employees`, `is_active`, `permit_status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(2, 'Tibiao Bakery', 'Roberto Santos', 'Food Establishment', 'Block 1, Caraudan', 'San Pedro', '09123456789', 'tibiaobakery@gmail.com', 'Bakery', 5, 1, 'pending', '2025-10-28 09:12:08', '2025-10-28 09:12:08', NULL),
(3, 'Carinderia ni Aling Rosa', 'Rosa Dela Cruz', 'Food Establishment', 'Block 2, Bongbongan II', 'Alegre', '09187654321', NULL, 'Carinderia', 3, 1, 'pending', '2025-10-28 09:12:08', '2025-10-28 09:12:08', NULL),
(4, 'Sari-Sari Store ni Nene', 'Nena Garcia', 'Non-Food Establishment', 'Block 3, Castillo', 'Supa', '09198765432', NULL, 'Sari-Sari Store', 2, 1, 'pending', '2025-10-28 09:12:08', '2025-10-28 09:12:08', NULL),
(5, 'Tibiao Meat Shop', 'Carlos Reyes', 'Food Establishment', 'Block 4, Lindero', 'Nica-an', '09156789012', NULL, 'Grocery', 4, 1, 'pending', '2025-10-28 09:12:08', '2025-10-28 09:12:08', NULL),
(6, 'Liza\'s Beauty Salon', 'Liza Mendoza', 'Non-Food Establishment', 'Block 5, Alegre', 'Malacañang', '09167890123', NULL, 'Salon', 3, 1, 'pending', '2025-10-28 09:12:08', '2025-10-28 09:12:08', NULL),
(7, 'Manong\'s Food Cart', 'Manuel Torres', 'Food Establishment', 'Block 6, Tigbaboy', 'Bagacay', '09178901234', NULL, 'Food Cart', 1, 1, 'pending', '2025-10-28 09:12:08', '2025-10-28 09:12:08', NULL),
(8, 'Tibiao Mini Mart', 'Antonio Ramos', 'Food Establishment', 'Block 7, El Progreso', 'Cubay', '09189012345', 'tibiaominimart@yahoo.com', 'Grocery', 8, 1, 'pending', '2025-10-28 09:12:08', '2025-10-28 09:12:08', NULL),
(9, 'Ate Mely\'s Restaurant', 'Melinda Cruz', 'Food Establishment', 'Block 8, Bagacay', 'Poblacion', '09190123456', NULL, 'Restaurant', 6, 1, 'pending', '2025-10-28 09:12:09', '2025-10-28 09:12:09', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('laravel-cache-jcsumugatd@gmail.com|127.0.0.1', 'i:1;', 1761820433),
('laravel-cache-jcsumugatd@gmail.com|127.0.0.1:timer', 'i:1761820433;', 1761820433);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `document_attachments`
--

CREATE TABLE `document_attachments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `attachable_id` bigint(20) UNSIGNED NOT NULL,
  `attachable_type` varchar(255) NOT NULL,
  `document_type` varchar(255) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_type` varchar(50) NOT NULL,
  `file_size` bigint(20) UNSIGNED NOT NULL,
  `uploaded_by` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inspections`
--

CREATE TABLE `inspections` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `inspection_number` varchar(255) NOT NULL,
  `business_id` bigint(20) UNSIGNED NOT NULL,
  `permit_id` bigint(20) UNSIGNED DEFAULT NULL,
  `lab_report_id` bigint(20) UNSIGNED DEFAULT NULL,
  `inspection_date` date NOT NULL,
  `inspection_time` time DEFAULT NULL,
  `inspector_id` bigint(20) UNSIGNED NOT NULL,
  `inspection_type` enum('Initial','Renewal') NOT NULL,
  `result` enum('Approved','Denied','Pending') DEFAULT 'Pending',
  `overall_score` decimal(5,2) DEFAULT NULL,
  `findings` text DEFAULT NULL,
  `recommendations` text DEFAULT NULL,
  `follow_up_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inspections`
--

INSERT INTO `inspections` (`id`, `inspection_number`, `business_id`, `permit_id`, `lab_report_id`, `inspection_date`, `inspection_time`, `inspector_id`, `inspection_type`, `result`, `overall_score`, `findings`, `recommendations`, `follow_up_date`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'INS-2024-0001', 2, 1, NULL, '2025-09-23', '09:00:00', 12, 'Initial', 'Pending', 76.00, 'Business premises are generally well-maintained and comply with sanitation standards.', 'Continue maintaining current standards. Minor improvements recommended for food storage area.', NULL, '2025-10-28 09:12:08', '2025-10-30 12:39:57', NULL),
(4, 'INS-2024-0004', 5, 4, NULL, '2025-03-23', '09:00:00', 11, 'Renewal', 'Pending', 89.00, 'Business premises are generally well-maintained and comply with sanitation standards.', 'Continue maintaining current standards. Minor improvements recommended for food storage area.', NULL, '2025-10-28 09:12:08', '2025-10-30 12:39:57', NULL),
(5, 'INS-2024-0005', 6, 5, NULL, '2025-03-23', '09:00:00', 11, 'Renewal', 'Pending', 87.00, 'Business premises are generally well-maintained and comply with sanitation standards.', 'Continue maintaining current standards. Minor improvements recommended for food storage area.', NULL, '2025-10-28 09:12:08', '2025-10-30 12:39:57', NULL),
(6, 'INS-2024-0006', 7, 6, NULL, '2024-12-23', '09:00:00', 12, 'Renewal', 'Pending', 92.00, 'Business premises are generally well-maintained and comply with sanitation standards.', 'Continue maintaining current standards. Minor improvements recommended for food storage area.', NULL, '2025-10-28 09:12:08', '2025-10-30 12:39:57', NULL),
(7, 'INS-2024-0007', 8, 7, NULL, '2025-06-23', '09:00:00', 12, 'Renewal', 'Pending', 86.00, 'Business premises are generally well-maintained and comply with sanitation standards.', 'Continue maintaining current standards. Minor improvements recommended for food storage area.', NULL, '2025-10-28 09:12:09', '2025-10-30 12:39:57', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lab_reports`
--

CREATE TABLE `lab_reports` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `business_id` bigint(20) UNSIGNED NOT NULL,
  `application_type` enum('new','renewal') NOT NULL COMMENT 'Type of permit application',
  `submitted_by` bigint(20) UNSIGNED NOT NULL COMMENT 'User who submitted the report',
  `inspected_by` bigint(20) UNSIGNED DEFAULT NULL COMMENT 'Lab inspector who reviewed',
  `fecalysis_photo` varchar(255) NOT NULL COMMENT 'Path to fecalysis examination photo',
  `xray_sputum_photo` varchar(255) NOT NULL COMMENT 'Path to X-ray/Sputum examination photo',
  `receipt_photo` varchar(255) NOT NULL COMMENT 'Path to receipt photo',
  `dti_photo` varchar(255) NOT NULL COMMENT 'Path to DTI document photo',
  `fecalysis_result` enum('pass','fail') NOT NULL,
  `xray_sputum_result` enum('pass','fail') NOT NULL,
  `receipt_result` enum('pass','fail') NOT NULL,
  `dti_result` enum('pass','fail') NOT NULL,
  `fecalysis_remarks` text DEFAULT NULL,
  `xray_sputum_remarks` text DEFAULT NULL,
  `receipt_remarks` text DEFAULT NULL,
  `dti_remarks` text DEFAULT NULL,
  `general_remarks` text DEFAULT NULL COMMENT 'General remarks from submitter',
  `inspector_remarks` text DEFAULT NULL COMMENT 'Remarks from lab inspector',
  `status` enum('pending','approved','rejected','failed') NOT NULL DEFAULT 'pending',
  `overall_result` enum('pass','fail') NOT NULL COMMENT 'Overall result based on all tests',
  `submitted_at` timestamp NULL DEFAULT NULL COMMENT 'When the report was submitted',
  `inspected_at` timestamp NULL DEFAULT NULL COMMENT 'When the report was inspected',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `lab_reports`
--

INSERT INTO `lab_reports` (`id`, `business_id`, `application_type`, `submitted_by`, `inspected_by`, `fecalysis_photo`, `xray_sputum_photo`, `receipt_photo`, `dti_photo`, `fecalysis_result`, `xray_sputum_result`, `receipt_result`, `dti_result`, `fecalysis_remarks`, `xray_sputum_remarks`, `receipt_remarks`, `dti_remarks`, `general_remarks`, `inspector_remarks`, `status`, `overall_result`, `submitted_at`, `inspected_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 2, 'new', 16, NULL, 'lab-reports/fecalysis/80AwErf84pjg9vW5o16TjVgfPdRWModKzMBprFsj.jpg', 'lab-reports/xray-sputum/S45PVmc9aiBA7mYvfbYcP1wdaOROegneDciTDGKu.jpg', 'lab-reports/receipts/lNqhZ87IwPLcF48wHAgM7QOK5282KgtKMV646hDm.jpg', 'lab-reports/dti/B85LRe8CQS8f6p1U62ts5iKPVv8ZhbtJEtc7teNi.jpg', 'pass', 'pass', 'pass', 'pass', NULL, NULL, NULL, NULL, NULL, NULL, 'pending', 'pass', '2025-10-29 05:25:02', NULL, '2025-10-29 05:25:02', '2025-10-30 04:19:22', '2025-10-30 04:19:22');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(5, '2025_10_29_122406_create_lab_reports_table', 2);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `business_id` bigint(20) UNSIGNED DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `notification_type` enum('Permit Expiring','Inspection Scheduled','Inspection Completed','Violation Issued','Renewal Required','Permit Approved','Permit Rejected') NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permit_renewals`
--

CREATE TABLE `permit_renewals` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `previous_permit_id` bigint(20) UNSIGNED NOT NULL,
  `new_permit_id` bigint(20) UNSIGNED DEFAULT NULL,
  `business_id` bigint(20) UNSIGNED NOT NULL,
  `renewal_request_date` date NOT NULL,
  `renewal_status` enum('Pending','Under Review','Inspection Required','Approved','Rejected') DEFAULT 'Pending',
  `rejection_reason` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sanitary_permits`
--

CREATE TABLE `sanitary_permits` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `permit_number` varchar(255) NOT NULL,
  `business_id` bigint(20) UNSIGNED NOT NULL,
  `permit_type` enum('New','Renewal') NOT NULL,
  `issue_date` date NOT NULL,
  `expiry_date` date NOT NULL,
  `status` enum('Active','Expiring Soon','Expired','Suspended','Revoked','Pending') DEFAULT 'Pending',
  `issued_by` bigint(20) UNSIGNED DEFAULT NULL,
  `approved_by` bigint(20) UNSIGNED DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sanitary_permits`
--

INSERT INTO `sanitary_permits` (`id`, `permit_number`, `business_id`, `permit_type`, `issue_date`, `expiry_date`, `status`, `issued_by`, `approved_by`, `remarks`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'SP-2024-0001', 2, 'New', '2025-09-28', '2026-09-28', 'Active', 11, 10, NULL, '2025-10-28 09:12:08', '2025-10-28 09:12:08', NULL),
(2, 'SP-2024-0002', 3, 'New', '2025-08-28', '2026-08-28', 'Active', 11, 10, NULL, '2025-10-28 09:12:08', '2025-10-28 09:12:08', NULL),
(3, 'SP-2024-0003', 4, 'Renewal', '2025-06-28', '2026-06-28', 'Active', 11, 10, NULL, '2025-10-28 09:12:08', '2025-10-28 09:12:08', NULL),
(4, 'SP-2024-0004', 5, 'Renewal', '2025-03-28', '2026-03-28', 'Active', 11, 10, NULL, '2025-10-28 09:12:08', '2025-10-28 09:12:08', NULL),
(5, 'SP-2024-0005', 6, 'Renewal', '2025-03-28', '2026-03-28', 'Active', 11, 10, NULL, '2025-10-28 09:12:08', '2025-10-28 09:12:08', NULL),
(6, 'SP-2024-0006', 7, 'Renewal', '2024-12-28', '2025-12-28', 'Active', 11, 10, NULL, '2025-10-28 09:12:08', '2025-10-28 09:12:08', NULL),
(7, 'SP-2024-0007', 8, 'Renewal', '2025-06-28', '2026-06-28', 'Active', 11, 10, NULL, '2025-10-28 09:12:08', '2025-10-28 09:12:08', NULL),
(8, 'SP-2024-0008', 9, 'Renewal', '2025-07-28', '2026-07-28', 'Active', 11, 10, NULL, '2025-10-28 09:12:09', '2025-10-28 09:12:09', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('G4Tp6uIw0OH9hABK6xXd2NZUoD82B5jEKii8fBef', 16, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiQmY2Y3VuR1FPWGZ5cXJVdEVnUkFMZ2JJTUNyWE9taGVKT1FxTUpsMiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9pbnNwZWN0aW9ucyI7czo1OiJyb3V0ZSI7czoxNzoiaW5zcGVjdGlvbnMuaW5kZXgiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aToxNjt9', 1761832493);

-- --------------------------------------------------------

--
-- Table structure for table `system_settings`
--

CREATE TABLE `system_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `key` varchar(255) NOT NULL,
  `value` text DEFAULT NULL,
  `type` varchar(50) DEFAULT 'string',
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('Admin','Municipal Health Officer','Sanitary Inspector','Staff') DEFAULT 'Staff',
  `position` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `role`, `position`, `is_active`, `remember_token`, `created_at`, `updated_at`) VALUES
(9, 'Admin User', 'admin@tibiao.gov.ph', NULL, '$2y$12$EwDqY76TreJkJi0XwoIzEehGtXl8LX2v7tDYzWQiprrkh6Ns1.bNS', 'Admin', 'System Administrator', 1, NULL, '2025-10-28 09:12:06', '2025-10-28 09:12:06'),
(10, 'Dr. Maria Santos', 'mho@tibiao.gov.ph', NULL, '$2y$12$R5zYMfcPuTf/t4fTeK5pEOZ26LzaxJrB4517AE4sJMDMGKECZ515G', 'Municipal Health Officer', 'Municipal Health Officer', 1, NULL, '2025-10-28 09:12:07', '2025-10-28 09:12:07'),
(11, 'Juan Dela Cruz', 'inspector1@tibiao.gov.ph', NULL, '$2y$12$FxhLDGgAbXcomIrjFO5IWOLF7tVl1D2K9y7LlyBJ7kj5Vf8v1wNTC', 'Sanitary Inspector', 'Sanitary Inspector I', 1, NULL, '2025-10-28 09:12:07', '2025-10-28 09:12:07'),
(12, 'Maria Garcia', 'inspector2@tibiao.gov.ph', NULL, '$2y$12$a4Avbwswz6WKugSg1amSGuwY5O3fOIh63QtAToER7uHeKQ1W8MPYm', 'Sanitary Inspector', 'Sanitary Inspector II', 1, NULL, '2025-10-28 09:12:08', '2025-10-28 09:12:08'),
(13, 'Pedro Reyes', 'staff@tibiao.gov.ph', NULL, '$2y$12$Sucu.SlAdeM7dF.nLRj99.OD2NZAogc.FVNv3yL9wKhf70D7boVxC', 'Staff', 'Administrative Aide', 1, NULL, '2025-10-28 09:12:08', '2025-10-28 09:12:08'),
(16, 'Jc Sumugat', 'jcsumugatxd@gmail.com', NULL, '$2y$12$Tc2KJJinmABupzeMgltXGuwWPlC.I8TcjThrU9A8/L8rPcfzUx4oy', 'Admin', 'Lab Inspector', 1, NULL, '2025-10-28 17:12:08', '2025-10-28 17:12:08');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `businesses`
--
ALTER TABLE `businesses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `document_attachments`
--
ALTER TABLE `document_attachments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uploaded_by` (`uploaded_by`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `inspections`
--
ALTER TABLE `inspections`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `inspection_number` (`inspection_number`),
  ADD KEY `business_id` (`business_id`),
  ADD KEY `permit_id` (`permit_id`),
  ADD KEY `inspector_id` (`inspector_id`),
  ADD KEY `lab_report_id` (`lab_report_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lab_reports`
--
ALTER TABLE `lab_reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lab_reports_submitted_by_foreign` (`submitted_by`),
  ADD KEY `lab_reports_inspected_by_foreign` (`inspected_by`),
  ADD KEY `lab_reports_business_id_index` (`business_id`),
  ADD KEY `lab_reports_status_index` (`status`),
  ADD KEY `lab_reports_application_type_index` (`application_type`),
  ADD KEY `lab_reports_submitted_at_index` (`submitted_at`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `business_id` (`business_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `permit_renewals`
--
ALTER TABLE `permit_renewals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `previous_permit_id` (`previous_permit_id`),
  ADD KEY `new_permit_id` (`new_permit_id`),
  ADD KEY `business_id` (`business_id`);

--
-- Indexes for table `sanitary_permits`
--
ALTER TABLE `sanitary_permits`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permit_number` (`permit_number`),
  ADD KEY `business_id` (`business_id`),
  ADD KEY `issued_by` (`issued_by`),
  ADD KEY `approved_by` (`approved_by`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `system_settings`
--
ALTER TABLE `system_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `key` (`key`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `businesses`
--
ALTER TABLE `businesses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `document_attachments`
--
ALTER TABLE `document_attachments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inspections`
--
ALTER TABLE `inspections`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lab_reports`
--
ALTER TABLE `lab_reports`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `permit_renewals`
--
ALTER TABLE `permit_renewals`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sanitary_permits`
--
ALTER TABLE `sanitary_permits`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `system_settings`
--
ALTER TABLE `system_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `document_attachments`
--
ALTER TABLE `document_attachments`
  ADD CONSTRAINT `document_attachments_ibfk_1` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `inspections`
--
ALTER TABLE `inspections`
  ADD CONSTRAINT `inspections_ibfk_1` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `inspections_ibfk_2` FOREIGN KEY (`permit_id`) REFERENCES `sanitary_permits` (`id`),
  ADD CONSTRAINT `inspections_ibfk_3` FOREIGN KEY (`inspector_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `inspections_ibfk_4` FOREIGN KEY (`lab_report_id`) REFERENCES `lab_reports` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `lab_reports`
--
ALTER TABLE `lab_reports`
  ADD CONSTRAINT `lab_reports_business_id_foreign` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `lab_reports_inspected_by_foreign` FOREIGN KEY (`inspected_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `lab_reports_submitted_by_foreign` FOREIGN KEY (`submitted_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`),
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `permit_renewals`
--
ALTER TABLE `permit_renewals`
  ADD CONSTRAINT `permit_renewals_ibfk_1` FOREIGN KEY (`previous_permit_id`) REFERENCES `sanitary_permits` (`id`),
  ADD CONSTRAINT `permit_renewals_ibfk_2` FOREIGN KEY (`new_permit_id`) REFERENCES `sanitary_permits` (`id`),
  ADD CONSTRAINT `permit_renewals_ibfk_3` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sanitary_permits`
--
ALTER TABLE `sanitary_permits`
  ADD CONSTRAINT `sanitary_permits_ibfk_1` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sanitary_permits_ibfk_2` FOREIGN KEY (`issued_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `sanitary_permits_ibfk_3` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
