-- Run once in your existing Aiven MySQL database. Existing gallery_items data is not changed.
CREATE TABLE IF NOT EXISTS travel_albums (
 id INT AUTO_INCREMENT PRIMARY KEY,
 title VARCHAR(160) NOT NULL,
 description VARCHAR(2000) NOT NULL DEFAULT '',
 cover_url VARCHAR(2048) NOT NULL DEFAULT '',
 sort_order INT NOT NULL DEFAULT 0,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS travel_media (
 id INT AUTO_INCREMENT PRIMARY KEY,
 album_id INT NOT NULL,
 type ENUM('image','video') NOT NULL DEFAULT 'image',
 src VARCHAR(2048) NOT NULL,
 caption VARCHAR(300) NOT NULL DEFAULT '',
 sort_order INT NOT NULL DEFAULT 0,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 INDEX idx_travel_album_order (album_id,sort_order,id),
 CONSTRAINT fk_travel_media_album FOREIGN KEY (album_id) REFERENCES travel_albums(id) ON DELETE CASCADE
);
