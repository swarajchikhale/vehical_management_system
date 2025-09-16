# 🚗 Vehicle Management System

![Vehicle Management System](https://img.shields.io/badge/PHP-8.0+-blue.svg)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange.svg)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

A comprehensive web-based **Vehicle Management System** that provides vehicle rental services and professional mechanic services. Built with PHP, MySQL, HTML, CSS, and JavaScript, featuring separate dashboards for customers, administrators, and mechanics.

## 🌟 Features

### 🔐 **Multi-Role Authentication**
- **Customer Portal** - Vehicle booking and service requests
- **Admin Dashboard** - Complete system management
- **Mechanic Panel** - Service request management

### 🚙 **Vehicle Management**
- Vehicle inventory with detailed specifications
- Real-time availability tracking
- Advanced search and filtering
- Image upload and management
- Vehicle status monitoring

### 📅 **Booking System**
- Interactive vehicle booking with date validation
- Real-time pricing calculation with tax
- Booking history and status tracking
- Automated conflict detection
- Invoice generation

### 🔧 **Mechanic Services**
- Service request submission with detailed descriptions
- Mechanic assignment and availability tracking
- Service cost estimation
- Emergency 24/7 support
- Service history and ratings

### 💰 **Billing & Payments**
- Automated invoice generation
- Tax calculation (18% configurable)
- Payment status tracking
- Bill history and downloads
- PDF export functionality

### 📊 **Analytics Dashboard**
- Revenue tracking and trends
- Booking statistics and charts
- User activity monitoring
- Service performance metrics
- Exportable reports

## 🛠️ Technology Stack

- **Backend:** PHP 8.0+, MySQL 8.0+
- **Frontend:** HTML5, CSS3, JavaScript (ES6)
- **Frameworks:** Bootstrap 5.3, Chart.js
- **Server:** XAMPP (Apache + MySQL)
- **Icons:** Font Awesome 6.4
- **Architecture:** MVC-inspired modular design

## 📁 Project Structure

```
vehicle_management_system/
├── 📄 index.php                    # Homepage
├── 📄 login.php                    # Authentication page
├── 📄 register.php                 # User registration
├── 📄 vehicles.php                 # Vehicle listing & booking
├── 📄 mechanic_service.php         # Service request page
├── 📄 contact.php                  # Contact information
├── 📄 database.sql                 # Complete database schema
│
├── 📁 config/
│   └── database.php                # Database configuration
│
├── 📁 includes/
│   ├── header.php                  # Common header template
│   ├── footer.php                  # Common footer template
│   └── functions.php               # Core helper functions
│
├── 📁 css/
│   └── style.css                   # Main responsive stylesheet
│
├── 📁 js/
│   ├── main.js                     # Core JavaScript functions
│   ├── validation.js               # Form validation system
│   └── dashboard.js                # Dashboard functionality
│
├── 📁 api/
│   ├── login.php                   # Authentication API
│   ├── register.php                # Registration API
│   ├── book_vehicle.php            # Booking API
│   ├── request_service.php         # Service request API
│   └── generate_bill.php           # Invoice generation
│
├── 📁 user/
│   ├── dashboard.php               # Customer dashboard
│   ├── my_bookings.php             # Booking management
│   └── profile.php                 # Profile settings
│
├── 📁 admin/
│   ├── index.php                   # Admin dashboard
│   ├── vehicles.php                # Vehicle management
│   ├── bookings.php                # Booking oversight
│   ├── services.php                # Service management
│   ├── users.php                   # User administration
│   └── reports.php                 # Analytics & reports
│
├── 📁 mechanic/
│   ├── dashboard.php               # Mechanic dashboard
│   ├── manage_services.php         # Service management
│   └── profile.php                 # Mechanic profile
│
├── 📁 uploads/
│   └── vehicles/                   # Vehicle images storage
│
└── 📁 logs/
    └── error.log                   # Application error logs
```

## 🚀 Quick Start

### Prerequisites
- **XAMPP** (PHP 8.0+, MySQL 8.0+, Apache)
- **Web Browser** (Chrome, Firefox, Safari, Edge)
- **Text Editor** (VS Code, Sublime Text, etc.)

### Installation

1. **Download and Install XAMPP**
   ```bash
   # Download XAMPP from https://www.apachefriends.org/
   # Install and start Apache + MySQL services
   ```

2. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/vehicle-management-system.git
   cd vehicle-management-system
   ```

3. **Database Setup**
   ```bash
   # Open phpMyAdmin: http://localhost/phpmyadmin
   # Create new database: vehicle_management
   # Import database.sql file
   ```

4. **Deploy Files**
   ```bash
   # Copy all files to xampp/htdocs/vehicle_management_system/
   # Or create a symbolic link for development
   ```

5. **Configuration**
   ```php
   // Update config/database.php if needed
   define('DB_HOST', 'localhost');
   define('DB_USER', 'root');
   define('DB_PASS', '');
   define('DB_NAME', 'vehicle_management');
   ```

6. **Access the System**
   ```
   Homepage: http://localhost/vehicle_management_system/
   Admin Panel: Login with admin credentials
   ```

## 🔑 Demo Credentials

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Admin** | admin@vehiclems.com | admin123 | Full system access |
| **Mechanic** | mechanic@vehiclems.com | mechanic123 | Service management |
| **Customer** | user@vehiclems.com | user123 | Booking & requests |

## 📱 Screenshots

### Homepage
![Homepage](https://via.placeholder.com/800x400?text=Modern+Vehicle+Management+Homepage)

### Admin Dashboard  
![Admin Dashboard](https://via.placeholder.com/800x400?text=Comprehensive+Admin+Dashboard+with+Analytics)

### Vehicle Booking
![Vehicle Booking](https://via.placeholder.com/800x400?text=Interactive+Vehicle+Booking+System)

### Responsive Design
![Mobile View](https://via.placeholder.com/400x600?text=Mobile+Responsive+Design)

## 🎯 Key Features Demo

### 🚗 **Vehicle Rental Flow**
1. Browse available vehicles with advanced filters
2. Select vehicle and choose rental dates
3. Real-time price calculation with taxes
4. Secure booking confirmation
5. Automated invoice generation

### 🔧 **Service Request Process**
1. Submit detailed service request form
2. Automatic mechanic assignment based on availability
3. Service cost estimation
4. Real-time status updates
5. Service completion and billing

### 📊 **Admin Management**
1. Complete vehicle inventory management
2. User and mechanic administration
3. Booking and service oversight
4. Revenue analytics with charts
5. Comprehensive reporting system

## 🛡️ Security Features

- **Password Security:** BCrypt hashing with salt
- **SQL Injection Prevention:** Prepared statements
- **XSS Protection:** Input sanitization and output escaping
- **Session Management:** Secure session handling with timeout
- **File Upload Security:** Type validation and secure storage
- **Role-based Access Control:** Multi-level permission system

## 🎨 Design Features

- **Responsive Design:** Mobile-first approach with Bootstrap 5
- **Modern UI:** Gradient backgrounds and smooth animations
- **Interactive Elements:** Real-time form validation and feedback
- **Accessibility:** WCAG compliance and screen reader support
- **Performance:** Optimized assets and lazy loading
- **Cross-browser:** Compatible with all major browsers

## 📊 Database Schema

### Core Tables
- **users:** User accounts and authentication
- **vehicles:** Vehicle inventory and specifications  
- **bookings:** Rental bookings and scheduling
- **services:** Mechanic service requests
- **mechanics:** Mechanic profiles and availability
- **bills:** Invoice and payment tracking

### Key Relationships
```sql
users (1) ←→ (n) bookings ←→ (1) vehicles
users (1) ←→ (n) services ←→ (1) mechanics  
bookings (1) ←→ (1) bills
services (1) ←→ (1) bills
```

## 🔧 API Endpoints

| Endpoint | Method | Description | Authentication |
|----------|---------|-------------|----------------|
| `/api/login.php` | POST | User authentication | Public |
| `/api/register.php` | POST | User registration | Public |
| `/api/book_vehicle.php` | POST | Create vehicle booking | Required |
| `/api/request_service.php` | POST | Submit service request | Required |
| `/api/generate_bill.php` | GET | Generate invoice PDF | Required |

## 🚀 Advanced Features

### Real-time Functionality
- Live booking availability updates
- Instant form validation and feedback
- Dynamic pricing calculations
- Auto-refresh dashboard statistics

### Reporting & Analytics
- Revenue trends with Chart.js visualizations
- Booking pattern analysis
- Service performance metrics
- Exportable data in CSV format

### Mobile Optimization
- Touch-friendly interface design
- Responsive navigation and forms
- Optimized images for mobile networks
- Progressive Web App (PWA) ready

## 🔄 Development Workflow

### Local Development
```bash
# Start XAMPP services
# Enable error reporting in PHP
# Use browser developer tools for debugging
# Check error.log for server-side issues
```

### Testing Checklist
- [ ] User registration and authentication
- [ ] Vehicle booking process
- [ ] Service request submission
- [ ] Admin panel functionality
- [ ] Responsive design on various devices
- [ ] Form validation and error handling
- [ ] Database operations and data integrity

## 📈 Future Enhancements

### Planned Features
- [ ] **Payment Gateway Integration** (Stripe, PayPal)
- [ ] **SMS/Email Notifications** for bookings and services
- [ ] **GPS Tracking** for mechanic location
- [ ] **Mobile App Development** (React Native/Flutter)
- [ ] **Advanced Analytics** with machine learning insights
- [ ] **Multi-language Support** (i18n)
- [ ] **API Documentation** with Swagger/OpenAPI

### Performance Improvements
- [ ] **Caching Layer** (Redis/Memcached)
- [ ] **CDN Integration** for static assets
- [ ] **Database Optimization** with query analysis
- [ ] **Load Balancing** for high availability

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow PSR-12 PHP coding standards
- Write meaningful commit messages
- Add comments for complex logic
- Test thoroughly before submitting
- Update documentation as needed

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Vehicle Management System

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 📞 Support & Contact

### Getting Help
- **Documentation:** Check the `/docs` folder for detailed guides
- **Issues:** Report bugs via GitHub Issues
- **Discussions:** Join our community discussions

### Community
- **Discord Server:** [Join our community](https://discord.gg/EtQdFmED)
- **Telegram :** [Community discussions](https://t.me/collabcoderx)


## 🏆 Acknowledgments

- **Bootstrap Team** for the amazing CSS framework
- **Chart.js** for beautiful data visualizations  
- **Font Awesome** for comprehensive icon library
- **XAMPP Team** for the excellent development environment
- **PHP Community** for continuous language improvements

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/vehicle-management-system)
![GitHub forks](https://img.shields.io/github/forks/yourusername/vehicle-management-system)
![GitHub issues](https://img.shields.io/github/issues/yourusername/vehicle-management-system)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/vehicle-management-system)

---

<div align="center">
  <h3>🌟 If you found this project helpful, please consider giving it a star! 🌟</h3>
  <p>Built with ❤️ for the developer community</p>
</div>

---

**Happy Coding! 🚀**
