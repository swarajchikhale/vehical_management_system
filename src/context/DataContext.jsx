import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

const INITIAL_VEHICLES = [
  {
    id: 1,
    vehicle_name: 'Toyota Camry Executive',
    vehicle_type: 'car',
    brand: 'Toyota',
    model: 'Camry Hybrid',
    year: 2023,
    license_plate: 'CAM-8821',
    rent_price: 65,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80',
    description: 'Sleek sedan with premium leather interior, hybrid efficiency, advanced safety features, and smooth ride for long trips.'
  },
  {
    id: 2,
    vehicle_name: 'BMW X5 xDrive40i',
    vehicle_type: 'car',
    brand: 'BMW',
    model: 'X5',
    year: 2024,
    license_plate: 'BMW-9901',
    rent_price: 135,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
    description: 'Luxury midsize SUV with all-wheel drive, panoramic sunroof, digital cockpit, and twin-turbo performance.'
  },
  {
    id: 3,
    vehicle_name: 'Yamaha YZF-R7 Supersport',
    vehicle_type: 'bike',
    brand: 'Yamaha',
    model: 'R7',
    year: 2023,
    license_plate: 'YAM-7721',
    rent_price: 35,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
    description: 'Agile sports motorcycle featuring a 689cc CP2 engine, aggressive ergonomics, and responsive handling.'
  },
  {
    id: 4,
    vehicle_name: 'Ford Transit Custom Cargo',
    vehicle_type: 'van',
    brand: 'Ford',
    model: 'Transit Custom',
    year: 2022,
    license_plate: 'VAN-4022',
    rent_price: 85,
    status: 'rented',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    description: 'Spacious payload capacity with rear barn doors, tie-down anchor points, and Bluetooth telematics for transport.'
  },
  {
    id: 5,
    vehicle_name: 'Mercedes-Benz Sprinter Passenger',
    vehicle_type: 'bus',
    brand: 'Mercedes',
    model: 'Sprinter 15-Pass',
    year: 2023,
    license_plate: 'BUS-1004',
    rent_price: 160,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
    description: 'Luxury group shuttle van with seating for 15 passengers, high-ceiling comfort, and overhead storage.'
  },
  {
    id: 6,
    vehicle_name: 'Mahindra PikUp Heavy-Duty',
    vehicle_type: 'truck',
    brand: 'Mahindra',
    model: 'PikUp 4x4',
    year: 2021,
    license_plate: 'TRK-9011',
    rent_price: 75,
    status: 'maintenance',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    description: 'Rugged 4x4 utility pickup built for tough off-road terrain, heavy towing, and construction logistics.'
  }
];

const INITIAL_MECHANICS = [
  {
    id: 101,
    name: 'John Mechanic',
    specialization: 'Engine & Electrical',
    experience_years: 6,
    hourly_rate: 45,
    availability: 'available',
    phone: '+1 (555) 019-4820',
    rating: 4.9,
    total_reviews: 38
  },
  {
    id: 102,
    name: 'Alex Rivera',
    specialization: 'Transmission & Brakes',
    experience_years: 8,
    hourly_rate: 50,
    availability: 'busy',
    phone: '+1 (555) 019-8823',
    rating: 4.8,
    total_reviews: 45
  },
  {
    id: 103,
    name: 'Sarah Chen',
    specialization: 'AC & EV Systems',
    experience_years: 5,
    hourly_rate: 40,
    availability: 'available',
    phone: '+1 (555) 019-3390',
    rating: 5.0,
    total_reviews: 29
  }
];

const INITIAL_BOOKINGS = [
  {
    id: 1001,
    user_id: 3,
    user_name: 'Jane Customer',
    vehicle_id: 4,
    vehicle_name: 'Ford Transit Custom Cargo',
    start_date: '2026-08-01',
    end_date: '2026-08-05',
    total_days: 5,
    rent_price: 85,
    subtotal: 425,
    tax_amount: 76.5,
    total_cost: 501.5,
    status: 'active',
    notes: 'Moving equipment for weekend event.'
  }
];

