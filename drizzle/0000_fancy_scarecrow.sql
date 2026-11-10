CREATE TABLE `account` (
	`id` varchar(36) NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` timestamp,
	`refresh_token_expires_at` timestamp,
	`scope` text,
	`password` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `account_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `agent_messages` (
	`id` varchar(36) NOT NULL,
	`from_agent_id` varchar(36),
	`to_agent_id` varchar(36),
	`agent_task_id` varchar(36),
	`body` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `agent_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `agent_tasks` (
	`id` varchar(36) NOT NULL,
	`task_id` varchar(36),
	`agent_id` varchar(36) NOT NULL,
	`status` enum('antri','dikerjakan','butuh_persetujuan','selesai','ditolak') NOT NULL DEFAULT 'antri',
	`summary` text NOT NULL,
	`evidence` text,
	`approval_gate` varchar(60),
	`approved_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `agent_tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `agents` (
	`id` varchar(36) NOT NULL,
	`slug` varchar(40) NOT NULL,
	`display_name` varchar(80) NOT NULL,
	`role` varchar(120) NOT NULL,
	`scope` text NOT NULL,
	`can_write` json NOT NULL,
	`requires_approval` json NOT NULL,
	`api_key_hash` varchar(128),
	`active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `agents_id` PRIMARY KEY(`id`),
	CONSTRAINT `agents_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `applications` (
	`id` varchar(36) NOT NULL,
	`company` varchar(160) NOT NULL,
	`role` varchar(160) NOT NULL,
	`url` varchar(500),
	`channel` varchar(40),
	`status` enum('terkirim','balasan','wawancara','tes','tawaran','ditolak','tidak_ada_kabar') NOT NULL DEFAULT 'terkirim',
	`sent_at` timestamp,
	`follow_up_at` timestamp,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `applications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `content_items` (
	`id` varchar(36) NOT NULL,
	`title` varchar(200) NOT NULL,
	`platform` enum('tiktok','instagram','threads','linkedin','youtube','website') NOT NULL,
	`format` enum('video','post','carousel','artikel') NOT NULL,
	`series` enum('build_in_public','production_notes','remotion_tips','case_study','lainnya'),
	`hook` text,
	`status` enum('ide','naskah','produksi','terjadwal','tayang') NOT NULL DEFAULT 'ide',
	`scheduled_at` timestamp,
	`published_at` timestamp,
	`url` varchar(500),
	`utm_campaign` varchar(80),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `content_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` varchar(36) NOT NULL,
	`name` varchar(120) NOT NULL,
	`handle` varchar(120),
	`platform` enum('linkedin','tiktok','instagram','threads','email','lainnya') NOT NULL,
	`segment` enum('freelancer','agency','multi_brand','sekolah','perekrut','lainnya') NOT NULL,
	`stage` enum('baru','dihubungi','balas','diskusi','penawaran','menang','kalah') NOT NULL DEFAULT 'baru',
	`source_utm` varchar(120),
	`url` varchar(500),
	`notes` text,
	`last_contact_at` timestamp,
	`next_action_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `link_clicks` (
	`id` varchar(36) NOT NULL,
	`link_id` varchar(36) NOT NULL,
	`clicked_at` timestamp NOT NULL DEFAULT (now()),
	`referrer_host` varchar(120),
	`device_type` varchar(20),
	CONSTRAINT `link_clicks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `links` (
	`id` varchar(36) NOT NULL,
	`slug` varchar(60) NOT NULL,
	`destination` varchar(800) NOT NULL,
	`platform` varchar(30),
	`campaign` varchar(80),
	`medium` varchar(30) DEFAULT 'organic',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `links_id` PRIMARY KEY(`id`),
	CONSTRAINT `links_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `metrics_daily` (
	`id` varchar(36) NOT NULL,
	`date` date NOT NULL,
	`platform` enum('all','tiktok','instagram','threads','linkedin','youtube','gumroad','lynk','website') NOT NULL,
	`metric` varchar(40) NOT NULL,
	`value` decimal(14,2) NOT NULL,
	`source` enum('manual','import','api') NOT NULL DEFAULT 'manual',
	CONSTRAINT `metrics_daily_id` PRIMARY KEY(`id`),
	CONSTRAINT `metrics_unique` UNIQUE(`date`,`platform`,`metric`)
);
--> statement-breakpoint
CREATE TABLE `outreach_events` (
	`id` varchar(36) NOT NULL,
	`lead_id` varchar(36) NOT NULL,
	`channel` varchar(30) NOT NULL,
	`direction` enum('keluar','masuk') NOT NULL,
	`body` text,
	`sent_at` timestamp NOT NULL DEFAULT (now()),
	`created_by` enum('owner','agent') NOT NULL DEFAULT 'owner',
	`approved_by_owner` boolean NOT NULL DEFAULT false,
	CONSTRAINT `outreach_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` varchar(36) NOT NULL,
	`slug` varchar(60) NOT NULL,
	`name` varchar(120) NOT NULL,
	`status` enum('draft','live','arsip') NOT NULL DEFAULT 'draft',
	`price_usd` decimal(10,2),
	`gumroad_url` varchar(500),
	`lynk_url` varchar(500),
	`demo_url` varchar(500),
	`license_note` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` varchar(36) NOT NULL,
	`slug` varchar(60) NOT NULL,
	`name` varchar(120) NOT NULL,
	`kind` enum('jasa','produk','konten','internal') NOT NULL,
	`stage` enum('ide','validasi','bangun','pilot','jalan','arsip') NOT NULL DEFAULT 'ide',
	`summary` text,
	`next_step` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `projects_id` PRIMARY KEY(`id`),
	CONSTRAINT `projects_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `sales` (
	`id` varchar(36) NOT NULL,
	`product_id` varchar(36) NOT NULL,
	`platform` enum('gumroad','lynk','etsy','payhip','direct') NOT NULL,
	`occurred_at` timestamp NOT NULL,
	`gross_usd` decimal(10,2),
	`net_usd` decimal(10,2),
	`referrer_utm` varchar(120),
	`external_id` varchar(120),
	`source` enum('manual','import','ping') NOT NULL DEFAULT 'manual',
	CONSTRAINT `sales_id` PRIMARY KEY(`id`),
	CONSTRAINT `sales_ext` UNIQUE(`platform`,`external_id`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` varchar(36) NOT NULL,
	`expires_at` timestamp NOT NULL,
	`token` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`ip_address` text,
	`user_agent` text,
	`user_id` varchar(36) NOT NULL,
	CONSTRAINT `session_id` PRIMARY KEY(`id`),
	CONSTRAINT `session_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `site_settings` (
	`key` varchar(60) NOT NULL,
	`value` json NOT NULL,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `site_settings_key` PRIMARY KEY(`key`)
);
--> statement-breakpoint
CREATE TABLE `subscribers` (
	`id` varchar(36) NOT NULL,
	`email` varchar(254) NOT NULL,
	`locale` enum('en','id') NOT NULL DEFAULT 'en',
	`status` enum('pending','confirmed','unsubscribed') NOT NULL DEFAULT 'pending',
	`source_utm` varchar(120),
	`confirm_token_hash` varchar(128),
	`confirmed_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `subscribers_id` PRIMARY KEY(`id`),
	CONSTRAINT `subscribers_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`planned_date` date,
	`session` enum('pagi','siang','malam'),
	`lane` enum('produk','video','karier','distribusi','review') NOT NULL,
	`duration_min` int,
	`priority` enum('kritis','tinggi','fleksibel') NOT NULL DEFAULT 'tinggi',
	`status` enum('belum','jalan','selesai','ditunda') NOT NULL DEFAULT 'belum',
	`done_criteria` text,
	`notes` text,
	`completed_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(36) NOT NULL,
	`name` text NOT NULL,
	`email` varchar(255) NOT NULL,
	`email_verified` boolean NOT NULL DEFAULT false,
	`image` text,
	`role` varchar(30) NOT NULL DEFAULT 'owner',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` varchar(36) NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` timestamp NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `verification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `account` ADD CONSTRAINT `account_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `agent_messages` ADD CONSTRAINT `agent_messages_from_agent_id_agents_id_fk` FOREIGN KEY (`from_agent_id`) REFERENCES `agents`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `agent_messages` ADD CONSTRAINT `agent_messages_to_agent_id_agents_id_fk` FOREIGN KEY (`to_agent_id`) REFERENCES `agents`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `agent_messages` ADD CONSTRAINT `agent_messages_agent_task_id_agent_tasks_id_fk` FOREIGN KEY (`agent_task_id`) REFERENCES `agent_tasks`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `agent_tasks` ADD CONSTRAINT `agent_tasks_task_id_tasks_id_fk` FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `agent_tasks` ADD CONSTRAINT `agent_tasks_agent_id_agents_id_fk` FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `link_clicks` ADD CONSTRAINT `link_clicks_link_id_links_id_fk` FOREIGN KEY (`link_id`) REFERENCES `links`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `outreach_events` ADD CONSTRAINT `outreach_events_lead_id_leads_id_fk` FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sales` ADD CONSTRAINT `sales_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `account_user_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE INDEX `leads_stage_idx` ON `leads` (`stage`);--> statement-breakpoint
CREATE INDEX `clicks_link_time` ON `link_clicks` (`link_id`,`clicked_at`);--> statement-breakpoint
CREATE INDEX `session_user_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE INDEX `tasks_date_idx` ON `tasks` (`planned_date`);--> statement-breakpoint
CREATE INDEX `tasks_status_idx` ON `tasks` (`status`);