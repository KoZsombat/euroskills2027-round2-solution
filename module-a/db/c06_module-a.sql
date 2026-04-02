-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Gép: competitor_db:3306
-- Létrehozás ideje: 2026. Már 13. 17:56
-- Kiszolgáló verziója: 8.4.8
-- PHP verzió: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `c06_module-a`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `api_tokens`
--

CREATE TABLE `api_tokens` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `revoked_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `api_tokens`
--

INSERT INTO `api_tokens` (`id`, `user_id`, `token`, `created_at`, `revoked_at`) VALUES
(1, 1, 'alice_token_123456789abcdef', '2026-02-28 07:00:00.000', NULL),
(2, 2, 'bob_token_987654321fedcba', '2026-02-26 07:00:00.000', '2026-02-26 08:00:00.000'),
(3, 3, 'carol_token_456789123abcdef', '2026-02-26 07:00:00.000', NULL),
(4, 4, 'david_token_789123456defabc', '2026-02-25 07:00:00.000', NULL),
(5, 5, 'eva_token_321654987cbafed', '2026-02-24 07:00:00.000', NULL),
(6, 6, 'admin_token_000111222333444', '2026-02-23 07:00:00.000', NULL),
(7, 7, 'grace_token_555666777888999', '2026-02-22 07:00:00.000', '2026-02-22 08:00:00.000'),
(8, 8, 'henry_token_aaabbbcccdddeee', '2026-02-21 07:00:00.000', NULL),
(9, 1, 'alice_token_43822420fd2d32c', '2026-03-11 15:03:49.971', NULL),
(10, 2, 'bob_token_d6583fd33695a83', '2026-03-11 15:03:50.184', NULL),
(11, 3, 'carol_token_cefed61634f3020', '2026-03-11 15:03:50.654', NULL),
(12, 5, 'eva_token_ea17b20d019dc54', '2026-03-11 15:03:50.727', '2026-03-11 15:03:50.733'),
(13, 1, 'alice_token_ddfd180a42c8e2f', '2026-03-11 15:03:52.304', NULL);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `chapter_completions`
--

CREATE TABLE `chapter_completions` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `chapter_id` bigint UNSIGNED NOT NULL,
  `credits_earned` int NOT NULL DEFAULT '0',
  `completed_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `chapter_completions`
--

INSERT INTO `chapter_completions` (`id`, `user_id`, `chapter_id`, `credits_earned`, `completed_at`) VALUES
(1, 1, 1, 4, '2026-02-27 09:00:00.000'),
(2, 1, 2, 4, '2026-02-27 11:00:00.000'),
(3, 1, 12, 3, '2026-02-27 13:00:00.000'),
(4, 2, 1, 4, '2026-02-27 10:00:00.000'),
(5, 3, 7, 5, '2026-02-27 12:00:00.000'),
(6, 3, 22, 5, '2026-02-27 14:00:00.000'),
(7, 5, 1, 4, '2026-02-27 15:00:00.000'),
(8, 5, 2, 4, '2026-02-27 16:00:00.000'),
(9, 5, 3, 5, '2026-02-27 17:00:00.000'),
(10, 7, 26, 4, '2026-02-27 18:00:00.000'),
(11, 8, 1, 4, '2026-02-27 19:00:00.000'),
(12, 1, 3, 4, '2026-03-11 15:03:51.437'),
(13, 1, 4, 5, '2026-03-11 15:03:51.598');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `enrollments`
--

