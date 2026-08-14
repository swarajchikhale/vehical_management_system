import React, { useState } from 'react';
import { Car, Wrench, Shield, Phone, Mail, MapPin, Heart, ArrowUp, Check } from 'lucide-react';

export const Footer = ({ setActiveTab }) => {
  const [copiedPhone, setCopiedPhone] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText('+1 (800) 555-DRIVE');
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      padding: '3.5rem 0 2rem 0',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          
          {/* Col 1 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <Car size={24} color="var(--accent-primary)" />
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800 }}>Drive<span className="text-gradient">Pulse</span></span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Next-generation Vehicle Management & Emergency Mechanic Service operating round-the-clock for luxury, utility, and commuter fleets.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-available" style={{ fontSize: '0.75rem' }}>
                ● 24/7 Dispatch Active
              </span>
              <span className="badge badge-confirmed" style={{ fontSize: '0.75rem' }}>
                ● 99.98% System Uptime
              </span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.2rem', color: 'var(--text-main)' }}>Quick Portals</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <li style={{ cursor: 'pointer' }} onClick={() => setActiveTab('vehicles')}>→ Browse Vehicle Fleet</li>
              <li style={{ cursor: 'pointer' }} onClick={() => setActiveTab('mechanics')}>→ Request Roadside Mechanic</li>
              <li style={{ cursor: 'pointer' }} onClick={() => setActiveTab('dashboard')}>→ Customer Dashboard</li>
              <li style={{ cursor: 'pointer' }} onClick={() => setActiveTab('admin')}>→ Admin Control Center</li>
              <li style={{ cursor: 'pointer' }} onClick={() => setActiveTab('mechanic_dash')}>→ Mechanic Workbench</li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.2rem', color: 'var(--text-main)' }}>Services & Fleet</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <li>• Premium Sedans & SUVs</li>
              <li>• Sports Bikes & Cruisers</li>
              <li>• Utility Vans & Trucks</li>
              <li>• Emergency Engine Repairs</li>
              <li>• Automated Tax Invoicing</li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.2rem', color: 'var(--text-main)' }}>Emergency Hotline</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <div 
                onClick={handleCopyPhone} 
                title="Click to copy emergency hotline" 
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', userSelect: 'none', transition: 'color 0.2s' }}
              >
                {copiedPhone ? <Check size={16} color="#10b981" /> : <Phone size={16} color="var(--accent-amber)" />}
                <span style={{ textDecoration: 'underline text-decoration-style-dotted' }}>+1 (800) 555-DRIVE</span>
                {copiedPhone && <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700, marginLeft: '0.2rem' }}>Copied!</span>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} color="var(--accent-cyan)" />
                <span>support@drivepulse.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} color="var(--accent-rose)" />
                <span>100 Innovation Parkway, Suite 400</span>
              </div>
            </div>
          </div>

        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-subtle)' }}>
          <div>
            © {new Date().getFullYear()} DrivePulse Vehicle Management System v1.2.0 • All rights reserved.
          </div>
          <button
            onClick={scrollToTop}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: '9999px', padding: '0.35rem 0.85rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            title="Scroll to top of page"
          >
            <ArrowUp size={14} /> Back to Top
          </button>
        </div>
      </div>
    </footer>
  );
};
