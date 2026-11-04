import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!message || !onClose) return;
    const interval = 50;
    const step = (interval / duration) * 100;
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return Math.max(0, prev - step);
      });
    }, interval);

    return () => clearInterval(timer);
  }, [message, onClose, duration]);

  if (!message) return null;

  const bgMap = {
    success: 'rgba(16, 185, 129, 0.95)',
    error: 'rgba(239, 68, 68, 0.95)',
    info: 'rgba(99, 102, 241, 0.95)'
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 9999,
        background: bgMap[type] || bgMap.info,
        color: '#ffffff',
        padding: '0.85rem 1.25rem',
        borderRadius: 'var(--radius-sm)',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontSize: '0.9rem',
        fontWeight: 600,
        backdropFilter: 'blur(8px)',
        animation: 'slideUp 0.3s ease-out',
        overflow: 'hidden'
      }}
    >
      {type === 'success' && <CheckCircle2 size={18} />}
      {type === 'error' && <AlertCircle size={18} />}
      {type === 'info' && <Info size={18} />}
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          title="Dismiss notification"
          style={{
            background: 'rgba(0,0,0,0.15)',
            border: 'none',
            color: 'rgba(255,255,255,0.9)',
            cursor: 'pointer',
            marginLeft: '0.75rem',
            padding: '0.2rem',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <X size={15} />
        </button>
      )}
      {/* Progress countdown indicator bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '3px',
          width: `${progress}%`,
          background: 'rgba(255, 255, 255, 0.65)',
          transition: 'width 50ms linear'
        }}
      />
    </div>
  );
};
