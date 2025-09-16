// Dashboard functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    // Initialize navigation
    const navLinks = document.querySelectorAll('.dashboard-nav a');
    const sections = document.querySelectorAll('.dashboard-section');
    
    // Add click handlers to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('data-target');
            if (targetId) {
                showDashboardSection(targetId);
                
                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Update URL hash without triggering scroll
                history.pushState(null, null, '#' + targetId);
            }
        });
    });
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', function() {
        const hash = window.location.hash.substr(1);
        if (hash) {
            showDashboardSection(hash);
            updateActiveNavLink(hash);
        }
    });
    
    // Show section based on URL hash on page load
    const initialHash = window.location.hash.substr(1);
    if (initialHash && document.getElementById(initialHash)) {
        showDashboardSection(initialHash);
        updateActiveNavLink(initialHash);
    }
    
    // Initialize data tables
    initializeDashboardTables();
    
    // Initialize charts if available
    initializeDashboardCharts();
    
    // Auto-refresh data periodically
    setInterval(refreshDashboardData, 300000); // 5 minutes
}

function showDashboardSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.style.display = 'none';
        section.classList.remove('fade-in');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
        targetSection.classList.add('fade-in');
        
        // Load section-specific data if needed
        loadSectionData(sectionId);
    }
}

function updateActiveNavLink(sectionId) {
    document.querySelectorAll('.dashboard-nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-target') === sectionId) {
            link.classList.add('active');
        }
    });
}

function loadSectionData(sectionId) {
    switch (sectionId) {
        case 'overview':
            loadOverviewData();
            break;
        case 'bookings':
            loadBookingsData();
            break;
        case 'services':
            loadServicesData();
            break;
        case 'bills':
            loadBillsData();
            break;
        case 'vehicles':
            loadVehiclesData();
            break;
        case 'users':
            loadUsersData();
            break;
    }
}

function initializeDashboardTables() {
    // Initialize sortable tables
    const tables = document.querySelectorAll('table[id]');
    tables.forEach(table => {
        if (table.id) {
            initializeDataTable(table.id);
        }
    });
}

