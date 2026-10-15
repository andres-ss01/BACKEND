-- =============================================================================
-- database/init-db.sql - Script COMPLETO: crea la base, las tablas y los datos
-- -----------------------------------------------------------------------------
-- Ejecutar en local:
--   mysql -u root -p < database/init-db.sql
-- O pegarlo en MySQL Workbench / DBeaver / phpMyAdmin conectado a tu servidor.
-- En la nube: omite las 2 primeras sentencias (CREATE DATABASE / USE) si tu
-- proveedor ya te dio una base creada, y selecciona esa base antes de ejecutar.
-- =============================================================================

CREATE DATABASE IF NOT EXISTS ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecommerce;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS products;

-- -----------------------------------------------------------------------------
-- Tabla de usuarios
-- Los objetos anidados "name" y "address" se guardan como columnas planas
-- (firstname, lastname, geo_lat, ...). La API los reconstruye al responder.
-- -----------------------------------------------------------------------------
CREATE TABLE users (
  id        INT UNSIGNED NOT NULL AUTO_INCREMENT,  -- ID numérico 1, 2, 3...
  email     VARCHAR(150) NOT NULL,
  username  VARCHAR(80)  NOT NULL,
  password  VARCHAR(255) NOT NULL,                 -- Hashear con bcrypt en producción
  firstname VARCHAR(80)  NOT NULL,
  lastname  VARCHAR(80)  NOT NULL,
  phone     VARCHAR(40)  NOT NULL,
  geo_lat   VARCHAR(30)  NOT NULL,                 -- address.geolocation.lat
  geo_long  VARCHAR(30)  NOT NULL,                 -- address.geolocation.long
  city      VARCHAR(100) NOT NULL,
  street    VARCHAR(150) NOT NULL,
  number    INT          NOT NULL,
  zipcode   VARCHAR(20)  NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),               -- No se repite el email
  UNIQUE KEY uq_users_username (username)          -- No se repite el username
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Tabla de productos
-- El objeto anidado "rating" se guarda como rating_rate y rating_count.
-- -----------------------------------------------------------------------------
CREATE TABLE products (
  id           INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  title        VARCHAR(255)  NOT NULL,
  price        DECIMAL(10,2) NOT NULL,
  description  TEXT          NOT NULL,
  category     VARCHAR(100)  NOT NULL,
  image        VARCHAR(500)  NOT NULL,
  rating_rate  DECIMAL(2,1)  NOT NULL DEFAULT 0,   -- Calificación de 0 a 5
  rating_count INT UNSIGNED  NOT NULL DEFAULT 0,   -- Número de votos
  PRIMARY KEY (id),
  KEY idx_products_category (category)             -- Acelera búsquedas por categoría
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Usuarios iniciales
INSERT INTO users (email, username, password, firstname, lastname, phone, geo_lat, geo_long, city, street, number, zipcode) VALUES
  ('morrison@gmail.com', 'mor_2314', '83r5^_', 'david', 'morrison', '1-570-236-7033', '40.3467', '-30.1310', 'Cullman', 'Frances Ct', 86, '29567-1452'),
  ('john@gmail.com', 'johnd', 'm38rmF$', 'john', 'doe', '1-570-236-7033', '-37.3159', '81.1496', 'kilcoole', 'new road', 7682, '12926-3874'),
  ('william@gmail.com', 'hopkins', 'William56$hj', 'william', 'hopkins', '1-678-123-4567', '30.2467', '-20.5489', 'san Antonio', 'Hunters Creek Dr', 6454, '98234-1734'),
  ('kevin@gmail.com', 'kevinryan', 'kev02937@', 'kevin', 'ryan', '1-567-094-1345', '40.3467', '-30.1310', 'Cullman', 'Frances Ct', 86, '29567-1452'),
  ('derek@gmail.com', 'derek', 'jklg*_56', 'derek', 'powell', '1-956-001-1945', '20.1677', '-10.6789', 'san Antonio', 'adams St', 245, '80796-1234'),
  ('maria@gmail.com', 'maria_g', 'mar1a#2024', 'maria', 'garcia', '52-442-555-0198', '20.5888', '-100.3899', 'Queretaro', 'Av. Universidad', 120, '76000-0001');

-- Productos iniciales
INSERT INTO products (title, price, description, category, image, rating_rate, rating_count) VALUES
  ('Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops', 109.95, 'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday', 'men''s clothing', 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png', 3.9, 120),
  ('Mens Casual Premium Slim Fit T-Shirts', 22.3, 'Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing.', 'men''s clothing', 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png', 4.1, 259),
  ('Mens Cotton Jacket', 55.99, 'Great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling.', 'men''s clothing', 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_t.png', 4.7, 500),
  ('John Hardy Women''s Legends Naga Gold & Silver Dragon Station Chain Bracelet', 695, 'From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean''s pearl.', 'jewelery', 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_t.png', 4.6, 400),
  ('Solid Gold Petite Micropave', 168, 'Satisfaction Guaranteed. Return or exchange any order within 30 days. Designed and sold by Hafeez Center in the United States.', 'jewelery', 'https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_t.png', 3.9, 70),
  ('WD 2TB Elements Portable External Hard Drive - USB 3.0', 64, 'USB 3.0 and USB 2.0 compatibility. Fast data transfers, improve PC performance, high capacity; compatibility formatted NTFS for Windows 10.', 'electronics', 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_t.png', 3.3, 203),
  ('SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s', 109, 'Easy upgrade for faster boot up, shutdown, application load and response. Boosts burst write performance, making it ideal for typical PC workloads.', 'electronics', 'https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_t.png', 2.9, 470),
  ('Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor', 999.99, '49 INCH SUPER ULTRAWIDE 32:9 CURVED GAMING MONITOR with dual 27 inch screen side by side. QUANTUM DOT (QLED) TECHNOLOGY, HDR support.', 'electronics', 'https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_t.png', 2.2, 140),
  ('BIYLACLESEN Women''s 3-in-1 Snowboard Jacket Winter Coats', 56.99, 'Note: The Jackets is US standard size, Please choose size as your usual wear. Material: 100% Polyester; Detachable Liner Fabric: Warm Fleece.', 'women''s clothing', 'https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_t.png', 2.6, 235),
  ('Women''s Short Sleeve Moisture Wicking Active T-Shirt', 12.99, 'Lightweight perfet for trip or casual wear. Moisture-wicking fabric keeps you dry and comfortable during workouts and daily activities.', 'women''s clothing', 'https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_t.png', 4.5, 146);
