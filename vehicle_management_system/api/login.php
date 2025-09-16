<?php
require_once '../includes/functions.php';

header('Content-Type: application/json');

// Handle logout
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    session_destroy();
    header('Location: /index.php');
    exit();
}

// Handle login
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Get and sanitize input
        $email = sanitizeInput($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';
        $role = sanitizeInput($_POST['role'] ?? '');
        $rememberMe = isset($_POST['remember_me']);
        
        // Validate required fields
        if (empty($email) || empty($password) || empty($role)) {
            setMessage('All fields are required', 'error');
            header('Location: /login.php');
            exit();
        }
        
        // Validate email format
        if (!validateEmail($email)) {
            setMessage('Invalid email format', 'error');
            header('Location: /login.php');
            exit();
        }
        
        // Check if user exists with provided email and role
        global $pdo;
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? AND role = ?");
        $stmt->execute([$email, $role]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user) {
            setMessage('Invalid email, password, or role', 'error');
            header('Location: /login.php');
            exit();
        }
        
        // Verify password
        if (!verifyPassword($password, $user['password'])) {
            setMessage('Invalid email, password, or role', 'error');
            header('Location: /login.php');
            exit();
        }
        
        // Set session variables
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['name'] = $user['name'];
        $_SESSION['email'] = $user['email'];
        $_SESSION['role'] = $user['role'];
        $_SESSION['login_time'] = time();
        
        // Set remember me cookie if requested
        if ($rememberMe) {
            $token = generateToken();
            setcookie('remember_token', $token, time() + (30 * 24 * 60 * 60), '/'); // 30 days
            
            // Store token in database (you might want to create a remember_tokens table)
            // For demo purposes, we'll skip this implementation
        }
        
        // Update last login time
        $stmt = $pdo->prepare("UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = ?");
        $stmt->execute([$user['id']]);
        
        setMessage('Login successful! Welcome back, ' . $user['name'], 'success');
        
        // Redirect based on role
        $redirectUrl = '/user/dashboard.php';
        switch ($role) {
            case 'admin':
                $redirectUrl = '/admin/index.php';
                break;
            case 'mechanic':
                $redirectUrl = '/mechanic/dashboard.php';
                break;
            case 'user':
            default:
                $redirectUrl = '/user/dashboard.php';
                break;
        }
        
        header("Location: $redirectUrl");
        exit();
        
    } catch (Exception $e) {
        error_log("Login error: " . $e->getMessage());
        setMessage('An error occurred during login. Please try again.', 'error');
        header('Location: /login.php');
        exit();
    }
}

// If not POST request or invalid access
header('Location: /login.php');
exit();
?>