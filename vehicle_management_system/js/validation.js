// Vehicle Management System - Form Validation

// Validation Rules
const validationRules = {
    required: {
        test: value => value && value.trim() !== '',
        message: 'This field is required'
    },
    email: {
        test: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: 'Please enter a valid email address'
    },
    phone: {
        test: value => /^[\+]?[0-9\s\-\(\)]{10,}$/.test(value),
        message: 'Please enter a valid phone number'
    },
    password: {
        test: value => value && value.length >= 6,
        message: 'Password must be at least 6 characters long'
    },
    passwordStrength: {
        test: value => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value),
        message: 'Password must contain at least 8 characters with uppercase, lowercase and number'
    },
    confirmPassword: {
        test: (value, formData) => value === formData.password,
        message: 'Passwords do not match'
    },
    minLength: {
        test: (value, formData, length) => value && value.trim().length >= length,
        message: (length) => `Must be at least ${length} characters long`
    },
    maxLength: {
        test: (value, formData, length) => !value || value.trim().length <= length,
        message: (length) => `Must be no more than ${length} characters long`
    },
    number: {
        test: value => !value || !isNaN(value) && isFinite(value),
        message: 'Please enter a valid number'
    },
    positiveNumber: {
        test: value => !value || (!isNaN(value) && parseFloat(value) > 0),
        message: 'Please enter a positive number'
    },
    date: {
        test: value => !value || !isNaN(new Date(value).getTime()),
        message: 'Please enter a valid date'
    },
    futureDate: {
        test: value => !value || new Date(value) >= new Date().setHours(0,0,0,0),
        message: 'Date must be today or in the future'
    },
    licensePlate: {
        test: value => !value || /^[A-Z0-9\-]{4,10}$/.test(value.toUpperCase()),
        message: 'Please enter a valid license plate (4-10 characters, letters and numbers only)'
    },
    year: {
        test: value => !value || (/^\d{4}$/.test(value) && parseInt(value) >= 1900 && parseInt(value) <= new Date().getFullYear() + 1),
        message: `Please enter a valid year (1900 - ${new Date().getFullYear() + 1})`
    }
};

// Validation Class
class FormValidator {
    constructor(form) {
        this.form = typeof form === 'string' ? document.getElementById(form) : form;
        this.errors = {};
        this.isValid = true;
        
        if (!this.form) {
            console.error('Form not found');
            return;
        }
        
        this.initializeValidation();
    }
    
    initializeValidation() {
        // Add real-time validation
        const inputs = this.form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            // Validate on blur
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            // Clear errors on input
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
        
        // Handle form submission
        this.form.addEventListener('submit', (e) => {
            if (!this.validate()) {
                e.preventDefault();
                this.showErrors();
            }
        });
    }
    
    validate() {
        this.errors = {};
        this.isValid = true;
        
        const inputs = this.form.querySelectorAll('input, select, textarea');
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());
        
        inputs.forEach(input => {
            this.validateField(input, data);
        });
        
        return this.isValid;
    }
    
    validateField(field, formData = null) {
        const name = field.name || field.id;
        const value = field.value;
        const rules = field.getAttribute('data-rules');
        
        if (!rules || !name) return true;
        
        if (!formData) {
            const form = new FormData(this.form);
            formData = Object.fromEntries(form.entries());
        }
        
        const ruleList = rules.split('|');
        let isFieldValid = true;
        
        for (const rule of ruleList) {
            const [ruleName, ...params] = rule.split(':');
            const param = params.join(':');
            
            if (validationRules[ruleName]) {
                let testResult;
                
                if (ruleName === 'confirmPassword') {
                    testResult = validationRules[ruleName].test(value, formData);
                } else if (ruleName === 'minLength' || ruleName === 'maxLength') {
                    const length = parseInt(param);
                    testResult = validationRules[ruleName].test(value, formData, length);
                } else {
                    testResult = validationRules[ruleName].test(value);
                }
                
                if (!testResult) {
                    let message = validationRules[ruleName].message;
                    if (typeof message === 'function') {
                        message = message(param);
                    }
                    
                    this.errors[name] = message;
                    this.isValid = false;
                    isFieldValid = false;
                    this.showFieldError(field, message);
                    break;
                }
            }
        }
        
        if (isFieldValid) {
            this.clearFieldError(field);
        }
        
        return isFieldValid;
    }
    
    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.classList.add('is-invalid');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = message;
        errorDiv.setAttribute('data-error-for', field.name || field.id);
        
        field.parentNode.appendChild(errorDiv);
    }
    
    clearFieldError(field) {
        field.classList.remove('is-invalid');
        
        const existingError = field.parentNode.querySelector(`[data-error-for="${field.name || field.id}"]`);
        if (existingError) {
            existingError.remove();
        }
        
        // Remove from errors object
        const name = field.name || field.id;
        if (this.errors[name]) {
            delete this.errors[name];
        }
    }
    
    showErrors() {
        // Scroll to first error
        const firstErrorField = this.form.querySelector('.is-invalid');
        if (firstErrorField) {
            firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstErrorField.focus();
        }
        
        // Show general error message
        if (Object.keys(this.errors).length > 0) {
            if (window.VehicleMS && window.VehicleMS.showAlert) {
                window.VehicleMS.showAlert('Please fix the errors in the form', 'danger');
            } else {
                alert('Please fix the errors in the form');
            }
        }
    }
    
    clearAllErrors() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            this.clearFieldError(input);
        });
        
        this.errors = {};
        this.isValid = true;
    }
    
    addCustomValidation(fieldName, validator, message) {
        const field = this.form.querySelector(`[name="${fieldName}"], #${fieldName}`);
        if (!field) return;
        
        field.addEventListener('blur', () => {
            if (!validator(field.value)) {
                this.showFieldError(field, message);
                this.errors[fieldName] = message;
                this.isValid = false;
            }
        });
    }
}

