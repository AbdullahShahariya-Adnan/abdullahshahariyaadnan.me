-- Run AFTER travel_albums_migration.sql; backup first. Existing records remain.
CREATE TABLE IF NOT EXISTS site_settings (
 setting_key VARCHAR(60) PRIMARY KEY,
 setting_value TEXT NOT NULL
);
ALTER TABLE travel_albums ADD COLUMN location VARCHAR(200) NOT NULL DEFAULT '';
ALTER TABLE travel_albums ADD COLUMN visited_on DATE NULL;
ALTER TABLE travel_albums ADD COLUMN map_url VARCHAR(2048) NOT NULL DEFAULT '';
-- If these columns already exist, skip the corresponding ALTER statement.
