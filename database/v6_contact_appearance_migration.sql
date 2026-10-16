-- Back up your database before applying. Run once after earlier migrations.
ALTER TABLE messages ADD COLUMN status ENUM('new','read','replied') NOT NULL DEFAULT 'new';
UPDATE messages SET status='read' WHERE is_read=1;
-- Appearance settings reuse the existing site_settings key/value table (v3 migration).
