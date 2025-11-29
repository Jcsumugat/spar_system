-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 29, 2025 at 02:22 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

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

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `model_type`, `model_id`, `description`, `changes`, `ip_address`, `created_at`, `updated_at`) VALUES
(1, 16, 'created', 'App\\Models\\Business', 10, 'Created business Tibiao Bakery', NULL, '127.0.0.1', '2025-10-30 06:20:47', '2025-10-30 06:20:47'),
(2, 16, 'approved', 'App\\Models\\Inspection', 10, 'Approved inspection INS-2025-0009 and issued permit SP-2025--0007', NULL, '127.0.0.1', '2025-11-01 04:38:10', '2025-11-01 04:38:10'),
(3, 16, 'updated', 'App\\Models\\Inspection', 11, 'Saved progress for inspection INS-2025-0010', NULL, '127.0.0.1', '2025-11-01 04:46:31', '2025-11-01 04:46:31'),
(4, 16, 'updated', 'App\\Models\\Inspection', 11, 'Saved progress for inspection INS-2025-0010', NULL, '127.0.0.1', '2025-11-01 04:46:38', '2025-11-01 04:46:38'),
(5, 16, 'updated', 'App\\Models\\Inspection', 11, 'Saved progress for inspection INS-2025-0010', NULL, '127.0.0.1', '2025-11-01 04:47:00', '2025-11-01 04:47:00'),
(6, 16, 'updated', 'App\\Models\\Inspection', 11, 'Saved progress for inspection INS-2025-0010', NULL, '127.0.0.1', '2025-11-01 04:48:52', '2025-11-01 04:48:52'),
(7, 16, 'updated', 'App\\Models\\Inspection', 11, 'Saved progress for inspection INS-2025-0010', NULL, '127.0.0.1', '2025-11-01 04:49:35', '2025-11-01 04:49:35'),
(8, 16, 'approved', 'App\\Models\\Inspection', 12, 'Approved inspection INS-2025-0001 and issued permit SP-2025-00001', NULL, '127.0.0.1', '2025-11-01 05:12:10', '2025-11-01 05:12:10'),
(9, 17, 'created', 'App\\Models\\Business', 11, 'Created business Carinderia ni aling Rosa', NULL, '127.0.0.1', '2025-11-02 22:24:39', '2025-11-02 22:24:39'),
(10, 16, 'created', 'App\\Models\\Business', 12, 'Created business SAmple', NULL, '127.0.0.1', '2025-11-02 22:30:30', '2025-11-02 22:30:30'),
(11, 16, 'created', 'App\\Models\\Business', 13, 'Created business sample', NULL, '127.0.0.1', '2025-11-02 22:38:10', '2025-11-02 22:38:10'),
(12, 16, 'printed', 'App\\Models\\SanitaryPermit', 9, 'Printed sanitary permit SP-2025-00001', NULL, '127.0.0.1', '2025-11-03 02:06:32', '2025-11-03 02:06:32'),
(13, 16, 'denied', 'App\\Models\\Inspection', 15, 'Denied inspection INS-2025-0004', NULL, '127.0.0.1', '2025-11-04 22:14:07', '2025-11-04 22:14:07'),
(14, 16, 'deleted', 'App\\Models\\Business', 12, 'Deleted business SAmple', NULL, '127.0.0.1', '2025-11-06 05:35:56', '2025-11-06 05:35:56'),
(15, 16, 'deleted', 'App\\Models\\Business', 13, 'Deleted business sample', NULL, '127.0.0.1', '2025-11-06 05:36:01', '2025-11-06 05:36:01'),
(16, 16, 'approved', 'App\\Models\\Inspection', 16, 'Approved inspection INS-2025-0005 and issued permit SP-2025-00002', NULL, '127.0.0.1', '2025-11-06 05:41:46', '2025-11-06 05:41:46'),
(17, 16, 'approved', 'App\\Models\\Inspection', 17, 'Approved inspection INS-2025-0006 and issued permit SP-2025-00003', NULL, '127.0.0.1', '2025-11-06 06:08:31', '2025-11-06 06:08:31'),
(18, 16, 'approved', 'App\\Models\\Inspection', 18, 'Approved inspection INS-2025-0007 and issued permit SP-2025-00004', NULL, '127.0.0.1', '2025-11-06 06:19:47', '2025-11-06 06:19:47'),
(19, 16, 'approved', 'App\\Models\\Inspection', 19, 'Approved inspection INS-2025-0008 and issued permit SP-2025-00005', NULL, '127.0.0.1', '2025-11-06 16:55:00', '2025-11-06 16:55:00'),
(20, 16, 'approved', 'App\\Models\\Inspection', 20, 'Approved inspection INS-2025-0009 and issued permit SP-2025-00006', NULL, '127.0.0.1', '2025-11-06 23:02:01', '2025-11-06 23:02:01'),
(21, 16, 'created', 'App\\Models\\Business', 14, 'Created business Example', NULL, '127.0.0.1', '2025-11-29 03:19:09', '2025-11-29 03:19:09'),
(22, 16, 'approved', 'App\\Models\\Inspection', 21, 'Approved inspection INS-2025-0001 and issued permit SP-2025-00007', NULL, '127.0.0.1', '2025-11-29 04:33:40', '2025-11-29 04:33:40');

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
  `establishment_category` enum('Restaurant','Bakery','Sari-Sari Store','Carinderia','Food Cart','Grocery','Retail Store','Salon','Fast Food','Cafeteria','Catering Service','Canteen','Food Cart/Stall','Grocery Store','Meat Shop','Seafood Market','Salon/Barber Shop','Spa/Massage Center','Hotel/Inn/Lodging','School/Day Care','Clinic/Hospital','Funeral Parlor','Mall/Shopping Center','Market','Public Pool/Resort','Gym/Fitness Center','Others','Other') DEFAULT NULL,
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
(2, 'Tibiao Bakery', 'Roberto Santos', 'Food Establishment', 'Tibiao, Antique, Philippines', 'Poblacion', '09123456789', 'tibiaobakery@gmail.com', 'Bakery', 5, 1, 'pending', '2025-10-28 09:12:08', '2025-11-29 12:06:35', NULL),
(3, 'Carinderia ni Aling Rosa', 'Rosa Dela Cruz', 'Food Establishment', 'Tibiao, Antique, Philippines', 'Alegre', '09187654321', NULL, 'Carinderia', 3, 1, 'pending', '2025-10-28 09:12:08', '2025-11-29 12:06:35', NULL),
(4, 'Sari-Sari Store ni Nene', 'Nena Garcia', 'Non-Food Establishment', 'Tibiao, Antique, Philippines', 'Castillo', '09198765432', NULL, 'Sari-Sari Store', 2, 1, 'pending', '2025-10-28 09:12:08', '2025-11-29 12:06:35', NULL),
(5, 'Tibiao Meat Shop', 'Carlos Reyes', 'Food Establishment', 'Tibiao, Antique, Philippines', 'Importante', '09156789012', NULL, 'Grocery', 4, 1, 'pending', '2025-10-28 09:12:08', '2025-11-29 12:06:36', NULL),
(6, 'Liza\'s Beauty Salon', 'Liza Mendoza', 'Non-Food Establishment', 'Tibiao, Antique, Philippines', 'Alegre', '09167890123', NULL, 'Salon', 3, 1, 'pending', '2025-10-28 09:12:08', '2025-11-29 12:06:36', NULL),
(7, 'Manong\'s Food Cart', 'Manuel Torres', 'Food Establishment', 'Tibiao, Antique, Philippines', 'Tigbaboy', '09178901234', NULL, 'Food Cart', 1, 1, 'pending', '2025-10-28 09:12:08', '2025-11-29 12:06:36', NULL),
(8, 'Tibiao Mini Mart', 'Antonio Ramos', 'Food Establishment', 'Tibiao, Antique, Philippines', 'Poblacion', '09189012345', 'tibiaominimart@yahoo.com', 'Grocery', 8, 1, 'pending', '2025-10-28 09:12:08', '2025-11-29 12:06:36', NULL),
(9, 'Ate Mely\'s Restaurant', 'Melinda Cruz', 'Food Establishment', 'Tibiao, Antique, Philippines', 'Poblacion', '09190123456', NULL, 'Restaurant', 6, 1, 'pending', '2025-10-28 09:12:09', '2025-11-29 12:06:36', NULL),
(10, 'Tibiao Bakery', 'John Carlo Sumugat', 'Food Establishment', 'Tibiao, Antique, Philippines', 'Poblacion', '09567460163', 'jcsumugatxd@gmail.com', 'Bakery', 5, 1, 'pending', '2025-10-30 06:20:47', '2025-11-29 12:05:30', NULL),
(11, 'Carinderia ni aling Rosa', 'Rosa A. Amar', 'Food Establishment', 'Tibiao, Antique, Philippines', 'Malabor', '09567460163', 'rosa@gmail.com', 'Restaurant', 3, 1, 'pending', '2025-11-02 22:24:39', '2025-11-29 12:03:40', NULL),
(12, 'SAmple', 'sample', 'Food Establishment', 'Tibiao, Antique, Philippines', 'Malabor', '09567460163', 'jcsumugatxd@gmail.com', 'Restaurant', 6, 1, 'pending', '2025-11-02 22:30:30', '2025-11-29 12:03:40', '2025-11-06 05:35:56'),
(13, 'sample', 'asasasa', 'Food Establishment', 'Tibiao, Antique, Philippines', 'Malabor', '09567460163', 'jcsumugatxd@gmail.com', 'Restaurant', 4, 1, 'pending', '2025-11-02 22:38:10', '2025-11-29 12:03:40', '2025-11-06 05:36:01'),
(14, 'Example', 'Sandro S. Farren', 'Food Establishment', 'Tibiao, Antique, Philippines', 'Tigbaboy', '09567460163', 'jcsumugatxd@gmail.com', 'Restaurant', 3, 1, 'pending', '2025-11-29 03:19:09', '2025-11-29 12:03:40', NULL);

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
('laravel-cache-ricamaeremoting@gmail.com|127.0.0.1', 'i:1;', 1764053711),
('laravel-cache-ricamaeremoting@gmail.com|127.0.0.1:timer', 'i:1764053711;', 1764053711),
('laravel-cache-ricaremoting@gmail.com|127.0.0.1', 'i:1;', 1764053734),
('laravel-cache-ricaremoting@gmail.com|127.0.0.1:timer', 'i:1764053734;', 1764053734);

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
  `inspection_type` enum('Initial','Renewal','Follow-up','Complaint-based','Random') NOT NULL,
  `result` enum('Approved','Denied','Pending') DEFAULT 'Pending',
  `overall_score` decimal(5,2) DEFAULT NULL,
  `findings` text DEFAULT NULL,
  `recommendations` text DEFAULT NULL,
  `fecalysis_inspector_remarks` text DEFAULT NULL,
  `xray_sputum_inspector_remarks` text DEFAULT NULL,
  `receipt_inspector_remarks` text DEFAULT NULL,
  `dti_inspector_remarks` text DEFAULT NULL,
  `follow_up_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inspections`