function initializeDashboardCharts() {
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx && typeof Chart !== 'undefined') {
        new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Revenue',
                    data: [12000, 19000, 15000, 25000, 22000, 30000],
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
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
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Bookings Chart
    const bookingsCtx = document.getElementById('bookingsChart');
    if (bookingsCtx && typeof Chart !== 'undefined') {
        new Chart(bookingsCtx, {
            type: 'doughnut',
            data: {
                labels: ['Confirmed', 'Active', 'Completed', 'Cancelled'],
                datasets: [{
                    data: [30, 20, 45, 5],
                    backgroundColor: [
                        '#007bff',
                        '#28a745',
                        '#17a2b8',
                        '#dc3545'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

function refreshDashboardData() {
    // Refresh dashboard statistics
    fetch('api/get_dashboard_stats.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                updateDashboardStats(data.stats);
            }
        })
        .catch(error => {
            console.error('Error refreshing dashboard data:', error);
        });
}

function updateDashboardStats(stats) {
    // Update stat cards
    const statElements = {
        totalBookings: document.querySelector('[data-stat="total-bookings"]'),
        totalRevenue: document.querySelector('[data-stat="total-revenue"]'),
        activeRentals: document.querySelector('[data-stat="active-rentals"]'),
        totalUsers: document.querySelector('[data-stat="total-users"]')
    };
    
    if (statElements.totalBookings) statElements.totalBookings.textContent = stats.totalBookings || 0;
    if (statElements.totalRevenue) statElements.totalRevenue.textContent = '$' + (stats.totalRevenue || 0).toLocaleString();
    if (statElements.activeRentals) statElements.activeRentals.textContent = stats.activeRentals || 0;
    if (statElements.totalUsers) statElements.totalUsers.textContent = stats.totalUsers || 0;
}

// Data loading functions
function loadOverviewData() {
    console.log('Loading overview data...');
    // Implementation for loading overview data
}

function loadBookingsData() {
    console.log('Loading bookings data...');
    // Implementation for loading bookings data
}

function loadServicesData() {
    console.log('Loading services data...');
    // Implementation for loading services data
}

function loadBillsData() {
    console.log('Loading bills data...');
    // Implementation for loading bills data
}

function loadVehiclesData() {
    console.log('Loading vehicles data...');
    // Implementation for loading vehicles data
}

function loadUsersData() {
    console.log('Loading users data...');
    // Implementation for loading users data
}

// Export/Print functions
function exportTableToCSV(tableId, filename) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    let csv = [];
    const rows = table.querySelectorAll('tr');
    
    for (let i = 0; i < rows.length; i++) {
        const row = [];
        const cols = rows[i].querySelectorAll('td, th');
        
        for (let j = 0; j < cols.length; j++) {
            let cellText = cols[j].textContent.trim();
            cellText = cellText.replace(/"/g, '""'); // Escape quotes
            row.push('"' + cellText + '"');
        }
        
        csv.push(row.join(','));
    }
    
    // Download CSV
    const csvContent = csv.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename || 'export.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

function printDashboard() {
    window.print();
}

// Real-time notifications
function initializeNotifications() {
    // Check for new notifications periodically
    setInterval(checkNotifications, 30000); // 30 seconds
}

function checkNotifications() {
    fetch('api/get_notifications.php')
        .then(response => response.json())
        .then(data => {
            if (data.success && data.notifications.length > 0) {
                showNotifications(data.notifications);
            }
        })
        .catch(error => {
            console.error('Error checking notifications:', error);
        });
}

function showNotifications(notifications) {
    const container = document.getElementById('notificationContainer') || document.body;
    
    notifications.forEach(notification => {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${notification.type} alert-dismissible fade show position-fixed`;
        alertDiv.style.cssText = 'top: 100px; right: 20px; z-index: 9999; width: 300px;';
        alertDiv.innerHTML = `
            <strong>${notification.title}</strong><br>
            ${notification.message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        container.appendChild(alertDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                const bsAlert = new bootstrap.Alert(alertDiv);
                bsAlert.close();
            }
        }, 5000);
    });
}

// Quick actions
function quickBookVehicle() {
    window.location.href = 'vehicles.php';
}

function quickRequestService() {
    window.location.href = 'mechanic_service.php';
}

function quickAddVehicle() {
    const modal = document.getElementById('addVehicleModal');
    if (modal) {
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    }
}

function quickAddUser() {
    const modal = document.getElementById('addUserModal');
    if (modal) {
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    }
}

// Search functionality
function initializeDashboardSearch() {
    const searchInput = document.getElementById('dashboardSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            searchDashboard(query);
        });
    }
}

function searchDashboard(query) {
    if (!query.trim()) return;
    
    // Search in tables
    const tables = document.querySelectorAll('.dashboard-section table tbody tr');
    tables.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(query)) {
            row.style.display = '';
            row.classList.add('highlight-search');
        } else {
            row.style.display = 'none';
        }
    });
    
    // Search in cards
    const cards = document.querySelectorAll('.dashboard-section .card');
    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(query)) {
            card.style.display = '';
            card.classList.add('highlight-search');
        } else {
            card.style.display = 'none';
        }
    });
}

function clearDashboardSearch() {
    // Show all hidden elements
    document.querySelectorAll('[style*="display: none"]').forEach(el => {
        el.style.display = '';
    });
    
    // Remove highlight classes
    document.querySelectorAll('.highlight-search').forEach(el => {
        el.classList.remove('highlight-search');
    });
    
    // Clear search input
    const searchInput = document.getElementById('dashboardSearch');
    if (searchInput) searchInput.value = '';
}

// Keyboard shortcuts
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + specific keys
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'n': // New booking
                    e.preventDefault();
                    quickBookVehicle();
                    break;

                case 's': // Search
                    e.preventDefault();
                    const searchInput = document.getElementById('dashboardSearch');
                    if (searchInput) searchInput.focus();
                    break;
            }
        }
    });
}
