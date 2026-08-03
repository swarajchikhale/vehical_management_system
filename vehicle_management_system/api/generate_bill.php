<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../includes/functions.php';

if (!isLoggedIn()) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized access.']);
    exit();
}

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;
$type = isset($_GET['type']) ? sanitizeInput($_GET['type']) : 'rental';

global $pdo;

if ($type === 'rental') {
    $stmt = $pdo->prepare("
        SELECT b.*, u.name as user_name, u.email, v.vehicle_name, v.rent_price 
        FROM bookings b 
        JOIN users u ON b.user_id = u.id 
        JOIN vehicles v ON b.vehicle_id = v.id 
        WHERE b.id = ?
    ");
    $stmt->execute([$id]);
    $booking = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$booking) {
        echo json_encode(['success' => false, 'message' => 'Booking not found.']);
        exit();
    }

    $subtotal = $booking['total_cost'];
    $tax = round($subtotal * 0.18, 2);
    $total = $subtotal + $tax;

    echo json_encode([
        'success' => true,
        'invoice_number' => 'INV-2026-' . $booking['id'],
        'customer' => $booking['user_name'],
        'email' => $booking['email'],
        'item' => $booking['vehicle_name'] . ' (' . $booking['total_days'] . ' Days)',
        'subtotal' => $subtotal,
        'tax' => $tax,
        'total' => $total,
        'status' => 'paid',
        'date' => date('Y-m-d')
    ]);
} else {
    $stmt = $pdo->prepare("
        SELECT s.*, u.name as user_name, u.email 
        FROM services s 
        LEFT JOIN users u ON s.user_id = u.id 
        WHERE s.id = ?
    ");
    $stmt->execute([$id]);
    $service = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$service) {
        echo json_encode(['success' => false, 'message' => 'Service record not found.']);
        exit();
    }

    $subtotal = $service['service_cost'] > 0 ? $service['service_cost'] : 100.00;
    $tax = round($subtotal * 0.18, 2);
    $total = $subtotal + $tax;

    echo json_encode([
        'success' => true,
        'invoice_number' => 'INV-SVC-' . $service['id'],
        'customer' => $service['user_name'],
        'email' => $service['email'],
        'item' => 'Mechanic Service - ' . strtoupper($service['vehicle_type']),
        'subtotal' => $subtotal,
        'tax' => $tax,
        'total' => $total,
        'status' => 'paid',
        'date' => date('Y-m-d')
    ]);
}
?>