--

INSERT INTO `inspections` (`id`, `inspection_number`, `business_id`, `permit_id`, `lab_report_id`, `inspection_date`, `inspection_time`, `inspector_id`, `inspection_type`, `result`, `overall_score`, `findings`, `recommendations`, `fecalysis_inspector_remarks`, `xray_sputum_inspector_remarks`, `receipt_inspector_remarks`, `dti_inspector_remarks`, `follow_up_date`, `created_at`, `updated_at`, `deleted_at`) VALUES
(21, 'INS-2025-0001', 14, 15, NULL, '2025-12-02', '09:00:00', 16, 'Initial', 'Approved', NULL, 'Lab report submitted on November 29, 2025. Physical inspection scheduled for new application.', 'Conduct on-site inspection to verify compliance with sanitary standards.', NULL, NULL, NULL, NULL, NULL, '2025-11-29 03:51:15', '2025-11-29 04:33:40', NULL);

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
  `fecalysis_result` varchar(255) DEFAULT NULL,
  `xray_sputum_result` varchar(255) DEFAULT NULL,
  `receipt_result` varchar(255) DEFAULT NULL,
  `dti_result` varchar(255) DEFAULT NULL,
  `fecalysis_remarks` text DEFAULT NULL,
  `xray_sputum_remarks` text DEFAULT NULL,
  `receipt_remarks` text DEFAULT NULL,
  `dti_remarks` text DEFAULT NULL,
  `general_remarks` text DEFAULT NULL COMMENT 'General remarks from submitter',
  `inspector_remarks` text DEFAULT NULL COMMENT 'Remarks from lab inspector',
  `status` enum('pending','approved','rejected','failed') NOT NULL DEFAULT 'pending',
  `overall_result` varchar(255) DEFAULT NULL,
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
(5, 2, 'new', 16, 16, 'lab-reports/fecalysis/b4wV0hGxTlPmOsKKjXJ5FQooNnKubw6mmzQILPXm.png', 'lab-reports/xray-sputum/8ZiFeaySKxhWSszwZQdh4bRhXccMdb8QMORk7oPn.jpg', 'lab-reports/receipts/xStBdnwSGJGD6GyG7u2nJ8k4qHtS1MX2mt9FC0ge.jpg', 'lab-reports/dti/qUN0Xx1Mj7UkVYMNsjcmEL9f0U7PHDqMDAodb6CL.jpg', 'pass', 'pass', 'pass', 'pass', NULL, NULL, NULL, NULL, NULL, 'Conduct on-site inspection to verify compliance with sanitary standards.', 'approved', 'pass', '2025-11-01 05:11:47', '2025-11-01 05:12:10', '2025-11-01 05:11:47', '2025-11-01 05:12:10', NULL),
(6, 3, 'new', 16, NULL, 'lab-reports/fecalysis/9UATpzqgSZtTUoTN2pskpyjvSHkhvr8doBuYOPqB.png', 'lab-reports/xray-sputum/MmmoFvUphrwAXhBXttUJvjfkXeGx6Br28Kj76i5M.jpg', 'lab-reports/receipts/PnJNdsZzESufffJdT40Rr1Z5IsJiflRR22LvGFvt.jpg', 'lab-reports/dti/HAfTgmVnGVTuBwoa8IWeJkRt94n3NwsxQdp5nsGm.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'pending', NULL, '2025-11-01 06:18:38', NULL, '2025-11-01 06:18:38', '2025-11-06 05:37:16', '2025-11-06 05:37:16'),
(7, 13, 'new', 16, NULL, 'lab-reports/fecalysis/jUWIWlJifDyF5esCIaCct31zoxXdodBpu8nuSivm.png', 'lab-reports/xray-sputum/8MGf8g8NrBay2imewvfevll0WAFbMkY1mI7HTWSk.png', 'lab-reports/receipts/diVMMrwTUbYFaxtjYPmomjRS1asmC9OkFPZJoYPQ.jpg', 'lab-reports/dti/3eRsHH8bRCiueWKKPE3VCLJebUHdE5ahRomAKwR6.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'pending', NULL, '2025-11-02 22:52:26', NULL, '2025-11-02 22:52:26', '2025-11-06 05:24:33', '2025-11-06 05:24:33'),
(8, 5, 'new', 16, 16, 'lab-reports/fecalysis/lqH3VExaZTYIDKhmP3RbRCR7jGlguEkLjl0bbYkB.png', 'lab-reports/xray-sputum/ILt4yg4tJ91tMqr7pIkPhy15eS6OrycDFy4uH0oy.jpg', 'lab-reports/receipts/8MsSntq40Lobg4uzO0QAqO1a6qob47IFMuTUuwE7.jpg', 'lab-reports/dti/okCe7StrB5Qq4WjCcvwBQgM4MtmKm4Az8B8aYiBg.jpg', 'fail', 'fail', 'pass', 'fail', NULL, NULL, NULL, NULL, NULL, 'Lab report submitted on November 05, 2025. Physical inspection scheduled for new application.', 'rejected', 'fail', '2025-11-04 21:21:15', '2025-11-04 22:14:07', '2025-11-04 21:21:15', '2025-11-04 22:14:07', NULL),
(9, 7, 'new', 17, 16, 'lab-reports/fecalysis/7qYQuOGDVAqjg3VtvG2BWFdmKrAGabsy5kMB0QCn.png', 'lab-reports/xray-sputum/YEoN6pc4EHwPMA30kndd8fJdVWF4xmdzDYGalcDg.jpg', 'lab-reports/receipts/82rNmyWo5DXhAmaEciHE3vA8iCVp1kksdAZOfTmm.jpg', 'lab-reports/dti/tLGLOhiPH2HyDyHHLTeWoKsKiS1sa2beArIbCgkO.jpg', 'pass', 'pass', 'pass', 'pass', NULL, NULL, NULL, NULL, NULL, 'Conduct on-site inspection to verify compliance with sanitary standards.', 'approved', 'pass', '2025-11-04 22:23:23', '2025-11-06 05:41:46', '2025-11-04 22:23:23', '2025-11-06 05:41:46', NULL),
(10, 5, 'new', 16, 16, 'lab-reports/fecalysis/lJk8d2ST5N4FNmyVPe9GYs1U0mzKR8qGjlscDxwz.png', 'lab-reports/xray-sputum/5SiZRZ6BQcsGcGTJb3Csz56EWjCoxoH5YrnIMwHF.jpg', 'lab-reports/receipts/bi3Kwypfs8Lsxpp6hqbKb3sn4Dc2Awbj66O62tQQ.jpg', 'lab-reports/dti/KYa8EmWeCZI6pZHqH95prajC0NNbxRPXJkHCmceK.jpg', 'pass', 'pass', 'pass', 'pass', NULL, NULL, NULL, NULL, NULL, 'Conduct on-site inspection to verify compliance with sanitary standards.', 'approved', 'pass', '2025-11-06 06:07:06', '2025-11-06 06:08:31', '2025-11-06 06:07:06', '2025-11-06 06:08:31', NULL),
(11, 8, 'new', 17, 16, 'lab-reports/fecalysis/XOhs9SjAbZZtMMUqa3PQJ9dtr1HSwT5MVaLMRDEL.png', 'lab-reports/xray-sputum/UbZ9WNzRTfOhoBjHOTpjERKZgINRg063FjKvV1Nw.jpg', 'lab-reports/receipts/sfYeTp5w4Ptv3LdEulbms1ng1uKrbjLNijchBZGj.jpg', 'lab-reports/dti/VSzlbAybtiLPliEq8RlQzXQ8GKPBRatb5wBKfHJR.jpg', 'pass', 'pass', 'pass', 'pass', NULL, NULL, NULL, NULL, NULL, 'Conduct on-site inspection to verify compliance with sanitary standards.', 'approved', 'pass', '2025-11-06 06:18:33', '2025-11-06 06:19:47', '2025-11-06 06:18:33', '2025-11-06 06:19:47', NULL),
(12, 3, 'new', 16, 16, 'lab-reports/fecalysis/FaR3nzBFzhjMAxZsRQYntXW39d4kJNRHvpxFRz6x.png', 'lab-reports/xray-sputum/6viYnG1T60YuPw8dqPp6iXS3snhJUXQDGEmvmLrv.jpg', 'lab-reports/receipts/eBKg5FUafVzxbdfN72U0J6kwN8SmdwpDqypJUPMF.jpg', 'lab-reports/dti/qzpnNX6F9AjWHOXtyXFQ87e15r7wujn1cM77g2QC.jpg', 'pass', 'pass', 'pass', 'pass', NULL, NULL, NULL, NULL, NULL, 'Conduct on-site inspection to verify compliance with sanitary standards.', 'approved', 'pass', '2025-11-06 16:54:22', '2025-11-06 16:55:00', '2025-11-06 16:54:22', '2025-11-06 16:55:00', NULL),
(13, 4, 'new', 17, 16, 'lab-reports/fecalysis/odDyoGQRIjm4hfhdIAablETTclGeYoyuELXCn5Tn.png', 'lab-reports/xray-sputum/99UMDpExCcMLHEhLXUHoGUBTciIakIvQcWK617JB.jpg', 'lab-reports/receipts/cg7LCBWCtm3zzc4Kovltx319Kz5symXlQuFHEHD2.jpg', 'lab-reports/dti/7DFS2AQTfFRab1rBwzgIzVirt5IoJElDHN0GVWw3.jpg', 'pass', 'pass', 'pass', 'pass', NULL, NULL, NULL, NULL, NULL, 'Conduct on-site inspection to verify compliance with sanitary standards.', 'approved', 'pass', '2025-11-06 23:01:16', '2025-11-06 23:02:01', '2025-11-06 23:01:16', '2025-11-06 23:02:01', NULL),
(19, 14, 'new', 17, 16, 'lab-reports/fecalysis/hnudb7KpIUapZ0OjQ8syMJ0jREGLVHebrrjNxIpR.png', 'lab-reports/xray-sputum/5Vt3yJ3AIgIJdXWn22NDrbsj6ZtvVcVfcBDJxsNd.jpg', 'lab-reports/receipts/UsMMBFCTRhuafm0AuTKVRjcMlr4pD6FFguskkc47.jpg', 'lab-reports/dti/wJSlJXS1Mad2McrgH3CqO1mZ3QVYFmjMIWohHb1O.jpg', 'pass', 'pass', 'pass', 'pass', NULL, NULL, NULL, NULL, NULL, 'Conduct on-site inspection to verify compliance with sanitary standards.', 'approved', 'pass', '2025-11-29 03:51:15', '2025-11-29 04:33:40', '2025-11-29 03:51:15', '2025-11-29 04:33:40', NULL);

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
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `type` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`data`)),
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `type`, `title`, `message`, `data`, `read_at`, `created_at`, `updated_at`) VALUES
(1, 16, 'business_registered', 'New Business Registered', 'New business \'sample\' owned by asasasa has been registered and requires inspection', '{\"business_id\":13,\"business_type\":\"Food Establishment\",\"barangay\":\"Malabor\"}', '0000-00-00 00:00:00', '2025-11-02 22:38:10', '2025-11-03 06:47:44'),
(2, 16, 'lab_report_submitted', 'New Lab Report Submitted', 'New application lab report from sample requires review', '{\"business_id\":13,\"lab_report_id\":7,\"application_type\":\"new\"}', '2025-11-02 22:52:33', '2025-11-02 22:52:26', '2025-11-02 22:52:33'),
(3, 16, 'lab_report_submitted', 'New Lab Report Submitted', 'New application lab report from Tibiao Meat Shop requires review', '{\"business_id\":5,\"lab_report_id\":8,\"application_type\":\"new\"}', '2025-11-04 21:23:47', '2025-11-04 21:21:16', '2025-11-04 21:23:47'),
(4, 16, 'lab_report_submitted', 'New Lab Report Submitted', 'New application lab report from Manong\'s Food Cart requires review', '{\"business_id\":7,\"lab_report_id\":9,\"application_type\":\"new\"}', '2025-11-06 06:35:19', '2025-11-04 22:23:23', '2025-11-06 06:35:19'),
(5, 16, 'lab_report_submitted', 'New Lab Report Submitted', 'New application lab report from Tibiao Meat Shop requires review', '{\"business_id\":5,\"lab_report_id\":10,\"application_type\":\"new\"}', NULL, '2025-11-06 06:07:06', '2025-11-06 06:07:06'),
(6, 16, 'lab_report_submitted', 'New Lab Report Submitted', 'New application lab report from Tibiao Mini Mart requires review', '{\"business_id\":8,\"lab_report_id\":11,\"application_type\":\"new\"}', '2025-11-06 06:19:01', '2025-11-06 06:18:33', '2025-11-06 06:19:01'),
(7, 17, 'lab_report_reviewed', 'Lab Report Approved', 'Lab report for Tibiao Mini Mart has been approved by the inspector', '{\"business_id\":8,\"lab_report_id\":11,\"status\":\"approved\",\"overall_result\":\"pass\"}', NULL, '2025-11-06 06:19:47', '2025-11-06 06:19:47'),
(8, 17, 'inspection_approved', 'Inspection Approved', 'Inspection INS-2025-0007 for Tibiao Mini Mart has been approved and permit SP-2025-00004 has been issued', '{\"business_id\":8,\"inspection_id\":18,\"inspection_number\":\"INS-2025-0007\",\"permit_id\":12,\"permit_number\":\"SP-2025-00004\"}', NULL, '2025-11-06 06:19:47', '2025-11-06 06:19:47'),
(9, 16, 'lab_report_submitted', 'New Lab Report Submitted', 'New application lab report from Carinderia ni Aling Rosa requires review', '{\"business_id\":3,\"lab_report_id\":12,\"application_type\":\"new\",\"inspection_id\":19}', NULL, '2025-11-06 16:54:22', '2025-11-06 16:54:22'),
(10, 16, 'lab_report_reviewed', 'Lab Report Approved', 'Lab report for Carinderia ni Aling Rosa has been approved by the inspector', '{\"business_id\":3,\"lab_report_id\":12,\"status\":\"approved\",\"overall_result\":\"pass\"}', '2025-11-06 16:58:32', '2025-11-06 16:55:00', '2025-11-06 16:58:32'),
(11, 16, 'inspection_approved', 'Inspection Approved', 'Inspection INS-2025-0008 for Carinderia ni Aling Rosa has been approved and permit SP-2025-00005 has been issued', '{\"business_id\":3,\"inspection_id\":19,\"inspection_number\":\"INS-2025-0008\",\"permit_id\":13,\"permit_number\":\"SP-2025-00005\"}', NULL, '2025-11-06 16:55:00', '2025-11-06 16:55:00'),
(12, 16, 'lab_report_submitted', 'New Lab Report Submitted', 'New application lab report from Sari-Sari Store ni Nene requires review', '{\"business_id\":4,\"lab_report_id\":13,\"application_type\":\"new\",\"inspection_id\":20}', '2025-11-06 23:01:30', '2025-11-06 23:01:16', '2025-11-06 23:01:30'),
(13, 17, 'lab_report_reviewed', 'Lab Report Approved', 'Lab report for Sari-Sari Store ni Nene has been approved by the inspector', '{\"business_id\":4,\"lab_report_id\":13,\"status\":\"approved\",\"overall_result\":\"pass\"}', NULL, '2025-11-06 23:02:01', '2025-11-06 23:02:01'),
(14, 17, 'inspection_approved', 'Inspection Approved', 'Inspection INS-2025-0009 for Sari-Sari Store ni Nene has been approved and permit SP-2025-00006 has been issued', '{\"business_id\":4,\"inspection_id\":20,\"inspection_number\":\"INS-2025-0009\",\"permit_id\":14,\"permit_number\":\"SP-2025-00006\"}', NULL, '2025-11-06 23:02:01', '2025-11-06 23:02:01'),
(15, 16, 'business_registered', 'New Business Registered', 'New business \'Example\' owned by Sandro S. Farren has been registered and requires inspection', '{\"business_id\":14,\"business_type\":\"Food Establishment\",\"barangay\":\"Tigbaboy\"}', NULL, '2025-11-29 03:19:09', '2025-11-29 03:19:09'),
(16, 16, 'lab_report_submitted', 'New Lab Report Submitted', 'New application lab report from Example requires review', '{\"business_id\":14,\"lab_report_id\":19,\"application_type\":\"new\",\"inspection_id\":21}', '2025-11-29 03:51:29', '2025-11-29 03:51:15', '2025-11-29 03:51:29'),
(17, 17, 'lab_report_reviewed', 'Lab Report Approved', 'Lab report for Example has been approved by the inspector', '{\"business_id\":14,\"lab_report_id\":19,\"status\":\"approved\",\"overall_result\":\"pass\"}', NULL, '2025-11-29 04:33:40', '2025-11-29 04:33:40'),
(18, 17, 'inspection_approved', 'Inspection Approved', 'Inspection INS-2025-0001 for Example has been approved and permit SP-2025-00007 has been issued', '{\"business_id\":14,\"inspection_id\":21,\"inspection_number\":\"INS-2025-0001\",\"permit_id\":15,\"permit_number\":\"SP-2025-00007\"}', NULL, '2025-11-29 04:33:40', '2025-11-29 04:33:40');

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
-- Table structure for table `permit_print_logs`
--

