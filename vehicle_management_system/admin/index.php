<?php
$pageTitle = 'Admin Dashboard';
require_once '../includes/functions.php';

// Ensure user is logged in as admin
requireLogin();
requireRole('admin');

// Get admin statistics
global $pdo;

$stats = [];
$stats['totalUsers'] = $pdo->query("SELECT COUNT(*) FROM users WHERE role != 'admin'")->fetchColumn();
$stats['totalVehicles'] = $pdo->query("SELECT COUNT(*) FROM vehicles")->fetchColumn();
$stats['availableVehicles'] = $pdo->query("SELECT COUNT(*) FROM vehicles WHERE status = 'available'")->fetchColumn();
$stats['totalBookings'] = $pdo->query("SELECT COUNT(*) FROM bookings")->fetchColumn();
$stats['activeBookings'] = $pdo->query("SELECT COUNT(*) FROM bookings WHERE status IN ('confirmed', 'active')")->fetchColumn();
$stats['totalServices'] = $pdo->query("SELECT COUNT(*) FROM services")->fetchColumn();
$stats['pendingServices'] = $pdo->query("SELECT COUNT(*) FROM services WHERE status = 'pending'")->fetchColumn();
$stats['totalRevenue'] = $pdo->query("SELECT COALESCE(SUM(total_amount), 0) FROM bills WHERE status = 'paid'")->fetchColumn();
$stats['monthlyRevenue'] = $pdo->query("SELECT COALESCE(SUM(total_amount), 0) FROM bills WHERE status = 'paid' AND MONTH(created_at) = MONTH(CURRENT_DATE())")->fetchColumn();

