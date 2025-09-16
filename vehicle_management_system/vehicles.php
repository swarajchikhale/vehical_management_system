<?php
$pageTitle = 'Available Vehicles';
require_once 'includes/header.php';

// Get filter parameters
$typeFilter = $_GET['type'] ?? '';
$priceMin = $_GET['price_min'] ?? '';
$priceMax = $_GET['price_max'] ?? '';
$search = $_GET['search'] ?? '';

// Build query with filters
$query = "SELECT * FROM vehicles WHERE status = 'available'";
$params = [];

if (!empty($typeFilter)) {
    $query .= " AND vehicle_type = ?";
    $params[] = $typeFilter;
}

if (!empty($priceMin) && is_numeric($priceMin)) {
    $query .= " AND rent_price >= ?";
    $params[] = floatval($priceMin);
}

if (!empty($priceMax) && is_numeric($priceMax)) {
    $query .= " AND rent_price <= ?";
    $params[] = floatval($priceMax);
}

if (!empty($search)) {
    $query .= " AND (vehicle_name LIKE ? OR brand LIKE ? OR model LIKE ?)";
    $searchTerm = '%' . $search . '%';
    $params[] = $searchTerm;
    $params[] = $searchTerm;
    $params[] = $searchTerm;
}

$query .= " ORDER BY vehicle_name ASC";

global $pdo;
$stmt = $pdo->prepare($query);
$stmt->execute($params);
$vehicles = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Get unique vehicle types for filter
$typeStmt = $pdo->query("SELECT DISTINCT vehicle_type FROM vehicles ORDER BY vehicle_type");
$vehicleTypes = $typeStmt->fetchAll(PDO::FETCH_COLUMN);
?>

