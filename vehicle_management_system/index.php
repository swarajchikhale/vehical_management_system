<?php
$pageTitle = 'Home';
require_once 'includes/header.php';
?>

<div class="container-fluid p-0">
    <!-- Hero Section -->
    <section class="hero bg-gradient text-white text-center py-5">
        <div class="container">
            <div class="row align-items-center min-vh-100">
                <div class="col-lg-6">
                    <h1 class="display-4 fw-bold mb-4 fade-in">
                        Vehicle Management System
                    </h1>
                    <p class="lead mb-4 fade-in">
                        Your one-stop solution for vehicle rental and professional mechanic services. 
                        Quality vehicles, expert mechanics, and transparent pricing.
                    </p>
                    <div class="d-flex flex-column flex-md-row gap-3 justify-content-center fade-in">
                        <a href="vehicles.php" class="btn btn-primary btn-lg px-4">
                            <i class="fas fa-car me-2"></i>Rent a Vehicle
                        </a>
                        <a href="mechanic_service.php" class="btn btn-outline-light btn-lg px-4">
                            <i class="fas fa-tools me-2"></i>Get Service
                        </a>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="hero-image fade-in">
                        <i class="fas fa-car-side" style="font-size: 15rem; opacity: 0.8;"></i>
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>

<!-- Services Section -->
<section class="py-5">
    <div class="container">
        <div class="text-center mb-5">
            <h2 class="display-5 fw-bold text-gradient">Our Services</h2>
            <p class="lead text-muted">Everything you need for your vehicle needs</p>
        </div>
        
        <div class="service-grid">
            <div class="service-card">
                <div class="service-icon">
                    <i class="fas fa-car text-primary"></i>
                </div>
                <h3 class="h4 mb-3">Vehicle Rental</h3>
                <p class="text-muted mb-4">
                    Choose from our extensive fleet of cars, bikes, trucks, and vans. 
                    All vehicles are well-maintained and available at competitive rates.
                </p>
                <ul class="list-unstyled text-start mb-4">
                    <li><i class="fas fa-check text-success me-2"></i>Wide variety of vehicles</li>
                    <li><i class="fas fa-check text-success me-2"></i>Competitive pricing</li>
                    <li><i class="fas fa-check text-success me-2"></i>24/7 support</li>
                    <li><i class="fas fa-check text-success me-2"></i>Insurance included</li>
                </ul>
                <a href="vehicles.php" class="btn btn-primary">Browse Vehicles</a>
            </div>
            
            <div class="service-card">
                <div class="service-icon">
                    <i class="fas fa-tools text-warning"></i>
                </div>
                <h3 class="h4 mb-3">Mechanic Services</h3>
                <p class="text-muted mb-4">
                    Professional mechanics available round the clock to fix all your vehicle problems. 
                    From minor repairs to major overhauls.
                </p>
                <ul class="list-unstyled text-start mb-4">
                    <li><i class="fas fa-check text-success me-2"></i>Certified mechanics</li>
                    <li><i class="fas fa-check text-success me-2"></i>On-site service</li>
                    <li><i class="fas fa-check text-success me-2"></i>Quality parts</li>
                    <li><i class="fas fa-check text-success me-2"></i>Warranty included</li>
                </ul>
                <a href="mechanic_service.php" class="btn btn-warning">Request Service</a>
            </div>
            
            <div class="service-card">
                <div class="service-icon">
                    <i class="fas fa-file-invoice text-info"></i>
                </div>
                <h3 class="h4 mb-3">Easy Billing</h3>
                <p class="text-muted mb-4">
                    Transparent billing system with instant invoice generation. 
                    Multiple payment options available for your convenience.
                </p>
                <ul class="list-unstyled text-start mb-4">
                    <li><i class="fas fa-check text-success me-2"></i>Instant invoices</li>
                    <li><i class="fas fa-check text-success me-2"></i>Multiple payment methods</li>
                    <li><i class="fas fa-check text-success me-2"></i>Digital receipts</li>
                    <li><i class="fas fa-check text-success me-2"></i>Billing history</li>
                </ul>
                <?php if (isLoggedIn()): ?>
                    <a href="<?php echo ($_SESSION['role'] === 'admin') ? 'admin/' : 'user/'; ?>dashboard.php" class="btn btn-info">View Bills</a>
                <?php else: ?>
                    <a href="login.php" class="btn btn-info">Login to View Bills</a>
                <?php endif; ?>
            </div>
        </div>
    </div>
</section>

