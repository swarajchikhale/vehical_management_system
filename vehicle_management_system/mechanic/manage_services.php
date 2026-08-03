<?php
$pageTitle = 'Manage Services - Mechanic';
require_once __DIR__ . '/../includes/header.php';
requireRole('mechanic');

global $pdo;

$stmtM = $pdo->prepare("SELECT * FROM mechanics WHERE user_id = ?");
$stmtM->execute([$_SESSION['user_id']]);
$mechanic = $stmtM->fetch(PDO::FETCH_ASSOC);

if (!$mechanic) {
    echo "<div class='container py-5'><div class='alert alert-danger'>Mechanic record not found.</div></div>";
    require_once __DIR__ . '/../includes/footer.php';
    exit();
}

// Handle job status update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'update_job') {
    $serviceId = intval($_POST['service_id']);
    $newStatus = sanitizeInput($_POST['status']);
    $cost = floatval($_POST['service_cost']);
    $notes = sanitizeInput($_POST['completion_notes']);

    $stmt = $pdo->prepare("UPDATE services SET status = ?, service_cost = ?, completion_notes = ? WHERE id = ? AND mechanic_id = ?");
    $stmt->execute([$newStatus, $cost, $notes, $serviceId, $mechanic['id']]);

    $message = "Service ticket #$serviceId updated successfully.";
}

// Fetch assigned tickets
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
        <h2><i class="fas fa-tasks text-warning me-2"></i>Manage Repair Jobs</h2>
        <a href="dashboard.php" class="btn btn-outline-secondary"><i class="fas fa-arrow-left me-1"></i>Back to Dashboard</a>
    </div>

    <?php if (isset($message)): ?>
        <div class="alert alert-success alert-dismissible fade show">
            <?php echo $message; ?>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    <?php endif; ?>

    <div class="row g-4">
        <?php foreach ($assignedServices as $job): ?>
            <div class="col-md-6">
                <div class="card shadow-sm h-100">
                    <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                        <span class="fw-bold">Ticket #<?php echo $job['id']; ?></span>
                        <span class="badge bg-<?php echo ($job['status'] == 'completed') ? 'success' : (($job['status'] == 'in_progress') ? 'warning' : 'info'); ?>">
                            <?php echo str_replace('_', ' ', ucfirst($job['status'])); ?>
                        </span>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title"><?php echo htmlspecialchars($job['problem_description']); ?></h5>
                        <p class="card-text text-muted mb-2"><i class="fas fa-map-marker-alt text-danger me-2"></i><?php echo htmlspecialchars($job['service_location']); ?></p>
                        <p class="card-text text-muted mb-3"><i class="fas fa-user me-2"></i>Customer: <?php echo htmlspecialchars($job['customer_name']); ?> (<?php echo htmlspecialchars($job['customer_phone']); ?>)</p>

                        <form method="POST" class="border-top pt-3">
                            <input type="hidden" name="action" value="update_job">
                            <input type="hidden" name="service_id" value="<?php echo $job['id']; ?>">

                            <div class="mb-2">
                                <label class="form-label small fw-bold">Repair Status</label>
                                <select name="status" class="form-select form-select-sm">
                                    <option value="assigned" <?php echo $job['status'] == 'assigned' ? 'selected' : ''; ?>>Assigned</option>
                                    <option value="in_progress" <?php echo $job['status'] == 'in_progress' ? 'selected' : ''; ?>>In Progress</option>
                                    <option value="completed" <?php echo $job['status'] == 'completed' ? 'selected' : ''; ?>>Completed</option>
                                </select>
                            </div>

                            <div class="mb-2">
                                <label class="form-label small fw-bold">Service Cost ($)</label>
                                <input type="number" step="0.01" name="service_cost" class="form-control form-control-sm" value="<?php echo $job['service_cost']; ?>">
                            </div>

                            <div class="mb-3">
                                <label class="form-label small fw-bold">Completion / Diagnostic Notes</label>
                                <textarea name="completion_notes" class="form-control form-control-sm" rows="2"><?php echo htmlspecialchars($job['completion_notes'] ?? ''); ?></textarea>
                            </div>

                            <button type="submit" class="btn btn-warning btn-sm w-100"><i class="fas fa-save me-1"></i>Save Progress</button>
                        </form>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
