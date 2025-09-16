<?php
$pageTitle = 'Mechanic Service';
require_once 'includes/header.php';

// Get available mechanics
global $pdo;
$stmt = $pdo->query("
    SELECT m.*, u.name as mechanic_name 
    FROM mechanics m 
    JOIN users u ON m.user_id = u.id 
    WHERE m.availability = 'available' 
    ORDER BY m.rating DESC
");
$availableMechanics = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<div class="container">
    <!-- Hero Section -->
    <div class="text-center mb-5">
        <h1 class="display-4 fw-bold text-gradient">
            <i class="fas fa-tools me-3"></i>Professional Mechanic Services
        </h1>
        <p class="lead text-muted">Expert mechanics available 24/7 to fix all your vehicle problems</p>
    </div>
    
    <!-- Service Types -->
    <div class="row g-4 mb-5">
        <div class="col-lg-3 col-md-6">
            <div class="service-card text-center">
                <div class="service-icon">
                    <i class="fas fa-car text-primary"></i>
                </div>
                <h5>Car Repair</h5>
                <p class="text-muted">Complete car repair and maintenance services</p>
                <ul class="list-unstyled text-start">
                    <li><i class="fas fa-check text-success me-2"></i>Engine diagnostics</li>
                    <li><i class="fas fa-check text-success me-2"></i>Brake service</li>
                    <li><i class="fas fa-check text-success me-2"></i>Oil change</li>
                    <li><i class="fas fa-check text-success me-2"></i>Battery replacement</li>
                </ul>
            </div>
        </div>
        
        <div class="col-lg-3 col-md-6">
            <div class="service-card text-center">
                <div class="service-icon">
                    <i class="fas fa-motorcycle text-warning"></i>
                </div>
                <h5>Bike Service</h5>
                <p class="text-muted">Motorcycle and bike repair specialists</p>
                <ul class="list-unstyled text-start">
                    <li><i class="fas fa-check text-success me-2"></i>Engine tuning</li>
                    <li><i class="fas fa-check text-success me-2"></i>Chain adjustment</li>
                    <li><i class="fas fa-check text-success me-2"></i>Tire replacement</li>
                    <li><i class="fas fa-check text-success me-2"></i>Electrical issues</li>
                </ul>
            </div>
        </div>
        
        <div class="col-lg-3 col-md-6">
            <div class="service-card text-center">
                <div class="service-icon">
                    <i class="fas fa-truck text-info"></i>
                </div>
                <h5>Heavy Vehicles</h5>
                <p class="text-muted">Truck and heavy vehicle maintenance</p>
                <ul class="list-unstyled text-start">
                    <li><i class="fas fa-check text-success me-2"></i>Hydraulic systems</li>
                    <li><i class="fas fa-check text-success me-2"></i>Transmission repair</li>
                    <li><i class="fas fa-check text-success me-2"></i>Suspension work</li>
                    <li><i class="fas fa-check text-success me-2"></i>Air brake service</li>
                </ul>
            </div>
        </div>
        
        <div class="col-lg-3 col-md-6">
            <div class="service-card text-center">
                <div class="service-icon">
                    <i class="fas fa-tools text-success"></i>
                </div>
                <h5>Emergency Service</h5>
                <p class="text-muted">24/7 emergency roadside assistance</p>
                <ul class="list-unstyled text-start">
                    <li><i class="fas fa-check text-success me-2"></i>Jump start service</li>
                    <li><i class="fas fa-check text-success me-2"></i>Flat tire change</li>
                    <li><i class="fas fa-check text-success me-2"></i>Lockout assistance</li>
                    <li><i class="fas fa-check text-success me-2"></i>Towing service</li>
                </ul>
            </div>
        </div>
    </div>
    
    <div class="row">
        <!-- Service Request Form -->
        <div class="col-lg-8">
            <div class="card">
                <div class="card-header">
                    <h4 class="mb-0"><i class="fas fa-clipboard-list me-2"></i>Request Service</h4>
                </div>
                <div class="card-body">
                    <form id="serviceForm" action="api/request_service.php" method="POST" data-validate>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group mb-3">
                                    <label for="customerName" class="form-label">
                                        <i class="fas fa-user me-2"></i>Your Name *
                                    </label>
                                    <input type="text" 
                                           class="form-control" 
                                           id="customerName" 
                                           name="customerName" 
                                           placeholder="Enter your full name"
                                           data-rules="required|minLength:2"
                                           <?php if (isLoggedIn()): ?>
                                               value="<?php echo htmlspecialchars($_SESSION['name']); ?>"
                                           <?php endif; ?>
                                           required>
                                </div>
                            </div>
                            
                            <div class="col-md-6">
                                <div class="form-group mb-3">
                                    <label for="customerPhone" class="form-label">
                                        <i class="fas fa-phone me-2"></i>Phone Number *
                                    </label>
                                    <input type="tel" 
                                           class="form-control" 
                                           id="customerPhone" 
                                           name="customerPhone" 
                                           placeholder="+1 (555) 123-4567"
                                           data-rules="required|phone"
                                           required>
                                </div>
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group mb-3">
                                    <label for="vehicleType" class="form-label">
                                        <i class="fas fa-car me-2"></i>Vehicle Type *
                                    </label>
                                    <select class="form-select" 
                                            id="vehicleType" 
                                            name="vehicleType" 
                                            data-rules="required"
                                            required>
                                        <option value="">Select vehicle type</option>
                                        <option value="car">Car</option>
                                        <option value="bike">Motorcycle/Bike</option>
                                        <option value="truck">Truck</option>
                                        <option value="van">Van</option>
                                        <option value="bus">Bus</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="col-md-6">
                                <div class="form-group mb-3">
                                    <label for="urgency" class="form-label">
                                        <i class="fas fa-exclamation-triangle me-2"></i>Urgency Level
                                    </label>
                                    <select class="form-select" id="urgency" name="urgency">
                                        <option value="normal">Normal</option>
                                        <option value="urgent">Urgent</option>
                                        <option value="emergency">Emergency (24/7)</option>
                                    </select>
                                </div>
                            </div>