<!-- Features Section -->
<section class="py-5 bg-light">
    <div class="container">
        <div class="text-center mb-5">
            <h2 class="display-5 fw-bold">Why Choose Us?</h2>
            <p class="lead text-muted">We provide the best service in the industry</p>
        </div>
        
        <div class="row g-4">
            <div class="col-md-6 col-lg-3">
                <div class="text-center p-4">
                    <div class="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px;">
                        <i class="fas fa-shield-alt fa-2x"></i>
                    </div>
                    <h5>Trusted & Secure</h5>
                    <p class="text-muted">All transactions are secure and your data is protected</p>
                </div>
            </div>
            
            <div class="col-md-6 col-lg-3">
                <div class="text-center p-4">
                    <div class="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px;">
                        <i class="fas fa-clock fa-2x"></i>
                    </div>
                    <h5>24/7 Available</h5>
                    <p class="text-muted">Round the clock service and support for all your needs</p>
                </div>
            </div>
            
            <div class="col-md-6 col-lg-3">
                <div class="text-center p-4">
                    <div class="bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px;">
                        <i class="fas fa-star fa-2x"></i>
                    </div>
                    <h5>Quality Service</h5>
                    <p class="text-muted">Top-notch service quality with customer satisfaction guarantee</p>
                </div>
            </div>
            
            <div class="col-md-6 col-lg-3">
                <div class="text-center p-4">
                    <div class="bg-info text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px;">
                        <i class="fas fa-dollar-sign fa-2x"></i>
                    </div>
                    <h5>Best Prices</h5>
                    <p class="text-muted">Competitive pricing with no hidden charges</p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Statistics Section -->
<section class="py-5">
    <div class="container">
        <div class="row g-4">
            <div class="col-md-3 col-sm-6">
                <div class="stat-card text-center">
                    <div class="stat-number"><?php echo count(getAvailableVehicles()); ?>+</div>
                    <div class="stat-label">Available Vehicles</div>
                </div>
            </div>
            <div class="col-md-3 col-sm-6">
                <div class="stat-card text-center">
                    <div class="stat-number"><?php echo count(getAllBookings()); ?>+</div>
                    <div class="stat-label">Happy Customers</div>
                </div>
            </div>
            <div class="col-md-3 col-sm-6">
                <div class="stat-card text-center">
                    <div class="stat-number"><?php echo count(getAllServices()); ?>+</div>
                    <div class="stat-label">Services Completed</div>
                </div>
            </div>
            <div class="col-md-3 col-sm-6">
                <div class="stat-card text-center">
                    <div class="stat-number">24/7</div>
                    <div class="stat-label">Support Available</div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Recent Vehicles Section -->
<section class="py-5 bg-light">
    <div class="container">
        <div class="d-flex justify-content-between align-items-center mb-5">
            <div>
                <h2 class="display-5 fw-bold">Featured Vehicles</h2>
                <p class="lead text-muted">Check out our most popular vehicles</p>
            </div>
            <a href="vehicles.php" class="btn btn-primary">View All Vehicles</a>
        </div>
        
        <div class="vehicle-grid">
            <?php
            $featuredVehicles = array_slice(getAvailableVehicles(), 0, 3);
            foreach ($featuredVehicles as $vehicle):
            ?>
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
                                ($vehicle['vehicle_type'] === 'truck' ? 'truck' : 'bus')); 
                        ?> fa-3x"></i>
                    <?php endif; ?>
                </div>
                <div class="vehicle-info">
                    <h5 class="card-title"><?php echo htmlspecialchars($vehicle['vehicle_name']); ?></h5>
                    <p class="text-muted">
                        <i class="fas fa-tag me-2"></i><?php echo ucfirst($vehicle['vehicle_type']); ?>
                        <?php if ($vehicle['year']): ?>
                            <span class="ms-2"><i class="fas fa-calendar me-1"></i><?php echo $vehicle['year']; ?></span>
                        <?php endif; ?>
                    </p>
                    <div class="price"><?php echo formatCurrency($vehicle['rent_price']); ?>/day</div>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <?php echo getStatusBadge($vehicle['status']); ?>
                        <?php if ($vehicle['status'] === 'available'): ?>
                            <a href="vehicles.php?vehicle=<?php echo $vehicle['id']; ?>" class="btn btn-primary btn-sm">
                                <i class="fas fa-calendar-check me-1"></i>Book Now
                            </a>
                        <?php else: ?>
                            <button class="btn btn-secondary btn-sm" disabled>
                                <i class="fas fa-ban me-1"></i>Not Available
                            </button>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- Call to Action Section -->
<section class="py-5 text-white" style="background: var(--gradient-primary);">
    <div class="container text-center">
        <h2 class="display-5 fw-bold mb-4">Ready to Get Started?</h2>
        <p class="lead mb-4">Join thousands of satisfied customers who trust us with their vehicle needs</p>
        <div class="d-flex flex-column flex-md-row gap-3 justify-content-center">
            <?php if (!isLoggedIn()): ?>
                <a href="register.php" class="btn btn-light btn-lg px-5">
                    <i class="fas fa-user-plus me-2"></i>Register Now
                </a>
                <a href="login.php" class="btn btn-outline-light btn-lg px-5">
                    <i class="fas fa-sign-in-alt me-2"></i>Already have an account?
                </a>
            <?php else: ?>
                <a href="vehicles.php" class="btn btn-light btn-lg px-5">
                    <i class="fas fa-car me-2"></i>Browse Vehicles
                </a>
                <a href="mechanic_service.php" class="btn btn-outline-light btn-lg px-5">
                    <i class="fas fa-tools me-2"></i>Request Service
                </a>
            <?php endif; ?>
        </div>
    </div>
</section>

<?php
$additionalScripts = '
<script>
    // Initialize animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("fade-in");
            }
        });
    }, observerOptions);
    
    // Observe all cards and sections
    document.querySelectorAll(".service-card, .vehicle-card, .stat-card").forEach(el => {
        observer.observe(el);
    });
</script>
';

require_once 'includes/footer.php';
?>