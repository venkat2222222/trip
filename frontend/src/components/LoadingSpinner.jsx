import React from 'react';

export default function LoadingSpinner({ message = 'Loading Tourister details...' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 1rem',
      width: '100%'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        border: '4px solid rgba(2, 132, 199, 0.2)',
        borderTop: '4px solid #0284c7',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <p style={{ marginTop: '1rem', color: '#64748b', fontWeight: 500 }}>{message}</p>
    </div>
  );
}