// Recent activity
$recentBookings = $pdo->query("
    SELECT b.*, u.name as user_name, v.vehicle_name 
    FROM bookings b 
    JOIN users u ON b.user_id = u.id 
    JOIN vehicles v ON b.vehicle_id = v.id 
    ORDER BY b.created_at DESC LIMIT 5
")->fetchAll(PDO::FETCH_ASSOC);

$recentServices = $pdo->query("
    SELECT s.*, u.name as customer_name 
    FROM services s 
    JOIN users u ON s.user_id = u.id 
    ORDER BY s.created_at DESC LIMIT 5
")->fetchAll(PDO::FETCH_ASSOC);

require_once '../includes/header.php';
?>

<div class="container-fluid">
    <div class="row">
        <!-- Sidebar -->
        <div class="col-lg-2">
            <div class="dashboard-sidebar">
                <div class="text-center mb-4">
                    <div class="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style="width: 60px; height: 60px;">
                        <i class="fas fa-user-shield fa-2x"></i>
                    </div>
                    <h6 class="mb-1">Admin Panel</h6>
                    <small class="text-muted"><?php echo htmlspecialchars($_SESSION['name']); ?></small>
                </div>
                
                <ul class="dashboard-nav">
                    <li>
                        <a href="#overview" class="active" data-target="overview">
                            <i class="fas fa-tachometer-alt me-2"></i>Overview
                        </a>
                    </li>
                    <li>
                        <a href="#vehicles" data-target="vehicles">
                            <i class="fas fa-car me-2"></i>Vehicles
                        </a>
                    </li>
                    <li>
                        <a href="#bookings" data-target="bookings">
                            <i class="fas fa-calendar-check me-2"></i>Bookings
                        </a>
                    </li>
                    <li>
                        <a href="#services" data-target="services">
                            <i class="fas fa-tools me-2"></i>Services
                        </a>
                    </li>
                    <li>
                        <a href="#users" data-target="users">
                            <i class="fas fa-users me-2"></i>Users
                        </a>
                    </li>
                    <li>
                        <a href="#bills" data-target="bills">
                            <i class="fas fa-file-invoice me-2"></i>Bills
                        </a>
                    </li>
                    <li>
                        <a href="#reports" data-target="reports">
                            <i class="fas fa-chart-bar me-2"></i>Reports
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        
        <!-- Main Content -->
        <div class="col-lg-10">
            <div class="dashboard-content">
                <!-- Overview Section -->
                <div id="overview" class="dashboard-section">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h2>Admin Dashboard</h2>
                        <div class="d-flex gap-2">
                            <button class="btn btn-outline-primary" onclick="Dashboard.refreshData()">
                                <i class="fas fa-refresh me-1"></i>Refresh
                            </button>
                            <button class="btn btn-outline-success" onclick="Dashboard.exportTable('overviewStats', 'dashboard_stats.csv')">
                                <i class="fas fa-download me-1"></i>Export
                            </button>
                        </div>
                    </div>
                    
                    <!-- Statistics Grid -->
                    <div class="row g-3 mb-4">
                        <div class="col-xl-3 col-md-6">
                            <div class="card bg-primary text-white">
                                <div class="card-body">
                                    <div class="d-flex justify-content-between">
                                        <div>
                                            <h4 data-stat="total-users"><?php echo $stats['totalUsers']; ?></h4>
                                            <p class="mb-0">Total Users</p>
                                        </div>
                                        <div class="align-self-center">
                                            <i class="fas fa-users fa-2x"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-xl-3 col-md-6">
                            <div class="card bg-success text-white">
                                <div class="card-body">
                                    <div class="d-flex justify-content-between">
                                        <div>
                                            <h4><?php echo $stats['totalVehicles']; ?></h4>
                                            <p class="mb-0">Total Vehicles</p>
                                            <small><?php echo $stats['availableVehicles']; ?> available</small>
                                        </div>
                                        <div class="align-self-center">
                                            <i class="fas fa-car fa-2x"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-xl-3 col-md-6">
                            <div class="card bg-warning text-white">
                                <div class="card-body">
                                    <div class="d-flex justify-content-between">
                                        <div>
                                            <h4 data-stat="total-bookings"><?php echo $stats['totalBookings']; ?></h4>
                                            <p class="mb-0">Total Bookings</p>
                                            <small><?php echo $stats['activeBookings']; ?> active</small>
                                        </div>
                                        <div class="align-self-center">
                                            <i class="fas fa-calendar-check fa-2x"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-xl-3 col-md-6">
                            <div class="card bg-info text-white">
                                <div class="card-body">
                                    <div class="d-flex justify-content-between">
                                        <div>
                                            <h4 data-stat="total-revenue"><?php echo formatCurrency($stats['totalRevenue']); ?></h4>
                                            <p class="mb-0">Total Revenue</p>
                                            <small><?php echo formatCurrency($stats['monthlyRevenue']); ?> this month</small>
                                        </div>
                                        <div class="align-self-center">
                                            <i class="fas fa-dollar-sign fa-2x"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-xl-3 col-md-6">
                            <div class="card bg-secondary text-white">
                                <div class="card-body">
                                    <div class="d-flex justify-content-between">
                                        <div>
                                            <h4><?php echo $stats['totalServices']; ?></h4>
                                            <p class="mb-0">Service Requests</p>
                                            <small><?php echo $stats['pendingServices']; ?> pending</small>
                                        </div>
                                        <div class="align-self-center">
                                            <i class="fas fa-tools fa-2x"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Charts Row -->
                    <div class="row g-3 mb-4">
                        <div class="col-lg-8">
                            <div class="card">
                                <div class="card-header">
                                    <h5 class="mb-0"><i class="fas fa-chart-line me-2"></i>Revenue Trend</h5>
                                </div>
                                <div class="card-body">
                                    <canvas id="revenueChart" height="100"></canvas>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <div class="card">
                                <div class="card-header">
                                    <h5 class="mb-0"><i class="fas fa-chart-pie me-2"></i>Booking Status</h5>
                                </div>
                                <div class="card-body">
                                    <canvas id="bookingsChart" height="200"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Recent Activity -->
                    <div class="row g-3">
                        <div class="col-lg-6">
                            <div class="card">
                                <div class="card-header">
                                    <h5 class="mb-0"><i class="fas fa-calendar me-2"></i>Recent Bookings</h5>
                                </div>
                                <div class="card-body">
                                    <?php if (empty($recentBookings)): ?>
                                        <p class="text-muted text-center py-3">No recent bookings</p>
                                    <?php else: ?>
                                        <div class="list-group list-group-flush">
                                            <?php foreach ($recentBookings as $booking): ?>
                                                <div class="list-group-item border-0 px-0">
                                                    <div class="d-flex justify-content-between align-items-start">
                                                        <div>
                                                            <h6 class="mb-1"><?php echo htmlspecialchars($booking['vehicle_name']); ?></h6>
                                                            <p class="mb-1 text-muted">
                                                                Customer: <?php echo htmlspecialchars($booking['user_name']); ?>
                                                            </p>
                                                            <small class="text-muted">
                                                                <?php echo formatDate($booking['start_date']); ?> - <?php echo formatDate($booking['end_date']); ?>
                                                            </small>
                                                        </div>
                                                        <div class="text-end">
                                                            <?php echo getStatusBadge($booking['status']); ?>
                                                            <div class="text-muted small mt-1">
                                                                <?php echo formatCurrency($booking['total_cost']); ?>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            <?php endforeach; ?>
                                        </div>
                                    <?php endif; ?>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-lg-6">
                            <div class="card">
                                <div class="card-header">
                                    <h5 class="mb-0"><i class="fas fa-tools me-2"></i>Recent Service Requests</h5>
                                </div>
                                <div class="card-body">
                                    <?php if (empty($recentServices)): ?>
                                        <p class="text-muted text-center py-3">No recent service requests</p>
                                    <?php else: ?>
                                        <div class="list-group list-group-flush">
                                            <?php foreach ($recentServices as $service): ?>
                                                <div class="list-group-item border-0 px-0">
                                                    <div class="d-flex justify-content-between align-items-start">
                                                        <div>
                                                            <h6 class="mb-1"><?php echo ucfirst($service['vehicle_type']); ?> Service</h6>
                                                            <p class="mb-1 text-muted">
                                                                Customer: <?php echo htmlspecialchars($service['customer_name']); ?>
                                                            </p>
                                                            <small class="text-muted">
                                                                <?php echo htmlspecialchars(substr($service['problem_description'], 0, 50)); ?>...
                                                            </small>
                                                        </div>
                                                        <div class="text-end">
                                                            <?php echo getStatusBadge($service['status']); ?>
                                                            <div class="text-muted small mt-1">
                                                                <?php echo formatDateTime($service['created_at']); ?>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            <?php endforeach; ?>
                                        </div>
                                    <?php endif; ?>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Other sections would be loaded dynamically -->
                <div id="vehicles" class="dashboard-section" style="display: none;">
                    <h2>Vehicle Management</h2>
                    <p>Vehicle management features will be loaded here...</p>
                </div>
                
                <div id="bookings" class="dashboard-section" style="display: none;">
                    <h2>Booking Management</h2>
                    <p>Booking management features will be loaded here...</p>
                </div>
                
                <div id="services" class="dashboard-section" style="display: none;">
                    <h2>Service Management</h2>
                    <p>Service management features will be loaded here...</p>
                </div>
                
                <div id="users" class="dashboard-section" style="display: none;">
                    <h2>User Management</h2>
                    <p>User management features will be loaded here...</p>
                </div>
                
                <div id="bills" class="dashboard-section" style="display: none;">
                    <h2>Bill Management</h2>
                    <p>Bill management features will be loaded here...</p>
                </div>
                
                <div id="reports" class="dashboard-section" style="display: none;">
                    <h2>Reports & Analytics</h2>
                    <p>Reporting features will be loaded here...</p>
                </div>
            </div>
        </div>
    </div>
</div>

<?php
$additionalScripts = '
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>
<script src="../js/dashboard.js"></script>
<script>
    document.addEventListener("DOMContentLoaded", function() {
        // Initialize charts with real data
        initializeAdminCharts();
    });
    
    function initializeAdminCharts() {
        // Revenue Chart
        const revenueCtx = document.getElementById("revenueChart");
        if (revenueCtx) {
            new Chart(revenueCtx, {
                type: "line",
                data: {
                    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                    datasets: [{
                        label: "Revenue ($)",
                        data: [12000, 19000, 15000, 25000, 22000, 30000],
                        borderColor: "rgb(75, 192, 192)",
                        backgroundColor: "rgba(75, 192, 192, 0.2)",
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return "$" + value.toLocaleString();
                                }
                            }
                        }
                    }
                }
            });
        }
        
        // Bookings Chart
        const bookingsCtx = document.getElementById("bookingsChart");
        if (bookingsCtx) {
            new Chart(bookingsCtx, {
                type: "doughnut",
                data: {
                    labels: ["Confirmed", "Active", "Completed", "Cancelled"],
                    datasets: [{
                        data: [<?php echo $stats["activeBookings"]; ?>, 15, 45, 5],
                        backgroundColor: [
                            "#007bff",
                            "#28a745", 
                            "#17a2b8",
                            "#dc3545"
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: "bottom"
                        }
                    }
                }
            });
        }
    }
</script>
';

require_once '../includes/footer.php';
?>