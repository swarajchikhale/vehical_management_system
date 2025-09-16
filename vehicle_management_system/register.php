<?php
$pageTitle = 'Register';

// Redirect if already logged in
if (isLoggedIn()) {
    $redirectUrl = $_SESSION['role'] === 'admin' ? '/admin/index.php' : 
                  ($_SESSION['role'] === 'mechanic' ? '/mechanic/dashboard.php' : '/user/dashboard.php');
    header("Location: $redirectUrl");
    exit();
}

require_once 'includes/header.php';
?>

<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
            <div class="form-container fade-in">
                <div class="text-center mb-4">
                    <i class="fas fa-user-plus fa-3x text-primary mb-3"></i>
                    <h6>1. Information We Collect</h6>
                <p>We collect information you provide when registering, booking vehicles, or requesting services.</p>
                
                <h6>2. How We Use Your Information</h6>
                <p>Your information is used to provide services, process payments, and communicate with you.</p>
                
                <h6>3. Information Sharing</h6>
                <p>We do not sell or share your personal information with third parties without consent.</p>
                
                <h6>4. Data Security</h6>
                <p>We implement appropriate security measures to protect your personal information.</p>
                
                <h6>5. Contact Us</h6>
                <p>If you have questions about this privacy policy, contact us at privacy@vehiclems.com</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<?php
$additionalScripts = '
<script>
    function togglePasswordVisibility(fieldId) {
        const field = document.getElementById(fieldId);
        const toggle = document.getElementById(fieldId + "-toggle");
        
        if (field.type === "password") {
            field.type = "text";
            toggle.className = "fas fa-eye-slash";
        } else {
            field.type = "password";
            toggle.className = "fas fa-eye";
        }
    }
    
    // Initialize password strength indicator
    document.addEventListener("DOMContentLoaded", function() {
        initializePasswordStrengthIndicator("password", "passwordStrength");
        
        // Show/hide mechanic fields based on account type
        document.getElementById("accountType").addEventListener("change", function() {
            const mechanicFields = document.getElementById("mechanicFields");
            const specialization = document.getElementById("specialization");
            const experience = document.getElementById("experience");
            const hourlyRate = document.getElementById("hourlyRate");
            
            if (this.value === "mechanic") {
                mechanicFields.style.display = "block";
                specialization.required = true;
                experience.required = true;
                hourlyRate.required = true;
            } else {
                mechanicFields.style.display = "none";
                specialization.required = false;
                experience.required = false;
                hourlyRate.required = false;
            }
        });
    });
</script>
';

