-- =============================================================================
-- database/schema.sql - Estructura de tablas (MySQL 8 / MariaDB)
-- -----------------------------------------------------------------------------
-- Es usado por el seeder de Node (npm run seed) y por init-db.sql.
-- No incluye CREATE DATABASE porque en la nube la base ya viene creada.
-- ADVERTENCIA: borra las tablas si existen para poder re-ejecutarse.
-- =============================================================================

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
