CREATE DATABASE IF NOT EXISTS stock_exchange_db;
USE stock_exchange_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL
);

-- Stocks table
CREATE TABLE IF NOT EXISTS stocks (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(500),
  current_price DECIMAL(10,2) NOT NULL,
  last_update DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Stock exchanges table
CREATE TABLE IF NOT EXISTS stock_exchanges (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(500),
  liveInMarket BOOLEAN DEFAULT FALSE
);

-- Join table
CREATE TABLE IF NOT EXISTS exchange_stocks (
  exchange_id BIGINT NOT NULL,
  stock_id BIGINT NOT NULL,
  PRIMARY KEY (exchange_id, stock_id),
  FOREIGN KEY (exchange_id) REFERENCES stock_exchanges(id) ON DELETE CASCADE,
  FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE CASCADE
);

-- Insert initial stocks with decimal prices and timestamp
INSERT INTO stocks (name, description, current_price, last_update) VALUES
('Apple', 'Tech company', 150.00, NOW()),
('Microsoft', 'Tech company', 280.00, NOW()),
('Amazon', 'E-commerce giant', 120.00, NOW()),
('Google', 'Search engine', 130.00, NOW()),
('Tesla', 'Electric vehicles', 200.00, NOW()),
('Netflix', 'Streaming service', 90.00, NOW()),
('Meta', 'Social media', 70.00, NOW()),
('Nvidia', 'GPU manufacturer', 350.00, NOW()),
('Intel', 'Semiconductor', 60.00, NOW()),
('AMD', 'Semiconductor', 55.00, NOW()),
('Samsung', 'Electronics', 110.00, NOW()),
('Sony', 'Electronics', 80.00, NOW()),
('Alibaba', 'E-commerce', 100.00, NOW()),
('Tencent', 'Tech company', 95.00, NOW()),
('Oracle', 'Software', 85.00, NOW()),
('IBM', 'Enterprise IT', 140.00, NOW()),
('Salesforce', 'CRM software', 150.00, NOW()),
('PayPal', 'Payment system', 75.00, NOW()),
('Visa', 'Payment network', 180.00, NOW()),
('Mastercard', 'Payment network', 170.00, NOW());

-- Insert initial stock exchanges
INSERT INTO stock_exchanges (name, description, liveInMarket) VALUES
('NYSE', 'New York Stock Exchange', TRUE),
('NASDAQ', 'Tech stocks', TRUE),
('London Stock Exchange', 'UK market', TRUE),
('Tokyo Stock Exchange', 'Japan market', TRUE),
('Shanghai Stock Exchange', 'China market', TRUE),
('Hong Kong Exchange', 'HK market', TRUE),
('Euronext', 'European market', TRUE),
('Bombay Stock Exchange', 'India market', TRUE),
('Frankfurt Stock Exchange', 'Germany market', TRUE),
('Toronto Stock Exchange', 'Canada market', TRUE);

-- Assign 2 stocks per exchange
INSERT INTO exchange_stocks (exchange_id, stock_id) VALUES
(1,1),(1,2),
(2,3),(2,4),
(3,5),(3,6),
(4,7),(4,8),
(5,9),(5,10),
(6,11),(6,12),
(7,13),(7,14),
(8,15),(8,16),
(9,17),(9,18),
(10,19),(10,20);
