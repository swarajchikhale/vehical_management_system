# 🚗 DrivePulse - Vehicle & Service Management System

![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-24.0+-339933?logo=nodedotjs&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-8.0+-blue.svg)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

**DrivePulse** is an all-in-one modern **Vehicle Management System** and **Emergency Roadside Mechanic Dispatch Platform**. Built with React 18, Vite, Lucide Icons, Chart.js, and custom HSL design tokens (along with a complete PHP/MySQL backend stack).

---

## 🌟 Key Features

### 🔐 **Multi-Role Portals**
- **Customer Portal** - Browse fleet, reserve vehicles with real-time price & 18% tax calculation, request emergency roadside mechanics, and view digital tax invoices.
- **Admin Command Center** - Monitor gross revenue with **Chart.js** analytics, manage fleet CRUD (Add/Edit/Delete), oversee active bookings, assign mechanics to service tickets, and inspect master invoices.
- **Mechanic Workbench** - View assigned repair jobs, update status (Assigned → In Progress → Completed), write diagnostic logs, and issue service invoices.

### 🚙 **Interactive Vehicle Rental Hub**
- Live vehicle inventory with category filters (`Car`, `Bike`, `Van`, `Bus`, `Truck`).
- Real-time search by vehicle name, brand, model, or license plate.
- Advanced sorting: Price Low → High, Price High → Low, Newest Model Year.
- Dynamic date pickers with conflict checking and live subtotal + GST calculation.
- Instant reservation and booking invoice generation.

### 🔧 **Emergency Roadside Mechanic Dispatch**
- 24/7 emergency breakdown dispatch option.
- Quick issue selector (Engine Overheating, Flat Tire, Battery Dead, Brake Squeal).
- GPS location address input and customer contact routing.
- Certified mechanic assignment with hourly rate and experience details.

### 📄 **Digital Tax Invoice Engine**
- Automated invoice generation for all rental reservations and completed repair jobs.
- Clean printable & downloadable invoice template with line item breakdown, 18% GST tax calculation, and payment status stamp.

### 💱 **Indian Rupee (INR ₹) Currency & Localized Formatting**
- Native Indian Rupee (`₹`) support across all rental rates, service tickets, and invoicing.
- Realistic Indian market pricing for luxury SUVs (`₹9,500/day`), sedans (`₹3,500/day`), bikes (`₹1,800/day`), and mechanic services.
- Reusable `Intl.NumberFormat('en-IN')` utility for precision currency formatting.

---

## 🛠️ Technology Stack

- **Frontend App:** React 18, Vite, Lucide-React Icons, Chart.js, React-Chartjs-2
- **Design System:** Custom HSL Design Tokens, Glassmorphism, Dark/Light Mode, Google Fonts (Inter & Outfit)
- **Localization:** Indian Standard Formatting (`Intl.NumberFormat('en-IN')` & `en-IN` Date formatting)
- **Backend / Legacy:** PHP 8.0+, MySQL 8.0+ PDO, Prepared Statements
- **Runtime:** Node.js (v24+) / Apache XAMPP

---

## 🚀 Quick Start (Node.js & Vite)

### Prerequisites
- **Node.js** (v18.0 or higher)
- **npm** (v9.0 or higher)

### Run Locally

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```

3. **Open Application:**
   Navigate to **[http://localhost:3000/](http://localhost:3000/)** (or `http://localhost:3001/` if port 3000 is occupied).

4. **Production Build:**
   ```bash
   npm run build
   ```

---

## 🔑 Role Credentials (Demo Quick-Switch)

Use the role switcher in the top navigation bar to test all three user perspectives instantly:

| Role | Demo Account | Primary Access Level |
|------|--------------|----------------------|
| **Customer** | `user@vehiclems.com` | Vehicle booking, mechanic service requests, tax invoices |
| **Admin** | `admin@vehiclems.com` | Revenue analytics charts, fleet CRUD, service dispatch, master bills |
| **Mechanic** | `mechanic@vehiclems.com` | Repair job management, diagnostic notes, billing settlement |

---

## 📁 Repository Structure

