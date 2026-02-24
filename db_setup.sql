CREATE DATABASE IF NOT EXISTS plant_shop;

USE plant_shop;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS plants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(50) UNIQUE NOT NULL,
  user_id INT,
  plant_id INT,
  quantity INT,
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  address TEXT,
  phone VARCHAR(20),
  status ENUM('pending', 'shipped', 'delivered') DEFAULT 'pending',
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (plant_id) REFERENCES plants(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert sample plants
INSERT INTO plants (name, description, price) VALUES
('Rose Sapling', 'Beautiful rose plant', 10.00),
('Tulip Bulbs', 'Colorful tulip flowers', 5.00),
('Oak Tree', 'Strong oak sapling', 20.00),
('Mango Tree', 'Delicious fruit-bearing tree', 25.50),
('Jasmine Plant', 'Fragrant jasmine flowers', 15.00),
('Bamboo Plant', 'Tall bamboo shoots', 30.00);