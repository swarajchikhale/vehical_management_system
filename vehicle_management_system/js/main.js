// Vehicle Management System - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize popovers
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function(popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Auto-hide alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(function(alert) {
        if (alert.classList.contains('alert-success') || alert.classList.contains('alert-info')) {
            setTimeout(function() {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            }, 5000);
        }
    });

    // Add fade-in animation to cards
    const cards = document.querySelectorAll('.card, .service-card, .vehicle-card');
    cards.forEach(function(card, index) {
        card.style.animationDelay = (index * 0.1) + 's';
        card.classList.add('fade-in');
    });

    // Initialize dashboard navigation
    initializeDashboardNav();
    
    // Initialize booking modals
    initializeBookingModals();
    
    // Initialize date pickers
    initializeDatePickers();
    
    // Initialize form animations
    initializeFormAnimations();
});

// Dashboard Navigation
function initializeDashboardNav() {
    const navLinks = document.querySelectorAll('.dashboard-nav a');
    const contentSections = document.querySelectorAll('.dashboard-section');
    
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Hide all content sections
            contentSections.forEach(section => {
                section.style.display = 'none';
                section.classList.remove('fade-in');
            });
            
            // Show target section
            const targetId = this.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.style.display = 'block';
                targetSection.classList.add('fade-in');
            }
        });
    });
}

// Booking Modal Functions
function initializeBookingModals() {
    const bookingBtns = document.querySelectorAll('.book-vehicle-btn');
    
    bookingBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const vehicleId = this.getAttribute('data-vehicle-id');
            const vehicleName = this.getAttribute('data-vehicle-name');
            const vehiclePrice = this.getAttribute('data-vehicle-price');
            
            openBookingModal(vehicleId, vehicleName, vehiclePrice);
        });
    });
}

function openBookingModal(vehicleId, vehicleName, vehiclePrice) {
    const modal = document.getElementById('bookingModal');
    const modalTitle = modal.querySelector('.modal-title');
    const vehicleIdInput = modal.querySelector('#vehicleId');
    const vehicleNameSpan = modal.querySelector('#vehicleName');
    const vehiclePriceSpan = modal.querySelector('#vehiclePrice');
    
    modalTitle.textContent = `Book ${vehicleName}`;
    vehicleIdInput.value = vehicleId;
    vehicleNameSpan.textContent = vehicleName;
    vehiclePriceSpan.textContent = `$${vehiclePrice}/day`;
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    const startDateInput = modal.querySelector('#startDate');
    const endDateInput = modal.querySelector('#endDate');
    
    startDateInput.min = today;
    endDateInput.min = today;
    
    // Clear previous values
    startDateInput.value = '';
    endDateInput.value = '';
    
    const bookingModal = new bootstrap.Modal(modal);
    bookingModal.show();
    
    // Calculate total when dates change
    startDateInput.addEventListener('change', () => calculateBookingTotal(vehiclePrice));
    endDateInput.addEventListener('change', () => calculateBookingTotal(vehiclePrice));
}

function calculateBookingTotal(pricePerDay) {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const totalElement = document.getElementById('bookingTotal');
    
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (end >= start) {
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
            const total = days * parseFloat(pricePerDay);
            const tax = total * 0.18; // 18% tax
            const grandTotal = total + tax;
            
            totalElement.innerHTML = `
                <div class="border rounded p-3 mt-3">
                    <div class="d-flex justify-content-between">
                        <span>Rental (${days} days):</span>
                        <span>$${total.toFixed(2)}</span>
                    </div>
                    <div class="d-flex justify-content-between">
                        <span>Tax (18%):</span>
                        <span>$${tax.toFixed(2)}</span>
                    </div>
                    <hr>
                    <div class="d-flex justify-content-between fw-bold">
                        <span>Total:</span>
                        <span>$${grandTotal.toFixed(2)}</span>
                    </div>
                </div>
            `;
        } else {
            totalElement.innerHTML = '<div class="alert alert-danger">End date must be after start date</div>';
        }
    } else {
        totalElement.innerHTML = '';
    }
}

// Date Picker Initialization
function initializeDatePickers() {
    const dateInputs = document.querySelectorAll('input[type="date"]');
    
    dateInputs.forEach(function(input) {
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        if (input.hasAttribute('data-min-today')) {
            input.min = today;
        }
        
        // Add date validation
        input.addEventListener('change', function() {
            validateDate(this);
        });
    });
}

function validateDate(input) {
    const selectedDate = new Date(input.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (input.hasAttribute('data-min-today') && selectedDate < today) {
        showAlert('Please select a future date', 'warning');
        input.value = '';
        return false;
    }
    
    return true;
}

// Form Animations
function initializeFormAnimations() {
    const formInputs = document.querySelectorAll('.form-control');
    
    formInputs.forEach(function(input) {
        // Add focus/blur animations
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Check if input has value on page load
        if (input.value !== '') {
            input.parentElement.classList.add('focused');
        }
    });
}

// AJAX Functions
function makeAjaxRequest(url, method, data, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    callback(null, response);
                } catch (e) {
                    callback('Invalid JSON response', null);
                }
            } else {
                callback('Request failed: ' + xhr.status, null);
            }
        }
    };
    
    if (data) {
        xhr.send(JSON.stringify(data));
    } else {
        xhr.send();
    }
}

// Vehicle Functions
function bookVehicle(formData) {
    showLoading('Booking vehicle...');
    
    makeAjaxRequest('/api/book_vehicle.php', 'POST', formData, function(error, response) {
        hideLoading();
        
        if (error) {
            showAlert('Booking failed: ' + error, 'danger');
            return;
        }
        
        if (response.success) {
            showAlert('Vehicle booked successfully! Booking ID: ' + response.booking_id, 'success');
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('bookingModal'));
            modal.hide();
            
            // Refresh page after 2 seconds
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } else {
            showAlert('Booking failed: ' + response.message, 'danger');
        }
    });
}

