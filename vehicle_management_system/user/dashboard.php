<?php
$pageTitle = 'My Dashboard';
require_once '../includes/functions.php';

// Ensure user is logged in
requireLogin();
requireRole('user');

// Get user data
$user = getCurrentUser();
$userBookings = getUserBookings($_SESSION['user_id']);
$userServices = getUserServices($_SESSION['user_id']);
$userBills = getUserBills($_SESSION['user_id']);

require_once '../includes/header.php';
?>

<div class="container">
    <div class="row">
        <!-- Sidebar -->
        <div class="col-lg-3">
            <div class="dashboard-sidebar">
                <div class="text-center mb-4">
                    <div class="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style="width: 60px; height: 60px;">
                        <i class="fas fa-user fa-2x"></i>
                    </div>
                    <h5 class="mb-1"><?php echo htmlspecialchars($user['name']); ?></h5>
                    <small class="text-muted"><?php echo ucfirst($user['role']); ?></small>
                </div>
                
                <ul class="dashboard-nav">
                    <li>
                        <a href="#overview" class="active" data-target="overview">
                            <i class="fas fa-tachometer-alt me-2"></i>Overview
                        </a>
                    </li>
                    <li>
                        <a href="#bookings" data-target="bookings">
                            <i class="fas fa-calendar-check me-2"></i>My Bookings
                        </a>
                    </li>
                    <li>
                        <a href="#services" data-target="services">
                            <i class="fas fa-tools me-2"></i>Service Requests
                        </a>
                    </li>
                    <li>
                        <a href="#bills" data-target="bills">
                            <i class="fas fa-file-invoice me-2"></i>Bills & Payments
                        </a>
                    </li>
                    <li>
                        <a href="#profile" data-target="profile">
                            <i class="fas fa-user-edit me-2"></i>Profile Settings
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        
        <!-- Main Content -->
        <div class="col-lg-9">
            <div class="dashboard-content">
                <!-- Overview Section -->
                <div id="overview" class="dashboard-section">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h2>Dashboard Overview</h2>
                        <small class="text-muted">Welcome back, <?php echo htmlspecialchars($user['name']); ?>!</small>
                    </div>
                    
                    <!-- Statistics Cards -->
                    <div class="row g-3 mb-4">
                        <div class="col-md-3">
                            <div class="card bg-primary text-white">
                                <div class="card-body text-center">
                                    <i class="fas fa-calendar-check fa-2x mb-2"></i>
                                    <h4><?php echo count($userBookings); ?></h4>
                                    <small>Total Bookings</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card bg-warning text-white">
                                <div class="card-body text-center">
                                    <i class="fas fa-tools fa-2x mb-2"></i>
                                    <h4><?php echo count($userServices); ?></h4>
                                    <small>Service Requests</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card bg-success text-white">
                                <div class="card-body text-center">
                                    <i class="fas fa-car fa-2x mb-2"></i>
                                    <h4><?php echo count(array_filter($userBookings, fn($b) => $b['status'] === 'active')); ?></h4>
                                    <small>Active Rentals</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card bg-info text-white">
                                <div class="card-body text-center">
                                    <i class="fas fa-dollar-sign fa-2x mb-2"></i>
                                    <h4><?php echo formatCurrency(array_sum(array_column($userBills, 'total_amount'))); ?></h4>
                                    <small>Total Spent</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Quick Actions -->
                    <div class="card mb-4">
                        <div class="card-header">
                            <h5 class="mb-0"><i class="fas fa-bolt me-2"></i>Quick Actions</h5>
                        </div>
                        <div class="card-body">
                            <div class="row g-2">
                                <div class="col-md-3">
                                    <a href="../vehicles.php" class="btn btn-primary w-100">
                                        <i class="fas fa-car me-2"></i>Rent Vehicle
                                    </a>
                                </div>
                                <div class="col-md-3">
                                    <a href="../mechanic_service.php" class="btn btn-warning w-100">
                                        <i class="fas fa-tools me-2"></i>Request Service
                                    </a>
                                </div>
                                <div class="col-md-3">
                                    <a href="#bills" class="btn btn-info w-100" data-target="bills">
                                        <i class="fas fa-file-invoice me-2"></i>View Bills
                                    </a>
                                </div>
                                <div class="col-md-3">
                                    <a href="#profile" class="btn btn-success w-100" data-target="profile">
                                        <i class="fas fa-user-edit me-2"></i>Update Profile
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Recent Activity -->
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0"><i class="fas fa-history me-2"></i>Recent Activity</h5>
                        </div>
                        <div class="card-body">
                            <?php
                            $recentBookings = array_slice($userBookings, 0, 3);
                            $recentServices = array_slice($userServices, 0, 3);
                            $recentActivity = array_merge($recentBookings, $recentServices);
                            
                            // Sort by created_at
                            usort($recentActivity, function($a, $b) {
                                return strtotime($b['created_at']) - strtotime($a['created_at']);
                            });
                            
                            $recentActivity = array_slice($recentActivity, 0, 5);
                            ?>
                            
                            <?php if (empty($recentActivity)): ?>
                                <p class="text-muted text-center py-3">No recent activity</p>
                            <?php else: ?>
                                <div class="list-group list-group-flush">
                                    <?php foreach ($recentActivity as $activity): ?>
                                        <div class="list-group-item border-0 px-0">
                                            <div class="d-flex justify-content-between align-items-start">
                                                <div>
                                                    <?php if (isset($activity['vehicle_name'])): ?>
                                                        <h6 class="mb-1">
                                                            <i class="fas fa-car text-primary me-2"></i>
                                                            Vehicle Booking - <?php echo htmlspecialchars($activity['vehicle_name']); ?>
                                                        </h6>
                                                        <p class="mb-1 text-muted">
                                                            <?php echo formatDate($activity['start_date']); ?> to <?php echo formatDate($activity['end_date']); ?>
                                                        </p>
                                                        <?php echo getStatusBadge($activity['status']); ?>
                                                    <?php else: ?>
                                                        <h6 class="mb-1">
                                                            <i class="fas fa-tools text-warning me-2"></i>
                                                            Service Request - <?php echo ucfirst($activity['vehicle_type']); ?>
                                                        </h6>
                                                        <p class="mb-1 text-muted">
                                                            <?php echo htmlspecialchars(substr($activity['problem_description'], 0, 100)); ?>...
                                                        </p>
                                                        <?php echo getStatusBadge($activity['status']); ?>
                                                    <?php endif; ?>
                                                </div>
                                                <small class="text-muted"><?php echo formatDateTime($activity['created_at']); ?></small>
                                            </div>
                                        </div>
                                    <?php endforeach; ?>
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
                
                <!-- Bookings Section -->
                <div id="bookings" class="dashboard-section" style="display: none;">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h2>My Bookings</h2>
                        <a href="../vehicles.php" class="btn btn-primary">
                            <i class="fas fa-plus me-1"></i>New Booking
                        </a>
                    </div>
                    
                    <?php if (empty($userBookings)): ?>
                        <div class="text-center py-5">
                            <i class="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                            <h4>No bookings yet</h4>
                            <p class="text-muted">Start by renting a vehicle from our collection</p>
                            <a href="../vehicles.php" class="btn btn-primary">Browse Vehicles</a>
                        </div>
                    <?php else: ?>
                        <div class="table-responsive">
                            <table class="table table-hover" id="bookingsTable">
                                <thead class="table-dark">
                                    <tr>
                                        <th data-sortable>Booking ID</th>
                                        <th data-sortable>Vehicle</th>
                                        <th data-sortable>Dates</th>
                                        <th data-sortable>Duration</th>
                                        <th data-sortable>Amount</th>
                                        <th data-sortable>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($userBookings as $booking): ?>
                                        <tr>
                                            <td class="fw-bold">#<?php echo $booking['id']; ?></td>
                                            <td>
                                                <div>
                                                    <div class="fw-semibold"><?php echo htmlspecialchars($booking['vehicle_name']); ?></div>
                                                    <small class="text-muted"><?php echo ucfirst($booking['vehicle_type']); ?></small>
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <div><?php echo formatDate($booking['start_date']); ?></div>
                                                    <small class="text-muted">to <?php echo formatDate($booking['end_date']); ?></small>
                                                </div>
                                            </td>
                                            <td><?php echo $booking['total_days']; ?> day(s)</td>
                                            <td class="fw-semibold"><?php echo formatCurrency($booking['total_cost']); ?></td>
                                            <td><?php echo getStatusBadge($booking['status']); ?></td>
                                            <td>
                                                <div class="btn-group btn-group-sm">
                                                    <button class="btn btn-outline-primary" onclick="viewBookingDetails(<?php echo $booking['id']; ?>)">
                                                        <i class="fas fa-eye"></i>
                                                    </button>
                                                    <?php if (in_array($booking['status'], ['confirmed', 'pending'])): ?>
                                                        <button class="btn btn-outline-danger" onclick="cancelBooking(<?php echo $booking['id']; ?>)">
                                                            <i class="fas fa-times"></i>
                                                        </button>
                                                    <?php endif; ?>
                                                </div>
                                            </td>
                                        </tr>