import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Car, Wrench, Shield, User, Sparkles, Palette } from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { currentUser, switchRole } = useAuth();
  
  const [currentPalette, setCurrentPalette] = useState(() => {
    return localStorage.getItem('dp_palette') || 'midnight';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-palette', currentPalette);
    localStorage.setItem('dp_palette', currentPalette);
  }, [currentPalette]);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0.85rem 0',
      transition: 'all 0.3s ease'
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
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <Car size={26} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>
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
            style={{ borderRadius: '9999px' }}
          >
            Home
          </button>
          <button 
            className={`btn ${activeTab === 'vehicles' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('vehicles')}
            style={{ borderRadius: '9999px' }}
          >
            <Car size={16} /> Rental Fleet
          </button>
          <button 
            className={`btn ${activeTab === 'mechanics' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('mechanics')}
            style={{ borderRadius: '9999px' }}
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
            style={{ borderRadius: '9999px' }}
          >
            <Shield size={16} /> Portal ({currentUser.role.toUpperCase()})
          </button>
        </nav>

        {/* Palette Selector & Role Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* UI Color Palette Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.25rem 0.5rem' }}>
            <Palette size={14} color="var(--accent-primary)" style={{ marginRight: '0.35rem' }} />
            <select 
              value={currentPalette}
              onChange={(e) => setCurrentPalette(e.target.value)}
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
              <option value="midnight">Theme: Midnight Cyber</option>
              <option value="emerald">Theme: Royal Emerald</option>
              <option value="crimson">Theme: Crimson Sport</option>
              <option value="sapphire">Theme: Sapphire Light</option>
            </select>
          </div>

          {/* Role Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.25rem 0.5rem' }}>
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
              <option value="customer">Role: Customer</option>
              <option value="admin">Role: Admin</option>
              <option value="mechanic">Role: Mechanic</option>
            </select>
          </div>

          {/* User Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '0.35rem 0.85rem', borderRadius: '9999px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
            <User size={16} color="var(--accent-cyan)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{currentUser.name}</span>
            <span style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: 'var(--gradient-primary)', color: '#fff', fontWeight: 800, textTransform: 'uppercase' }}>
              {currentUser.role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
