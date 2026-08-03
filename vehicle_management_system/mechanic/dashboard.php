<?php
$pageTitle = 'Mechanic Dashboard';
require_once __DIR__ . '/../includes/header.php';
requireRole('mechanic');

global $pdo;

// Fetch mechanic record for logged in user
$stmtM = $pdo->prepare("SELECT * FROM mechanics WHERE user_id = ?");
$stmtM->execute([$_SESSION['user_id']]);
$mechanic = $stmtM->fetch(PDO::FETCH_ASSOC);

if (!$mechanic) {
    echo "<div class='container py-5'><div class='alert alert-danger'>Mechanic profile not found.</div></div>";
    require_once __DIR__ . '/../includes/footer.php';
    exit();
}

// Fetch assigned service tickets
$stmtS = $pdo->prepare("
    SELECT s.*, u.name as customer_name, u.phone as customer_phone 
    FROM services s 
    LEFT JOIN users u ON s.user_id = u.id 
    WHERE s.mechanic_id = ? 
    ORDER BY s.created_at DESC
");
$stmtS->execute([$mechanic['id']]);
$assignedServices = $stmtS->fetchAll(PDO::FETCH_ASSOC);
?>

<div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h2><i class="fas fa-wrench text-warning me-2"></i>Technician Workbench</h2>
            <p class="text-muted mb-0">Logged in as: <strong><?php echo htmlspecialchars($_SESSION['user_name']); ?></strong> (<?php echo htmlspecialchars($mechanic['specialization']); ?>)</p>
        </div>
        <div>
            <a href="manage_services.php" class="btn btn-warning"><i class="fas fa-tasks me-1"></i>Manage Active Jobs</a>
        </div>
    </div>

    <div class="row g-4 mb-4">
        <div class="col-md-4">
            <div class="card bg-primary text-white p-3 shadow-sm">
                <h5>Assigned Jobs</h5>
                <h2 class="display-6 fw-bold"><?php echo count($assignedServices); ?></h2>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card bg-warning text-dark p-3 shadow-sm">
                <h5>In Progress</h5>
                <h2 class="display-6 fw-bold">
                    <?php echo count(array_filter($assignedServices, fn($s) => $s['status'] === 'in_progress')); ?>
                </h2>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card bg-success text-white p-3 shadow-sm">
                <h5>Completed Jobs</h5>
                <h2 class="display-6 fw-bold">
                    <?php echo count(array_filter($assignedServices, fn($s) => $s['status'] === 'completed')); ?>
                </h2>
            </div>
        </div>
    </div>

    <div class="card shadow-sm">
        <div class="card-header bg-dark text-white">
            <h5 class="mb-0"><i class="fas fa-clipboard-list me-2"></i>Assigned Repair Tickets</h5>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead>
                        <tr>
                            <th>Ticket</th>
                            <th>Customer</th>
                            <th>Problem</th>
                            <th>Location</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($assignedServices as $job): ?>
                            <tr>
                                <td><strong>#<?php echo $job['id']; ?></strong></td>
                                <td>
                                    <div><?php echo htmlspecialchars($job['customer_name']); ?></div>
                                    <small class="text-muted"><?php echo htmlspecialchars($job['customer_phone']); ?></small>
                                </td>
                                <td><?php echo htmlspecialchars($job['problem_description']); ?></td>
                                <td><?php echo htmlspecialchars($job['service_location']); ?></td>
                                <td>
                                    <span class="badge bg-<?php echo ($job['status'] == 'completed') ? 'success' : (($job['status'] == 'in_progress') ? 'warning' : 'info'); ?>">
                                        <?php echo str_replace('_', ' ', ucfirst($job['status'])); ?>
                                    </span>
                                </td>
                                <td>
                                    <a href="manage_services.php" class="btn btn-sm btn-outline-warning">Update Ticket</a>
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
