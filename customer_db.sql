-- Customer data model for MySQL

USE plant_shop;

CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,  -- Store hashed passwords
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Add a foreign key to orders if needed
-- ALTER TABLE orders ADD COLUMN customer_id INT, ADD FOREIGN KEY (customer_id) REFERENCES customers(id);