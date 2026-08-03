<?php
$pageTitle = 'Book Vehicle - DrivePulse';
require_once __DIR__ . '/../includes/header.php';
requireLogin();

$vehicleId = isset($_GET['id']) ? intval($_GET['id']) : 0;
$vehicle = getVehicleById($vehicleId);

if (!$vehicle || $vehicle['status'] !== 'available') {
    header('Location: /vehicles.php');
    exit();
}

$error = '';
$success = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $startDate = sanitizeInput($_POST['start_date']);
    $endDate = sanitizeInput($_POST['end_date']);
    $notes = sanitizeInput($_POST['notes']);

    if (empty($startDate) || empty($endDate)) {
        $error = 'Please select valid start and end dates.';
    } elseif (strtotime($endDate) < strtotime($startDate)) {
        $error = 'End date cannot be earlier than start date.';
    } else {
        $days = (strtotime($endDate) - strtotime($startDate)) / 86400 + 1;
        $subtotal = $days * $vehicle['rent_price'];
        $totalCost = $subtotal + ($subtotal * 0.18);

        $bookingId = createBooking($_SESSION['user_id'], $vehicle['id'], $startDate, $endDate, $totalCost, $notes);

        if ($bookingId) {
            $success = true;
        } else {
            $error = 'Failed to process booking. Please try again.';
        }
    }
}
?>

<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card shadow-lg">
                <div class="card-header bg-primary text-white">
                    <h3 class="card-title mb-0"><i class="fas fa-car me-2"></i>Reserve <?php echo htmlspecialchars($vehicle['vehicle_name']); ?></h3>
                </div>
                <div class="card-body p-4">
                    <?php if ($success): ?>
                        <div class="text-center py-4">
                            <i class="fas fa-check-circle text-success display-1 mb-3"></i>
                            <h2 class="text-success">Reservation Confirmed!</h2>
                            <p class="lead">Your booking has been successfully recorded in our system.</p>
                            <a href="my_bookings.php" class="btn btn-primary mt-3">View My Bookings</a>
                        </div>
                    <?php else: ?>
                        <?php if ($error): ?>
                            <div class="alert alert-danger"><?php echo $error; ?></div>
                        <?php endif; ?>

                        <div class="row mb-4">
                            <div class="col-md-6">
                                <h5>Vehicle Details</h5>
                                <ul class="list-unstyled">
                                    <li><strong>Brand:</strong> <?php echo htmlspecialchars($vehicle['brand']); ?></li>
                                    <li><strong>Model:</strong> <?php echo htmlspecialchars($vehicle['model']); ?></li>
                                    <li><strong>Daily Price:</strong> $<?php echo number_format($vehicle['rent_price'], 2); ?>/day</li>
                                </ul>
                            </div>
                            <div class="col-md-6 text-end">
                                <span class="badge bg-success fs-6">Available</span>
                            </div>
                        </div>

                        <form method="POST">
                            <div class="row g-3 mb-3">
                                <div class="col-md-6">
                                    <label class="form-label"><i class="fas fa-calendar-alt me-1"></i>Start Date</label>
                                    <input type="date" name="start_date" class="form-control" value="<?php echo date('Y-m-d'); ?>" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label"><i class="fas fa-calendar-check me-1"></i>End Date</label>
                                    <input type="date" name="end_date" class="form-control" value="<?php echo date('Y-m-d', strtotime('+3 days')); ?>" required>
                                </div>
                            </div>

                            <div class="mb-4">
                                <label class="form-label">Rental Notes / Special Requests</label>
                                <textarea name="notes" class="form-control" rows="3" placeholder="E.g. Booster seat needed, preferred pickup time..."></textarea>
                            </div>

                            <div class="d-flex justify-content-between align-items-center border-top pt-3">
                                <a href="../vehicles.php" class="btn btn-outline-secondary">Cancel</a>
                                <button type="submit" class="btn btn-primary btn-lg"><i class="fas fa-check me-2"></i>Confirm Booking</button>
                            </div>
                        </form>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
