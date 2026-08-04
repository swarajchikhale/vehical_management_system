<?php
$pageTitle = 'My Bookings - DrivePulse';
require_once __DIR__ . '/../includes/header.php';
requireLogin();

$userBookings = getUserBookings($_SESSION['user_id']);
?>

<div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2><i class="fas fa-car text-primary me-2"></i>My Vehicle Bookings</h2>
        <a href="../vehicles.php" class="btn btn-primary"><i class="fas fa-plus me-1"></i>Rent Another Vehicle</a>
    </div>

    <?php if (empty($userBookings)): ?>
        <div class="card p-5 text-center shadow-sm">
            <i class="fas fa-car-side fa-3x text-muted mb-3"></i>
            <h4>No vehicle bookings found</h4>
            <p class="text-muted">You have not booked any vehicles yet.</p>
            <div>
                <a href="../vehicles.php" class="btn btn-primary">Browse Vehicles</a>
            </div>
        </div>
    <?php else: ?>
        <div class="card shadow-sm">
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-dark">
                            <tr>
                                <th>Booking ID</th>
                                <th>Vehicle</th>
                                <th>Type</th>
                                <th>Dates</th>
                                <th>Days</th>
                                <th>Total Cost</th>
                                <th>Status</th>
                                <th>Invoice</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($userBookings as $b): ?>
                                <tr>
                                    <td><strong>#<?php echo $b['id']; ?></strong></td>
                                    <td>
                                        <strong><?php echo htmlspecialchars($b['vehicle_name']); ?></strong>
                                        <div class="small text-muted"><?php echo htmlspecialchars($b['brand']); ?> <?php echo htmlspecialchars($b['model']); ?></div>
                                    </td>
                                    <td><span class="badge bg-secondary"><?php echo strtoupper($b['vehicle_type']); ?></span></td>
                                    <td><?php echo $b['start_date']; ?> to <?php echo $b['end_date']; ?></td>
                                    <td><?php echo $b['total_days']; ?></td>
                                    <td class="fw-bold text-success">₹<?php echo number_format($b['total_cost'], 2); ?></td>
                                    <td>
                                        <span class="badge bg-<?php echo ($b['status'] == 'active' || $b['status'] == 'confirmed') ? 'success' : (($b['status'] == 'pending') ? 'warning' : 'secondary'); ?>">
                                            <?php echo ucfirst($b['status']); ?>
                                        </span>
                                    </td>
                                    <td>
                                        <a href="../api/generate_bill.php?id=<?php echo $b['id']; ?>&type=rental" target="_blank" class="btn btn-sm btn-outline-info">
                                            <i class="fas fa-file-invoice me-1"></i>View Bill
                                        </a>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    <?php endif; ?>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