function requestService(formData) {
    showLoading('Submitting service request...');
    
    makeAjaxRequest('/api/request_service.php', 'POST', formData, function(error, response) {
        hideLoading();
        
        if (error) {
            showAlert('Service request failed: ' + error, 'danger');
            return;
        }
        
        if (response.success) {
            showAlert('Service request submitted successfully! Request ID: ' + response.request_id, 'success');
            // Reset form
            document.getElementById('serviceForm').reset();
        } else {
            showAlert('Service request failed: ' + response.message, 'danger');
        }
    });
}

// UI Helper Functions
function showAlert(message, type) {
    const alertContainer = document.getElementById('alertContainer') || document.body;
    const alertId = 'alert-' + Date.now();
    
    const alertHtml = `
        <div id="${alertId}" class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    alertContainer.insertAdjacentHTML('afterbegin', alertHtml);
    
    // Auto-hide success and info alerts
    if (type === 'success' || type === 'info') {
        setTimeout(() => {
            const alert = document.getElementById(alertId);
            if (alert) {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            }
        }, 5000);
    }
}

function showLoading(message = 'Loading...') {
    const loadingHtml = `
        <div id="loadingOverlay" class="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style="background: rgba(0,0,0,0.5); z-index: 9999;">
            <div class="bg-white p-4 rounded shadow text-center">
                <div class="spinner-border text-primary mb-3" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <div>${message}</div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', loadingHtml);
}

function hideLoading() {
    const loading = document.getElementById('loadingOverlay');
    if (loading) {
        loading.remove();
    }
}

function confirmAction(message, callback) {
    if (confirm(message)) {
        callback();
    }
}

// Data Table Functions
function initializeDataTable(tableId, options = {}) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    // Add search functionality
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'form-control mb-3';
    searchInput.placeholder = 'Search...';
    
    table.parentNode.insertBefore(searchInput, table);
    
    const rows = table.querySelectorAll('tbody tr');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        rows.forEach(function(row) {
            const text = row.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
    
    // Add sorting functionality
    const headers = table.querySelectorAll('thead th');
    headers.forEach(function(header, index) {
        if (header.hasAttribute('data-sortable')) {
            header.style.cursor = 'pointer';
            header.innerHTML += ' <i class="fas fa-sort ms-1"></i>';
            
            header.addEventListener('click', function() {
                sortTable(table, index);
            });
        }
    });
}

function sortTable(table, columnIndex) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const header = table.querySelectorAll('thead th')[columnIndex];
    const icon = header.querySelector('i');
    
    let isAscending = !header.classList.contains('sort-asc');
    
    // Reset all sort icons
    table.querySelectorAll('thead th i').forEach(i => {
        i.className = 'fas fa-sort ms-1';
    });
    table.querySelectorAll('thead th').forEach(h => {
        h.classList.remove('sort-asc', 'sort-desc');
    });
    
    // Sort rows
    rows.sort(function(a, b) {
        const aValue = a.children[columnIndex].textContent.trim();
        const bValue = b.children[columnIndex].textContent.trim();
        
        // Check if values are numbers
        const aNum = parseFloat(aValue);
        const bNum = parseFloat(bValue);
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
            return isAscending ? aNum - bNum : bNum - aNum;
        }
        
        // Check if values are dates
        const aDate = new Date(aValue);
        const bDate = new Date(bValue);
        
        if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
            return isAscending ? aDate - bDate : bDate - aDate;
        }
        
        // String comparison
        return isAscending ? 
            aValue.localeCompare(bValue) : 
            bValue.localeCompare(aValue);
    });
    
    // Update header classes and icon
    if (isAscending) {
        header.classList.add('sort-asc');
        icon.className = 'fas fa-sort-up ms-1';
    } else {
        header.classList.add('sort-desc');
        icon.className = 'fas fa-sort-down ms-1';
    }
    
    // Reorder rows in DOM
    rows.forEach(row => tbody.appendChild(row));
}

// Print Functions
function printBill(billId) {
    window.open(`/api/generate_bill.php?id=${billId}&action=print`, '_blank');
}

function downloadBill(billId) {
    window.open(`/api/generate_bill.php?id=${billId}&action=download`, '_blank');
}

// Image Preview Functions
function previewImage(input, previewId) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const preview = document.getElementById(previewId);
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        
        reader.readAsDataURL(input.files[0]);
    }
}

// Form Submission Handlers
function handleBookingForm() {
    const form = document.getElementById('bookingForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        
        // Validate dates
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (startDate < today) {
            showAlert('Start date cannot be in the past', 'warning');
            return;
        }
        
        if (endDate < startDate) {
            showAlert('End date must be after start date', 'warning');
            return;
        }
        
        bookVehicle(data);
    });
}

function handleServiceForm() {
    const form = document.getElementById('serviceForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        
        // Validate required fields
        if (!data.problemDescription || data.problemDescription.trim().length < 10) {
            showAlert('Please provide a detailed problem description (at least 10 characters)', 'warning');
            return;
        }
        
        requestService(data);
    });
}

// Initialize form handlers when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    handleBookingForm();
    handleServiceForm();
    
    // Initialize data tables
    initializeDataTable('vehiclesTable');
    initializeDataTable('bookingsTable');
    initializeDataTable('servicesTable');
    initializeDataTable('usersTable');
});

// Export functions for global use
window.VehicleMS = {
    showAlert,
    showLoading,
    hideLoading,
    confirmAction,
    bookVehicle,
    requestService,
    printBill,
    downloadBill,
    previewImage,
    makeAjaxRequest
};