const INITIAL_SERVICES = [
  {
    id: 2001,
    user_id: 3,
    user_name: 'Jane Customer',
    user_phone: '+1 (555) 019-7711',
    mechanic_id: 102,
    mechanic_name: 'Alex Rivera',
    vehicle_type: 'car',
    vehicle_model: 'Honda Civic 2021',
    problem_description: 'Engine overheating on highway, warning indicator lamp illuminated.',
    service_location: '742 Evergreen Terrace, Sector 4',
    preferred_date: '2026-08-04',
    status: 'in_progress',
    is_emergency: true,
    service_cost: 120,
    completion_notes: 'Replaced radiator hose and flushed coolant system.'
  }
];

const INITIAL_BILLS = [
  {
    id: 3001,
    invoice_number: 'INV-2026-1001',
    user_id: 3,
    user_name: 'Jane Customer',
    bill_type: 'rental',
    item_title: 'Ford Transit Custom Cargo (5 Days)',
    booking_id: 1001,
    subtotal: 425.00,
    tax_amount: 76.50,
    total_amount: 501.50,
    status: 'paid',
    payment_method: 'Credit Card (**** 4821)',
    created_at: '2026-08-01'
  }
];

export const DataProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState(() => {
    const saved = localStorage.getItem('dp_vehicles');
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });

  const [mechanics, setMechanics] = useState(() => {
    const saved = localStorage.getItem('dp_mechanics');
    return saved ? JSON.parse(saved) : INITIAL_MECHANICS;
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('dp_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [services, setServices] = useState(() => {
    const saved = localStorage.getItem('dp_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [bills, setBills] = useState(() => {
    const saved = localStorage.getItem('dp_bills');
    return saved ? JSON.parse(saved) : INITIAL_BILLS;
  });

  // Sync state to local storage
  useEffect(() => { localStorage.setItem('dp_vehicles', JSON.stringify(vehicles)); }, [vehicles]);
  useEffect(() => { localStorage.setItem('dp_mechanics', JSON.stringify(mechanics)); }, [mechanics]);
  useEffect(() => { localStorage.setItem('dp_bookings', JSON.stringify(bookings)); }, [bookings]);
  useEffect(() => { localStorage.setItem('dp_services', JSON.stringify(services)); }, [services]);
  useEffect(() => { localStorage.setItem('dp_bills', JSON.stringify(bills)); }, [bills]);

  // Actions
  const addVehicle = (vehicleData) => {
    const newId = Date.now();
    const newVehicle = { id: newId, status: 'available', ...vehicleData };
    setVehicles([newVehicle, ...vehicles]);
    return newVehicle;
  };

  const updateVehicleStatus = (vehicleId, status) => {
    setVehicles(vehicles.map(v => v.id === vehicleId ? { ...v, status } : v));
  };

  const deleteVehicle = (vehicleId) => {
    setVehicles(vehicles.filter(v => v.id !== vehicleId));
  };

  const createBooking = (user, vehicle, startDate, endDate, notes) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const subtotal = totalDays * vehicle.rent_price;
    const tax_amount = Math.round(subtotal * 0.18 * 100) / 100;
    const total_cost = subtotal + tax_amount;

    const bookingId = Math.floor(1000 + Math.random() * 9000);
    const newBooking = {
      id: bookingId,
      user_id: user.id,
      user_name: user.name,
      vehicle_id: vehicle.id,
      vehicle_name: vehicle.vehicle_name,
      start_date: startDate,
      end_date: endDate,
      total_days: totalDays,
      rent_price: vehicle.rent_price,
      subtotal,
      tax_amount,
      total_cost,
      status: 'confirmed',
      notes,
      created_at: new Date().toISOString().split('T')[0]
    };

    // Mark vehicle as rented
    updateVehicleStatus(vehicle.id, 'rented');
    setBookings([newBooking, ...bookings]);

    // Auto-generate Bill
    const newBill = {
      id: Math.floor(3000 + Math.random() * 9000),
      invoice_number: `INV-2026-${bookingId}`,
      user_id: user.id,
      user_name: user.name,
      bill_type: 'rental',
      item_title: `${vehicle.vehicle_name} (${totalDays} Days)`,
      booking_id: bookingId,
      subtotal,
      tax_amount,
      total_amount: total_cost,
      status: 'paid',
      payment_method: 'Online Payment',
      created_at: new Date().toISOString().split('T')[0]
    };
    setBills([newBill, ...bills]);

    return { booking: newBooking, bill: newBill };
  };

  const createServiceRequest = (user, serviceData) => {
    const serviceId = Math.floor(2000 + Math.random() * 9000);
    const newService = {
      id: serviceId,
      user_id: user.id,
      user_name: user.name,
      user_phone: user.phone || '+1 (555) 012-3456',
      mechanic_id: null,
      mechanic_name: 'Unassigned',
      status: 'pending',
      service_cost: 0,
      completion_notes: '',
      created_at: new Date().toISOString().split('T')[0],
      ...serviceData
    };
    setServices([newService, ...services]);
    return newService;
  };

  const assignMechanicToService = (serviceId, mechanicId) => {
    const selectedMech = mechanics.find(m => m.id === Number(mechanicId));
    setServices(services.map(s => {
      if (s.id === serviceId) {
        return {
          ...s,
          mechanic_id: selectedMech ? selectedMech.id : null,
          mechanic_name: selectedMech ? selectedMech.name : 'Unassigned',
          status: 'assigned'
        };
      }
      return s;
    }));
  };

  const updateServiceStatus = (serviceId, status, cost = 0, notes = '') => {
    setServices(services.map(s => {
      if (s.id === serviceId) {
        const updated = { ...s, status };
        if (cost > 0) updated.service_cost = cost;
        if (notes) updated.completion_notes = notes;
        
        // If completed, generate service invoice
        if (status === 'completed' && s.status !== 'completed') {
          const subtotal = Number(cost) || 100;
          const tax_amount = Math.round(subtotal * 0.18 * 100) / 100;
          const total_amount = subtotal + tax_amount;
          
          const newBill = {
            id: Math.floor(3000 + Math.random() * 9000),
            invoice_number: `INV-SVC-${serviceId}`,
            user_id: s.user_id,
            user_name: s.user_name,
            bill_type: 'service',
            item_title: `Mechanic Service - ${s.vehicle_type.toUpperCase()} (${s.mechanic_name})`,
            service_id: serviceId,
            subtotal,
            tax_amount,
            total_amount,
            status: 'pending',
            payment_method: 'Direct Billing',
            created_at: new Date().toISOString().split('T')[0]
          };
          setBills(prev => [newBill, ...prev]);
        }
        return updated;
      }
      return s;
    }));
  };

  const updateBookingStatus = (bookingId, status) => {
    setBookings(bookings.map(b => {
      if (b.id === bookingId) {
        // If cancelled or completed, release vehicle
        if (status === 'cancelled' || status === 'completed') {
          updateVehicleStatus(b.vehicle_id, 'available');
        }
        return { ...b, status };
      }
      return b;
    }));
  };

  const resetToDefault = () => {
    setVehicles(INITIAL_VEHICLES);
    setMechanics(INITIAL_MECHANICS);
    setBookings(INITIAL_BOOKINGS);
    setServices(INITIAL_SERVICES);
    setBills(INITIAL_BILLS);
    localStorage.clear();
  };

  return (
    <DataContext.Provider value={{
      vehicles,
      mechanics,
      bookings,
      services,
      bills,
      addVehicle,
      updateVehicleStatus,
      deleteVehicle,
      createBooking,
      createServiceRequest,
      assignMechanicToService,
      updateServiceStatus,
      updateBookingStatus,
      resetToDefault
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