// Auto-initialize validation for forms with data-validate attribute
document.addEventListener('DOMContentLoaded', function() {
    const formsToValidate = document.querySelectorAll('form[data-validate]');
    
    formsToValidate.forEach(form => {
        new FormValidator(form);
    });
});

// Password strength indicator
function initializePasswordStrengthIndicator(passwordFieldId, indicatorId) {
    const passwordField = document.getElementById(passwordFieldId);
    const indicator = document.getElementById(indicatorId);
    
    if (!passwordField || !indicator) return;
    
    passwordField.addEventListener('input', function() {
        const password = this.value;
        const strength = calculatePasswordStrength(password);
        
        indicator.innerHTML = getPasswordStrengthHTML(strength);
    });
}

function calculatePasswordStrength(password) {
    let score = 0;
    const checks = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?]/.test(password)
    };
    
    score = Object.values(checks).filter(check => check).length;
    
    if (password.length === 0) return { score: 0, label: '', class: '' };
    if (score < 2) return { score, label: 'Very Weak', class: 'danger' };
    if (score < 3) return { score, label: 'Weak', class: 'warning' };
    if (score < 4) return { score, label: 'Fair', class: 'info' };
    if (score < 5) return { score, label: 'Good', class: 'primary' };
    return { score, label: 'Strong', class: 'success' };
}

function getPasswordStrengthHTML(strength) {
    if (strength.score === 0) return '';
    
    const percentage = (strength.score / 5) * 100;
    
    return `
        <div class="password-strength mt-2">
            <div class="progress" style="height: 8px;">
                <div class="progress-bar bg-${strength.class}" 
                     role="progressbar" 
                     style="width: ${percentage}%" 
                     aria-valuenow="${percentage}" 
                     aria-valuemin="0" 
                     aria-valuemax="100">
                </div>
            </div>
            <small class="text-${strength.class}">${strength.label}</small>
        </div>
    `;
}

// File upload validation
function validateFileUpload(input, options = {}) {
    const {
        maxSize = 5 * 1024 * 1024, // 5MB
        allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
        required = false
    } = options;
    
    const files = input.files;
    
    if (required && files.length === 0) {
        return { valid: false, message: 'Please select a file' };
    }
    
    if (files.length === 0) {
        return { valid: true };
    }
    
    const file = files[0];
    
    // Check file size
    if (file.size > maxSize) {
        const sizeMB = Math.round(maxSize / (1024 * 1024));
        return { valid: false, message: `File size must be less than ${sizeMB}MB` };
    }
    
    // Check file type
    if (!allowedTypes.includes(file.type)) {
        const types = allowedTypes.map(type => type.split('/')[1]).join(', ');
        return { valid: false, message: `Only ${types} files are allowed` };
    }
    
    return { valid: true };
}

// Custom validation helpers
const ValidationHelpers = {
    isValidEmail: (email) => validationRules.email.test(email),
    isValidPhone: (phone) => validationRules.phone.test(phone),
    isValidPassword: (password) => validationRules.password.test(password),
    isStrongPassword: (password) => validationRules.passwordStrength.test(password),
    isValidDate: (date) => validationRules.date.test(date),
    isFutureDate: (date) => validationRules.futureDate.test(date),
    isValidLicensePlate: (plate) => validationRules.licensePlate.test(plate),
    isValidYear: (year) => validationRules.year.test(year)
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FormValidator, ValidationHelpers, validateFileUpload };
}

// Make available globally
window.FormValidator = FormValidator;
window.ValidationHelpers = ValidationHelpers;
window.validateFileUpload = validateFileUpload;
window.initializePasswordStrengthIndicator = initializePasswordStrengthIndicator;