<div class="container">
    <!-- Page Header -->
    <div class="text-center mb-5">
        <h1 class="display-4 fw-bold text-gradient">Available Vehicles</h1>
        <p class="lead text-muted">Choose from our wide selection of well-maintained vehicles</p>
    </div>
    
    <!-- Filters -->
    <div class="card mb-4">
        <div class="card-header">
            <h5 class="mb-0"><i class="fas fa-filter me-2"></i>Filter Vehicles</h5>
        </div>
        <div class="card-body">
            <form method="GET" action="" id="filterForm">
                <div class="row g-3">
                    <div class="col-md-3">
                        <label for="search" class="form-label">Search</label>
                        <input type="text" 
                               class="form-control" 
                               id="search" 
                               name="search" 
                               value="<?php echo htmlspecialchars($search); ?>"
                               placeholder="Search vehicles...">
                    </div>
                    
                    <div class="col-md-2">
                        <label for="type" class="form-label">Type</label>
                        <select class="form-select" id="type" name="type">
                            <option value="">All Types</option>
                            <?php foreach ($vehicleTypes as $type): ?>
                                <option value="<?php echo $type; ?>" <?php echo ($typeFilter === $type) ? 'selected' : ''; ?>>
                                    <?php echo ucfirst($type); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    
                    <div class="col-md-2">
                        <label for="price_min" class="form-label">Min Price</label>
                        <input type="number" 
                               class="form-control" 
                               id="price_min" 
                               name="price_min" 
                               value="<?php echo htmlspecialchars($priceMin); ?>"
                               placeholder="$0"
                               min="0"
                               step="0.01">
                    </div>
                    
                    <div class="col-md-2">
                        <label for="price_max" class="form-label">Max Price</label>
                        <input type="number" 
                               class="form-control" 
                               id="price_max" 
                               name="price_max" 
                               value="<?php echo htmlspecialchars($priceMax); ?>"
                               placeholder="$1000"
                               min="0"
                               step="0.01">
                    </div>
                    
                    <div class="col-md-3 d-flex align-items-end">
                        <button type="submit" class="btn btn-primary me-2">
                            <i class="fas fa-search me-1"></i>Filter
                        </button>
                        <a href="vehicles.php" class="btn btn-outline-secondary">
                            <i class="fas fa-times me-1"></i>Clear
                        </a>
                    </div>
                </div>
            </form>
        </div>
    </div>
    
    <!-- Results Info -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h5 class="mb-0">
            <?php echo count($vehicles); ?> vehicle(s) found
            <?php if (!empty($search) || !empty($typeFilter) || !empty($priceMin) || !empty($priceMax)): ?>
                <small class="text-muted">with filters applied</small>
            <?php endif; ?>
        </h5>
        
        <div class="btn-group" role="group">
            <button type="button" class="btn btn-outline-primary active" onclick="toggleView('grid')">
                <i class="fas fa-th-large me-1"></i>Grid
            </button>
            <button type="button" class="btn btn-outline-primary" onclick="toggleView('list')">
                <i class="fas fa-list me-1"></i>List
            </button>
        </div>
    </div>
    
    <!-- Vehicles Grid -->
    <div id="vehicleGrid" class="vehicle-grid">
        <?php if (empty($vehicles)): ?>
            <div class="col-12">
                <div class="text-center py-5">
                    <i class="fas fa-car fa-3x text-muted mb-3"></i>
                    <h4>No vehicles found</h4>
                    <p class="text-muted">Try adjusting your filters or check back later for new additions.</p>
                    <a href="vehicles.php" class="btn btn-primary">View All Vehicles</a>
                </div>
            </div>
        <?php else: ?>
            <?php foreach ($vehicles as $vehicle): ?>
                <div class="vehicle-card">
                    <div class="vehicle-image">
                        <?php if ($vehicle['image']): ?>
                            <img src="uploads/vehicles/<?php echo htmlspecialchars($vehicle['image']); ?>" 
                                 alt="<?php echo htmlspecialchars($vehicle['vehicle_name']); ?>"
                                 class="w-100 h-100 object-fit-cover">
                        <?php else: ?>
                            <i class="fas fa-<?php 
                                echo $vehicle['vehicle_type'] === 'car' ? 'car' : 
                                    ($vehicle['vehicle_type'] === 'bike' ? 'motorcycle' : 
                                    ($vehicle['vehicle_type'] === 'truck' ? 'truck' : 
                                    ($vehicle['vehicle_type'] === 'van' ? 'shuttle-van' : 'bus'))); 
                            ?> fa-3x"></i>
                        <?php endif; ?>
                        <div class="vehicle-overlay">
                            <button class="btn btn-light btn-sm" onclick="viewVehicleDetails(<?php echo $vehicle['id']; ?>)">
                                <i class="fas fa-eye me-1"></i>View Details
                            </button>
                        </div>
                    </div>
                    
                    <div class="vehicle-info">
                        <h5 class="card-title"><?php echo htmlspecialchars($vehicle['vehicle_name']); ?></h5>
                        
                        <div class="vehicle-details mb-3">
                            <span class="badge bg-primary me-2">
                                <i class="fas fa-tag me-1"></i><?php echo ucfirst($vehicle['vehicle_type']); ?>
                            </span>
                            
                            <?php if ($vehicle['brand']): ?>
                                <small class="text-muted d-block mt-1">
                                    <i class="fas fa-industry me-1"></i><?php echo htmlspecialchars($vehicle['brand']); ?>
                                    <?php if ($vehicle['model']): ?>
                                        <?php echo htmlspecialchars($vehicle['model']); ?>
                                    <?php endif; ?>
                                </small>
                            <?php endif; ?>
                            
                            <?php if ($vehicle['year']): ?>
                                <small class="text-muted d-block">
                                    <i class="fas fa-calendar me-1"></i><?php echo $vehicle['year']; ?>
                                </small>
                            <?php endif; ?>
                            
                            <?php if ($vehicle['license_plate']): ?>
                                <small class="text-muted d-block">
                                    <i class="fas fa-id-card me-1"></i><?php echo htmlspecialchars($vehicle['license_plate']); ?>
                                </small>
                            <?php endif; ?>
                        </div>
                        
                        <div class="price mb-3"><?php echo formatCurrency($vehicle['rent_price']); ?>/day</div>
                        
                        <?php if ($vehicle['description']): ?>
                            <p class="text-muted small">
                                <?php echo htmlspecialchars(substr($vehicle['description'], 0, 100)); ?>
                                <?php if (strlen($vehicle['description']) > 100): ?>...<?php endif; ?>
                            </p>
                        <?php endif; ?>
                        
                        <div class="d-flex justify-content-between align-items-center">
                            <?php echo getStatusBadge($vehicle['status']); ?>
                            
                            <?php if ($vehicle['status'] === 'available'): ?>
                                <?php if (isLoggedIn()): ?>
                                    <button class="btn btn-primary btn-sm book-vehicle-btn" 
                                            data-vehicle-id="<?php echo $vehicle['id']; ?>"
                                            data-vehicle-name="<?php echo htmlspecialchars($vehicle['vehicle_name']); ?>"
                                            data-vehicle-price="<?php echo $vehicle['rent_price']; ?>">
                                        <i class="fas fa-calendar-check me-1"></i>Book Now
                                    </button>
                                <?php else: ?>
                                    <a href="login.php" class="btn btn-primary btn-sm">
                                        <i class="fas fa-sign-in-alt me-1"></i>Login to Book
                                    </a>
                                <?php endif; ?>
                            <?php else: ?>
                                <button class="btn btn-secondary btn-sm" disabled>
                                    <i class="fas fa-ban me-1"></i>Not Available
                                </button>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>
    
    <!-- Vehicles List View (Hidden by default) -->
    <div id="vehicleList" class="d-none">
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Vehicle</th>
                        <th>Type</th>
                        <th>Brand/Model</th>
                        <th>Year</th>
                        <th>Price/Day</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($vehicles as $vehicle): ?>
                        <tr>
                            <td>
                                <div class="d-flex align-items-center">
                                    <div class="me-3" style="width: 50px; height: 40px; background: var(--gradient-primary); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                                        <i class="fas fa-<?php 
                                            echo $vehicle['vehicle_type'] === 'car' ? 'car' : 
                                                ($vehicle['vehicle_type'] === 'bike' ? 'motorcycle' : 
                                                ($vehicle['vehicle_type'] === 'truck' ? 'truck' : 
                                                ($vehicle['vehicle_type'] === 'van' ? 'shuttle-van' : 'bus'))); 
                                        ?> text-white"></i>
                                    </div>
                                    <div>
                                        <div class="fw-semibold"><?php echo htmlspecialchars($vehicle['vehicle_name']); ?></div>
                                        <?php if ($vehicle['license_plate']): ?>
                                            <small class="text-muted"><?php echo htmlspecialchars($vehicle['license_plate']); ?></small>
                                        <?php endif; ?>
                                    </div>
                                </div>
                            </td>
                            <td><?php echo ucfirst($vehicle['vehicle_type']); ?></td>
                            <td>
                                <?php echo htmlspecialchars($vehicle['brand'] ?? 'N/A'); ?>
                                <?php if ($vehicle['model']): ?>
                                    <br><small class="text-muted"><?php echo htmlspecialchars($vehicle['model']); ?></small>
                                <?php endif; ?>
                            </td>
                            <td><?php echo $vehicle['year'] ?? 'N/A'; ?></td>
                            <td class="fw-semibold text-primary"><?php echo formatCurrency($vehicle['rent_price']); ?></td>
                            <td><?php echo getStatusBadge($vehicle['status']); ?></td>
                            <td>
                                <?php if ($vehicle['status'] === 'available'): ?>
                                    <?php if (isLoggedIn()): ?>
                                        <button class="btn btn-primary btn-sm book-vehicle-btn" 
                                                data-vehicle-id="<?php echo $vehicle['id']; ?>"
                                                data-vehicle-name="<?php echo htmlspecialchars($vehicle['vehicle_name']); ?>"
                                                data-vehicle-price="<?php echo $vehicle['rent_price']; ?>">
                                            <i class="fas fa-calendar-check me-1"></i>Book
                                        </button>
                                    <?php else: ?>
                                        <a href="login.php" class="btn btn-primary btn-sm">Login</a>
                                    <?php endif; ?>
                                <?php else: ?>
                                    <button class="btn btn-secondary btn-sm" disabled>N/A</button>
                                <?php endif; ?>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Booking Modal -->
