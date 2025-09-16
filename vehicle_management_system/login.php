<?php
$pageTitle = 'Login';

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
        <div class="col-md-6 col-lg-5">
            <div class="form-container fade-in">
                <div class="text-center mb-4">
                    <i class="fas fa-user-circle fa-3x text-primary mb-3"></i>
                    <h2 class="fw-bold">Welcome Back</h2>
                    <p class="text-muted">Sign in to your account</p>
                </div>
                
                <form id="loginForm" action="api/login.php" method="POST" data-validate>
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
                        <label for="password" class="form-label">
                            <i class="fas fa-lock me-2"></i>Password
                        </label>
                        <div class="input-group">
                            <input type="password" 
                                   class="form-control" 
                                   id="password" 
                                   name="password" 
                                   placeholder="Enter your password"
                                   data-rules="required"
                                   required>
                            <button class="btn btn-outline-secondary" 
                                    type="button" 
                                    onclick="togglePasswordVisibility('password')">
                                <i class="fas fa-eye" id="password-toggle"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="form-group mb-3">
                        <label for="role" class="form-label">
                            <i class="fas fa-user-tag me-2"></i>Login as
                        </label>
                        <select class="form-select" 
                                id="role" 
                                name="role" 
                                data-rules="required"
                                required>
                            <option value="">Select your role</option>
                            <option value="user">Customer</option>
                            <option value="admin">Administrator</option>
                            <option value="mechanic">Mechanic</option>
                        </select>
                    </div>
                    
                    <div class="form-group mb-4">
                        <div class="form-check">
                            <input class="form-check-input" 
                                   type="checkbox" 
                                   id="remember_me" 
                                   name="remember_me">
                            <label class="form-check-label" for="remember_me">
                                Remember me
                            </label>
                        </div>
                    </div>
                    
                    <button type="submit" class="btn btn-primary w-100 mb-3">
                        <i class="fas fa-sign-in-alt me-2"></i>Sign In
                    </button>
                    
                    <div class="text-center">
                        <a href="#" class="text-decoration-none" data-bs-toggle="modal" data-bs-target="#forgotPasswordModal">
                            Forgot your password?
                        </a>
                    </div>
                    
                    <hr class="my-4">
                    
                    <div class="text-center">
                        <p class="mb-0">Don't have an account?</p>
                        <a href="register.php" class="btn btn-outline-primary w-100 mt-2">
                            <i class="fas fa-user-plus me-2"></i>Create Account
                        </a>
                    </div>
                </form>
            </div>
            
            <!-- Demo Credentials Card -->
            <div class="card mt-4 bg-light border-info">
                <div class="card-header bg-info text-white">
                    <h6 class="mb-0"><i class="fas fa-info-circle me-2"></i>Demo Credentials</h6>
                </div>
                <div class="card-body">
                    <div class="row g-3">
                        <div class="col-md-4">
                            <h6 class="text-primary">Admin</h6>
                            <small class="text-muted">
                                Email: admin@vehiclems.com<br>
                                Password: admin123
                            </small>
                        </div>
                        <div class="col-md-4">
                            <h6 class="text-warning">Mechanic</h6>
                            <small class="text-muted">
                                Email: mechanic@vehiclems.com<br>
                                Password: mechanic123
                            </small>
                        </div>
                        <div class="col-md-4">
                            <h6 class="text-success">Customer</h6>
                            <small class="text-muted">
                                Email: user@vehiclems.com<br>
                                Password: user123
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Forgot Password Modal -->
<div class="modal fade" id="forgotPasswordModal" tabindex="-1" aria-labelledby="forgotPasswordModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="forgotPasswordModalLabel">
                    <i class="fas fa-key me-2"></i>Reset Password
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="forgotPasswordForm">
                    <div class="mb-3">
                        <label for="resetEmail" class="form-label">Email Address</label>
                        <input type="email" 
                               class="form-control" 
                               id="resetEmail" 
                               name="resetEmail" 
                               placeholder="Enter your email address"
                               required>
                    </div>
                    <div class="mb-3">
                        <label for="resetRole" class="form-label">Account Type</label>
                        <select class="form-select" id="resetRole" name="resetRole" required>
                            <option value="">Select account type</option>
                            <option value="user">Customer</option>
                            <option value="admin">Administrator</option>
                            <option value="mechanic">Mechanic</option>
                        </select>
                    </div>
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle me-2"></i>
                        A password reset link will be sent to your email address.
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" onclick="resetPassword()">
                    <i class="fas fa-paper-plane me-2"></i>Send Reset Link
                </button>
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
    
    function resetPassword() {
        const email = document.getElementById("resetEmail").value;
        const role = document.getElementById("resetRole").value;
        
        if (!email || !role) {
            alert("Please fill in all fields");
            return;
        }
        
        // Simulate password reset
        alert("Password reset link has been sent to " + email + " (Demo mode - check console)");
        console.log("Password reset requested for:", { email, role });
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById("forgotPasswordModal"));
        modal.hide();
        
        // Reset form
        document.getElementById("forgotPasswordForm").reset();
    }
    
    // Auto-fill demo credentials
    document.addEventListener("DOMContentLoaded", function() {
        const urlParams = new URLSearchParams(window.location.search);
        const demo = urlParams.get("demo");
        
        if (demo) {
            const credentials = {
                admin: { email: "admin@vehiclems.com", password: "admin123", role: "admin" },
                mechanic: { email: "mechanic@vehiclems.com", password: "mechanic123", role: "mechanic" },
                user: { email: "user@vehiclems.com", password: "user123", role: "user" }
            };
            
            if (credentials[demo]) {
                document.getElementById("email").value = credentials[demo].email;
                document.getElementById("password").value = credentials[demo].password;
                document.getElementById("role").value = credentials[demo].role;
            }
        }
        
        // Add click handlers for demo credentials
        document.querySelectorAll(".card-body .col-md-4").forEach(function(card, index) {
            card.style.cursor = "pointer";
            card.addEventListener("click", function() {
                const roles = ["admin", "mechanic", "user"];
                const credentials = {
                    admin: { email: "admin@vehiclems.com", password: "admin123", role: "admin" },
                    mechanic: { email: "mechanic@vehiclems.com", password: "mechanic123", role: "mechanic" },
                    user: { email: "user@vehiclems.com", password: "user123", role: "user" }
                };
                
                const role = roles[index];
                if (credentials[role]) {
                    document.getElementById("email").value = credentials[role].email;
                    document.getElementById("password").value = credentials[role].password;
                    document.getElementById("role").value = credentials[role].role;
                }
            });
        });
    });
</script>
';

require_once 'includes/footer.php';
?>