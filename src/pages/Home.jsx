import React from 'react';
import { useData } from '../context/DataContext';
import { formatINR, getStatusBadgeClass, getStatusLabel } from '../utils/formatters';
import { Car, Wrench, ShieldCheck, Zap, Award, Star, ArrowRight, CheckCircle2, Clock, FileText } from 'lucide-react';

export const Home = ({ setActiveTab, onBookVehicle }) => {
  const { vehicles, bookings, services } = useData();
  const availableVehicles = vehicles.filter(v => v.status === 'available');

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '5rem 0 6rem 0',
        background: 'radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.15) 0%, rgba(11, 15, 25, 0) 70%)',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
              <div className="badge badge-available">
                <Zap size={14} /> Next-Gen Fleet & Maintenance Platform
              </div>
              <div className="badge badge-confirmed" style={{ fontSize: '0.78rem', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
                <Star size={13} fill="var(--accent-amber)" color="var(--accent-amber)" /> 4.98 (2,400+ Customer Reviews)
              </div>
              <div className="badge badge-assigned" style={{ fontSize: '0.78rem' }}>
                ● 24/7 Priority Support
              </div>
            </div>
            <h1 style={{ fontSize: '3.2rem', lineHeight: 1.1, marginBottom: '1.5rem', fontWeight: 800 }}>
              Premium Vehicle Rental & <span className="text-gradient">Instant Mechanic Service</span>
            </h1>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '540px' }}>
              Book high-performance cars, bikes, and vans with transparent daily pricing, or dispatch certified mechanics to your breakdown location in minutes.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
              <button className="btn btn-primary btn-lg" onClick={() => setActiveTab('vehicles')}>
                <Car size={20} /> Rent a Vehicle
              </button>
              <button className="btn btn-secondary btn-lg" onClick={() => setActiveTab('mechanics')}>
                <Wrench size={20} /> Request Mechanic
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span onClick={() => setActiveTab('vehicles')} style={{ cursor: 'pointer', background: 'var(--bg-glass)', border: '1px solid var(--border-color)', padding: '0.35rem 0.75rem', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle2 size={13} color="var(--accent-emerald)" /> Instant Fleet Filter
              </span>
              <span onClick={() => setActiveTab('mechanics')} style={{ cursor: 'pointer', background: 'var(--bg-glass)', border: '1px solid var(--border-color)', padding: '0.35rem 0.75rem', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={13} color="var(--accent-amber)" /> 24/7 Mobile Mechanic
              </span>
              <span onClick={() => setActiveTab('dashboard')} style={{ cursor: 'pointer', background: 'var(--bg-glass)', border: '1px solid var(--border-color)', padding: '0.35rem 0.75rem', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <FileText size={13} color="var(--accent-cyan)" /> Digital Tax Invoices
              </span>
              <span style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-color)', padding: '0.35rem 0.75rem', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <ShieldCheck size={13} color="var(--accent-emerald)" /> 100% Fully Insured
              </span>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div style={{ position: 'relative' }}>
            <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-highlight)' }}>
              <img 
                src="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=80" 
                alt="BMW X5 Luxury SUV"
                style={{ width: '100%', height: '320px', objectFit: 'cover' }}
              />
              <div style={{ padding: '1.5rem', background: 'var(--gradient-card)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.3rem' }}>BMW X5 xDrive40i</h3>
                  <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>₹9,500 <small style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/day</small></span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Luxury midsize SUV with all-wheel drive, digital cockpit & twin-turbo power.
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="badge badge-available">Available Now</span>
                  <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('vehicles')}>
                    Book This Car <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats Counter */}
      <section style={{ padding: '2rem 0', background: 'var(--bg-glass)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container grid grid-cols-4">
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--accent-primary)' }}>
              {availableVehicles.length}+
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>Ready Vehicles</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--accent-cyan)' }}>
              {bookings.length + 140}+
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>Bookings Completed</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--accent-emerald)' }}>
              {services.length + 85}+
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>Emergency Repairs</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--accent-amber)' }}>
              4.9 ★
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>Customer Rating • 1.2k+ Drivers</div>
          </div>
        </div>
      </section>

      {/* Core Services Section */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Comprehensive Services</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>Everything required to keep your mobility seamless and reliable.</p>
          </div>

          <div className="grid grid-cols-3">
            {/* Card 1 */}
            <div className="card">
              <div style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)', width: '54px', height: '54px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Car size={28} />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.75rem' }}>Vehicle Rental</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                Browse our premium fleet of sedans, SUVs, sports bikes, and cargo vans with flexible daily and weekly rates.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-main)', marginBottom: '1.5rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="var(--accent-emerald)" /> Instant date booking</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="var(--accent-emerald)" /> Comprehensive insurance</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="var(--accent-emerald)" /> Clean & inspected fleet</li>
              </ul>
              <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => setActiveTab('vehicles')}>
                Explore Vehicles
              </button>
            </div>

            {/* Card 2 */}
            <div className="card">
              <div style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)', width: '54px', height: '54px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Wrench size={28} />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.75rem' }}>Mechanic Dispatch</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                Stuck on the road? Request an on-site certified mechanic for engine diagnostics, tire swaps, and battery fixes.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-main)', marginBottom: '1.5rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="var(--accent-emerald)" /> 24/7 Roadside Assistance</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="var(--accent-emerald)" /> Certified Master Mechanics</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="var(--accent-emerald)" /> Live Status Tracking</li>
              </ul>
              <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => setActiveTab('mechanics')}>
                Request Service
              </button>
            </div>

            {/* Card 3 */}
            <div className="card">
              <div style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)', width: '54px', height: '54px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <FileText size={28} />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.75rem' }}>Digital Invoicing</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                Transparent billing with automated 18% tax calculation, line item breakdown, and downloadable PDF receipts.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-main)', marginBottom: '1.5rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="var(--accent-emerald)" /> Instant PDF generation</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="var(--accent-emerald)" /> GST & Tax compliant</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="var(--accent-emerald)" /> Full billing history</li>
              </ul>
              <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => setActiveTab('dashboard')}>
                View Invoices
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Fleet Preview */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Featured Vehicle Fleet</h2>
              <p style={{ color: 'var(--text-muted)' }}>Popular rentals ready for immediate reservation</p>
            </div>
            <button className="btn btn-primary" onClick={() => setActiveTab('vehicles')}>
              View All Fleet ({vehicles.length}) <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-3">
            {vehicles.slice(0, 3).map(v => (
              <div className="card" key={v.id} style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ position: 'relative' }}>
                  <img src={v.image} alt={v.vehicle_name} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                  <span className={`badge badge-${v.status}`} style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                    {v.status}
                  </span>
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                    {v.brand} • {v.vehicle_type}
                  </div>
                  <h3 style={{ fontSize: '1.2rem', margin: '0.25rem 0 0.5rem 0' }}>{v.vehicle_name}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.2rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {v.description}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem' }}>
                    <div>
                      <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>₹{v.rent_price}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}> / day</span>
                    </div>
                    <button 
                      className="btn btn-primary btn-sm" 
                      disabled={v.status !== 'available'}
                      onClick={() => {
                        setActiveTab('vehicles');
                      }}
                    >
                      {v.status === 'available' ? 'Book Now' : 'Not Available'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