<div class="modal fade" id="bookingModal" tabindex="-1" aria-labelledby="bookingModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="bookingModalLabel">
                    <i class="fas fa-calendar-check me-2"></i>Book Vehicle
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            
            <form id="bookingForm" action="api/book_vehicle.php" method="POST" data-validate>
                <div class="modal-body">
                    <input type="hidden" id="vehicleId" name="vehicleId">
                    
                    <div class="alert alert-info">
                        <h6><i class="fas fa-car me-2"></i><span id="vehicleName"></span></h6>
                        <p class="mb-0">Price: <span id="vehiclePrice" class="fw-bold"></span></p>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group mb-3">
                                <label for="startDate" class="form-label">Start Date</label>
                                <input type="date" 
                                       class="form-control" 
                                       id="startDate" 
                                       name="startDate"
                                       data-rules="required|futureDate"
                                       required>
                            </div>
                        </div>
                        
                        <div class="col-md-6">
                            <div class="form-group mb-3">
                                <label for="endDate" class="form-label">End Date</label>
                                <input type="date" 
                                       class="form-control" 
                                       id="endDate" 
                                       name="endDate"
                                       data-rules="required|futureDate"
                                       required>
                            </div>
                        </div>
                    </div>
                    
                    
                    <div id="bookingTotal"></div>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-check me-1"></i>Confirm Booking
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Vehicle Details Modal -->
<div class="modal fade" id="vehicleDetailsModal" tabindex="-1" aria-labelledby="vehicleDetailsModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="vehicleDetailsModalLabel">
                    <i class="fas fa-info-circle me-2"></i>Vehicle Details
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" id="vehicleDetailsContent">
                <!-- Content will be loaded via JavaScript -->
            </div>
        </div>
    </div>