CREATE TABLE `enrollments` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `course_id` bigint UNSIGNED NOT NULL,
  `enrolled_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `enrollments`
--

INSERT INTO `enrollments` (`id`, `user_id`, `course_id`, `enrolled_at`) VALUES
(1, 1, 1, '2026-02-10 08:00:00.000'),
(2, 1, 3, '2026-02-10 08:15:00.000'),
(3, 1, 6, '2026-02-10 08:30:00.000'),
(4, 2, 1, '2026-02-10 09:00:00.000'),
(5, 2, 4, '2026-02-10 09:15:00.000'),
(6, 3, 2, '2026-02-10 10:00:00.000'),
(7, 3, 5, '2026-02-10 10:15:00.000'),
(8, 3, 9, '2026-02-10 10:30:00.000'),
(9, 4, 7, '2026-02-10 11:00:00.000'),
(10, 4, 8, '2026-02-10 11:15:00.000'),
(11, 5, 1, '2026-02-10 12:00:00.000'),
(12, 5, 2, '2026-02-10 12:15:00.000'),
(13, 5, 3, '2026-02-10 12:30:00.000'),
(14, 7, 6, '2026-02-10 13:00:00.000'),
(15, 7, 14, '2026-02-10 13:15:00.000'),
(16, 8, 1, '2026-02-10 14:00:00.000'),
(17, 8, 17, '2026-02-10 14:15:00.000'),
(18, 4, 1, '2026-03-11 15:03:51.379'),
(19, 6, 2, '2026-03-11 15:03:51.416');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `mentor_sessions`
--

CREATE TABLE `mentor_sessions` (
  `id` bigint UNSIGNED NOT NULL,
  `mentor_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expertise` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `experience_level` enum('junior','mid','senior') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'mid',
  `session_date` datetime(3) NOT NULL,
  `duration_minutes` int NOT NULL DEFAULT '60',
  `credit_cost` int NOT NULL,
  `is_available` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `mentor_sessions`
--

INSERT INTO `mentor_sessions` (`id`, `mentor_name`, `expertise`, `experience_level`, `session_date`, `duration_minutes`, `credit_cost`, `is_available`, `created_at`) VALUES
(1, 'Sarah Johnson', 'Frontend Development', 'senior', '2026-02-26 07:00:00.000', 60, 15, 0, '2026-02-26 07:00:00.000'),
(2, 'Michael Brown', 'Backend Development', 'senior', '2026-02-25 10:00:00.000', 60, 14, 0, '2026-02-25 07:00:00.000'),
(3, 'Lisa Wang', 'UI/UX Design', 'mid', '2026-02-24 12:00:00.000', 60, 12, 0, '2026-02-24 07:00:00.000'),
(4, 'David Rodriguez', 'DevOps', 'senior', '2026-02-24 08:00:00.000', 60, 15, 0, '2026-02-28 07:00:00.000'),
(5, 'Emma Chen', 'Data Science', 'mid', '2026-02-23 13:00:00.000', 60, 13, 0, '2026-02-23 07:00:00.000'),
(6, 'Sarah Johnson', 'Frontend Development', 'senior', '2026-03-22 13:00:00.000', 60, 15, 1, '2026-03-22 07:00:00.000'),
(7, 'Michael Brown', 'Backend Development', 'senior', '2026-03-21 09:00:00.000', 60, 14, 1, '2026-03-21 07:00:00.000'),
(8, 'Lisa Wang', 'UI/UX Design', 'mid', '2026-03-20 14:00:00.000', 60, 12, 1, '2026-03-20 07:00:00.000'),
(9, 'James Wilson', 'Mobile Development', 'mid', '2026-03-19 09:00:00.000', 60, 12, 0, '2026-03-19 07:00:00.000'),
(10, 'Maria Garcia', 'Machine Learning', 'senior', '2026-03-18 10:00:00.000', 60, 15, 1, '2026-03-18 07:00:00.000'),
(11, 'Alex Kim', 'Cybersecurity', 'mid', '2026-03-17 12:00:00.000', 60, 13, 1, '2026-03-17 07:00:00.000'),
(12, 'Jennifer Lee', 'Cloud Architecture', 'senior', '2026-03-16 14:00:00.000', 60, 14, 1, '2026-03-16 07:00:00.000'),
(13, 'Robert Taylor', 'JavaScript', 'junior', '2026-03-15 09:00:00.000', 60, 8, 0, '2026-03-15 07:00:00.000'),
(14, 'Amanda Davis', 'Python Development', 'mid', '2026-03-14 13:00:00.000', 60, 11, 0, '2026-03-14 07:00:00.000'),
(15, 'Thomas Anderson', 'API Development', 'senior', '2026-03-13 08:00:00.000', 60, 14, 1, '2026-03-13 07:00:00.000');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `session_bookings`
--

CREATE TABLE `session_bookings` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `session_id` bigint UNSIGNED NOT NULL,
  `status` enum('pending','confirmed','rejected','completed','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `credits_paid` int NOT NULL,
  `booked_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `session_bookings`
