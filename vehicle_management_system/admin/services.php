<?php
$pageTitle = 'Manage Services - Admin';
require_once __DIR__ . '/../includes/header.php';
requireRole('admin');

global $pdo;

// Assign mechanic
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'assign_mechanic') {
    $serviceId = intval($_POST['service_id']);
    $mechanicId = intval($_POST['mechanic_id']);
    
    $stmt = $pdo->prepare("UPDATE services SET mechanic_id = ?, status = 'assigned' WHERE id = ?");
    $stmt->execute([$mechanicId, $serviceId]);
    $message = "Mechanic assigned to service request #$serviceId successfully.";
}

// Fetch all services with mechanic details
$stmtS = $pdo->query("
    SELECT s.*, u.name as customer_name, u.phone as customer_phone, 
           m.id as mechanic_id, mu.name as mechanic_name 
    FROM services s 
    LEFT JOIN users u ON s.user_id = u.id 
    LEFT JOIN mechanics m ON s.mechanic_id = m.id 
    LEFT JOIN users mu ON m.user_id = mu.id 
    ORDER BY s.created_at DESC
");
$services = $stmtS->fetchAll(PDO::FETCH_ASSOC);

// Fetch all available mechanics
$stmtM = $pdo->query("SELECT m.id, u.name, m.specialization FROM mechanics m JOIN users u ON m.user_id = u.id");
$mechanics = $stmtM->fetchAll(PDO::FETCH_ASSOC);
?>

<div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2><i class="fas fa-tools text-warning me-2"></i>Service Dispatch & Management</h2>
        <a href="index.php" class="btn btn-outline-secondary"><i class="fas fa-arrow-left me-1"></i>Back to Admin Dashboard</a>
    </div>

    <?php if (isset($message)): ?>
        <div class="alert alert-success alert-dismissible fade show">
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
                            <th>Vehicle Type</th>
                            <th>Problem</th>
                            <th>Location</th>
                            <th>Assigned Mechanic</th>
                            <th>Status</th>
                            <th>Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($services as $s): ?>
                            <tr>
                                <td><strong>#<?php echo $s['id']; ?></strong></td>
                                <td>
                                    <div><?php echo htmlspecialchars($s['customer_name'] ?? 'Guest'); ?></div>
                                    <small class="text-muted"><?php echo htmlspecialchars($s['customer_phone'] ?? ''); ?></small>
                                </td>
                                <td><span class="badge bg-secondary"><?php echo strtoupper($s['vehicle_type']); ?></span></td>
                                <td style="max-width: 250px;"><?php echo htmlspecialchars($s['problem_description']); ?></td>
                                <td><?php echo htmlspecialchars($s['service_location']); ?></td>
                                <td>
                                    <form method="POST" class="d-flex">
                                        <input type="hidden" name="action" value="assign_mechanic">
                                        <input type="hidden" name="service_id" value="<?php echo $s['id']; ?>">
                                        <select name="mechanic_id" class="form-select form-select-sm" onchange="this.form.submit()">
                                            <option value="">-- Assign --</option>
                                            <?php foreach ($mechanics as $m): ?>
                                                <option value="<?php echo $m['id']; ?>" <?php echo ($s['mechanic_id'] == $m['id']) ? 'selected' : ''; ?>>
                                                    <?php echo htmlspecialchars($m['name']); ?> (<?php echo htmlspecialchars($m['specialization']); ?>)
                                                </option>
                                            <?php endforeach; ?>
                                        </select>
                                    </form>
                                </td>
                                <td>
                                    <span class="badge bg-<?php echo ($s['status'] == 'completed') ? 'success' : (($s['status'] == 'in_progress' || $s['status'] == 'assigned') ? 'info' : 'warning'); ?>">
                                        <?php echo str_replace('_', ' ', ucfirst($s['status'])); ?>
                                    </span>
                                </td>
                                <td class="fw-bold">₹<?php echo number_format($s['service_cost'], 2); ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
