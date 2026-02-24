-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 22-02-2026 a las 05:50:26
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `marketplace_servicios`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `client_properties`
--

CREATE TABLE `client_properties` (
  `id` varchar(36) NOT NULL,
  `client_id` varchar(36) NOT NULL,
  `address_line` varchar(255) NOT NULL,
  `property_type` varchar(100) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `disputes`
--

CREATE TABLE `disputes` (
  `id` varchar(36) NOT NULL,
  `request_id` varchar(36) NOT NULL,
  `escrow_id` varchar(36) NOT NULL,
  `initiator_id` varchar(36) NOT NULL,
  `reason_category` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `status` enum('open','under_review','resolved_refund','resolved_release','arbitration') DEFAULT 'open',
  `resolution_notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `escrow_payments`
--

CREATE TABLE `escrow_payments` (
  `id` varchar(36) NOT NULL,
  `request_id` varchar(36) NOT NULL,
  `payer_id` varchar(36) NOT NULL,
  `payee_id` varchar(36) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `purpose` enum('visit_fee','final_job') NOT NULL,
  `mp_preference_id` varchar(255) DEFAULT NULL,
  `mp_payment_id` varchar(255) DEFAULT NULL,
  `status` enum('pending','held_in_escrow','released','refunded','disputed') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `released_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `kyc_verifications`
--

CREATE TABLE `kyc_verifications` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `document_type` enum('dni_front','dni_back','selfie','license_matricula') NOT NULL,
  `document_url` varchar(255) NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `notes` text DEFAULT NULL,
  `verified_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `legal_agreements`
--

CREATE TABLE `legal_agreements` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `agreement_type` enum('platform_intermediary_waiver','terms_and_conditions') NOT NULL,
  `accepted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `ip_address` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `professional_profiles`
--

CREATE TABLE `professional_profiles` (
  `user_id` varchar(36) NOT NULL,
  `category` varchar(100) NOT NULL,
  `bio` text DEFAULT NULL,
  `skills` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`skills`)),
  `rating_avg` decimal(3,2) DEFAULT 0.00,
  `total_jobs` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `quotes_and_visits`
--

CREATE TABLE `quotes_and_visits` (
  `id` varchar(36) NOT NULL,
  `request_id` varchar(36) NOT NULL,
  `professional_id` varchar(36) NOT NULL,
  `visit_fee` decimal(10,2) NOT NULL,
  `visit_status` enum('pending_payment','scheduled','completed','waived') DEFAULT 'pending_payment',
  `final_labor_cost` decimal(10,2) DEFAULT NULL,
  `materials_cost` decimal(10,2) DEFAULT NULL,
  `quote_status` enum('draft','submitted','accepted','rejected') DEFAULT 'draft',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reviews`
--

CREATE TABLE `reviews` (
  `id` varchar(36) NOT NULL,
  `request_id` varchar(36) NOT NULL,
  `reviewer_id` varchar(36) NOT NULL,
  `reviewee_id` varchar(36) NOT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` between 1 and 5),
  `comment` text DEFAULT NULL,
  `is_risk_flag` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `service_logs`
--

CREATE TABLE `service_logs` (
  `id` varchar(36) NOT NULL,
  `request_id` varchar(36) NOT NULL,
  `professional_id` varchar(36) NOT NULL,
  `action_type` enum('arrival','diagnosis','quote_submitted','work_started','milestone_reached','work_finished') NOT NULL,
  `description` text NOT NULL,
  `media_urls` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`media_urls`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `service_requests`
--

CREATE TABLE `service_requests` (
  `id` varchar(36) NOT NULL,
  `client_id` varchar(36) NOT NULL,
  `property_id` varchar(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `complexity` enum('simple','complex','pending_triage') DEFAULT 'pending_triage',
  `preferred_gender` enum('any','female_only') DEFAULT 'any',
  `status` enum('open','quoting','visit_scheduled','in_progress','completed','disputed','cancelled') DEFAULT 'open',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `role` enum('client','professional','admin') NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `gender` enum('male','female','other') NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `status` enum('pending_kyc','active','suspended') DEFAULT 'pending_kyc',
  `is_risk_user` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `role`, `email`, `password_hash`, `first_name`, `last_name`, `gender`, `phone_number`, `status`, `is_risk_user`, `created_at`, `updated_at`) VALUES
('aa44b18b-6821-4826-9800-81596e8f8a36', 'professional', 'maciel.nuevo@test.com', '$2b$10$4fGdOakdG1WpSWsVKqnKZeBwGUJc4jn8bOmK.mYCschoJ0ma09xzS', 'Maciel', 'Test', 'other', '123456789', 'active', 0, '2026-02-21 00:11:33', '2026-02-21 00:44:40');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `client_properties`
--
ALTER TABLE `client_properties`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_id` (`client_id`);

--
-- Indices de la tabla `disputes`
--
ALTER TABLE `disputes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `request_id` (`request_id`),
  ADD KEY `escrow_id` (`escrow_id`),
  ADD KEY `initiator_id` (`initiator_id`);

--
-- Indices de la tabla `escrow_payments`
--
ALTER TABLE `escrow_payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `request_id` (`request_id`),
  ADD KEY `payer_id` (`payer_id`),
  ADD KEY `payee_id` (`payee_id`);

--
-- Indices de la tabla `kyc_verifications`
--
ALTER TABLE `kyc_verifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `legal_agreements`
--
ALTER TABLE `legal_agreements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `professional_profiles`
--
ALTER TABLE `professional_profiles`
  ADD PRIMARY KEY (`user_id`);

--
-- Indices de la tabla `quotes_and_visits`
--
ALTER TABLE `quotes_and_visits`
  ADD PRIMARY KEY (`id`),
  ADD KEY `request_id` (`request_id`),
  ADD KEY `professional_id` (`professional_id`);

--
-- Indices de la tabla `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `request_id` (`request_id`),
  ADD KEY `reviewer_id` (`reviewer_id`),
  ADD KEY `reviewee_id` (`reviewee_id`);

--
-- Indices de la tabla `service_logs`
--
ALTER TABLE `service_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `request_id` (`request_id`),
  ADD KEY `professional_id` (`professional_id`);

--
-- Indices de la tabla `service_requests`
--
ALTER TABLE `service_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `property_id` (`property_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `client_properties`
--
ALTER TABLE `client_properties`
  ADD CONSTRAINT `client_properties_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `disputes`
--
ALTER TABLE `disputes`
  ADD CONSTRAINT `disputes_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `service_requests` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `disputes_ibfk_2` FOREIGN KEY (`escrow_id`) REFERENCES `escrow_payments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `disputes_ibfk_3` FOREIGN KEY (`initiator_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `escrow_payments`
--
ALTER TABLE `escrow_payments`
  ADD CONSTRAINT `escrow_payments_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `service_requests` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `escrow_payments_ibfk_2` FOREIGN KEY (`payer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `escrow_payments_ibfk_3` FOREIGN KEY (`payee_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `kyc_verifications`
--
ALTER TABLE `kyc_verifications`
  ADD CONSTRAINT `kyc_verifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `legal_agreements`
--
ALTER TABLE `legal_agreements`
  ADD CONSTRAINT `legal_agreements_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `professional_profiles`
--
ALTER TABLE `professional_profiles`
  ADD CONSTRAINT `professional_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `quotes_and_visits`
--
ALTER TABLE `quotes_and_visits`
  ADD CONSTRAINT `quotes_and_visits_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `service_requests` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `quotes_and_visits_ibfk_2` FOREIGN KEY (`professional_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `service_requests` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`reviewer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`reviewee_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `service_logs`
--
ALTER TABLE `service_logs`
  ADD CONSTRAINT `service_logs_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `service_requests` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `service_logs_ibfk_2` FOREIGN KEY (`professional_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `service_requests`
--
ALTER TABLE `service_requests`
  ADD CONSTRAINT `service_requests_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `service_requests_ibfk_2` FOREIGN KEY (`property_id`) REFERENCES `client_properties` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