--

INSERT INTO `session_bookings` (`id`, `user_id`, `session_id`, `status`, `credits_paid`, `booked_at`) VALUES
(1, 1, 1, 'completed', 15, '2026-02-10 08:00:00.000'),
(2, 3, 2, 'completed', 14, '2026-02-10 09:00:00.000'),
(3, 5, 6, 'confirmed', 15, '2026-02-18 10:00:00.000'),
(4, 2, 13, 'pending', 8, '2026-02-18 11:00:00.000'),
(5, 7, 8, 'confirmed', 12, '2026-02-18 12:00:00.000'),
(6, 8, 14, 'pending', 11, '2026-02-18 13:00:00.000'),
(7, 3, 13, 'pending', 8, '2026-03-11 15:03:51.813'),
(8, 6, 14, 'pending', 11, '2026-03-11 15:03:51.826'),
(9, 4, 9, 'pending', 12, '2026-03-11 15:03:51.875');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('learner','mentor','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'learner',
  `credit_balance` int NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `credit_balance`, `created_at`, `updated_at`) VALUES
(1, 'Alice Johnson', 'alice@example.com', '$2b$10$5aNFo7Wszw5VwWOJRuzHqOE4kbopzOBWcTpEZSd92TzVIcAhQANO.', 'learner', 54, '2026-02-28 07:00:00.000', '2026-02-18 15:16:17.474'),
(2, 'Bob Smith', 'bob@example.com', '$2b$10$5aNFo7Wszw5VwWOJRuzHqOE4kbopzOBWcTpEZSd92TzVIcAhQANO.', 'learner', 23, '2026-02-27 07:00:00.000', '2026-02-18 15:16:17.474'),
(3, 'Carol Davis', 'carol@example.com', '$2b$10$5aNFo7Wszw5VwWOJRuzHqOE4kbopzOBWcTpEZSd92TzVIcAhQANO.', 'learner', 59, '2026-02-26 07:00:00.000', '2026-02-18 15:16:17.474'),
(4, 'David Wilson', 'david@example.com', '$2b$10$5aNFo7Wszw5VwWOJRuzHqOE4kbopzOBWcTpEZSd92TzVIcAhQANO.', 'mentor', 0, '2026-02-25 07:00:00.000', '2026-02-18 15:16:17.474'),
(5, 'Eva Rodriguez', 'eva@example.com', '$2b$10$5aNFo7Wszw5VwWOJRuzHqOE4kbopzOBWcTpEZSd92TzVIcAhQANO.', 'learner', 89, '2026-02-24 07:00:00.000', '2026-02-18 15:16:17.474'),
(6, 'Frank Chen', 'frank@example.com', '$2b$10$5aNFo7Wszw5VwWOJRuzHqOE4kbopzOBWcTpEZSd92TzVIcAhQANO.', 'admin', 139, '2026-02-23 07:00:00.000', '2026-02-18 15:16:17.474'),
(7, 'Grace Kim', 'grace@example.com', '$2b$10$5aNFo7Wszw5VwWOJRuzHqOE4kbopzOBWcTpEZSd92TzVIcAhQANO.', 'learner', 34, '2026-02-22 07:00:00.000', '2026-02-18 15:16:17.474'),
(8, 'Henry Taylor', 'henry@example.com', '$2b$10$5aNFo7Wszw5VwWOJRuzHqOE4kbopzOBWcTpEZSd92TzVIcAhQANO.', 'learner', 8, '2026-02-21 07:00:00.000', '2026-02-18 15:16:17.474'),
(9, 'New User', 'newuser@example.com', '$2b$10$ffYlH.kxN6MtRoteNL4oo.TEKhFFdpXdEFNSTW5UbAWDYIU5vozxG', 'learner', 0, '2026-03-11 15:03:49.582', '2026-03-11 15:03:49.582'),
(10, 'First', 'duplicate_test@example.com', '$2b$10$k7ct8WoiBKXSLx0cQ6ETzORETzhrYhzAKI8Qa4uDmjBjz2LO25BKy', 'learner', 0, '2026-03-11 15:03:49.855', '2026-03-11 15:03:49.855');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('7d16574f-e3e8-45ab-90a3-3d6035aeb2f9', 'f3a684050e14b580464806ad4137ac4c084bea1daedaa399f91cc7f77188e07a', '2026-02-18 15:16:12.564', '20250816184119_init', NULL, NULL, '2026-02-18 15:16:12.559', 1),
('a53163f3-d87d-46ee-b313-f810ae2e92a4', '2745f591a14d2eb6477aeed92e7914c22df089dc8388a8d7d538a17f47d244f0', '2026-02-18 15:16:12.558', '20250816160842_init', NULL, NULL, '2026-02-18 15:16:12.513', 1);

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `api_tokens`
--
ALTER TABLE `api_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `api_tokens_token_key` (`token`),
  ADD KEY `api_tokens_user_id_idx` (`user_id`),
  ADD KEY `api_tokens_revoked_at_idx` (`revoked_at`);

--
-- A tábla indexei `chapter_completions`
--
ALTER TABLE `chapter_completions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `chapter_completions_user_id_chapter_id_key` (`user_id`,`chapter_id`),
  ADD KEY `chapter_completions_user_id_idx` (`user_id`),
  ADD KEY `chapter_completions_chapter_id_idx` (`chapter_id`);

