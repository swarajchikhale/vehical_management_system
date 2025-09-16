-- Vehicle Management System Database
-- Run this script in phpMyAdmin or MySQL command line

CREATE DATABASE IF NOT EXISTS vehicle_management;
USE vehicle_management;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin', 'mechanic') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Vehicles table
CREATE TABLE vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_name VARCHAR(100) NOT NULL,
    vehicle_type ENUM('car', 'bike', 'truck', 'van', 'bus') NOT NULL,
    brand VARCHAR(50),
    model VARCHAR(50),
    year INT,
    license_plate VARCHAR(20) UNIQUE,
    rent_price DECIMAL(10,2) NOT NULL,
    status ENUM('available', 'rented', 'maintenance') DEFAULT 'available',
    image VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Mechanics table
CREATE TABLE mechanics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    specialization VARCHAR(100),
    experience_years INT,
    hourly_rate DECIMAL(10,2),
    availability ENUM('available', 'busy', 'offline') DEFAULT 'available',
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Bookings table
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INT NOT NULL,
    total_cost DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'active', 'completed', 'cancelled') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

-- Services table
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    mechanic_id INT,
    vehicle_type ENUM('car', 'bike', 'truck', 'van', 'bus') NOT NULL,
    problem_description TEXT NOT NULL,
    service_location VARCHAR(255) NOT NULL,
    preferred_date DATE,
    status ENUM('pending', 'assigned', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    service_cost DECIMAL(10,2) DEFAULT 0.00,
    completion_notes TEXT,
    rating INT DEFAULT 0,
    review TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (mechanic_id) REFERENCES mechanics(id) ON DELETE SET NULL
);

-- Bills table
CREATE TABLE bills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    service_id INT,
    user_id INT NOT NULL,
    bill_type ENUM('rental', 'service') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'paid', 'overdue') DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO users (name, email, phone, password, role) VALUES
('System Admin', 'admin@vehiclems.com', '+1234567890', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('John Mechanic', 'mechanic@vehiclems.com', '+1234567891', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mechanic'),
('Jane Customer', 'user@vehiclems.com', '+1234567892', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user');

INSERT INTO vehicles (vehicle_name, vehicle_type, brand, model, year, license_plate, rent_price, description) VALUES
('Toyota Camry 2020', 'car', 'Toyota', 'Camry', 2020, 'ABC123', 50.00, 'Comfortable sedan with excellent fuel efficiency'),
('Honda CBR 600RR', 'bike', 'Honda', 'CBR 600RR', 2019, 'BIKE001', 25.00, 'Sports bike perfect for city rides'),
('Ford Transit Van', 'van', 'Ford', 'Transit', 2021, 'VAN001', 80.00, 'Spacious van for cargo and passenger transport'),
('BMW X5', 'car', 'BMW', 'X5', 2022, 'BMW001', 120.00, 'Luxury SUV with premium features'),
('Yamaha R15', 'bike', 'Yamaha', 'R15', 2020, 'BIKE002', 20.00, 'Sporty bike ideal for daily commute'),
('Mahindra Bolero', 'truck', 'Mahindra', 'Bolero', 2019, 'TRUCK001', 60.00, 'Reliable pickup truck for heavy duty work');

INSERT INTO mechanics (user_id, specialization, experience_years, hourly_rate, availability) VALUES
(2, 'Car & Bike Repair', 5, 25.00, 'available');

-- Create indexes for better performance
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_vehicle_id ON bookings(vehicle_id);
CREATE INDEX idx_bookings_date ON bookings(start_date, end_date);
CREATE INDEX idx_services_user_id ON services(user_id);
CREATE INDEX idx_services_mechanic_id ON services(mechanic_id);
CREATE INDEX idx_bills_user_id ON bills(user_id);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_users_email ON users(email);