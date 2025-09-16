<?php
require_once '../includes/functions.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Get and sanitize input
        $firstName = sanitizeInput($_POST['firstName'] ?? '');
        $lastName = sanitizeInput($_POST['lastName'] ?? '');
        $email = sanitizeInput($_POST['email'] ?? '');
        $phone = sanitizeInput($_POST['phone'] ?? '');
        $password = $_POST['password'] ?? '';
        $confirmPassword = $_POST['confirmPassword'] ?? '';
        $accountType = sanitizeInput($_POST['accountType'] ?? 'user');
        
        // Mechanic specific fields
        $specialization = sanitizeInput($_POST['specialization'] ?? '');
        $experience = intval($_POST['experience'] ?? 0);
        $hourlyRate = floatval($_POST['hourlyRate'] ?? 0);
        
        // Validate required fields
        $errors = [];
        
        if (empty($firstName)) $errors[] = 'First name is required';
        if (empty($lastName)) $errors[] = 'Last name is required';
        if (empty($email)) $errors[] = 'Email is required';
        if (empty($phone)) $errors[] = 'Phone number is required';
        if (empty($password)) $errors[] = 'Password is required';
        if (empty($confirmPassword)) $errors[] = 'Password confirmation is required';
        if (!in_array($accountType, ['user', 'mechanic'])) $errors[] = 'Invalid account type';
        
        // Validate email format
        if (!empty($email) && !validateEmail($email)) {
            $errors[] = 'Invalid email format';
        }
        
        // Validate phone format
        if (!empty($phone) && !validatePhone($phone)) {
            $errors[] = 'Invalid phone number format';
        }
        
        // Validate password strength
        if (strlen($password) < 8) {
            $errors[] = 'Password must be at least 8 characters long';
        }
        
        if (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/', $password)) {
            $errors[] = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
        }
        
        // Check if passwords match
        if ($password !== $confirmPassword) {
            $errors[] = 'Passwords do not match';
        }
        
        // Validate mechanic-specific fields
        if ($accountType === 'mechanic') {
            if (empty($specialization)) $errors[] = 'Specialization is required for mechanics';
            if ($experience < 0) $errors[] = 'Experience must be a positive number';
            if ($hourlyRate <= 0) $errors[] = 'Hourly rate must be greater than 0';
        }
        
        // Check if there are validation errors
        if (!empty($errors)) {
            setMessage(implode('<br>', $errors), 'error');
            header('Location: /register.php');
            exit();
        }
        
        global $pdo;
        
        // Check if email already exists
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            setMessage('Email address is already registered', 'error');
            header('Location: /register.php');
            exit();
        }
        
        // Start transaction
        $pdo->beginTransaction();
        
        try {
            // Hash password
            $hashedPassword = hashPassword($password);
            $fullName = trim($firstName . ' ' . $lastName);
            
            // Insert user
            $stmt = $pdo->prepare("
                INSERT INTO users (name, email, phone, password, role, created_at) 
                VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            ");
            $stmt->execute([$fullName, $email, $phone, $hashedPassword, $accountType]);
            
            $userId = $pdo->lastInsertId();
            
            // If registering as mechanic, add mechanic record
            if ($accountType === 'mechanic') {
                $stmt = $pdo->prepare("
                    INSERT INTO mechanics (user_id, specialization, experience_years, hourly_rate, availability) 
                    VALUES (?, ?, ?, ?, 'available')
                ");
                $stmt->execute([$userId, $specialization, $experience, $hourlyRate]);
            }
            
            // Commit transaction
            $pdo->commit();
            
            // Auto-login the user
            $_SESSION['user_id'] = $userId;
            $_SESSION['name'] = $fullName;
            $_SESSION['email'] = $email;
            $_SESSION['role'] = $accountType;
            $_SESSION['login_time'] = time();
            
            setMessage('Account created successfully! Welcome to Vehicle Management System.', 'success');
            
            // Redirect based on role
            $redirectUrl = ($accountType === 'mechanic') ? '/mechanic/dashboard.php' : '/user/dashboard.php';
            header("Location: $redirectUrl");
            exit();
            
        } catch (Exception $e) {
            // Rollback transaction
            $pdo->rollback();
            throw $e;
        }
        
    } catch (PDOException $e) {
        error_log("Database error during registration: " . $e->getMessage());
        
        if ($e->getCode() == 23000) { // Duplicate entry
            setMessage('Email address is already registered', 'error');
        } else {
            setMessage('Database error occurred. Please try again.', 'error');
        }
        
        header('Location: /register.php');
        exit();
        
    } catch (Exception $e) {
        error_log("Registration error: " . $e->getMessage());
        setMessage('An error occurred during registration. Please try again.', 'error');
        header('Location: /register.php');
        exit();
    }
}

// If not POST request or invalid access
header('Location: /register.php');
exit();
?>