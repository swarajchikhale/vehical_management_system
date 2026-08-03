<?php
$pageTitle = 'Request Service - Customer';
require_once __DIR__ . '/../includes/header.php';
requireLogin();

$userServiceTickets = getUserServices($_SESSION['user_id']);
?>

<div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2><i class="fas fa-tools text-warning me-2"></i>My Service Tickets</h2>
        <a href="../mechanic_service.php" class="btn btn-warning"><i class="fas fa-plus me-1"></i>New Service Request</a>
    </div>

    <?php if (empty($userServiceTickets)): ?>
        <div class="card p-5 text-center shadow-sm">
            <i class="fas fa-wrench fa-3x text-muted mb-3"></i>
            <h4>No mechanic service tickets found</h4>
            <p class="text-muted">You have not submitted any roadside repair requests.</p>
            <div>
                <a href="../mechanic_service.php" class="btn btn-warning">Request Mechanic</a>
            </div>
        </div>
    <?php else: ?>
        <div class="card shadow-sm">
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-dark">
                            <tr>
                                <th>Ticket ID</th>
                                <th>Vehicle Type</th>
                                <th>Problem Description</th>
                                <th>Location</th>
                                <th>Assigned Mechanic</th>
                                <th>Status</th>
                                <th>Bill</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($userServiceTickets as $s): ?>
                                <tr>
                                    <td><strong>#<?php echo $s['id']; ?></strong></td>
                                    <td><span class="badge bg-secondary"><?php echo strtoupper($s['vehicle_type']); ?></span></td>
                                    <td style="max-width: 250px;"><?php echo htmlspecialchars($s['problem_description']); ?></td>
                                    <td><?php echo htmlspecialchars($s['service_location']); ?></td>
                                    <td><?php echo htmlspecialchars($s['mechanic_name'] ?? 'Unassigned'); ?></td>
                                    <td>
                                        <span class="badge bg-<?php echo ($s['status'] == 'completed') ? 'success' : (($s['status'] == 'in_progress' || $s['status'] == 'assigned') ? 'info' : 'warning'); ?>">
                                            <?php echo str_replace('_', ' ', ucfirst($s['status'])); ?>
                                        </span>
                                    </td>
                                    <td>
                                        <a href="../api/generate_bill.php?id=<?php echo $s['id']; ?>&type=service" target="_blank" class="btn btn-sm btn-outline-info">
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
