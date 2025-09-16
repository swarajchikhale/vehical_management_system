<?php
require_once '../includes/functions.php';

// Ensure user is logged in
requireLogin();

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Get and sanitize input
        $vehicleId = intval($_POST['vehicleId'] ?? 0);
        $startDate = sanitizeInput($_POST['startDate'] ?? '');
        $endDate = sanitizeInput($_POST['endDate'] ?? '');
        $notes = sanitizeInput($_POST['notes'] ?? '');
        $userId = $_SESSION['user_id'];
        
        // Validate input
        $errors = [];
        
        if ($vehicleId <= 0) $errors[] = 'Invalid vehicle selected';
        if (empty($startDate)) $errors[] = 'Start date is required';
        if (empty($endDate)) $errors[] = 'End date is required';
        
        // Validate dates
        if (!validateDate($startDate)) $errors[] = 'Invalid start date';
        if (!validateDate($endDate)) $errors[] = 'Invalid end date';
        
        if (empty($errors)) {
            $start = new DateTime($startDate);
            $end = new DateTime($endDate);
            $today = new DateTime();
            $today->setTime(0, 0, 0);
            
            if ($start < $today) $errors[] = 'Start date cannot be in the past';
            if ($end < $start) $errors[] = 'End date must be on or after start date';
        }
        
        if (!empty($errors)) {
            setMessage(implode('<br>', $errors), 'error');
            header('Location: /vehicles.php');
            exit();
        }
        
        global $pdo;
        
        // Check if vehicle exists and is available
        $stmt = $pdo->prepare("SELECT * FROM vehicles WHERE id = ? AND status = 'available'");
        $stmt->execute([$vehicleId]);
        $vehicle = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$vehicle) {
            setMessage('Vehicle is not available for booking', 'error');
            header('Location: /vehicles.php');
            exit();
        }
        
        // Check for conflicting bookings
        $stmt = $pdo->prepare("
            SELECT COUNT(*) FROM bookings 
            WHERE vehicle_id = ? 
            AND status NOT IN ('cancelled', 'completed')
            AND (
                (start_date <= ? AND end_date >= ?) OR
                (start_date <= ? AND end_date >= ?) OR
                (start_date >= ? AND end_date <= ?)
            )
        ");
        $stmt->execute([
            $vehicleId, 
            $startDate, $startDate,  // Check if existing booking overlaps with start date
            $endDate, $endDate,      // Check if existing booking overlaps with end date
            $startDate, $endDate     // Check if existing booking is within new booking period
        ]);
        
        if ($stmt->fetchColumn() > 0) {
            setMessage('Vehicle is already booked for the selected dates', 'error');
            header('Location: /vehicles.php');
            exit();
        }
        
        // Calculate total cost
        $totalDays = $start->diff($end)->days + 1;
        $totalCost = $totalDays * $vehicle['rent_price'];
        $taxAmount = $totalCost * 0.18; // 18% tax
        $finalAmount = $totalCost + $taxAmount;
        
        // Start transaction
        $pdo->beginTransaction();
        
        try {
            // Create booking
            $bookingId = createBooking($userId, $vehicleId, $startDate, $endDate, $finalAmount, $notes);
            
            if (!$bookingId) {
                throw new Exception('Failed to create booking');
            }
            
            // Generate bill
            $billGenerated = generateBill($userId, $bookingId, null, $finalAmount, 'rental');
            
            if (!$billGenerated) {
                throw new Exception('Failed to generate bill');
            }
            
            // Update vehicle status
            updateVehicleStatus($vehicleId, 'rented');
            
            // Commit transaction
            $pdo->commit();
            
            setMessage(
                "Booking confirmed successfully!<br>" .
                "Booking ID: <strong>#{$bookingId}</strong><br>" .
                "Total Amount: <strong>" . formatCurrency($finalAmount) . "</strong><br>" .
                "Duration: <strong>{$totalDays} day(s)</strong>",
                'success'
            );
            
            // Redirect to user dashboard
            header('Location: /user/dashboard.php');
            exit();
            
        } catch (Exception $e) {
            // Rollback transaction
            $pdo->rollback();
            throw $e;
        }
        
    } catch (Exception $e) {
        error_log("Booking error: " . $e->getMessage());
        setMessage('An error occurred while processing your booking. Please try again.', 'error');
        header('Location: /vehicles.php');
        exit();
    }
}

// If not POST request
header('Location: /vehicles.php');
exit();
?>