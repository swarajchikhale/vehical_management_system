import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Wrench, CheckCircle, Clock, MapPin, Phone, AlertTriangle, FileCheck } from 'lucide-react';

export const MechanicDashboard = () => {
  const { services, updateServiceStatus, mechanics } = useData();
  const { currentUser } = useAuth();

  const [editingServiceId, setEditingServiceId] = useState(null);
  const [costInput, setCostInput] = useState('');
  const [notesInput, setNotesInput] = useState('');

  // Get assigned services for this mechanic
  const assignedJobs = services.filter(s => s.mechanic_id === currentUser.id || s.mechanic_name === currentUser.name);

  const handleUpdateJob = (serviceId, status) => {
    if (status === 'completed') {
      const cost = Number(costInput) || 120;
      const notes = notesInput || 'Repair completed successfully and tested.';
      updateServiceStatus(serviceId, 'completed', cost, notes);
      setEditingServiceId(null);
    } else {
      updateServiceStatus(serviceId, status);
    }
  };

  return (
    <div className="container fade-in" style={{ padding: '3rem 1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="badge badge-assigned" style={{ marginBottom: '0.5rem' }}>
            <Wrench size={14} /> Certified Mechanic Workbench
          </div>
          <h1 style={{ fontSize: '2.2rem' }}>
            Technician Dashboard: <span className="text-gradient">{currentUser.name}</span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Manage active service dispatches, log repair hours, and issue service completion invoices.
          </p>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Current Status</span>
          <span className="badge badge-available">● On Duty & Ready</span>
        </div>
      </div>

      {/* Jobs Overview */}
      <div className="grid grid-cols-3" style={{ marginBottom: '2.5rem' }}>
        <div className="card">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Assigned Dispatch Jobs</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{assignedJobs.length}</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>In Progress</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
            {assignedJobs.filter(j => j.status === 'in_progress').length}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Jobs Completed</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            {assignedJobs.filter(j => j.status === 'completed').length}
          </div>
        </div>
      </div>

      {/* Service Tickets List */}
      <h2 style={{ fontSize: '1.4rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Wrench size={20} color="var(--accent-amber)" /> Active Service Dispatches ({assignedJobs.length})
      </h2>

      {assignedJobs.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>
          <Wrench size={48} style={{ marginBottom: '1rem', opacity: 0.4 }} />
          <h3>No assigned service tickets right now</h3>
          <p>You can switch to the Admin role to assign tickets to John Mechanic!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {assignedJobs.map(job => (
            <div key={job.id} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                    <h3 style={{ fontSize: '1.25rem' }}>Dispatch Ticket #{job.id} - {job.vehicle_model}</h3>
                    <span className={`badge badge-${job.status}`}>{job.status.replace('_', ' ')}</span>
                    {job.is_emergency && <span className="badge badge-maintenance">EMERGENCY DISPATCH</span>}
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '0.5rem' }}>
                    <strong>Problem:</strong> {job.problem_description}
                  </p>
                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><MapPin size={14} color="var(--accent-rose)" /> {job.service_location}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Phone size={14} color="var(--accent-cyan)" /> {job.user_name} ({job.user_phone})</span>
                  </div>
                </div>

                {/* Status Action buttons */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {job.status === 'assigned' && (
                    <button className="btn btn-primary btn-sm" onClick={() => handleUpdateJob(job.id, 'in_progress')}>
                      Start Repair (In Progress)
                    </button>
                  )}

                  {job.status === 'in_progress' && (
                    <button 
                      className="btn btn-primary btn-sm" 
                      style={{ background: 'var(--accent-emerald)' }}
                      onClick={() => {
                        setEditingServiceId(job.id);
                        setCostInput(job.service_cost || '120');
                        setNotesInput(job.completion_notes || '');
                      }}
                    >
                      <CheckCircle size={14} /> Mark Job Completed
                    </button>
                  )}
                </div>
              </div>

              {/* Completion Notes Editor */}
              {editingServiceId === job.id && (
                <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-highlight)', borderRadius: 'var(--radius-sm)', padding: '1.25rem', marginTop: '1rem' }}>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.85rem' }}>Log Repair Summary & Service Fee</h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Service Charge ($)</label>
                      <input 
                        type="number" 
                        className="form-control"
                        value={costInput}
                        onChange={(e) => setCostInput(e.target.value)}
                        placeholder="120.00"
                        required
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Mechanic Diagnostics & Notes</label>
                      <input 
                        type="text" 
                        className="form-control"
                        value={notesInput}
                        onChange={(e) => setNotesInput(e.target.value)}
                        placeholder="Replaced worn components, refilled fluids, tested engine..."
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => setEditingServiceId(null)}>
                      Cancel
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={() => handleUpdateJob(job.id, 'completed')}>
                      Save & Issue Invoice
                    </button>
                  </div>
                </div>
              )}

              {job.status === 'completed' && job.completion_notes && (
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--accent-emerald)' }}>
                  <strong>✓ Mechanic Notes:</strong> {job.completion_notes} (${Number(job.service_cost).toFixed(2)})
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