CREATE TABLE `permit_print_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `permit_id` bigint(20) UNSIGNED NOT NULL,
  `business_id` bigint(20) UNSIGNED NOT NULL,
  `printed_by` bigint(20) UNSIGNED NOT NULL,
  `printed_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ip_address` varchar(255) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permit_print_logs`
--

INSERT INTO `permit_print_logs` (`id`, `permit_id`, `business_id`, `printed_by`, `printed_at`, `ip_address`, `user_agent`, `created_at`, `updated_at`) VALUES
(1, 9, 2, 16, '2025-11-03 02:06:32', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-11-03 02:06:32', '2025-11-03 02:06:32');

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
(9, 'SP-2025-00001', 2, 'New', '2025-11-01', '2026-11-01', 'Active', 16, 16, 'Conduct on-site inspection to verify compliance with sanitary standards.', '2025-11-01 05:12:10', '2025-11-01 05:12:10', NULL),
(10, 'SP-2025-00002', 7, 'New', '2025-11-06', '2026-11-06', 'Active', 17, 16, 'Conduct on-site inspection to verify compliance with sanitary standards.', '2025-11-06 05:41:46', '2025-11-29 12:22:02', NULL),
(11, 'SP-2025-00003', 5, 'New', '2025-11-06', '2026-11-06', 'Active', 16, 16, 'Conduct on-site inspection to verify compliance with sanitary standards.', '2025-11-06 06:08:31', '2025-11-06 06:08:31', NULL),
(12, 'SP-2025-00004', 8, 'New', '2025-11-06', '2026-11-06', 'Active', 17, 16, 'Conduct on-site inspection to verify compliance with sanitary standards.', '2025-11-06 06:19:47', '2025-11-29 12:22:02', NULL),
(13, 'SP-2025-00005', 3, 'New', '2025-11-07', '2026-11-07', 'Active', 16, 16, 'Conduct on-site inspection to verify compliance with sanitary standards.', '2025-11-06 16:55:00', '2025-11-06 16:55:00', NULL),
(14, 'SP-2025-00006', 4, 'New', '2025-11-07', '2026-11-07', 'Active', 17, 16, 'Conduct on-site inspection to verify compliance with sanitary standards.', '2025-11-06 23:02:01', '2025-11-29 12:22:02', NULL),
(15, 'SP-2025-00007', 14, 'New', '2025-11-29', '2026-11-29', 'Active', 17, 16, 'Conduct on-site inspection to verify compliance with sanitary standards.', '2025-11-29 04:33:40', '2025-11-29 04:33:40', NULL);

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
('F3c8si8VPstAv5hewHEpfwCNamhU2DCSmWZ2DCqI', 16, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiSExWeHZ0UzUyT3lEaUxZa25qNUMwYUxsVEtpZWlEelpKUmNMazh5QSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9sYWItcmVwb3J0cyI7czo1OiJyb3V0ZSI7czoxNzoibGFiLXJlcG9ydHMuaW5kZXgiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aToxNjt9', 1764422515),
('FudmMDyyRQtx75H1RZ7xl5fuGSydtg49YJciGZ7s', 17, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiWm8xblFLYXZEbjBFNFBHcnp5RnFnd0doOURUSHF1eEdsbWxXVVlJWCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9sYWItcmVwb3J0cy9jcmVhdGUiO3M6NToicm91dGUiO3M6MTg6ImxhYi1yZXBvcnRzLmNyZWF0ZSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6NTA6ImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjE3O30=', 1764421936),
('TaFFY5gSWlnVcZJTq9FZA8yDJFtTf30ZFt56ow1H', 17, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoidnFPNk0waUdhNVVxWGRKQ2VUNm1aQ0lDUUV6Z2FMYWRXVmRLclBMWSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9sb2dpbiI7czo1OiJyb3V0ZSI7czo1OiJsb2dpbiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6NTA6ImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjE3O30=', 1764422504);

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
(16, 'Jc Sumugat', 'jcsumugatxd@gmail.com', NULL, '$2y$12$Tc2KJJinmABupzeMgltXGuwWPlC.I8TcjThrU9A8/L8rPcfzUx4oy', 'Admin', 'Lab Inspector', 1, NULL, '2025-10-28 17:12:08', '2025-10-28 17:12:08'),
(17, 'Rica Mae Remoting', 'rica@gmail.com', NULL, '$2y$12$/kw3msyFmWc/U4nga.hIaOITYqjaBsWvJtJihifwDHjPEezoZgWPW', 'Staff', 'Lab Assistant', 1, 'N6L4jupeacNQWK5Wl8RngiKy0uj3yiRO1FFuX9s9lVGqRm6f3D7L0tp3kQrI', '2025-11-01 06:26:51', '2025-11-01 06:26:51');

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
  ADD KEY `notifications_user_id_read_at_index` (`user_id`,`read_at`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `permit_print_logs`
--
ALTER TABLE `permit_print_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `permit_print_logs_business_id_printed_at_index` (`business_id`,`printed_at`),
  ADD KEY `permit_print_logs_permit_id_printed_at_index` (`permit_id`,`printed_at`),
  ADD KEY `permit_print_logs_printed_by_foreign` (`printed_by`);

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `businesses`
--
ALTER TABLE `businesses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lab_reports`
--
ALTER TABLE `lab_reports`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `permit_print_logs`
--
ALTER TABLE `permit_print_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `permit_renewals`
--
ALTER TABLE `permit_renewals`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sanitary_permits`
--
ALTER TABLE `sanitary_permits`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `system_settings`
--
ALTER TABLE `system_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

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
  ADD CONSTRAINT `notifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `permit_print_logs`
--
ALTER TABLE `permit_print_logs`
  ADD CONSTRAINT `permit_print_logs_business_id_foreign` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `permit_print_logs_permit_id_foreign` FOREIGN KEY (`permit_id`) REFERENCES `sanitary_permits` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `permit_print_logs_printed_by_foreign` FOREIGN KEY (`printed_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

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