```
vehical_management_system/
├── 📄 index.html                   # HTML5 Entry point
├── 📄 package.json                 # Project dependencies & scripts
├── 📄 vite.config.js               # Vite build configuration
├── 📄 README.md                    # System documentation
│
├── 📁 src/                         # Modern React Web Application
│   ├── 📄 main.jsx                 # React root mount
│   ├── 📄 App.jsx                  # Main application component & router
│   ├── 📄 index.css                # Design system & HSL variables
│   │
│   ├── 📁 utils/
│   │   └── 📄 formatters.js        # INR currency, date & getStatusBadgeClass utilities
│   │
│   ├── 📁 context/
│   │   ├── 📄 AuthContext.jsx       # Multi-role auth & demo credentials
│   │   └── 📄 DataContext.jsx       # Fleet, bookings, services & bills state
│   │
│   ├── 📁 components/
│   │   ├── 📄 Navbar.jsx            # Glassmorphism header with role switcher & user badge
│   │   ├── 📄 Footer.jsx            # Footer with emergency hotline & links
│   │   ├── 📄 InvoiceModal.jsx      # Printable digital tax invoice modal
│   │   └── 📄 Toast.jsx             # Floating notification toast component
│   │
│   └── 📁 pages/
│       ├── 📄 Home.jsx              # Landing page & live stats
│       ├── 📄 Vehicles.jsx          # Fleet rental hub, live search & price calculator
│       ├── 📄 MechanicServices.jsx  # Roadside mechanic request dispatch
│       ├── 📄 CustomerDashboard.jsx # Customer portal with tabbed booking history
│       ├── 📄 AdminDashboard.jsx    # Admin control center, Chart.js analytics & bill search
│       └── 📄 MechanicDashboard.jsx # Technician repair workbench & quick status toggles
│
└── 📁 vehicle_management_system/   # PHP & MySQL Backend Legacy Stack
    ├── 📄 database.sql             # MySQL Database Schema & sample data
    ├── 📄 index.php                # PHP Homepage
    ├── 📄 login.php                # Authentication page
    ├── 📄 register.php             # User registration
    ├── 📄 vehicles.php             # PHP Vehicle list
    ├── 📄 mechanic_service.php     # Service request form
    ├── 📁 config/                  # DB PDO configuration
    ├── 📁 includes/                # Common templates & helper functions
    ├── 📁 api/                     # Backend JSON API endpoints
    ├── 📁 user/                    # Customer PHP portal
    ├── 📁 admin/                   # Admin PHP dashboard
    └── 📁 mechanic/                # Mechanic PHP workbench
```

---

## 📊 Database Schema (MySQL)

- **users:** `id`, `name`, `email`, `phone`, `password`, `role` (`user`, `admin`, `mechanic`)
- **vehicles:** `id`, `vehicle_name`, `vehicle_type`, `brand`, `model`, `year`, `license_plate`, `rent_price`, `status`
- **mechanics:** `id`, `user_id`, `specialization`, `experience_years`, `hourly_rate`, `availability`, `rating`
- **bookings:** `id`, `user_id`, `vehicle_id`, `start_date`, `end_date`, `total_days`, `total_cost`, `status`
- **services:** `id`, `user_id`, `mechanic_id`, `vehicle_type`, `problem_description`, `service_location`, `preferred_date`, `status`, `service_cost`
- **bills:** `id`, `booking_id`, `service_id`, `user_id`, `bill_type`, `subtotal`, `tax_amount`, `total_amount`, `status`

---

## 📖 User Guide & Portal Features

1. **Renting a Vehicle:**
   - Navigate to **Rental Fleet** tab.
   - Use search, category pills, or price/year sorting dropdowns to filter vehicles.
   - Click **Book Vehicle** to configure reservation dates and calculate GST tax automatically.

2. **Requesting a Mechanic:**
   - Navigate to **Mechanic Services** tab.
   - Select issue type or toggle **Urgent Roadside Emergency** for priority dispatch.
   - Filter certified mechanics by specialization and rate.

3. **Managing Invoices & Printing:**
   - Access **Customer Dashboard** or **Admin Control Center**.
   - Click **View Invoice** to inspect line items or **Print** to open the printable tax receipt layout.
   - Press **Escape** key at any time to close active invoice or reservation modals.
   - Click any license plate badge to quickly copy the plate number to your clipboard.
   - Passwords and account registration forms include aria-accessible show/hide toggle controls.

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 📜 Recent Release Commits (v1.6.0)

1. `Add localized payment gateway method tag to digital tax invoice modal` - Updates invoice payment method badge with localized Indian payment options.
2. `Add maximum rental duration guideline note to vehicle reservation form` - Displays 30-day maximum booking duration guideline text in vehicle checkout form.
3. `Add technician average repair turnaround time metric to mechanic dashboard` - Adds 45-minute average turnaround time metric pill to technician workbench.
4. `Update README architecture documentation and recent commit release log` - Documents v1.6.0 release updates, system component enhancements, and recent commit history.

