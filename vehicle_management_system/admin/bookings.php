<?php
$pageTitle = 'Manage Bookings - Admin';
require_once __DIR__ . '/../includes/header.php';
requireRole('admin');

global $pdo;

// Handle status updates
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'update_status') {
    $bookingId = intval($_POST['booking_id']);
    $newStatus = sanitizeInput($_POST['status']);
    
    $stmt = $pdo->prepare("UPDATE bookings SET status = ? WHERE id = ?");
    $stmt->execute([$newStatus, $bookingId]);
    
    if ($newStatus === 'cancelled' || $newStatus === 'completed') {
        $stmtV = $pdo->prepare("UPDATE vehicles SET status = 'available' WHERE id = (SELECT vehicle_id FROM bookings WHERE id = ?)");
        $stmtV->execute([$bookingId]);
    }
    
    $message = "Booking #$bookingId status updated to " . ucfirst($newStatus);
}

$bookings = getAllBookings();
?>

<div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2><i class="fas fa-calendar-check text-primary me-2"></i>Manage Rental Bookings</h2>
        <a href="index.php" class="btn btn-outline-secondary"><i class="fas fa-arrow-left me-1"></i>Back to Admin Dashboard</a>
    </div>

    <?php if (isset($message)): ?>
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <?php echo $message; ?>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    <?php endif; ?>

    <div class="card shadow-sm">
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Customer</th>
                            <th>Vehicle</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Total Days</th>
                            <th>Total Cost</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($bookings as $b): ?>
                            <tr>
                                <td><strong>#<?php echo $b['id']; ?></strong></td>
                                <td>
                                    <div><?php echo htmlspecialchars($b['user_name']); ?></div>
                                    <small class="text-muted"><?php echo htmlspecialchars($b['email']); ?></small>
                                </td>
                                <td><?php echo htmlspecialchars($b['vehicle_name']); ?></td>
                                <td><?php echo $b['start_date']; ?></td>
                                <td><?php echo $b['end_date']; ?></td>
                                <td><?php echo $b['total_days']; ?></td>
                                <td class="fw-bold text-success">$<?php echo number_format($b['total_cost'], 2); ?></td>
                                <td>
                                    <span class="badge bg-<?php 
                                        echo ($b['status'] == 'active' || $b['status'] == 'confirmed') ? 'success' : 
                                            (($b['status'] == 'pending') ? 'warning' : 'secondary'); 
                                    ?>">
                                        <?php echo ucfirst($b['status']); ?>
                                    </span>
                                </td>
                                <td>
                                    <form method="POST" class="d-flex gap-1">
                                        <input type="hidden" name="action" value="update_status">
                                        <input type="hidden" name="booking_id" value="<?php echo $b['id']; ?>">
                                        <select name="status" class="form-select form-select-sm" onchange="this.form.submit()">
                                            <option value="pending" <?php echo $b['status'] == 'pending' ? 'selected' : ''; ?>>Pending</option>
                                            <option value="confirmed" <?php echo $b['status'] == 'confirmed' ? 'selected' : ''; ?>>Confirmed</option>
                                            <option value="active" <?php echo $b['status'] == 'active' ? 'selected' : ''; ?>>Active</option>
                                            <option value="completed" <?php echo $b['status'] == 'completed' ? 'selected' : ''; ?>>Completed</option>
                                            <option value="cancelled" <?php echo $b['status'] == 'cancelled' ? 'selected' : ''; ?>>Cancelled</option>
                                        </select>
                                    </form>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
