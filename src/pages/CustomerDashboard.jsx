import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { InvoiceModal } from '../components/InvoiceModal';
import { formatINR, formatDateIN, getStatusBadgeClass, getStatusLabel } from '../utils/formatters';
import { Car, Wrench, FileText, Calendar, DollarSign, CheckCircle2, Clock, AlertCircle, Printer, RotateCcw, X } from 'lucide-react';

export const CustomerDashboard = ({ setActiveTab }) => {
  const { bookings, services, bills } = useData();
  const { currentUser } = useAuth();
  const [selectedBill, setSelectedBill] = useState(null);
  const [bookingFilter, setBookingFilter] = useState('all');

  // Filter items for current user
  const userBookings = bookings.filter(b => b.user_id === currentUser.id);
  const filteredBookings = userBookings.filter(b => bookingFilter === 'all' || b.status.toLowerCase() === bookingFilter.toLowerCase());
  const userServices = services.filter(s => s.user_id === currentUser.id);
  const userBills = bills.filter(b => b.user_id === currentUser.id);

  const totalSpent = userBills.reduce((acc, curr) => acc + (Number(curr.total_amount) || 0), 0);

  return (
    <div className="container fade-in" style={{ padding: '3rem 1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.4rem' }}>
            Welcome back, <span className="text-gradient">{currentUser.name}</span>
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
            <span className="badge badge-available" style={{ fontSize: '0.72rem' }}>
              ● Verified Customer • Account Active
            </span>
            {userServices.length > 0 && (
              <span className="badge badge-assigned" style={{ fontSize: '0.72rem' }}>
                ● {userServices.length} Service Tickets
              </span>
            )}
          </div>
          <p style={{ color: 'var(--text-muted)' }}>
            Manage your active vehicle rentals, requested mechanic services, and digital invoices.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" onClick={() => setActiveTab('vehicles')}>
            <Car size={16} /> Rent New Vehicle
          </button>
          <button className="btn btn-secondary" onClick={() => setActiveTab('mechanics')}>
            <Wrench size={16} /> Request Mechanic
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4" style={{ marginBottom: '2.5rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)', width: '54px', height: '54px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Car size={26} />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{userBookings.length}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Rental Reservations</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)', width: '54px', height: '54px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wrench size={26} />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{userServices.length}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Service Tickets</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }} title="Cumulative gross expenditure for settled rentals and maintenance services">
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', width: '54px', height: '54px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={26} />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
              {formatINR(totalSpent)}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Settled Bills</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)', width: '54px', height: '54px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={26} />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
              {userBills.length}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Digital Invoices</div>
          </div>
        </div>
      </div>

      {/* Status Legend Guidance Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', background: 'var(--bg-glass)', border: '1px solid var(--border-color)', padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-sm)', marginBottom: '2.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>Status Guide:</span>
        <span className="badge badge-confirmed">● Active / Confirmed</span>
        <span className="badge badge-assigned">● In Progress</span>
        <span className="badge badge-completed">● Completed / Settled</span>
        <span className="badge badge-cancelled">● Cancelled</span>
      </div>

      {/* Bookings Section */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <Car size={22} color="var(--accent-primary)" /> My Rental Reservations ({filteredBookings.length})
            </h2>
            {userBookings.filter(b => b.status === 'active').length > 0 && (
              <span className="badge badge-confirmed" style={{ fontSize: '0.78rem' }}>
                {userBookings.filter(b => b.status === 'active').length} Active Now
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {bookingFilter !== 'all' && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setBookingFilter('all')}
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', borderRadius: 'var(--radius-xs)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                title="Reset filter standard"
              >
                <RotateCcw size={12} /> Clear Filter
              </button>
            )}
            <div style={{ display: 'flex', gap: '0.35rem', background: 'var(--bg-card)', padding: '0.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              {['all', 'active', 'confirmed', 'completed', 'cancelled'].map(f => (
                <button
                  key={f}
                  onClick={() => setBookingFilter(f)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-xs)',
                    border: 'none',
                    background: bookingFilter === f ? 'var(--gradient-primary)' : 'transparent',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    textTransform: 'capitalize',
                    cursor: 'pointer'
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <Car size={40} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
            <p>No vehicle reservations match the selected filter standard.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredBookings.map(b => {
              const matchedBill = bills.find(bill => bill.booking_id === b.id);
              return (
                <div key={b.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                      <h3 style={{ fontSize: '1.2rem' }}>{b.vehicle_name}</h3>
                      <span className={`badge ${getStatusBadgeClass(b.status)}`}>{getStatusLabel(b.status)}</span>
                      {b.status === 'active' && <span className="badge badge-available" style={{ fontSize: '0.72rem' }}>● Verified Keyless Access</span>}
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Booking ID: #{b.id} • Dates: <strong>{formatDateIN(b.start_date)}</strong> to <strong>{formatDateIN(b.end_date)}</strong> ({b.total_days} Days)
                    </p>
                    {b.notes && <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: '0.25rem' }}>Note: {b.notes}</div>}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{formatINR(b.total_cost)}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {b.total_days} {b.total_days === 1 ? 'day' : 'days'} reservation (incl. 18% GST)
                      </div>
                    </div>

                    {matchedBill && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => setSelectedBill(matchedBill)} title="Inspect digital tax receipt invoice details">
                          <FileText size={14} /> View Invoice
                        </button>
                        <button 
                          className="btn btn-primary btn-sm"
                          title="Print official tax receipt PDF"
                          onClick={() => {
                            setSelectedBill(matchedBill);
                            setTimeout(() => window.print(), 200);
                          }}
                        >
                          <Printer size={14} /> Print
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Service Tickets Section */}
      <div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Wrench size={22} color="var(--accent-amber)" /> My Mechanic Service Tickets ({userServices.length})
        </h2>

        {userServices.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <Wrench size={40} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
            <p>No roadside service requests submitted yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {userServices.map(s => {
              const matchedBill = bills.find(bill => bill.service_id === s.id);
              return (
                <div key={s.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                      <h3 style={{ fontSize: '1.15rem' }}>Ticket #{s.id} - {s.vehicle_model}</h3>
                      <span className={`badge badge-${s.status}`}>{s.status.replace('_', ' ')}</span>
                      {s.is_emergency && <span className="badge badge-maintenance">URGENT EMERGENCY</span>}
                    </div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Problem: {s.problem_description}
                    </p>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                      Location: {s.service_location} • Assigned Mechanic: <strong>{s.mechanic_name}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        {formatINR(s.service_cost || 0)}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated Cost</div>
                    </div>

                    {matchedBill && (
                      <button className="btn btn-secondary btn-sm" onClick={() => setSelectedBill(matchedBill)}>
                        <FileText size={14} /> Service Bill
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Invoice Viewer Modal */}
      {selectedBill && (
        <InvoiceModal bill={selectedBill} onClose={() => setSelectedBill(null)} />
      )}
    </div>
  );
};
