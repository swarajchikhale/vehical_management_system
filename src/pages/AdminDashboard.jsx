import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { InvoiceModal } from '../components/InvoiceModal';
import { formatINR } from '../utils/formatters';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { Shield, Car, Wrench, DollarSign, Plus, Edit, Trash2, CheckCircle, XCircle, FileText, UserCheck, AlertTriangle, X } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

export const AdminDashboard = () => {
  const { vehicles, bookings, services, bills, addVehicle, updateVehicleStatus, deleteVehicle, assignMechanicToService, updateBookingStatus, mechanics } = useData();
  
  const [activeSubTab, setActiveSubTab] = useState('fleet'); // fleet | bookings | services | bills
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  // New vehicle form state
  const [newVehicle, setNewVehicle] = useState({
    vehicle_name: '',
    vehicle_type: 'car',
    brand: '',
    model: '',
    year: 2024,
    license_plate: '',
    rent_price: 50,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    description: ''
  });

  // Calculate Metrics
  const totalRevenue = bills.reduce((acc, curr) => acc + (Number(curr.total_amount) || 0), 0);
  const activeRentals = bookings.filter(b => b.status === 'active' || b.status === 'confirmed').length;
  const pendingServices = services.filter(s => s.status === 'pending').length;

  // Chart Data
  const revenueChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [
      {
        label: 'Monthly Revenue (₹)',
        data: [120000, 190000, 300000, 450000, 380000, 520000, 610000, Math.round(totalRevenue)],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#9ca3af' } }
    },
    scales: {
      x: { ticks: { color: '#9ca3af' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: '#9ca3af' }, grid: { color: 'rgba(255,255,255,0.05)' } }
    }
  };

  const handleAddVehicleSubmit = (e) => {
    e.preventDefault();
    addVehicle(newVehicle);
    setShowAddVehicleModal(false);
    setNewVehicle({
      vehicle_name: '',
      vehicle_type: 'car',
      brand: '',
      model: '',
      year: 2024,
      license_plate: '',
      rent_price: 3500,
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      description: ''
    });
  };

  return (
    <div className="container fade-in" style={{ padding: '3rem 1.5rem' }}>
      {/* Admin Title */}
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="badge badge-confirmed" style={{ marginBottom: '0.5rem' }}>
            <Shield size={14} /> Master Admin Command Center
          </div>
          <h1 style={{ fontSize: '2.2rem' }}>System Analytics & Operation Control</h1>
        </div>

        <button className="btn btn-primary" onClick={() => setShowAddVehicleModal(true)}>
          <Plus size={18} /> Add New Vehicle
        </button>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-4" style={{ marginBottom: '2.5rem' }}>
        <div className="card">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Total Gross Revenue</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>{formatINR(totalRevenue)}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', marginTop: '0.35rem' }}>↑ +18.4% vs last month</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Active Vehicle Rentals</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{activeRentals}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>Across {vehicles.length} fleet vehicles</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Pending Service Dispatch</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-amber)' }}>{pendingServices}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-amber)', marginTop: '0.35rem' }}>Requires mechanic assignment</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Registered Mechanics</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{mechanics.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>100% certified technicians</div>
        </div>
      </div>

      {/* Analytics Revenue Chart */}
      <div className="card" style={{ marginBottom: '2.5rem', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Revenue Trends (Chart.js Real-Time Feed)</h3>
        <div style={{ maxHeight: '300px' }}>
          <Line data={revenueChartData} options={chartOptions} />
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', flexWrap: 'wrap' }}>
        <button 
          className={`btn ${activeSubTab === 'fleet' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSubTab('fleet')}
        >
          <Car size={16} /> Manage Fleet ({vehicles.length})
        </button>

        <button 
          className={`btn ${activeSubTab === 'bookings' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSubTab('bookings')}
        >
          <FileText size={16} /> All Rental Bookings ({bookings.length})
        </button>

        <button 
          className={`btn ${activeSubTab === 'services' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSubTab('services')}
        >
          <Wrench size={16} /> Service Dispatch ({services.length})
        </button>

        <button 
          className={`btn ${activeSubTab === 'bills' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSubTab('bills')}
        >
          <DollarSign size={16} /> Master Invoices ({bills.length})
        </button>
      </div>

      {/* Tab 1: Fleet Management */}
      {activeSubTab === 'fleet' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem' }}>Vehicle</th>
                <th style={{ padding: '1rem' }}>Type</th>
                <th style={{ padding: '1rem' }}>Plate Number</th>
                <th style={{ padding: '1rem' }}>Rate / Day</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map(v => (
                <tr key={v.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src={v.image} alt={v.vehicle_name} style={{ width: '48px', height: '36px', borderRadius: '4px', objectFit: 'cover' }} />
                    <div>
                      <strong style={{ display: 'block' }}>{v.vehicle_name}</strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{v.brand} {v.model} ({v.year})</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', textTransform: 'capitalize' }}>{v.vehicle_type}</td>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{v.license_plate}</td>
                  <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>{formatINR(v.rent_price, false)}</td>
                  <td style={{ padding: '1rem' }}>
                    <select 
                      className="form-select"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', width: 'auto' }}
                      value={v.status}
                      onChange={(e) => updateVehicleStatus(v.id, e.target.value)}
                    >
                      <option value="available">Available</option>
                      <option value="rented">Rented</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteVehicle(v.id)}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Bookings Oversight */}
      {activeSubTab === 'bookings' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem' }}>Booking ID</th>
                <th style={{ padding: '1rem' }}>Customer</th>
                <th style={{ padding: '1rem' }}>Vehicle</th>
                <th style={{ padding: '1rem' }}>Dates</th>
                <th style={{ padding: '1rem' }}>Total Cost</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontWeight: 700 }}>#{b.id}</td>
                  <td style={{ padding: '1rem' }}>{b.user_name}</td>
                  <td style={{ padding: '1rem' }}>{b.vehicle_name}</td>
                  <td style={{ padding: '1rem', fontSize: '0.82rem' }}>{b.start_date} to {b.end_date}</td>
                  <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>{formatINR(b.total_cost)}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`badge badge-${b.status}`}>{b.status}</span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <select 
                      className="form-select"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', width: 'auto' }}
                      value={b.status}
                      onChange={(e) => updateBookingStatus(b.id, e.target.value)}
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Mechanic Service Dispatch */}
      {activeSubTab === 'services' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem' }}>Ticket</th>
                <th style={{ padding: '1rem' }}>Customer / Contact</th>
                <th style={{ padding: '1rem' }}>Problem Description</th>
                <th style={{ padding: '1rem' }}>Location</th>
                <th style={{ padding: '1rem' }}>Assigned Mechanic</th>
                <th style={{ padding: '1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {services.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontWeight: 700 }}>
                    #{s.id} {s.is_emergency && <span className="badge badge-maintenance">URGENT</span>}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <strong>{s.user_name}</strong>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{s.user_phone}</div>
                  </td>
                  <td style={{ padding: '1rem', maxWidth: '240px' }}>{s.problem_description}</td>
                  <td style={{ padding: '1rem', fontSize: '0.82rem' }}>{s.service_location}</td>
                  <td style={{ padding: '1rem' }}>
                    <select 
                      className="form-select"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', width: 'auto' }}
                      value={s.mechanic_id || ''}
                      onChange={(e) => assignMechanicToService(s.id, e.target.value)}
                    >
                      <option value="">-- Assign Mechanic --</option>
                      {mechanics.map(m => (
                        <option key={m.id} value={m.id}>{m.name} ({m.specialization})</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`badge badge-${s.status}`}>{s.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 4: Master Bills & Invoices */}
      {activeSubTab === 'bills' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem' }}>Invoice #</th>
                <th style={{ padding: '1rem' }}>Customer</th>
                <th style={{ padding: '1rem' }}>Item</th>
                <th style={{ padding: '1rem' }}>Subtotal</th>
                <th style={{ padding: '1rem' }}>Tax (18%)</th>
                <th style={{ padding: '1rem' }}>Total</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Invoice</th>
              </tr>
            </thead>
            <tbody>
              {bills.map(bill => (
                <tr key={bill.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--accent-primary)' }}>{bill.invoice_number}</td>
                  <td style={{ padding: '1rem' }}>{bill.user_name}</td>
                  <td style={{ padding: '1rem' }}>{bill.item_title}</td>
                  <td style={{ padding: '1rem' }}>{formatINR(bill.subtotal)}</td>
                  <td style={{ padding: '1rem' }}>{formatINR(bill.tax_amount)}</td>
                  <td style={{ padding: '1rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{formatINR(bill.total_amount)}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`badge badge-${bill.status}`}>{bill.status}</span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => setSelectedBill(bill)}>
                      <FileText size={14} /> Open
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Adding New Vehicle */}
      {showAddVehicleModal && (
        <div className="modal-overlay" onClick={() => setShowAddVehicleModal(false)}>
          <div className="modal-content fade-in" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.4rem' }}>Add New Fleet Vehicle</h2>
              <button onClick={() => setShowAddVehicleModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddVehicleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Vehicle Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="E.g. Audi A6 Saloon" 
                    value={newVehicle.vehicle_name}
                    onChange={(e) => setNewVehicle({ ...newVehicle, vehicle_name: e.target.value })}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Vehicle Type</label>
                  <select 
                    className="form-select"
                    value={newVehicle.vehicle_type}
                    onChange={(e) => setNewVehicle({ ...newVehicle, vehicle_type: e.target.value })}
                  >
                    <option value="car">Car</option>
                    <option value="bike">Bike</option>
                    <option value="van">Van</option>
                    <option value="truck">Truck</option>
                    <option value="bus">Bus</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Brand</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Audi" 
                    value={newVehicle.brand}
                    onChange={(e) => setNewVehicle({ ...newVehicle, brand: e.target.value })}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">License Plate</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="AUD-0091" 
                    value={newVehicle.license_plate}
                    onChange={(e) => setNewVehicle({ ...newVehicle, license_plate: e.target.value })}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Daily Price (₹)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={newVehicle.rent_price}
                    onChange={(e) => setNewVehicle({ ...newVehicle, rent_price: Number(e.target.value) })}
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={newVehicle.image}
                  onChange={(e) => setNewVehicle({ ...newVehicle, image: e.target.value })}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-control"
                  rows="3"
                  value={newVehicle.description}
                  onChange={(e) => setNewVehicle({ ...newVehicle, description: e.target.value })}
                  required
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddVehicleModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Vehicle to Fleet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Viewer Modal */}
      {selectedBill && (
        <InvoiceModal bill={selectedBill} onClose={() => setSelectedBill(null)} />
      )}
    </div>
  );
};
