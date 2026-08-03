import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, Calendar, CheckCircle, Shield, AlertCircle, X, DollarSign } from 'lucide-react';

export const Vehicles = ({ setActiveTab }) => {
  const { vehicles, createBooking } = useData();
  const { currentUser } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Booking form state
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // Filtering logic
  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.vehicle_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || v.vehicle_type.toLowerCase() === selectedType.toLowerCase();
    return matchesSearch && matchesType;
  });

  // Calculate pricing
  const calculateCost = () => {
    if (!selectedVehicle || !startDate || !endDate) return { days: 0, subtotal: 0, tax: 0, total: 0 };
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const subtotal = days * selectedVehicle.rent_price;
    const tax = Math.round(subtotal * 0.18 * 100) / 100;
    const total = subtotal + tax;
    return { days, subtotal, tax, total };
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!selectedVehicle) return;

    const result = createBooking(currentUser, selectedVehicle, startDate, endDate, notes);
    setBookingSuccess(result.bill);
  };

  const pricing = calculateCost();

  return (
    <div className="container fade-in" style={{ padding: '3rem 1.5rem' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>
          Vehicle <span className="text-gradient">Rental Fleet</span>
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Explore our fully inspected vehicles available for daily and long-term rental.
        </p>
      </div>

      {/* Controls Bar */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: '2rem', background: 'var(--bg-card)', padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text"
            className="form-control"
            placeholder="Search by vehicle name, brand or model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.75rem' }}
          />
        </div>

        {/* Type Pill Filter */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {['all', 'car', 'bike', 'van', 'bus', 'truck'].map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-color)',
                background: selectedType === type ? 'var(--gradient-primary)' : 'var(--bg-glass)',
                color: '#ffffff',
                fontSize: '0.85rem',
                fontWeight: 600,
                textTransform: 'capitalize',
                cursor: 'pointer'
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-3">
        {filteredVehicles.map(vehicle => (
          <div className="card" key={vehicle.id} style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ position: 'relative' }}>
              <img 
                src={vehicle.image} 
                alt={vehicle.vehicle_name}
                style={{ width: '100%', height: '220px', objectFit: 'cover' }}
              />
              <span className={`badge badge-${vehicle.status}`} style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                {vehicle.status}
              </span>
              <span style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'rgba(0,0,0,0.7)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', color: '#fff', fontWeight: 600 }}>
                {vehicle.license_plate}
              </span>
            </div>

            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
                  {vehicle.brand} • {vehicle.year}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Type: <strong style={{ color: 'var(--text-main)', textTransform: 'capitalize' }}>{vehicle.vehicle_type}</strong>
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{vehicle.vehicle_name}</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem', minHeight: '42px', lineHeight: 1.5 }}>
                {vehicle.description}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <div>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>${vehicle.rent_price}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}> / day</span>
                </div>

                <button 
                  className={`btn ${vehicle.status === 'available' ? 'btn-primary' : 'btn-secondary'}`}
                  disabled={vehicle.status !== 'available'}
                  onClick={() => {
                    setSelectedVehicle(vehicle);
                    setBookingSuccess(null);
                  }}
                >
                  {vehicle.status === 'available' ? 'Book Vehicle' : 'Unavailable'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          <AlertCircle size={48} style={{ marginBottom: '1rem', color: 'var(--accent-amber)' }} />
          <h3>No vehicles found matching your query</h3>
          <p>Try clearing filters or searching for another term.</p>
        </div>
      )}

      {/* Booking Modal */}
      {selectedVehicle && (
        <div className="modal-overlay" onClick={() => setSelectedVehicle(null)}>
          <div className="modal-content fade-in" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem' }}>Reserve {selectedVehicle.vehicle_name}</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Customer: <strong>{currentUser.name}</strong> ({currentUser.email})</p>
              </div>
              <button onClick={() => setSelectedVehicle(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {bookingSuccess ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <CheckCircle size={56} color="var(--accent-emerald)" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Reservation Confirmed!</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  Booking <strong>#{bookingSuccess.booking_id}</strong> is active. Invoice <strong>{bookingSuccess.invoice_number}</strong> generated.
                </p>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <button className="btn btn-primary" onClick={() => { setSelectedVehicle(null); setActiveTab('dashboard'); }}>
                    Go to My Bookings
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label"><Calendar size={14} /> Start Date</label>
                    <input 
                      type="date"
                      className="form-control"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label"><Calendar size={14} /> End Date</label>
                    <input 
                      type="date"
                      className="form-control"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Rental Notes / Special Requirements</label>
                  <textarea 
                    className="form-control"
                    rows="3"
                    placeholder="E.g., Preferred pickup spot, booster seat required..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  ></textarea>
                </div>

                {/* Price Breakdown Box */}
                <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '1.25rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Daily Rate:</span>
                    <span>${selectedVehicle.rent_price} / day</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Total Rental Days:</span>
                    <span>{pricing.days} Days</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Subtotal:</span>
                    <span>${pricing.subtotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.6rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>GST Tax (18%):</span>
                    <span>${pricing.tax.toFixed(2)}</span>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.6rem', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.15rem' }}>
                    <span>Total Amount:</span>
                    <span style={{ color: 'var(--accent-cyan)' }}>${pricing.total.toFixed(2)}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedVehicle(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Confirm & Reserve
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
