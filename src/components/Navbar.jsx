import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Car, Wrench, Shield, User, LogOut, ChevronDown, Sparkles } from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { currentUser, switchRole, logout } = useAuth();

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0.85rem 0'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          <div style={{
            background: 'var(--gradient-primary)',
            padding: '0.6rem',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <Car size={26} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>
              Drive<span className="text-gradient">Pulse</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>Vehicle & Service OS</div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button 
            className={`btn ${activeTab === 'home' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('home')}
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            Home
          </button>
          <button 
            className={`btn ${activeTab === 'vehicles' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('vehicles')}
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            <Car size={16} /> Rental Fleet
          </button>
          <button 
            className={`btn ${activeTab === 'mechanics' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('mechanics')}
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            <Wrench size={16} /> Mechanic Services
          </button>
          <button 
            className={`btn ${['dashboard', 'admin', 'mechanic_dash'].includes(activeTab) ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => {
              if (currentUser.role === 'admin') setActiveTab('admin');
              else if (currentUser.role === 'mechanic') setActiveTab('mechanic_dash');
              else setActiveTab('dashboard');
            }}
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            <Shield size={16} /> Portal ({currentUser.role.toUpperCase()})
          </button>
        </nav>

        {/* Role Switcher & User Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.25rem 0.5rem' }}>
            <Sparkles size={14} color="var(--accent-amber)" style={{ marginRight: '0.35rem' }} />
            <select 
              value={currentUser.role === 'user' ? 'customer' : currentUser.role}
              onChange={(e) => {
                switchRole(e.target.value);
                if (e.target.value === 'admin') setActiveTab('admin');
                else if (e.target.value === 'mechanic') setActiveTab('mechanic_dash');
                else setActiveTab('dashboard');
              }}
              style={{
                background: 'transparent',
                color: 'var(--text-main)',
                border: 'none',
                outline: 'none',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              <option value="customer">Switch Role: Customer</option>
              <option value="admin">Switch Role: Admin</option>
              <option value="mechanic">Switch Role: Mechanic</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-glass)', border: '1px solid var(--border-color)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-full)' }}>
            <User size={16} color="var(--accent-cyan)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{currentUser.name}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
