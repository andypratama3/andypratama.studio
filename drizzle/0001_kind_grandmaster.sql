ALTER TABLE `links` ADD `active` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `subscribers` ADD `unsubscribe_token_hash` varchar(128);