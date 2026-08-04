<?php
$pageTitle = 'Fleet Management - Admin';
require_once __DIR__ . '/../includes/header.php';
requireRole('admin');

global $pdo;

// Handle Add Vehicle
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'add_vehicle') {
    $name = sanitizeInput($_POST['vehicle_name']);
    $type = sanitizeInput($_POST['vehicle_type']);
    $brand = sanitizeInput($_POST['brand']);
    $model = sanitizeInput($_POST['model']);
    $year = intval($_POST['year']);
    $plate = sanitizeInput($_POST['license_plate']);
    $price = floatval($_POST['rent_price']);
    $desc = sanitizeInput($_POST['description']);

    $stmt = $pdo->prepare("
        INSERT INTO vehicles (vehicle_name, vehicle_type, brand, model, year, license_plate, rent_price, description, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'available')
    ");
    $stmt->execute([$name, $type, $brand, $model, $year, $plate, $price, $desc]);
    $message = "Vehicle '$name' added to fleet successfully.";
}

// Handle Delete Vehicle
if (isset($_GET['delete'])) {
    $vId = intval($_GET['delete']);
    $stmt = $pdo->prepare("DELETE FROM vehicles WHERE id = ?");
    $stmt->execute([$vId]);
    $message = "Vehicle removed from fleet.";
}

$stmtV = $pdo->query("SELECT * FROM vehicles ORDER BY created_at DESC");
$vehicles = $stmtV->fetchAll(PDO::FETCH_ASSOC);
?>

<div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2><i class="fas fa-car text-primary me-2"></i>Fleet Management</h2>
        <div>
            <button class="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target="#addVehicleModal">
                <i class="fas fa-plus me-1"></i>Add New Vehicle
            </button>
            <a href="index.php" class="btn btn-outline-secondary"><i class="fas fa-arrow-left me-1"></i>Back</a>
        </div>
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
                            <th>Vehicle Name</th>
                            <th>Type</th>
                            <th>Brand / Model</th>
                            <th>License Plate</th>
                            <th>Daily Rate</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($vehicles as $v): ?>
                            <tr>
                                <td><strong>#<?php echo $v['id']; ?></strong></td>
                                <td><strong><?php echo htmlspecialchars($v['vehicle_name']); ?></strong></td>
                                <td><span class="badge bg-secondary"><?php echo strtoupper($v['vehicle_type']); ?></span></td>
                                <td><?php echo htmlspecialchars($v['brand'] . ' ' . $v['model']); ?> (<?php echo $v['year']; ?>)</td>
                                <td><code><?php echo htmlspecialchars($v['license_plate']); ?></code></td>
                                <td class="fw-bold text-success">₹<?php echo number_format($v['rent_price'], 2); ?></td>
                                <td>
                                    <span class="badge bg-<?php echo ($v['status'] == 'available') ? 'success' : (($v['status'] == 'rented') ? 'warning' : 'danger'); ?>">
                                        <?php echo ucfirst($v['status']); ?>
                                    </span>
                                </td>
                                <td>
                                    <a href="vehicles.php?delete=<?php echo $v['id']; ?>" class="btn btn-sm btn-outline-danger" onclick="return confirm('Remove vehicle?')">
                                        <i class="fas fa-trash"></i>
                                    </a>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<!-- Modal Add Vehicle -->
<div class="modal fade" id="addVehicleModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <form method="POST">
                <input type="hidden" name="action" value="add_vehicle">
                <div class="modal-header">
                    <h5 class="modal-title">Add Vehicle to Fleet</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label">Vehicle Name</label>
                            <input type="text" name="vehicle_name" class="form-control" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Type</label>
                            <select name="vehicle_type" class="form-select">
                                <option value="car">Car</option>
                                <option value="bike">Bike</option>
                                <option value="van">Van</option>
                                <option value="truck">Truck</option>
                                <option value="bus">Bus</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Brand</label>
                            <input type="text" name="brand" class="form-control" required>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Model</label>
                            <input type="text" name="model" class="form-control" required>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Year</label>
                            <input type="number" name="year" class="form-control" value="2024" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">License Plate</label>
                            <input type="text" name="license_plate" class="form-control" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Daily Price (₹)</label>
                            <input type="number" step="0.01" name="rent_price" class="form-control" required>
                        </div>
                        <div class="col-12">
                            <label class="form-label">Description</label>
                            <textarea name="description" class="form-control" rows="3" required></textarea>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary">Save Vehicle</button>
                </div>
            </form>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
