-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th7 11, 2025 lúc 05:52 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `chatweb`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `conversations`
--

CREATE TABLE `conversations` (
  `id` int(11) NOT NULL,
  `type` enum('personal','group') NOT NULL,
  `group_name` varchar(255) DEFAULT NULL,
  `group_avatar` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `last_message_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `conversations`
--

INSERT INTO `conversations` (`id`, `type`, `group_name`, `group_avatar`, `created_at`, `updated_at`, `last_message_id`) VALUES
(28, 'personal', NULL, NULL, '2025-03-23 17:53:12', '2025-03-25 06:32:57', 159),
(29, 'personal', NULL, NULL, '2025-03-24 16:25:51', '2025-06-12 08:37:01', 203),
(30, 'personal', NULL, NULL, '2025-03-24 16:26:09', '2025-03-24 16:36:49', 141),
(31, 'personal', NULL, NULL, '2025-03-24 18:18:53', '2025-03-24 18:18:53', NULL),
(36, 'group', 'u', NULL, '2025-03-25 01:10:49', '2025-03-25 07:11:44', 162),
(40, 'personal', NULL, NULL, '2025-03-25 13:06:58', '2025-03-25 13:08:31', 164);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `conversation_members`
--

CREATE TABLE `conversation_members` (
  `id` int(11) NOT NULL,
  `conversation_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `role` enum('member','owner') DEFAULT 'member',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `conversation_members`
--

INSERT INTO `conversation_members` (`id`, `conversation_id`, `user_id`, `role`, `created_at`, `updated_at`) VALUES
(39, 28, 8, 'member', '2025-03-23 17:53:12', '2025-03-23 17:53:12'),
(40, 28, 7, 'member', '2025-03-23 17:53:12', '2025-03-23 17:53:12'),
(41, 29, 9, 'member', '2025-03-24 16:25:51', '2025-03-24 16:25:51'),
(42, 29, 7, 'member', '2025-03-24 16:25:51', '2025-03-24 16:25:51'),
(43, 30, 9, 'member', '2025-03-24 16:26:09', '2025-03-24 16:26:09'),
(44, 30, 8, 'member', '2025-03-24 16:26:09', '2025-03-24 16:26:09'),
(59, 36, 7, 'owner', '2025-03-25 01:10:49', '2025-03-25 01:10:49'),
(60, 36, 8, 'member', '2025-03-25 01:10:49', '2025-03-25 01:10:49'),
(61, 36, 9, 'member', '2025-03-25 01:10:49', '2025-03-25 01:10:49'),
(68, 40, 7, 'member', '2025-03-25 13:06:58', '2025-03-25 13:06:58'),
(69, 40, 10, 'member', '2025-03-25 13:06:58', '2025-03-25 13:06:58');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `conversation_setting`
--

CREATE TABLE `conversation_setting` (
  `id` int(11) NOT NULL,
  `conversation_id` int(11) NOT NULL,
  `conversation_emoji` varchar(255) DEFAULT '?',
  `conversation_background` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `conversation_setting`
--

INSERT INTO `conversation_setting` (`id`, `conversation_id`, `conversation_emoji`, `conversation_background`) VALUES
(1, 28, '👍', NULL),
(2, 29, '👍', NULL),
(3, 30, '👍', NULL),
(4, 31, '👍', NULL),
(5, 36, '👍', NULL),
(6, 40, '👍', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `deleted_messages`
--

CREATE TABLE `deleted_messages` (
  `id` int(11) NOT NULL,
  `message_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `deleted_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `deleted_messages`
--

INSERT INTO `deleted_messages` (`id`, `message_id`, `user_id`, `deleted_at`) VALUES
(1, 146, 7, '2025-03-25 02:06:48'),
(2, 144, 7, '2025-03-25 03:30:34'),
(3, 142, 7, '2025-03-25 03:41:48'),
(4, 139, 7, '2025-03-25 03:53:27'),
(5, 153, 7, '2025-03-25 05:02:45'),
(6, 154, 7, '2025-03-25 05:02:58'),
(7, 155, 7, '2025-03-25 05:03:05'),
(8, 155, 8, '2025-03-25 05:07:06'),
(9, 152, 7, '2025-03-25 05:25:16'),
(10, 159, 7, '2025-03-25 06:33:18'),
(11, 160, 7, '2025-03-25 07:09:41'),
(12, 161, 7, '2025-03-25 07:11:20'),
(13, 193, 7, '2025-04-01 13:53:21');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `friendships`
--

CREATE TABLE `friendships` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `status` enum('pending','accepted','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `replied_at` timestamp NULL DEFAULT NULL,
  `is_blocked` tinyint(1) DEFAULT 0,
  `action_by_user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `friendships`
--

INSERT INTO `friendships` (`id`, `sender_id`, `receiver_id`, `status`, `created_at`, `updated_at`, `replied_at`, `is_blocked`, `action_by_user_id`) VALUES
(24, 8, 7, 'accepted', '2025-03-23 17:51:19', '2025-03-23 17:53:12', NULL, 0, 7),
(25, 9, 7, 'accepted', '2025-03-24 16:23:42', '2025-03-26 09:34:09', NULL, 0, 7),
(26, 9, 8, 'accepted', '2025-03-24 16:26:06', '2025-03-24 16:26:09', NULL, 0, 8),
(30, 7, 10, 'accepted', '2025-03-25 13:06:44', '2025-03-26 09:16:15', NULL, 0, 7);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `conversation_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `content` text DEFAULT NULL,
  `type` enum('text','media','document','video','emoji') NOT NULL,
  `is_pinned` tinyint(41) DEFAULT 0,
  `is_revoked` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `messages`
--

INSERT INTO `messages` (`id`, `conversation_id`, `sender_id`, `content`, `type`, `is_pinned`, `is_revoked`, `created_at`, `updated_at`) VALUES
(78, 28, 7, '1', 'text', 0, 0, '2025-03-24 15:26:34', '2025-03-24 15:26:34'),
(79, 28, 7, '2', 'text', 0, 0, '2025-03-24 15:26:36', '2025-03-24 15:26:36'),
(80, 28, 7, '3', 'text', 0, 0, '2025-03-24 15:26:37', '2025-03-24 15:26:37'),
(81, 28, 7, '4', 'text', 0, 0, '2025-03-24 15:26:38', '2025-03-24 15:26:38'),
(82, 28, 7, '5', 'text', 0, 0, '2025-03-24 15:26:39', '2025-03-24 15:26:39'),
(83, 28, 7, '6', 'text', 0, 0, '2025-03-24 15:26:40', '2025-03-24 15:26:40'),
(84, 28, 7, '7', 'text', 0, 0, '2025-03-24 15:26:41', '2025-03-24 15:26:41'),
(85, 28, 7, '8', 'text', 0, 0, '2025-03-24 15:26:43', '2025-03-24 15:26:43'),
(86, 28, 7, '9', 'text', 0, 0, '2025-03-24 15:26:45', '2025-03-24 15:26:45'),
(87, 28, 7, '10', 'text', 0, 0, '2025-03-24 15:26:47', '2025-03-24 15:26:47'),
(88, 28, 7, '11', 'text', 0, 0, '2025-03-24 15:26:48', '2025-03-24 15:26:48'),
(89, 28, 7, '12', 'text', 0, 0, '2025-03-24 15:26:49', '2025-03-24 15:26:49'),
(90, 28, 7, '13', 'text', 0, 0, '2025-03-24 15:26:50', '2025-03-24 15:26:50'),
(91, 28, 7, '14', 'text', 0, 0, '2025-03-24 15:26:51', '2025-03-24 15:26:51'),
(92, 28, 7, '15', 'text', 0, 0, '2025-03-24 15:26:52', '2025-03-24 15:26:52'),
(93, 28, 7, '16', 'text', 0, 0, '2025-03-24 15:26:53', '2025-03-24 15:26:53'),
(94, 28, 7, '17', 'text', 0, 0, '2025-03-24 15:26:54', '2025-03-24 15:26:54'),
(95, 28, 7, '18', 'text', 0, 0, '2025-03-24 15:26:55', '2025-03-24 15:26:55'),
(96, 28, 7, '19', 'text', 0, 0, '2025-03-24 15:26:56', '2025-03-24 15:26:56'),
(97, 28, 7, '20', 'text', 0, 0, '2025-03-24 15:26:57', '2025-03-24 15:26:57'),
(98, 28, 7, '21', 'text', 0, 0, '2025-03-24 15:26:58', '2025-03-24 15:26:58'),
(99, 28, 7, '22', 'text', 0, 0, '2025-03-24 15:26:58', '2025-03-24 15:26:58'),
(100, 28, 7, '23', 'text', 0, 0, '2025-03-24 15:26:59', '2025-03-24 15:26:59'),
(101, 28, 7, '24', 'text', 0, 0, '2025-03-24 15:27:01', '2025-03-24 15:27:01'),
(102, 28, 7, '25', 'text', 0, 0, '2025-03-24 15:27:02', '2025-03-24 15:27:02'),
(103, 28, 7, '26', 'text', 0, 0, '2025-03-24 15:27:03', '2025-03-24 15:27:03'),
(104, 28, 7, '27', 'text', 0, 0, '2025-03-24 15:27:05', '2025-03-24 15:27:05'),
(105, 28, 7, '28', 'text', 0, 0, '2025-03-24 15:27:06', '2025-03-24 15:27:06'),
(106, 28, 7, '29', 'text', 0, 0, '2025-03-24 15:27:08', '2025-03-24 15:27:08'),
(107, 28, 7, '30', 'text', 0, 0, '2025-03-24 15:27:09', '2025-03-24 15:27:09'),
(108, 28, 7, '31', 'text', 0, 0, '2025-03-24 15:32:30', '2025-03-24 15:32:30'),
(109, 28, 7, '32', 'text', 0, 0, '2025-03-24 15:32:30', '2025-03-24 15:32:30'),
(110, 28, 7, '33', 'text', 0, 0, '2025-03-24 15:32:37', '2025-03-24 15:32:37'),
(111, 28, 7, '34', 'text', 0, 0, '2025-03-24 15:32:40', '2025-03-24 15:32:40'),
(112, 28, 7, '35', 'text', 0, 0, '2025-03-24 15:32:45', '2025-03-24 15:32:45'),
(113, 28, 7, '36', 'text', 0, 0, '2025-03-24 15:32:47', '2025-03-24 15:32:47'),
(114, 28, 7, '37', 'text', 0, 0, '2025-03-24 15:32:48', '2025-03-24 15:32:48'),
(115, 28, 7, '38', 'text', 0, 0, '2025-03-24 15:32:49', '2025-03-24 15:32:49'),
(116, 28, 7, '39', 'text', 0, 0, '2025-03-24 15:32:50', '2025-03-24 15:32:50'),
(117, 28, 7, '40', 'text', 0, 0, '2025-03-24 15:32:51', '2025-03-24 15:32:51'),
(118, 28, 7, '41', 'text', 0, 0, '2025-03-24 15:32:52', '2025-03-24 15:32:52'),
(119, 28, 8, '42', 'text', 0, 0, '2025-03-24 16:06:14', '2025-03-24 16:06:14'),
(120, 28, 8, '43', 'text', 0, 0, '2025-03-24 16:06:23', '2025-03-24 16:06:23'),
(121, 28, 7, '44', 'text', 0, 0, '2025-03-24 16:11:27', '2025-03-24 16:11:27'),
(122, 28, 7, '', 'media', 0, 1, '2025-03-24 16:12:23', '2025-03-25 03:52:45'),
(123, 28, 7, '1', 'text', 0, 0, '2025-03-24 16:13:59', '2025-03-24 16:13:59'),
(124, 28, 8, 'aaaa', 'text', 0, 0, '2025-03-24 16:15:02', '2025-03-24 16:15:02'),
(125, 28, 8, 'aaaa', 'text', 0, 0, '2025-03-24 16:16:25', '2025-03-24 16:16:25'),
(126, 28, 7, 'aaa', 'text', 0, 1, '2025-03-24 16:16:46', '2025-03-25 03:48:38'),
(127, 28, 7, '1', 'text', 0, 1, '2025-03-24 16:16:51', '2025-03-25 03:42:48'),
(128, 28, 8, 'aaa', 'text', 0, 0, '2025-03-24 16:18:04', '2025-03-24 16:18:04'),
(129, 29, 7, '1', 'text', 0, 0, '2025-03-24 16:26:42', '2025-03-24 16:26:42'),
(130, 29, 7, '2', 'text', 0, 0, '2025-03-24 16:27:00', '2025-03-24 16:27:00'),
(131, 29, 7, '3', 'text', 0, 0, '2025-03-24 16:28:36', '2025-03-24 16:28:36'),
(132, 29, 7, '4', 'text', 0, 0, '2025-03-24 16:29:44', '2025-03-24 16:29:44'),
(133, 29, 7, '5', 'text', 0, 0, '2025-03-24 16:31:30', '2025-03-24 16:31:30'),
(134, 30, 8, '1', 'text', 0, 0, '2025-03-24 16:31:42', '2025-03-24 16:31:42'),
(135, 30, 8, '2', 'text', 0, 0, '2025-03-24 16:31:52', '2025-03-24 16:31:52'),
(136, 30, 8, '3', 'text', 0, 0, '2025-03-24 16:32:41', '2025-03-24 16:32:41'),
(137, 30, 9, '4', 'text', 0, 0, '2025-03-24 16:35:46', '2025-03-24 16:35:46'),
(138, 28, 8, 'u1', 'text', 0, 0, '2025-03-24 16:36:06', '2025-03-24 16:36:06'),
(139, 28, 8, 'u12', 'text', 0, 0, '2025-03-24 16:36:31', '2025-03-24 16:36:31'),
(140, 29, 7, '6', 'text', 0, 0, '2025-03-24 16:36:40', '2025-03-24 16:36:40'),
(141, 30, 9, '5', 'text', 0, 0, '2025-03-24 16:36:49', '2025-03-24 16:36:49'),
(142, 28, 8, '111', 'text', 0, 0, '2025-03-24 16:58:04', '2025-03-24 16:58:04'),
(143, 29, 9, '7', 'text', 0, 0, '2025-03-24 17:09:42', '2025-03-24 17:09:42'),
(144, 28, 8, '112', 'text', 0, 0, '2025-03-24 17:11:20', '2025-03-24 17:11:20'),
(145, 29, 9, '8', 'text', 0, 0, '2025-03-24 17:18:24', '2025-03-24 17:18:24'),
(146, 28, 8, '113', 'text', 0, 0, '2025-03-24 17:18:42', '2025-03-24 17:18:42'),
(147, 36, 7, '1', 'text', 0, 0, '2025-03-25 01:12:37', '2025-03-25 01:12:37'),
(148, 36, 8, '2', 'text', 0, 1, '2025-03-25 01:12:46', '2025-03-25 05:25:50'),
(149, 36, 9, '3', 'text', 0, 0, '2025-03-25 01:12:55', '2025-03-25 01:12:55'),
(150, 36, 7, '4', 'text', 0, 1, '2025-03-25 01:26:22', '2025-03-25 05:25:36'),
(151, 36, 9, '5', 'text', 0, 0, '2025-03-25 01:26:33', '2025-03-25 01:26:33'),
(152, 36, 7, '6', 'text', 0, 0, '2025-03-25 01:28:31', '2025-03-25 01:28:31'),
(153, 28, 7, '1', 'text', 0, 0, '2025-03-25 05:00:41', '2025-03-25 05:00:41'),
(154, 28, 7, '', 'media', 0, 0, '2025-03-25 05:01:01', '2025-03-25 05:01:01'),
(155, 28, 7, '', 'document', 0, 0, '2025-03-25 05:01:09', '2025-03-25 05:01:09'),
(156, 28, 7, '', 'document', 0, 1, '2025-03-25 05:02:20', '2025-03-25 05:03:24'),
(157, 28, 7, '2', 'text', 0, 1, '2025-03-25 05:02:37', '2025-03-25 05:03:33'),
(158, 28, 7, '', 'media', 0, 1, '2025-03-25 05:03:14', '2025-03-25 05:03:41'),
(159, 28, 7, '1', 'text', 0, 0, '2025-03-25 06:32:57', '2025-03-25 06:32:57'),
(160, 36, 7, '1', 'text', 0, 0, '2025-03-25 07:09:14', '2025-03-25 07:09:14'),
(161, 36, 7, '2', 'text', 0, 0, '2025-03-25 07:11:06', '2025-03-25 07:11:06'),
(162, 36, 7, '1', 'text', 0, 1, '2025-03-25 07:11:43', '2025-03-25 07:11:55'),
(163, 40, 7, '1', 'text', 0, 0, '2025-03-25 13:08:26', '2025-03-25 13:08:26'),
(164, 40, 10, '2', 'text', 0, 0, '2025-03-25 13:08:31', '2025-03-25 13:08:31'),
(165, 29, 7, '1', 'text', 0, 0, '2025-03-29 15:18:22', '2025-03-29 15:18:22'),
(166, 29, 7, '2', 'text', 0, 0, '2025-03-29 15:18:54', '2025-03-29 15:18:54'),
(167, 29, 7, '3', 'text', 0, 0, '2025-03-29 15:19:36', '2025-03-29 15:19:36'),
(168, 29, 7, '4', 'text', 0, 0, '2025-03-29 15:20:16', '2025-03-29 15:20:16'),
(169, 29, 7, '5', 'text', 0, 0, '2025-03-29 15:20:43', '2025-03-29 15:20:43'),
(170, 29, 7, '6', 'text', 0, 0, '2025-03-29 15:21:43', '2025-03-29 15:21:43'),
(171, 29, 7, '7', 'text', 0, 0, '2025-04-01 08:14:18', '2025-04-01 08:14:18'),
(172, 29, 7, '8', 'text', 0, 0, '2025-04-01 08:14:57', '2025-04-01 08:14:57'),
(173, 29, 7, '9', 'text', 0, 0, '2025-04-01 08:15:42', '2025-04-01 08:15:42'),
(174, 29, 7, '10', 'text', 0, 0, '2025-04-01 08:16:35', '2025-04-01 08:16:35'),
(175, 29, 7, '', 'media', 0, 0, '2025-04-01 08:18:25', '2025-04-01 08:18:25'),
(176, 29, 7, '11', 'text', 0, 0, '2025-04-01 08:32:37', '2025-04-01 08:32:37'),
(177, 29, 7, '12', 'text', 0, 0, '2025-04-01 08:32:49', '2025-04-01 08:32:49'),
(179, 29, 7, '', 'media', 0, 0, '2025-04-01 08:38:42', '2025-04-01 08:38:42'),
(180, 29, 7, '13', 'text', 0, 0, '2025-04-01 13:31:19', '2025-04-01 13:31:19'),
(181, 29, 7, '14', 'text', 0, 0, '2025-04-01 13:31:38', '2025-04-01 13:31:38'),
(182, 29, 7, '15', 'text', 0, 0, '2025-04-01 13:32:28', '2025-04-01 13:32:28'),
(183, 29, 7, '16', 'text', 0, 0, '2025-04-01 13:32:45', '2025-04-01 13:32:45'),
(184, 29, 7, '17', 'text', 0, 0, '2025-04-01 13:40:57', '2025-04-01 13:40:57'),
(185, 29, 7, '18', 'text', 0, 0, '2025-04-01 13:41:08', '2025-04-01 13:41:08'),
(186, 29, 7, '19', 'text', 0, 0, '2025-04-01 13:41:44', '2025-04-01 13:41:44'),
(187, 29, 7, '20', 'text', 0, 0, '2025-04-01 13:42:31', '2025-04-01 13:42:31'),
(188, 29, 7, '21', 'text', 0, 0, '2025-04-01 13:42:36', '2025-04-01 13:42:36'),
(189, 29, 7, '', 'media', 0, 0, '2025-04-01 13:44:28', '2025-04-01 13:44:28'),
(190, 29, 7, '', 'media', 0, 1, '2025-04-01 13:48:17', '2025-04-01 14:09:24'),
(191, 29, 7, '', 'document', 0, 1, '2025-04-01 13:48:52', '2025-04-01 14:01:15'),
(192, 29, 7, '1', 'text', 0, 1, '2025-04-01 13:51:53', '2025-04-01 14:00:46'),
(193, 29, 7, '2', 'text', 0, 0, '2025-04-01 13:51:58', '2025-04-01 13:51:58'),
(194, 29, 7, '1', 'text', 0, 0, '2025-04-01 14:27:23', '2025-04-01 14:27:23'),
(195, 29, 7, '2', 'text', 0, 0, '2025-04-01 14:27:31', '2025-04-01 14:27:31'),
(196, 29, 7, '3', 'text', 0, 0, '2025-04-01 14:33:36', '2025-04-01 14:33:36'),
(199, 29, 7, '👍', 'emoji', 0, 0, '2025-04-01 17:47:32', '2025-04-01 17:47:32'),
(200, 29, 7, 'gbgbsss', 'text', 0, 0, '2025-04-19 08:13:33', '2025-04-19 08:13:33'),
(201, 29, 7, '1', 'text', 0, 0, '2025-04-19 08:15:04', '2025-04-19 08:15:04'),
(202, 29, 7, 'aaaaaa', 'text', 0, 0, '2025-06-12 08:36:40', '2025-06-12 08:36:40'),
(203, 29, 7, '', 'media', 0, 1, '2025-06-12 08:37:01', '2025-06-12 08:37:30');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `message_files`
--

CREATE TABLE `message_files` (
  `id` int(11) NOT NULL,
  `message_id` int(11) NOT NULL,
  `file_url` varchar(255) NOT NULL,
  `file_name` varchar(255) DEFAULT 'file',
  `file_type` varchar(255) NOT NULL,
  `file_size` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `message_files`
--

INSERT INTO `message_files` (`id`, `message_id`, `file_url`, `file_name`, `file_type`, `file_size`, `created_at`) VALUES
(10, 122, 'https://res.cloudinary.com/dbyuzvqz8/image/upload/fl_attachment/v1742832746/Chat-App/Message/Media/1742832743530.jpg.jpg', 'file.jpg', 'image/jpeg', 24669, '2025-03-24 16:12:26'),
(11, 154, 'https://res.cloudinary.com/dbyuzvqz8/image/upload/fl_attachment/v1742878862/Chat-App/Message/Media/1742878861350.jpg.jpg', 'file.jpg', 'image/jpeg', 24669, '2025-03-25 05:01:03'),
(12, 155, 'https://res.cloudinary.com/dbyuzvqz8/raw/upload/fl_attachment/v1742878871/Chat-App/Message/Media/1742878870006.pdf', 'CV Khôi Nguyễn Văn - F.pdf', 'application/pdf', 210505, '2025-03-25 05:01:12'),
(13, 156, 'https://res.cloudinary.com/dbyuzvqz8/raw/upload/fl_attachment/v1742878943/Chat-App/Message/Media/1742878941034.pdf', 'CV Khôi Nguyễn Văn - F.pdf', 'application/pdf', 210505, '2025-03-25 05:02:23'),
(14, 158, 'https://res.cloudinary.com/dbyuzvqz8/image/upload/fl_attachment/v1742878994/Chat-App/Message/Media/1742878994121.jpg.jpg', 'file.jpg', 'image/jpeg', 24669, '2025-03-25 05:03:15'),
(15, 175, 'https://res.cloudinary.com/dbyuzvqz8/image/upload/fl_attachment/v1743495507/Chat-App/Message/Media/1743495505818.jpg.jpg', 'Ao_ni_Nam.jpg', 'image/jpeg', 89966, '2025-04-01 08:18:29'),
(16, 179, 'https://res.cloudinary.com/dbyuzvqz8/image/upload/fl_attachment/v1743496725/Chat-App/Message/Media/1743496722967.jpg.jpg', 'Ao_hoodie_Nam.jpg', 'image/jpeg', 101673, '2025-04-01 08:38:46'),
(17, 189, 'https://res.cloudinary.com/dbyuzvqz8/image/upload/fl_attachment/v1743515070/Chat-App/Message/Media/1743515068662.jpg.jpg', '8ts24w002-aoo-phong-ngan-tay.jpg', 'image/jpeg', 24669, '2025-04-01 13:44:31'),
(18, 190, 'https://res.cloudinary.com/dbyuzvqz8/image/upload/fl_attachment/v1743515303/Chat-App/Message/Media/1743515299586.jpg.jpg', 'Canifa_Z_Nam.jpg', 'image/jpeg', 84651, '2025-04-01 13:48:24'),
(19, 191, 'https://res.cloudinary.com/dbyuzvqz8/raw/upload/fl_attachment/v1743515335/Chat-App/Message/Media/1743515332667.pdf', 'CV Khôi Nguyễn Văn - F.pdf', 'application/pdf', 210505, '2025-04-01 13:48:56'),
(20, 203, 'https://res.cloudinary.com/dbyuzvqz8/image/upload/fl_attachment/v1749717424/Chat-App/Message/Media/1749717421783.jpg.jpg', '8ts24w002-aoo-phong-ngan-tay.jpg', 'image/jpeg', 24669, '2025-06-12 08:37:04');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `message_reactions`
--

CREATE TABLE `message_reactions` (
  `id` int(11) NOT NULL,
  `message_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `reaction` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `message_reactions`
--

INSERT INTO `message_reactions` (`id`, `message_id`, `user_id`, `reaction`, `created_at`, `updated_at`) VALUES
(24, 200, 7, '❤️', '2025-04-19 08:15:25', '2025-04-19 08:15:25'),
(25, 203, 7, '❤️', '2025-06-12 08:37:21', '2025-06-12 08:37:21');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `message_readers`
--

CREATE TABLE `message_readers` (
  `id` int(11) NOT NULL,
  `message_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `read_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `message_readers`
--

INSERT INTO `message_readers` (`id`, `message_id`, `user_id`, `read_at`) VALUES
(917, 78, 8, '2025-03-24 15:26:34'),
(918, 79, 8, '2025-03-24 15:26:36'),
(919, 80, 8, '2025-03-24 15:26:37'),
(920, 81, 8, '2025-03-24 15:26:38'),
(921, 82, 8, '2025-03-24 15:26:39'),
(922, 83, 8, '2025-03-24 15:26:40'),
(923, 84, 8, '2025-03-24 15:27:14'),
(924, 87, 8, '2025-03-24 15:27:14'),
(925, 86, 8, '2025-03-24 15:27:14'),
(926, 85, 8, '2025-03-24 15:27:14'),
(927, 88, 8, '2025-03-24 15:27:14'),
(928, 89, 8, '2025-03-24 15:27:14'),
(929, 90, 8, '2025-03-24 15:27:14'),
(930, 91, 8, '2025-03-24 15:27:14'),
(931, 92, 8, '2025-03-24 15:27:14'),
(932, 93, 8, '2025-03-24 15:27:14'),
(933, 94, 8, '2025-03-24 15:27:14'),
(934, 95, 8, '2025-03-24 15:27:14'),
(935, 96, 8, '2025-03-24 15:27:14'),
(936, 97, 8, '2025-03-24 15:27:14'),
(937, 98, 8, '2025-03-24 15:27:14'),
(938, 99, 8, '2025-03-24 15:27:14'),
(939, 100, 8, '2025-03-24 15:27:15'),
(940, 101, 8, '2025-03-24 15:27:15'),
(941, 102, 8, '2025-03-24 15:27:15'),
(942, 103, 8, '2025-03-24 15:27:15'),
(943, 104, 8, '2025-03-24 15:27:15'),
(944, 105, 8, '2025-03-24 15:27:15'),
(945, 106, 8, '2025-03-24 15:27:15'),
(946, 107, 8, '2025-03-24 15:27:15'),
(947, 108, 8, '2025-03-24 15:32:30'),
(948, 109, 8, '2025-03-24 15:32:33'),
(949, 110, 8, '2025-03-24 15:32:37'),
(950, 111, 8, '2025-03-24 16:06:12'),
(951, 112, 8, '2025-03-24 16:06:12'),
(952, 113, 8, '2025-03-24 16:06:12'),
(953, 114, 8, '2025-03-24 16:06:12'),
(954, 115, 8, '2025-03-24 16:06:12'),
(955, 116, 8, '2025-03-24 16:06:12'),
(956, 117, 8, '2025-03-24 16:06:12'),
(957, 118, 8, '2025-03-24 16:06:12'),
(958, 119, 7, '2025-03-24 16:06:19'),
(959, 120, 7, '2025-03-24 16:06:23'),
(960, 121, 8, '2025-03-24 16:11:27'),
(961, 122, 8, '2025-03-24 16:12:24'),
(962, 123, 8, '2025-03-24 16:13:59'),
(963, 126, 8, '2025-03-24 16:17:54'),
(964, 127, 8, '2025-03-24 16:17:54'),
(965, 124, 7, '2025-03-24 16:17:59'),
(966, 125, 7, '2025-03-24 16:17:59'),
(967, 128, 7, '2025-03-24 16:18:04'),
(968, 129, 9, '2025-03-24 16:26:45'),
(969, 130, 9, '2025-03-24 16:27:56'),
(970, 131, 9, '2025-03-24 16:28:36'),
(971, 132, 9, '2025-03-24 16:31:14'),
(972, 133, 9, '2025-03-24 16:31:30'),
(973, 134, 9, '2025-03-24 16:31:42'),
(974, 135, 9, '2025-03-24 16:31:52'),
(975, 136, 9, '2025-03-24 16:32:41'),
(976, 137, 8, '2025-03-24 16:35:50'),
(977, 138, 7, '2025-03-24 16:36:21'),
(978, 139, 7, '2025-03-24 16:36:31'),
(979, 140, 9, '2025-03-24 16:36:41'),
(980, 141, 8, '2025-03-24 16:36:54'),
(981, 142, 7, '2025-03-24 16:58:17'),
(982, 143, 7, '2025-03-24 17:16:27'),
(983, 144, 7, '2025-03-24 17:17:03'),
(984, 145, 7, '2025-03-24 17:18:29'),
(985, 146, 7, '2025-03-24 18:10:20'),
(986, 147, 9, '2025-03-25 01:12:37'),
(987, 147, 8, '2025-03-25 01:12:37'),
(988, 148, 9, '2025-03-25 01:12:46'),
(989, 148, 7, '2025-03-25 01:12:46'),
(990, 149, 8, '2025-03-25 01:12:55'),
(991, 149, 7, '2025-03-25 01:12:55'),
(992, 150, 8, '2025-03-25 01:26:22'),
(993, 150, 9, '2025-03-25 01:26:22'),
(994, 151, 8, '2025-03-25 01:26:33'),
(995, 151, 7, '2025-03-25 01:26:33'),
(996, 152, 8, '2025-03-25 01:28:31'),
(997, 152, 9, '2025-03-25 01:28:31'),
(998, 153, 8, '2025-03-25 05:00:50'),
(999, 154, 8, '2025-03-25 05:01:01'),
(1000, 155, 8, '2025-03-25 05:01:10'),
(1001, 156, 8, '2025-03-25 05:02:21'),
(1002, 157, 8, '2025-03-25 05:02:37'),
(1003, 158, 8, '2025-03-25 05:03:14'),
(1004, 159, 8, '2025-03-25 06:32:57'),
(1005, 160, 9, '2025-03-25 07:09:14'),
(1006, 160, 8, '2025-03-25 07:09:27'),
(1007, 161, 8, '2025-03-25 07:11:06'),
(1008, 161, 9, '2025-03-25 07:11:06'),
(1009, 162, 8, '2025-03-25 07:11:44'),
(1010, 162, 9, '2025-03-25 07:11:44'),
(1011, 163, 10, '2025-03-25 13:08:26'),
(1012, 164, 7, '2025-03-25 13:08:32'),
(1013, 165, 9, '2025-03-29 15:18:27'),
(1014, 166, 9, '2025-03-29 15:18:54'),
(1015, 167, 9, '2025-03-29 15:20:18'),
(1016, 168, 9, '2025-03-29 15:20:18'),
(1017, 169, 9, '2025-03-29 15:20:43'),
(1018, 169, 9, '2025-03-29 15:20:46'),
(1019, 170, 9, '2025-03-29 15:21:44'),
(1020, 170, 9, '2025-03-29 15:21:44'),
(1021, 171, 9, '2025-04-01 08:14:54'),
(1022, 172, 9, '2025-04-01 08:14:57'),
(1023, 173, 9, '2025-04-01 08:15:43'),
(1024, 174, 9, '2025-04-01 08:16:35'),
(1025, 175, 9, '2025-04-01 08:20:05'),
(1026, 176, 9, '2025-04-01 08:32:44'),
(1027, 177, 9, '2025-04-01 08:32:50'),
(1029, 179, 9, '2025-04-01 08:38:43'),
(1030, 180, 9, '2025-04-01 13:31:37'),
(1031, 182, 9, '2025-04-01 13:35:39'),
(1032, 183, 9, '2025-04-01 13:35:39'),
(1033, 181, 9, '2025-04-01 13:35:39'),
(1034, 184, 9, '2025-04-01 13:41:04'),
(1035, 185, 9, '2025-04-01 13:41:30'),
(1036, 186, 9, '2025-04-01 13:41:54'),
(1037, 187, 9, '2025-04-01 13:42:33'),
(1038, 188, 9, '2025-04-01 13:42:37'),
(1039, 189, 9, '2025-04-01 13:44:29'),
(1040, 190, 9, '2025-04-01 13:48:22'),
(1041, 191, 9, '2025-04-01 13:48:56'),
(1042, 192, 9, '2025-04-01 13:51:54'),
(1043, 193, 9, '2025-04-01 13:52:03'),
(1044, 194, 9, '2025-04-01 14:27:23'),
(1045, 195, 9, '2025-04-01 14:27:34'),
(1046, 196, 9, '2025-04-01 14:33:42'),
(1048, 199, 9, '2025-04-01 17:47:33'),
(1049, 200, 9, '2025-04-19 08:13:35'),
(1050, 201, 9, '2025-04-19 08:15:11'),
(1051, 202, 9, '2025-06-12 08:36:44'),
(1052, 203, 9, '2025-06-12 08:37:03');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `display_name` varchar(255) DEFAULT NULL,
  `provider` enum('google','facebook') DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `status` enum('online','offline') DEFAULT 'offline',
  `last_online_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `otp` varchar(4) DEFAULT NULL,
  `otp_expire` timestamp NULL DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `display_name`, `provider`, `avatar`, `bio`, `status`, `last_online_at`, `created_at`, `updated_at`, `otp`, `otp_expire`, `is_verified`) VALUES
(7, 'Khoi251104@', '$2b$10$mCEhaUs1cg00F7w3UJ0zqufjJYBcKt2Fm8LaGdWtbr0zZuOEGrGPO', 'khoindt10a4@gmail.com', 'Nguyen Van A', NULL, 'https://res.cloudinary.com/dbyuzvqz8/image/upload/fl_attachment/v1742926121/Chat-App/Avatar/1742926119241.png.png', 'Bio', 'offline', '2025-06-12 08:41:51', '2025-03-23 07:33:58', '2025-06-12 08:41:51', '6291', '2025-03-23 07:38:58', 1),
(8, 'User123@', '$2b$10$PuDsDn.IPW4HGUyZy0aYt.FZwsk0fEV8DfzJAwZcu6xuXWvlUBrPa', 'nvkxxx04@gmail.com', 'User2', NULL, 'https://res.cloudinary.com/dbyuzvqz8/image/upload/fl_attachment/v1743526515/Chat-App/Avatar/Personal/1743526510643.png.png', 'Bio', 'offline', '2025-04-01 17:47:26', '2025-03-23 09:51:39', '2025-04-01 17:47:26', '4243', '2025-03-23 09:56:39', 1),
(9, 'Khoi251104@1', '$2b$10$t3rhvyXJee.dEgseZqO1v.wgxGUGx9LQuXBfq4EA73A3YW.fHaufS', 'nvk251104@gmail.com', 'Nguyen Van C', NULL, 'https://res.cloudinary.com/dbyuzvqz8/image/upload/fl_attachment/v1742972982/Chat-App/Avatar/Personal/1742972976428.png.png', 'Bio', 'offline', '2025-06-12 08:41:40', '2025-03-24 16:23:00', '2025-06-12 08:41:40', '8452', '2025-03-24 16:28:00', 1),
(10, 'Khoi251104@2', '$2b$10$xVj/I8rVXFNN739/ax1sm.oaGEaoP0nyxSRYBUn1.SwtJcIWzq0Oe', 'tdm05112005@gmail.com', 'Nguyen Van B', NULL, 'https://res.cloudinary.com/dbyuzvqz8/image/upload/fl_attachment/v1742922525/Chat-App/Avatar/1742922522917.png.png', 'Bio', 'offline', '2025-03-25 18:13:05', '2025-03-25 12:33:53', '2025-03-26 07:20:02', '2840', '2025-03-25 12:38:53', 1);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `conversations`
--
ALTER TABLE `conversations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `last_message_id` (`last_message_id`);

--
-- Chỉ mục cho bảng `conversation_members`
--
ALTER TABLE `conversation_members`
  ADD PRIMARY KEY (`id`),
  ADD KEY `conversation_id` (`conversation_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `conversation_setting`
--
ALTER TABLE `conversation_setting`
  ADD PRIMARY KEY (`id`),
  ADD KEY `conversation_id` (`conversation_id`);

--
-- Chỉ mục cho bảng `deleted_messages`
--
ALTER TABLE `deleted_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `message_id` (`message_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `friendships`
--
ALTER TABLE `friendships`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user1_id` (`sender_id`,`receiver_id`);

--
-- Chỉ mục cho bảng `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `conversation_id` (`conversation_id`),
  ADD KEY `sender_id` (`sender_id`);

--
-- Chỉ mục cho bảng `message_files`
--
ALTER TABLE `message_files`
  ADD PRIMARY KEY (`id`),
  ADD KEY `message_id` (`message_id`);

--
-- Chỉ mục cho bảng `message_reactions`
--
ALTER TABLE `message_reactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_reaction` (`message_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `message_readers`
--
ALTER TABLE `message_readers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `message_id` (`message_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `conversations`
--
ALTER TABLE `conversations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT cho bảng `conversation_members`
--
ALTER TABLE `conversation_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;

--
-- AUTO_INCREMENT cho bảng `conversation_setting`
--
ALTER TABLE `conversation_setting`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `deleted_messages`
--
ALTER TABLE `deleted_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT cho bảng `friendships`
--
ALTER TABLE `friendships`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT cho bảng `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=204;

--
-- AUTO_INCREMENT cho bảng `message_files`
--
ALTER TABLE `message_files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT cho bảng `message_reactions`
--
ALTER TABLE `message_reactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT cho bảng `message_readers`
--
ALTER TABLE `message_readers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1053;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `conversations`
--
ALTER TABLE `conversations`
  ADD CONSTRAINT `conversations_ibfk_2` FOREIGN KEY (`last_message_id`) REFERENCES `messages` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `conversation_members`
--
ALTER TABLE `conversation_members`
  ADD CONSTRAINT `conversation_members_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `conversation_members_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `conversation_setting`
--
ALTER TABLE `conversation_setting`
  ADD CONSTRAINT `conversation_setting_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `deleted_messages`
--
ALTER TABLE `deleted_messages`
  ADD CONSTRAINT `deleted_messages_ibfk_1` FOREIGN KEY (`message_id`) REFERENCES `messages` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `deleted_messages_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `message_files`
--
ALTER TABLE `message_files`
  ADD CONSTRAINT `message_files_ibfk_1` FOREIGN KEY (`message_id`) REFERENCES `messages` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `message_reactions`
--
ALTER TABLE `message_reactions`
  ADD CONSTRAINT `message_reactions_ibfk_1` FOREIGN KEY (`message_id`) REFERENCES `messages` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `message_reactions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `message_readers`
--
ALTER TABLE `message_readers`
  ADD CONSTRAINT `message_readers_ibfk_1` FOREIGN KEY (`message_id`) REFERENCES `messages` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `message_readers_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
