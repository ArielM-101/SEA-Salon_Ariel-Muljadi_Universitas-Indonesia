ALTER USER'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Petama3177';
CREATE DATABASE IF NOT EXISTS salon_database;
USE salon_database;

DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS branches;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS reviews;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phoneNumber VARCHAR(15) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('Customer', 'Admin') NOT NULL
);

CREATE TABLE branches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    branchName VARCHAR(255) NOT NULL,
    branchLocation VARCHAR(255) NOT NULL,
    openingTime TIME NOT NULL,
    closingTime TIME NOT NULL
);

CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    serviceName VARCHAR(255) NOT NULL,
    duration INT NOT NULL,
    branchId INT NOT NULL,
    FOREIGN KEY (branchId) REFERENCES branches(id)
);

CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    phoneNumber VARCHAR(15) NOT NULL,
    serviceType INT NOT NULL,
    dateTime DATETIME NOT NULL,
    branchId INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (branchId) REFERENCES branches(id),
    FOREIGN KEY (serviceType) REFERENCES services(id)
);

CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customerName VARCHAR(255) NOT NULL,
    rating INT NOT NULL,
    comment TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM reservations;
SELECT * FROM users;
SELECT * FROM services;
SELECT * FROM branches;
SELECT * FROM reviews;
SELECT * FROM services JOIN branches ON services.branchId = branches.id;