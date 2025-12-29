CREATE DATABASE IF NOT EXISTS bag_store;
USE bag_store;


CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(255),
  category VARCHAR(100),
  stock_quantity INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  address VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  product_id INT,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Cart table
CREATE TABLE IF NOT EXISTS cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  product_id INT,
  quantity INT DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id),
  UNIQUE KEY unique_cart_item (user_id, product_id)
);

-- Insert sample products
INSERT INTO products (name, description, price, image_url, category, stock_quantity) VALUES
('Leather Tote Bag', 'A classic leather tote bag perfect for everyday use. Made with genuine leather and spacious interior.', 89.99, 'https://media.istockphoto.com/id/1493644514/photo/brown-duffel-bag-on-mens-shoulder.jpg?s=612x612&w=0&k=20&c=0zN7dFQuO62w1JxH3ccX5XBOl7v9Yq2JmwVoUrOiwNc=', 'Tote', 25),
('Canvas Backpack', 'Durable canvas backpack with multiple compartments. Ideal for school or casual outings.', 45.99, 'https://media.istockphoto.com/id/1002625784/photo/backpack-from-fabric-of-color-khaki-on-white-background.jpg?s=612x612&w=0&k=20&c=4u2EDH5zxH1XaSMEq6oWhU-89bzU_3Aut0gM_8_KpwE=', 'Backpack', 40),
('Crossbody Purse', 'Elegant crossbody purse with adjustable strap and secure zipper closure.', 34.99, 'https://media.istockphoto.com/id/1664026047/photo/minimalistic-light-beige-leather-cross-body-bag-with-space-for-text-concept-of-versatile.jpg?s=612x612&w=0&k=20&c=1lSdFX2qek29ZjV9ZEsHNeHUdmXWEWPnJAnkO-64mBk=', 'Crossbody', 30),
('Evening Clutch', 'Stylish evening clutch with metallic finish and detachable chain strap.', 39.99, 'https://media.istockphoto.com/id/467160487/photo/pearl-beaded-handbag.jpg?s=612x612&w=0&k=20&c=TyMool4uicdaHZi0ptKtSioxv2aNNQWonqsL7oKJ_Ro=', 'Clutch', 15),
('Weekender Duffel', 'Spacious weekender duffel bag with shoe compartment and side pockets.', 79.99, 'https://media.istockphoto.com/id/1492635227/photo/blue-leather-travel-bag-or-duffle-bag-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=YhkoD47z7tpvBcl5-Hp4A2qIx0wzZGukzJSPOCsHHu8=', 'Duffel', 20);