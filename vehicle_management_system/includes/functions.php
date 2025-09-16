<?php
session_start();
require_once __DIR__ . '/../config/database.php';

// Authentication functions
function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

function requireLogin() {
    if (!isLoggedIn()) {
        header('Location: /login.php');
        exit();
    }
}

function requireRole($role) {
    if (!isLoggedIn() || $_SESSION['role'] !== $role) {
        header('Location: /index.php');
        exit();
    }
}

function getCurrentUser() {
    if (!isLoggedIn()) {
        return null;
    }
    
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

// Validation functions
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

function validatePhone($phone) {
    return preg_match('/^[\+]?[0-9\s\-\(\)]+$/', $phone);
}

function validateDate($date) {
    $d = DateTime::createFromFormat('Y-m-d', $date);
    return $d && $d->format('Y-m-d') === $date;
}

// Security functions
function hashPassword($password) {
    return password_hash($password, PASSWORD_DEFAULT);
}

function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

function generateToken() {
    return bin2hex(random_bytes(32));
}

// Vehicle functions
function getAvailableVehicles() {
    global $pdo;
    $stmt = $pdo->query("SELECT * FROM vehicles WHERE status = 'available' ORDER BY vehicle_name");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getVehicleById($id) {
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM vehicles WHERE id = ?");
    $stmt->execute([$id]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function updateVehicleStatus($vehicleId, $status) {
    global $pdo;
    $stmt = $pdo->prepare("UPDATE vehicles SET status = ? WHERE id = ?");
    return $stmt->execute([$status, $vehicleId]);
}

// Booking functions
function createBooking($userId, $vehicleId, $startDate, $endDate, $totalCost, $notes = '') {
    global $pdo;
    
    $totalDays = (strtotime($endDate) - strtotime($startDate)) / (60 * 60 * 24) + 1;
    
    $stmt = $pdo->prepare("
        INSERT INTO bookings (user_id, vehicle_id, start_date, end_date, total_days, total_cost, notes, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmed')
    ");
    
    if ($stmt->execute([$userId, $vehicleId, $startDate, $endDate, $totalDays, $totalCost, $notes])) {
        updateVehicleStatus($vehicleId, 'rented');
        return $pdo->lastInsertId();
    }
    return false;
}

function getUserBookings($userId) {
    global $pdo;
    $stmt = $pdo->prepare("
        SELECT b.*, v.vehicle_name, v.vehicle_type, v.brand, v.model 
        FROM bookings b 
        JOIN vehicles v ON b.vehicle_id = v.id 
        WHERE b.user_id = ? 
        ORDER BY b.created_at DESC
    ");
    $stmt->execute([$userId]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getAllBookings() {
    global $pdo;
    $stmt = $pdo->query("
        SELECT b.*, u.name as user_name, u.email, v.vehicle_name, v.vehicle_type 
        FROM bookings b 
        JOIN users u ON b.user_id = u.id 
        JOIN vehicles v ON b.vehicle_id = v.id 
        ORDER BY b.created_at DESC
    ");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// Service functions
function createServiceRequest($userId, $vehicleType, $problemDescription, $serviceLocation, $preferredDate) {
    global $pdo;
    $stmt = $pdo->prepare("
        INSERT INTO services (user_id, vehicle_type, problem_description, service_location, preferred_date) 
        VALUES (?, ?, ?, ?, ?)
    ");
    return $stmt->execute([$userId, $vehicleType, $problemDescription, $serviceLocation, $preferredDate]);
}

function getUserServices($userId) {
    global $pdo;
    $stmt = $pdo->prepare("
        SELECT s.*, m.user_id as mechanic_user_id, u.name as mechanic_name 
        FROM services s 
        LEFT JOIN mechanics m ON s.mechanic_id = m.id 
        LEFT JOIN users u ON m.user_id = u.id 
        WHERE s.user_id = ? 
        ORDER BY s.created_at DESC
    ");
    $stmt->execute([$userId]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getAllServices() {
    global $pdo;
    $stmt = $pdo->query("
        SELECT s.*, u.name as customer_name, u.email as customer_email, u.phone as customer_phone,
               m.user_id as mechanic_user_id, mu.name as mechanic_name 
        FROM services s 
        JOIN users u ON s.user_id = u.id 
        LEFT JOIN mechanics m ON s.mechanic_id = m.id 
        LEFT JOIN users mu ON m.user_id = mu.id 
        ORDER BY s.created_at DESC
    ");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getMechanicServices($mechanicId) {
    global $pdo;
    $stmt = $pdo->prepare("
        SELECT s.*, u.name as customer_name, u.email as customer_email, u.phone as customer_phone 
        FROM services s 
        JOIN users u ON s.user_id = u.id 
        WHERE s.mechanic_id = ? 
        ORDER BY s.created_at DESC
    ");
    $stmt->execute([$mechanicId]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// Bill functions
function generateBill($userId, $bookingId = null, $serviceId = null, $amount, $type) {
    global $pdo;
    
    $taxRate = 0.18; // 18% tax
    $taxAmount = $amount * $taxRate;
    $totalAmount = $amount + $taxAmount;
    
    $stmt = $pdo->prepare("
        INSERT INTO bills (user_id, booking_id, service_id, bill_type, amount, tax_amount, total_amount) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    
    return $stmt->execute([$userId, $bookingId, $serviceId, $type, $amount, $taxAmount, $totalAmount]);
}

function getUserBills($userId) {
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM bills WHERE user_id = ? ORDER BY created_at DESC");
    $stmt->execute([$userId]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// Utility functions
function formatDate($date) {
    return date('M d, Y', strtotime($date));
}

function formatDateTime($datetime) {
    return date('M d, Y h:i A', strtotime($datetime));
}

function formatCurrency($amount) {
    return '$' . number_format($amount, 2);
}

function getStatusBadge($status) {
    $statusClasses = [
        'available' => 'success',
        'rented' => 'danger',
        'maintenance' => 'warning',
        'pending' => 'warning',
        'confirmed' => 'info',
        'active' => 'primary',
        'completed' => 'success',
        'cancelled' => 'secondary',
        'assigned' => 'info',
        'in_progress' => 'primary',
        'paid' => 'success',
        'overdue' => 'danger'
    ];
    
    $class = isset($statusClasses[$status]) ? $statusClasses[$status] : 'secondary';
    return "<span class=\"badge badge-{$class}\">" . ucfirst(str_replace('_', ' ', $status)) . "</span>";
}

// File upload functions
function uploadVehicleImage($file) {
    $targetDir = "uploads/vehicles/";
    $fileName = time() . '_' . basename($file["name"]);
    $targetFile = $targetDir . $fileName;
    $uploadOk = 1;
    $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));
    
    // Check if image file is actual image
    $check = getimagesize($file["tmp_name"]);
    if ($check === false) {
        return ['success' => false, 'message' => 'File is not an image.'];
    }
    
    // Check file size (5MB max)
    if ($file["size"] > 5000000) {
        return ['success' => false, 'message' => 'File is too large.'];
    }
    
    // Allow certain file formats
    if (!in_array($imageFileType, ['jpg', 'jpeg', 'png', 'gif'])) {
        return ['success' => false, 'message' => 'Only JPG, JPEG, PNG & GIF files are allowed.'];
    }
    
    // Create directory if it doesn't exist
    if (!file_exists($targetDir)) {
        mkdir($targetDir, 0777, true);
    }
    
    if (move_uploaded_file($file["tmp_name"], $targetFile)) {
        return ['success' => true, 'filename' => $fileName];
    } else {
        return ['success' => false, 'message' => 'Error uploading file.'];
    }
}

// Error handling
function logError($message, $file = '', $line = '') {
    $log = date('Y-m-d H:i:s') . " - Error: $message";
    if ($file) $log .= " in $file";
    if ($line) $log .= " on line $line";
    $log .= "\n";
    
    file_put_contents('logs/error.log', $log, FILE_APPEND | LOCK_EX);
}

// Success/Error messages
function setMessage($message, $type = 'info') {
    $_SESSION['message'] = $message;
    $_SESSION['message_type'] = $type;
}

function getMessage() {
    if (isset($_SESSION['message'])) {
        $message = $_SESSION['message'];
        $type = $_SESSION['message_type'] ?? 'info';
        unset($_SESSION['message'], $_SESSION['message_type']);
        return ['message' => $message, 'type' => $type];
    }
    return null;
}

function displayMessage() {
    $msg = getMessage();
    if ($msg) {
        $alertClass = [
            'success' => 'alert-success',
            'error' => 'alert-danger',
            'warning' => 'alert-warning',
            'info' => 'alert-info'
        ];
        $class = $alertClass[$msg['type']] ?? 'alert-info';
        echo "<div class=\"alert {$class} alert-dismissible fade show\" role=\"alert\">
                {$msg['message']}
                <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"alert\"></button>
              </div>";
    }
}
?>