require_once 'includes/footer.php';
?>2 class="fw-bold">Create Account</h2>
                    <p class="text-muted">Join us to access our services</p>
                </div>
                
                <form id="registerForm" action="api/register.php" method="POST" data-validate>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group mb-3">
                                <label for="firstName" class="form-label">
                                    <i class="fas fa-user me-2"></i>First Name
                                </label>
                                <input type="text" 
                                       class="form-control" 
                                       id="firstName" 
                                       name="firstName" 
                                       placeholder="Enter first name"
                                       data-rules="required|minLength:2"
                                       required>
                            </div>
                        </div>
                        
                        <div class="col-md-6">
                            <div class="form-group mb-3">
                                <label for="lastName" class="form-label">
                                    <i class="fas fa-user me-2"></i>Last Name
                                </label>
                                <input type="text" 
                                       class="form-control" 
                                       id="lastName" 
                                       name="lastName" 
                                       placeholder="Enter last name"
                                       data-rules="required|minLength:2"
                                       required>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-group mb-3">
                        <label for="email" class="form-label">
                            <i class="fas fa-envelope me-2"></i>Email Address
                        </label>
                        <input type="email" 
                               class="form-control" 
                               id="email" 
                               name="email" 
                               placeholder="Enter your email"
                               data-rules="required|email"
                               required>
                    </div>
                    
                    <div class="form-group mb-3">
                        <label for="phone" class="form-label">
                            <i class="fas fa-phone me-2"></i>Phone Number
                        </label>
                        <input type="tel" 
                               class="form-control" 
                               id="phone" 
                               name="phone" 
                               placeholder="Enter your phone number"
                               data-rules="required|phone"
                               required>
                    </div>
                    
                    <div class="form-group mb-3">
                        <label for="password" class="form-label">
                            <i class="fas fa-lock me-2"></i>Password
                        </label>
                        <div class="input-group">
                            <input type="password" 
                                   class="form-control" 
                                   id="password" 
                                   name="password" 
                                   placeholder="Create a password"
                                   data-rules="required|passwordStrength"
                                   required>
                            <button class="btn btn-outline-secondary" 
                                    type="button" 
                                    onclick="togglePasswordVisibility('password')">
                                <i class="fas fa-eye" id="password-toggle"></i>
                            </button>
                        </div>
                        <div id="passwordStrength"></div>
                    </div>
                    
                    <div class="form-group mb-3">
                        <label for="confirmPassword" class="form-label">
                            <i class="fas fa-lock me-2"></i>Confirm Password
                        </label>
                        <div class="input-group">
                            <input type="password" 
                                   class="form-control" 
                                   id="confirmPassword" 
                                   name="confirmPassword" 
                                   placeholder="Confirm your password"
                                   data-rules="required|confirmPassword"
                                   required>
                            <button class="btn btn-outline-secondary" 
                                    type="button" 
                                    onclick="togglePasswordVisibility('confirmPassword')">
                                <i class="fas fa-eye" id="confirmPassword-toggle"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="form-group mb-3">
                        <label for="accountType" class="form-label">
                            <i class="fas fa-user-tag me-2"></i>Account Type
                        </label>
                        <select class="form-select" 
                                id="accountType" 
                                name="accountType" 
                                data-rules="required"
                                required>
                            <option value="">Select account type</option>
                            <option value="user">Customer - Rent vehicles and request services</option>
                            <option value="mechanic">Mechanic - Provide repair services</option>
                        </select>
                    </div>
                    
                    <!-- Mechanic-specific fields -->
                    <div id="mechanicFields" style="display: none;">
                        <div class="card border-info mb-3">
                            <div class="card-header bg-info text-white">
                                <h6 class="mb-0"><i class="fas fa-tools me-2"></i>Mechanic Information</h6>
                            </div>
                            <div class="card-body">
                                <div class="form-group mb-3">
                                    <label for="specialization" class="form-label">Specialization</label>
                                    <select class="form-select" id="specialization" name="specialization">
                                        <option value="">Select specialization</option>
                                        <option value="Car Repair">Car Repair</option>
                                        <option value="Bike Repair">Bike Repair</option>
                                        <option value="Truck Repair">Truck Repair</option>
                                        <option value="General Mechanic">General Mechanic</option>
                                        <option value="Electrical Systems">Electrical Systems</option>
                                        <option value="Engine Specialist">Engine Specialist</option>
                                    </select>
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-group mb-3">
                                            <label for="experience" class="form-label">Experience (Years)</label>
                                            <input type="number" 
                                                   class="form-control" 
                                                   id="experience" 
                                                   name="experience" 
                                                   min="0" 
                                                   max="50"
                                                   placeholder="Years of experience">
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <div class="form-group mb-3">
                                            <label for="hourlyRate" class="form-label">Hourly Rate ($)</label>
                                            <input type="number" 
                                                   class="form-control" 
                                                   id="hourlyRate" 
                                                   name="hourlyRate" 
                                                   min="10" 
                                                   max="200" 
                                                   step="0.01"
                                                   placeholder="Per hour charge">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-group mb-3">
                        <div class="form-check">
                            <input class="form-check-input" 
                                   type="checkbox" 
                                   id="terms" 
                                   name="terms" 
                                   required>
                            <label class="form-check-label" for="terms">
                                I agree to the 
                                <a href="#" data-bs-toggle="modal" data-bs-target="#termsModal">Terms of Service</a> 
                                and 
                                <a href="#" data-bs-toggle="modal" data-bs-target="#privacyModal">Privacy Policy</a>
                            </label>
                        </div>
                    </div>
                    
                    <div class="form-group mb-3">
                        <div class="form-check">
                            <input class="form-check-input" 
                                   type="checkbox" 
                                   id="newsletter" 
                                   name="newsletter">
                            <label class="form-check-label" for="newsletter">
                                Subscribe to our newsletter for updates and offers
                            </label>
                        </div>
                    </div>
                    
                    <button type="submit" class="btn btn-primary w-100 mb-3">
                        <i class="fas fa-user-plus me-2"></i>Create Account
                    </button>
                    
                    <hr class="my-4">
                    
                    <div class="text-center">
                        <p class="mb-0">Already have an account?</p>
                        <a href="login.php" class="btn btn-outline-primary w-100 mt-2">
                            <i class="fas fa-sign-in-alt me-2"></i>Sign In
                        </a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<!-- Terms of Service Modal -->
<div class="modal fade" id="termsModal" tabindex="-1" aria-labelledby="termsModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="termsModalLabel">Terms of Service</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <h6>1. Acceptance of Terms</h6>
                <p>By using our Vehicle Management System, you agree to these terms and conditions.</p>
                
                <h6>2. Vehicle Rental</h6>
                <p>All vehicle rentals are subject to availability and proper documentation.</p>
                
                <h6>3. Mechanic Services</h6>
                <p>All mechanic services are provided by certified professionals with warranty coverage.</p>
                
                <h6>4. Payment Terms</h6>
                <p>All payments must be made as per the agreed terms. Late payments may incur additional charges.</p>
                
                <h6>5. Liability</h6>
                <p>Users are responsible for any damage or misuse of rented vehicles.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<!-- Privacy Policy Modal -->
<div class="modal fade" id="privacyModal" tabindex="-1" aria-labelledby="privacyModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="privacyModalLabel">Privacy Policy</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <h