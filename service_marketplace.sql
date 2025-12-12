-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 12, 2025 at 05:24 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `service_marketplace`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `booking_date` date NOT NULL,
  `booking_time` time NOT NULL,
  `status` enum('pending','confirmed','completed','cancelled') DEFAULT 'pending',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `service_id`, `customer_id`, `booking_date`, `booking_time`, `status`, `notes`, `created_at`) VALUES
(1, 1, 1, '2025-12-18', '15:45:00', 'completed', 'FAST', '2025-11-30 04:18:12'),
(2, 1, 3, '2025-11-30', '13:15:00', 'completed', '1231231321', '2025-11-30 05:13:01'),
(3, 1, 1, '2025-11-30', '13:18:00', 'completed', '123123', '2025-11-30 05:14:13'),
(4, 3, 3, '2025-11-30', '16:17:00', 'completed', 'left rihgt', '2025-11-30 15:17:29'),
(5, 2, 3, '2025-12-01', '10:30:00', 'completed', 'asdasd', '2025-12-01 02:21:26'),
(6, 5, 3, '2025-12-01', '19:59:00', 'completed', 'use only puck support', '2025-12-01 11:37:42'),
(7, 4, 4, '2025-12-01', '20:48:00', 'completed', NULL, '2025-12-01 11:39:53'),
(8, 4, 3, '2025-12-01', '23:05:00', 'completed', NULL, '2025-12-01 15:01:56'),
(9, 3, 3, '2025-12-01', '23:35:00', 'completed', NULL, '2025-12-01 15:07:20'),
(10, 5, 3, '2025-12-02', '23:44:00', 'completed', 'smurf ian gwapo', '2025-12-01 15:28:42'),
(11, 3, 1, '2025-12-25', '13:54:00', 'completed', 'MGASD', '2025-12-03 05:50:10'),
(12, 5, 3, '2025-12-16', '19:58:00', 'pending', 'asdasd', '2025-12-08 11:54:49');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `sender_id`, `receiver_id`, `message`, `is_read`, `created_at`) VALUES
(2, 1, 2, 'Hello from user 1', 0, '2025-12-01 02:27:03'),
(3, 1, 4, 'Hi! I\'m interested in your service: 123', 1, '2025-12-01 08:12:57'),
(4, 1, 4, 'asfnkasd', 1, '2025-12-01 08:13:12'),
(5, 1, 4, 'asdasd', 1, '2025-12-01 08:13:15'),
(6, 4, 1, 'asdada', 1, '2025-12-01 08:21:28'),
(7, 4, 1, 'asasdasd', 1, '2025-12-01 08:21:32'),
(8, 4, 1, 'asdasd', 1, '2025-12-01 08:27:29'),
(9, 3, 4, 'Hi! I\'m interested in your service: BOOSTING SERVICE', 1, '2025-12-01 11:37:12'),
(10, 3, 4, 'BOSS PA BOOST ACCOUNT', 1, '2025-12-01 11:37:56'),
(11, 4, 3, 'sge boss ako bahala', 1, '2025-12-01 11:38:46'),
(12, 4, 1, 'asdasd', 1, '2025-12-01 15:08:49'),
(13, 1, 4, 'asfafafa', 1, '2025-12-03 05:49:13'),
(14, 4, 1, 'asdasdasd', 0, '2025-12-05 08:55:15'),
(15, 4, 1, 'asdasd', 0, '2025-12-05 08:55:27'),
(16, 4, 3, 'Hi 123123! I found your profile on the marketplace.', 1, '2025-12-05 09:31:43'),
(17, 3, 4, 'Hi! I\'m interested in your service: BOOSTING SERVICE', 0, '2025-12-08 11:54:30'),
(18, 3, 4, 'IMSAMDAMSD', 0, '2025-12-08 11:54:36'),
(19, 3, 4, 'Hi Kin! I found your profile on the marketplace.', 0, '2025-12-08 11:55:20');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `provider_id` int(11) NOT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` between 1 and 5),
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `booking_id`, `customer_id`, `provider_id`, `rating`, `comment`, `created_at`) VALUES
(1, 4, 3, 4, 5, 'The service is good ', '2025-11-30 17:57:51');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` int(11) NOT NULL,
  `provider_id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `hourly_rate` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `provider_id`, `title`, `description`, `category`, `hourly_rate`, `created_at`) VALUES
(1, 4, 'ELEECTROOOO', 'best service in town', 'Electrical', 5.00, '2025-11-30 04:10:46'),
(2, 4, 'VIDEO EDITING ', 'I can create life to your raw videos with my editing skills. SUPER FAST and QUALITY EDITS', 'Other', 19.00, '2025-11-30 09:24:17'),
(3, 4, '123', '123', 'Other', 123.00, '2025-11-30 15:06:22'),
(4, 4, 'fishing', 'afs', 'Electrical', 123123.00, '2025-11-30 17:49:28'),
(5, 4, 'BOOSTING SERVICE', 'DOTA 2 ACCOUNT SO CHEAP AND FAST ', 'Other', 5.00, '2025-12-01 11:36:27'),
(6, 4, 'DOTA BOOSTER', 'FAST BOOSTING', 'Other', 100.00, '2025-12-08 11:52:03');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` enum('customer','provider') DEFAULT 'customer',
  `profile_image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `name`, `phone`, `role`, `profile_image`, `created_at`) VALUES
(1, 'zero12363731@gmail.com', '$2b$12$hzT8Nm2.4LsLoVgAlyCqceUsVdTPKeceoaw86gdiTDfSNylBB0X62', '123', NULL, 'customer', '/uploads/1764924500253-u99om8.png', '2025-11-28 17:31:19'),
(2, 'asd123@gmail.com', '$2b$12$3AMavVe.WijXiB/bllqDy.ZvKUwKLGTXQQeHPiOjfvYx3EQiZ2hpi', 'asd', NULL, 'customer', NULL, '2025-11-28 17:33:43'),
(3, '123123@gmail.com', '$2b$12$SPzb.KJeuRZ5oR/z7WmBEOGSJh2oP7bX/OpGjDpnHn2UXiBC7cx0q', '123123', NULL, 'customer', '/uploads/1764602254600-dw9agfq.jpg', '2025-11-28 17:35:35'),
(4, 'admin123@gmail.com', '$2b$12$cNHp2LyDDinRNXLade41uO66Gc7BX3ShQUNjgYT22EQQPxxZ72F8S', 'Kin', '', 'provider', '/uploads/1764587741950-9j752.jpg', '2025-11-30 04:06:28');

-- --------------------------------------------------------

--
-- Table structure for table `work_photos`
--

CREATE TABLE `work_photos` (
  `id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `uploaded_by` int(11) NOT NULL,
  `photo_url` varchar(255) NOT NULL,
  `caption` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `work_photos`
--

INSERT INTO `work_photos` (`id`, `booking_id`, `uploaded_by`, `photo_url`, `caption`, `created_at`) VALUES
(1, 4, 4, '/uploads/1764524993480-7ev0jpstrwv.jpeg', '', '2025-11-30 17:49:53'),
(2, 5, 4, '/uploads/1764587910499-gockz.jpg', '', '2025-12-01 11:18:30'),
(3, 6, 4, '/uploads/1764589154013-iyy64t.jpg', '', '2025-12-01 11:39:14'),
(4, 10, 4, '/uploads/1764602967436-edqjxr.png', '', '2025-12-01 15:29:27');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `service_id` (`service_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `booking_id` (`booking_id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `provider_id` (`provider_id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `provider_id` (`provider_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `work_photos`
--
ALTER TABLE `work_photos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `booking_id` (`booking_id`),
  ADD KEY `uploaded_by` (`uploaded_by`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `work_photos`
--
ALTER TABLE `work_photos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`provider_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `services`
--
ALTER TABLE `services`
  ADD CONSTRAINT `services_ibfk_1` FOREIGN KEY (`provider_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `work_photos`
--
ALTER TABLE `work_photos`
  ADD CONSTRAINT `work_photos_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `work_photos_ibfk_2` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
