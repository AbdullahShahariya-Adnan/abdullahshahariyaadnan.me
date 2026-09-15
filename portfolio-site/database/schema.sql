-- Portfolio database schema (MySQL 8+)
-- Local: mysql -u root -p < schema.sql
-- Cloud (Aiven etc.): run the statements below WITHOUT the CREATE DATABASE/USE lines,
-- against the database name your provider gave you.

CREATE DATABASE IF NOT EXISTS portfolio_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE portfolio_db;

CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  tagline VARCHAR(200),
  description TEXT NOT NULL,
  long_description TEXT,
  role VARCHAR(150),
  duration VARCHAR(100),
  tech_stack VARCHAR(255) NOT NULL,
  features TEXT,
  challenges TEXT,
  github_url VARCHAR(255),
  live_url VARCHAR(255),
  image_url VARCHAR(255),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  subject VARCHAR(200),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS education (
  id INT AUTO_INCREMENT PRIMARY KEY,
  degree VARCHAR(200) NOT NULL,
  institution VARCHAR(200) NOT NULL,
  start_year VARCHAR(10),
  end_year VARCHAR(10),
  description TEXT,
  sort_order INT DEFAULT 0
);
