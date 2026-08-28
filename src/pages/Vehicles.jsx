import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { formatINR, getStatusBadgeClass, getStatusLabel } from '../utils/formatters';

import { Search, Filter, Calendar, CheckCircle, Shield, AlertCircle, X, DollarSign, Star } from 'lucide-react';

export const Vehicles = ({ setActiveTab }) => {
  const { vehicles, createBooking } = useData();
  const { currentUser } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Booking form state
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // Filtering & sorting logic
  const filteredVehicles = vehicles
    .filter(v => {
      const matchesSearch = v.vehicle_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            v.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            v.license_plate.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || v.vehicle_type.toLowerCase() === selectedType.toLowerCase();
      const matchesStatus = statusFilter === 'all' || v.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'price_low') return a.rent_price - b.rent_price;
      if (sortBy === 'price_high') return b.rent_price - a.rent_price;
      if (sortBy === 'year_new') return b.year - a.year;
      return 0;
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
    if (new Date(endDate) < new Date(startDate)) {
      alert('End date cannot be prior to start date. Please select a valid checkout date.');
      return;
    }

    const result = createBooking(currentUser, selectedVehicle, startDate, endDate, notes);
    setBookingSuccess(result.bill);
  };

  const pricing = calculateCost();
  const todayStr = new Date().toISOString().split('T')[0];

  const availableCount = vehicles.filter(v => v.status === 'available').length;
  const rentedCount = vehicles.filter(v => v.status === 'rented').length;

  return (
    <div className="container fade-in" style={{ padding: '3rem 1.5rem' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>
            Vehicle <span className="text-gradient">Rental Fleet</span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Explore our fully inspected vehicles available for daily and long-term rental.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span className="badge badge-available" style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}>
            ● {availableCount} Vehicles Available
          </span>
          <span className="badge badge-maintenance" style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}>
            ● {rentedCount} Currently Rented
          </span>
          <span className="badge badge-confirmed" style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}>
            ● 85% Active Readiness Rate
          </span>
        </div>
      </div>

      {/* Controls Bar */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: '2rem', background: 'var(--bg-card)', padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: searchTerm ? 'var(--accent-primary)' : 'var(--text-muted)' }} />
          <input 
            type="text"
            className="form-control"
            placeholder="Search by vehicle name, brand, model or plate..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.75rem', paddingRight: searchTerm ? '2.5rem' : '1rem', borderColor: searchTerm ? 'var(--accent-primary)' : 'var(--border-color)' }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Clear vehicle search query"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Type Pill Filter & Sort */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {['all', 'car', 'bike', 'van', 'bus', 'truck'].map(type => {
              const count = type === 'all' ? vehicles.length : vehicles.filter(v => v.vehicle_type.toLowerCase() === type).length;
              return (
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
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  {type}
                  <span style={{ fontSize: '0.68rem', padding: '0.05rem 0.35rem', borderRadius: '9999px', background: 'rgba(255,255,255,0.2)' }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.25rem 0.5rem' }}>
            <Filter size={14} color="var(--accent-primary)" style={{ marginRight: '0.35rem' }} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                background: 'transparent',
                color: 'var(--text-main)',
                border: 'none',
                outline: 'none',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <option value="all">Status: All Statuses</option>
              <option value="available">Status: Available</option>
              <option value="rented">Status: Rented</option>
              <option value="maintenance">Status: Maintenance</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.25rem 0.5rem' }} title="Sort rental vehicles by price or release year">
            <Filter size={14} color="var(--accent-primary)" style={{ marginRight: '0.35rem' }} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: 'transparent',
                color: 'var(--text-main)',
                border: 'none',
                outline: 'none',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <option value="default">Sort: Recommended</option>
              <option value="price_low">Sort: Price Low → High</option>
              <option value="price_high">Sort: Price High → Low</option>
              <option value="year_new">Sort: Newest Year First</option>
            </select>
          </div>

          {(searchTerm || selectedType !== 'all' || statusFilter !== 'all' || sortBy !== 'default') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedType('all');
                setStatusFilter('all');
                setSortBy('default');
              }}
              className="btn btn-secondary btn-sm"
              style={{ borderRadius: 'var(--radius-sm)', padding: '0.4rem 0.75rem' }}
            >
              Reset Filters
            </button>
          )}
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
              <span className={`badge ${getStatusBadgeClass(vehicle.status)}`} style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                {getStatusLabel(vehicle.status)}
              </span>
              <span 
                onClick={() => navigator.clipboard.writeText(vehicle.license_plate)}
                title="Click to copy license plate"
                style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'rgba(0,0,0,0.78)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', color: '#fff', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease' }}
              >
                {vehicle.license_plate}
              </span>
            </div>

            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
                  {vehicle.brand} • {vehicle.year}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--accent-amber)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                  <Star size={12} fill="var(--accent-amber)" color="var(--accent-amber)" /> {vehicle.rating || 4.9} ({vehicle.trips_completed || 24} trips)
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.35rem' }}>{vehicle.vehicle_name}</h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.65rem', display: 'flex', gap: '0.5rem' }}>
                <span style={{ background: 'var(--bg-secondary)', padding: '0.1rem 0.45rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>Automatic</span>
                <span style={{ background: 'var(--bg-secondary)', padding: '0.1rem 0.45rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>Insured</span>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem', minHeight: '42px', lineHeight: 1.5 }}>
                {vehicle.description}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <div>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{formatINR(vehicle.rent_price, false)}</span>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Reserve {selectedVehicle.vehicle_name}</h2>
                  <span className="badge badge-confirmed" style={{ fontSize: '0.75rem' }}>
                    {pricing.days} {pricing.days === 1 ? 'Day' : 'Days'} Selected
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Customer: <strong>{currentUser.name}</strong> ({currentUser.email})</p>
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
                      min={todayStr}
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
                      min={startDate || todayStr}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem', marginTop: '-0.5rem' }}>
                  Note: Maximum 30 consecutive days allowed per single online rental reservation.
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
                    <span>{formatINR(selectedVehicle.rent_price, false)} / day</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Total Rental Days:</span>
                    <span>{pricing.days} Days</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Subtotal:</span>
                    <span>{formatINR(pricing.subtotal)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.6rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>GST Tax (18%):</span>
                    <span>{formatINR(pricing.tax)}</span>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.6rem', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.15rem' }}>
                    <span>Total Amount:</span>
                    <span style={{ color: 'var(--accent-cyan)' }}>{formatINR(pricing.total)}</span>
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
