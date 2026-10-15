-- Select portfolio_db in phpMyAdmin first. Run once on local and production databases.
CREATE TABLE IF NOT EXISTS gallery_items (
 id INT AUTO_INCREMENT PRIMARY KEY,
 type VARCHAR(10) NOT NULL DEFAULT 'image',
 src VARCHAR(2048) NOT NULL,
 caption VARCHAR(300) NOT NULL DEFAULT '',
 sort_order INT NOT NULL DEFAULT 0,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Run these two ALTER statements ONLY if the columns are not already present.
ALTER TABLE gallery_items ADD COLUMN category VARCHAR(10) NOT NULL DEFAULT 'gallery';
ALTER TABLE gallery_items ADD COLUMN link_url VARCHAR(2048) NOT NULL DEFAULT '';