</div>

<?php
$additionalScripts = '
<script>
    let currentView = "grid";
    
    function toggleView(view) {
        const gridView = document.getElementById("vehicleGrid");
        const listView = document.getElementById("vehicleList");
        const gridBtn = document.querySelector("[onclick=\'toggleView(\\\"grid\\\")\']");
        const listBtn = document.querySelector("[onclick=\'toggleView(\\\"list\\\")\']");
        
        if (view === "grid") {
            gridView.classList.remove("d-none");
            listView.classList.add("d-none");
            gridBtn.classList.add("active");
            listBtn.classList.remove("active");
            currentView = "grid";
        } else {
            gridView.classList.add("d-none");
            listView.classList.remove("d-none");
            gridBtn.classList.remove("active");
            listBtn.classList.add("active");
            currentView = "list";
        }
        
        localStorage.setItem("vehicleViewPreference", view);
    }
    
    function viewVehicleDetails(vehicleId) {
        fetch(`api/get_vehicle_details.php?id=${vehicleId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const vehicle = data.vehicle;
                    const content = `
                        <div class="row">
                            <div class="col-md-6">
                                <div class="vehicle-image-large mb-3" style="height: 250px; background: var(--gradient-primary); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                                    ${vehicle.image ? 
                                        `<img src="uploads/vehicles/${vehicle.image}" alt="${vehicle.vehicle_name}" class="w-100 h-100 object-fit-cover" style="border-radius: 8px;">` :
                                        `<i class="fas fa-car fa-4x text-white"></i>`
                                    }
                                </div>
                            </div>
                            <div class="col-md-6">
                                <h4>${vehicle.vehicle_name}</h4>
                                <div class="mb-3">
                                    <span class="badge bg-primary me-2">${vehicle.vehicle_type.charAt(0).toUpperCase() + vehicle.vehicle_type.slice(1)}</span>
                                    ${vehicle.status === "available" ? 
                                        `<span class="badge bg-success">Available</span>` : 
                                        `<span class="badge bg-danger">Not Available</span>`
                                    }
                                </div>
                                
                                <table class="table table-sm">
                                    <tr><td><strong>Brand:</strong></td><td>${vehicle.brand || "N/A"}</td></tr>
                                    <tr><td><strong>Model:</strong></td><td>${vehicle.model || "N/A"}</td></tr>
                                    <tr><td><strong>Year:</strong></td><td>${vehicle.year || "N/A"}</td></tr>
                                    <tr><td><strong>License Plate:</strong></td><td>${vehicle.license_plate || "N/A"}</td></tr>
                                    <tr><td><strong>Price per Day:</strong></td><td class="text-primary fw-bold">${vehicle.rent_price}</td></tr>
                                </table>
                                
                                ${vehicle.description ? 
                                    `<div class="mt-3">
                                        <h6>Description:</h6>
                                        <p class="text-muted">${vehicle.description}</p>
                                    </div>` : ""
                                }
                                
                                ${vehicle.status === "available" && ' . (isLoggedIn() ? 'true' : 'false') . ' ? 
                                    `<button class="btn btn-primary mt-3 book-vehicle-btn" 
                                             data-vehicle-id="${vehicle.id}"
                                             data-vehicle-name="${vehicle.vehicle_name}"
                                             data-vehicle-price="${vehicle.rent_price}"
                                             data-bs-dismiss="modal">
                                        <i class="fas fa-calendar-check me-1"></i>Book This Vehicle
                                    </button>` : 
                                    (!' . (isLoggedIn() ? 'true' : 'false') . ' ? 
                                        `<a href="login.php" class="btn btn-primary mt-3">
                                            <i class="fas fa-sign-in-alt me-1"></i>Login to Book
                                        </a>` : "")
                                }
                            </div>
                        </div>
                    `;
                    
                    document.getElementById("vehicleDetailsContent").innerHTML = content;
                    
                    // Reinitialize booking buttons
                    initializeBookingButtons();
                    
                    const modal = new bootstrap.Modal(document.getElementById("vehicleDetailsModal"));
                    modal.show();
                } else {
                    alert("Error loading vehicle details");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Error loading vehicle details");
            });
    }
    
    function initializeBookingButtons() {
        document.querySelectorAll(".book-vehicle-btn").forEach(btn => {
            btn.addEventListener("click", function() {
                const vehicleId = this.dataset.vehicleId;
                const vehicleName = this.dataset.vehicleName;
                const vehiclePrice = this.dataset.vehiclePrice;
                
                document.getElementById("vehicleId").value = vehicleId;
                document.getElementById("vehicleName").textContent = vehicleName;
                document.getElementById("vehiclePrice").textContent = `${vehiclePrice}/day`;
                
                // Set minimum dates
                const today = new Date().toISOString().split("T")[0];
                document.getElementById("startDate").min = today;
                document.getElementById("endDate").min = today;
                
                // Clear previous values
                document.getElementById("startDate").value = "";
                document.getElementById("endDate").value = "";
                document.getElementById("notes").value = "";
                document.getElementById("bookingTotal").innerHTML = "";
                
                const modal = new bootstrap.Modal(document.getElementById("bookingModal"));
                modal.show();
            });
        });
    }
    
    // Calculate booking total
    function calculateBookingTotal() {
        const startDate = document.getElementById("startDate").value;
        const endDate = document.getElementById("endDate").value;
        const pricePerDay = parseFloat(document.getElementById("vehiclePrice").textContent.replace("$", "").replace("/day", ""));
        
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            
            if (end >= start) {
                const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
                const subtotal = days * pricePerDay;
                const tax = subtotal * 0.18; // 18% tax
                const total = subtotal + tax;
                
                document.getElementById("bookingTotal").innerHTML = `
                    <div class="card border-primary mt-3">
                        <div class="card-header bg-primary text-white">
                            <h6 class="mb-0">Booking Summary</h6>
                        </div>
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <span>Rental (${days} day${days > 1 ? "s" : ""}):</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div class="d-flex justify-content-between">
                                <span>Tax (18%):</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            <hr>
                            <div class="d-flex justify-content-between fw-bold fs-5">
                                <span>Total:</span>
                                <span class="text-primary">${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                document.getElementById("bookingTotal").innerHTML = `
                    <div class="alert alert-warning mt-3">
                        <i class="fas fa-exclamation-triangle me-2"></i>End date must be on or after start date
                    </div>
                `;
            }
        }
    }
    
    // Initialize everything when DOM loads
    document.addEventListener("DOMContentLoaded", function() {
        // Restore view preference
        const savedView = localStorage.getItem("vehicleViewPreference");
        if (savedView) {
            toggleView(savedView);
        }
        
        // Initialize booking buttons
        initializeBookingButtons();
        
        // Add date change listeners
        document.getElementById("startDate").addEventListener("change", calculateBookingTotal);
        document.getElementById("endDate").addEventListener("change", calculateBookingTotal);
        
        // Add vehicle overlay effects
        document.querySelectorAll(".vehicle-card").forEach(card => {
            const overlay = card.querySelector(".vehicle-overlay");
            if (overlay) {
                card.addEventListener("mouseenter", () => {
                    overlay.style.opacity = "1";
                });
                card.addEventListener("mouseleave", () => {
                    overlay.style.opacity = "0";
                });
            }
        });
    });
</script>

<style>
    .vehicle-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .vehicle-image {
        position: relative;
        overflow: hidden;
    }
    
    .vehicle-image img {
        transition: transform 0.3s ease;
    }
    
    .vehicle-card:hover .vehicle-image img {
        transform: scale(1.05);
    }
    
    .object-fit-cover {
        object-fit: cover;
    }
</style>
';

require_once 'includes/footer.php';
?>