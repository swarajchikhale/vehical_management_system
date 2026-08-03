<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../includes/functions.php';

if (!isLoggedIn()) {
    echo json_encode(['success' => false, 'message' => 'Please login to submit a service request.']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $vehicleType = sanitizeInput($_POST['vehicle_type'] ?? 'car');
    $problemDescription = sanitizeInput($_POST['problem_description'] ?? '');
    $serviceLocation = sanitizeInput($_POST['service_location'] ?? '');
    $preferredDate = sanitizeInput($_POST['preferred_date'] ?? date('Y-m-d'));

    if (empty($problemDescription) || empty($serviceLocation)) {
        echo json_encode(['success' => false, 'message' => 'Please provide problem description and location.']);
        exit();
    }

    $result = createServiceRequest($_SESSION['user_id'], $vehicleType, $problemDescription, $serviceLocation, $preferredDate);

    if ($result) {
        echo json_encode(['success' => true, 'message' => 'Service request submitted successfully. A mechanic will be assigned shortly.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to submit service request. Please try again.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>
