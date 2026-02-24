-- Cart table for storing user-selected items

USE plant_shop;

CREATE TABLE IF NOT EXISTS carts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT,
  plant_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (plant_id) REFERENCES plants(id)
);

-- Example: INSERT INTO carts (customer_id, plant_id, quantity) VALUES (1, 2, 3);