--
-- A tábla indexei `enrollments`
--
ALTER TABLE `enrollments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `enrollments_user_id_course_id_key` (`user_id`,`course_id`),
  ADD KEY `enrollments_user_id_idx` (`user_id`),
  ADD KEY `enrollments_course_id_idx` (`course_id`);

--
-- A tábla indexei `mentor_sessions`
--
ALTER TABLE `mentor_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mentor_sessions_session_date_idx` (`session_date`),
  ADD KEY `mentor_sessions_is_available_idx` (`is_available`),
  ADD KEY `mentor_sessions_expertise_idx` (`expertise`);

--
-- A tábla indexei `session_bookings`
--
ALTER TABLE `session_bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `session_bookings_user_id_idx` (`user_id`),
  ADD KEY `session_bookings_status_idx` (`status`),
  ADD KEY `session_bookings_session_id_fkey` (`session_id`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_key` (`email`),
  ADD KEY `users_email_idx` (`email`),
  ADD KEY `users_role_idx` (`role`),
  ADD KEY `users_credit_balance_idx` (`credit_balance`);

--
-- A tábla indexei `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `api_tokens`
--
ALTER TABLE `api_tokens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT a táblához `chapter_completions`
--
ALTER TABLE `chapter_completions`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT a táblához `enrollments`
--
ALTER TABLE `enrollments`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT a táblához `mentor_sessions`
--
ALTER TABLE `mentor_sessions`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT a táblához `session_bookings`
--
ALTER TABLE `session_bookings`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `api_tokens`
--
ALTER TABLE `api_tokens`
  ADD CONSTRAINT `api_tokens_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `chapter_completions`
--
ALTER TABLE `chapter_completions`
  ADD CONSTRAINT `chapter_completions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `enrollments`
--
ALTER TABLE `enrollments`
  ADD CONSTRAINT `enrollments_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `session_bookings`
--
ALTER TABLE `session_bookings`
  ADD CONSTRAINT `session_bookings_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `mentor_sessions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `session_bookings_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
