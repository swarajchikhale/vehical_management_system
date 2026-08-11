import React, { useEffect } from 'react';
import { formatINR, formatDateIN } from '../utils/formatters';
import { FileText, Printer, CheckCircle, Clock, X, DollarSign } from 'lucide-react';

export const InvoiceModal = ({ bill, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!bill) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content fade-in" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '620px', background: '#ffffff', color: '#1f2937', padding: '2.5rem' }}
      >
        {/* Header Bar (No Print) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4f46e5', fontWeight: 700 }}>
            <FileText size={22} />
            <span>DIGITAL TAX INVOICE</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={handlePrint}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#4f46e5', color: '#fff', border: 'none', padding: '0.45rem 0.9rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
            >
              <Printer size={14} /> Print Invoice
            </button>
            <button 
              onClick={onClose}
              style={{ background: '#f3f4f6', color: '#4b5563', border: 'none', padding: '0.45rem', borderRadius: '6px', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div id="printable-invoice">
          {/* Invoice Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111827', margin: 0 }}>DrivePulse Inc.</h2>
              <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.2rem' }}>Vehicle Rental & Mechanic Operations</p>
              <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Tax ID: REG-99482-VMS</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#4f46e5' }}>{bill.invoice_number}</div>
              <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>Date: {bill.created_at}</p>
              <div style={{
                display: 'inline-block',
                marginTop: '0.4rem',
                padding: '0.25rem 0.6rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                background: bill.status === 'paid' ? '#d1fae5' : '#fef3c7',
                color: bill.status === 'paid' ? '#047857' : '#d97706'
              }}>
                {bill.status === 'paid' ? '● PAID & SETTLED' : '● PENDING PAYMENT'}
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>Billed To</span>
              <strong style={{ color: '#111827' }}>{bill.user_name}</strong>
              <p style={{ color: '#6b7280', fontSize: '0.82rem', margin: 0 }}>Customer ID: #{bill.user_id}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>Payment Method</span>
              <span style={{ color: '#111827', fontWeight: 600 }}>{bill.payment_method || 'Direct Billing'}</span>
            </div>
          </div>

          {/* Table Items */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left', background: '#f3f4f6' }}>
                <th style={{ padding: '0.6rem 0.8rem', color: '#374151' }}>Item Description</th>
                <th style={{ padding: '0.6rem 0.8rem', color: '#374151', textAlign: 'center' }}>Type</th>
                <th style={{ padding: '0.6rem 0.8rem', color: '#374151', textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '0.8rem', fontWeight: 600, color: '#111827' }}>{bill.item_title}</td>
                <td style={{ padding: '0.8rem', textAlign: 'center', textTransform: 'capitalize', color: '#6b7280' }}>{bill.bill_type}</td>
                <td style={{ padding: '0.8rem', textAlign: 'right', fontWeight: 600, color: '#111827' }}>{formatINR(bill.subtotal)}</td>
              </tr>
            </tbody>
          </table>

          {/* Financial Calculation */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
            <div style={{ width: '240px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', color: '#4b5563' }}>
                <span>Subtotal:</span>
                <span>{formatINR(bill.subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', color: '#4b5563' }}>
                <span>GST / Tax (18%):</span>
                <span>{formatINR(bill.tax_amount)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderTop: '2px solid #111827', fontWeight: 800, fontSize: '1.1rem', color: '#111827', marginTop: '0.4rem' }}>
                <span>Total Amount:</span>
                <span style={{ color: '#4f46e5' }}>{formatINR(bill.total_amount)}</span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div style={{ borderTop: '1px dashed #d1d5db', paddingTop: '1rem', textAlign: 'center', fontSize: '0.78rem', color: '#9ca3af' }}>
            Thank you for choosing DrivePulse. For billing inquiries, contact billing@drivepulse.com.
          </div>
        </div>
      </div>
    </div>
  );
};
