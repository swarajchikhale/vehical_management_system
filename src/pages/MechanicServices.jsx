import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { formatINR, getStatusBadgeClass, getStatusLabel } from '../utils/formatters';
import { Wrench, AlertTriangle, MapPin, Calendar, Clock, CheckCircle2, PhoneCall, ShieldCheck, Search, Star } from 'lucide-react';

export const MechanicServices = ({ setActiveTab }) => {
  const { services, createServiceRequest, mechanics } = useData();
  const { currentUser } = useAuth();

  const [vehicleType, setVehicleType] = useState('car');
  const [vehicleModel, setVehicleModel] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [serviceLocation, setServiceLocation] = useState('');
  const [preferredDate, setPreferredDate] = useState(new Date().toISOString().split('T')[0]);
  const [isEmergency, setIsEmergency] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);
  const [mechSearchTerm, setMechSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const serviceData = {
      vehicle_type: vehicleType,
      vehicle_model: vehicleModel || `${vehicleType.toUpperCase()} Standard`,
      problem_description: problemDescription,
      service_location: serviceLocation,
      preferred_date: preferredDate,
      is_emergency: isEmergency
    };

    const newTicket = createServiceRequest(currentUser, serviceData);
    setSubmittedTicket(newTicket);
  };

  const quickIssues = [
    'Engine Overheating & Smoke',
    'Dead Battery / Alternator Issue',
    'Flat Tire / Puncture Repair',
    'Brake Squeal / Fluid Leak',
    'AC & Electrical Failure'
  ];

  return (
    <div className="container fade-in" style={{ padding: '3rem 1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.85rem' }}>
          <AlertTriangle size={14} /> 24/7 Mobile Mechanic Hotline Active
        </div>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>
          Request Roadside <span className="text-gradient">Mechanic Dispatch</span>
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Submit issue details below to dispatch a certified master mechanic directly to your current location.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
        
        {/* Request Form */}
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Wrench size={22} color="var(--accent-amber)" /> Service Request Form
          </h3>

          {submittedTicket ? (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <CheckCircle2 size={56} color="var(--accent-emerald)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Dispatch Ticket #{submittedTicket.id} Created</h3>
              <div style={{ marginBottom: '1rem' }}>
                <span className={`badge ${submittedTicket.is_emergency ? 'badge-maintenance' : 'badge-confirmed'}`} style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem' }}>
                  <Clock size={14} /> Estimated Technician Arrival: {submittedTicket.is_emergency ? '15 - 25 Mins (Priority Unit)' : '45 - 60 Mins'}
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Your request has been routed to our dispatcher. A certified mechanic will contact you shortly at <strong>{currentUser.phone}</strong>.
              </p>

              <button className="btn btn-primary" onClick={() => { setSubmittedTicket(null); setProblemDescription(''); setServiceLocation(''); }}>
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Emergency Switch */}
              <div style={{ background: isEmergency ? 'rgba(244, 63, 94, 0.15)' : 'var(--bg-glass)', border: isEmergency ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid var(--border-color)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <strong style={{ color: isEmergency ? 'var(--accent-rose)' : 'var(--text-main)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <AlertTriangle size={16} /> Urgent Roadside Emergency?
                  </strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Prioritize instant dispatch within 30 minutes</span>
                </div>
                <input 
                  type="checkbox"
                  checked={isEmergency}
                  onChange={(e) => setIsEmergency(e.target.checked)}
                  style={{ width: '20px', height: '20px', accentColor: 'var(--accent-rose)', cursor: 'pointer' }}
                />
              </div>

              {/* Vehicle Type & Model */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Vehicle Category</label>
                  <select 
                    className="form-select"
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                  >
                    <option value="car">Car / SUV / Sedan</option>
                    <option value="bike">Motorcycle / Scooter</option>
                    <option value="van">Passenger / Cargo Van</option>
                    <option value="truck">Truck / Pickup</option>
                    <option value="bus">Bus / Transport</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Vehicle Brand & Model</label>
                  <input 
                    type="text"
                    className="form-control"
                    placeholder="E.g. Honda Civic 2021"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Quick Issue Selector */}
              <div className="form-group">
                <label className="form-label">Quick Issue Tags</label>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {quickIssues.map(issue => (
                    <button
                      type="button"
                      key={issue}
                      onClick={() => setProblemDescription(prev => prev ? `${prev}. ${issue}` : issue)}
                      style={{
                        padding: '0.35rem 0.65rem',
                        fontSize: '0.78rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-muted)',
                        cursor: 'pointer'
                      }}
                    >
                      + {issue}
                    </button>
                  ))}
                </div>
              </div>

              {/* Problem Description */}
              <div className="form-group">
                <label className="form-label">Problem Details</label>
                <textarea 
                  className="form-control"
                  rows="3"
                  placeholder="Describe symptoms, noise, warning indicators, or damage..."
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  required
                ></textarea>
              </div>

              {/* Location & Preferred Date */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label"><MapPin size={14} /> Service Location Address</label>
                  <input 
                    type="text"
                    className="form-control"
                    placeholder="Street, Landmark or Highway mile"
                    value={serviceLocation}
                    onChange={(e) => setServiceLocation(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label"><Calendar size={14} /> Preferred Date</label>
                  <input 
                    type="date"
                    className="form-control"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className={`btn ${isEmergency ? 'btn-danger' : 'btn-primary'}`} style={{ width: '100%', marginTop: '0.5rem' }}>
                <Wrench size={18} /> {isEmergency ? 'DISPATCH EMERGENCY MECHANIC NOW' : 'Schedule Service Request'}
              </button>
            </form>
          )}
        </div>

        {/* Available Mechanics Panel */}
        <div>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={20} color="var(--accent-emerald)" /> Certified On-Call Mechanics
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Our certified mechanics are equipped with mobile diagnostic tools and genuine replacement parts.
            </p>

            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-control"
                placeholder="Filter mechanics by name or spec..."
                value={mechSearchTerm}
                onChange={(e) => setMechSearchTerm(e.target.value)}
                style={{ paddingLeft: '2.25rem', fontSize: '0.82rem' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {mechanics
                .filter(m => m.name.toLowerCase().includes(mechSearchTerm.toLowerCase()) || m.specialization.toLowerCase().includes(mechSearchTerm.toLowerCase()))
                .map(m => (
                  <div key={m.id} style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontSize: '1rem', margin: 0 }}>{m.name}</h4>
                      <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)' }}>{m.specialization}</span>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        Exp: {m.experience_years} yrs • {formatINR(m.hourly_rate, false)}/hr • <Star size={12} color="var(--accent-amber)" fill="var(--accent-amber)" /> {m.rating} ({m.total_reviews} reviews)
                      </div>
                    </div>

                    <span className={`badge ${getStatusBadgeClass(m.availability)}`}>
                      {getStatusLabel(m.availability)}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          <div style={{ background: 'var(--gradient-card)', border: '1px solid var(--border-highlight)', borderRadius: 'var(--radius-md)', padding: '1.5rem', textAlign: 'center' }}>
            <PhoneCall size={32} color="var(--accent-cyan)" style={{ marginBottom: '0.75rem' }} />
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Direct Dispatch Hotline</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Speak directly with a master technician 24/7</p>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>+1 (800) 555-3748</div>
          </div>
        </div>

      </div>
    </div>
  );
};
