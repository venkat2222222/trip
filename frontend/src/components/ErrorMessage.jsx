import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div style={{
      background: '#fef2f2',
      border: '1px solid #fecaca',
      color: '#991b1b',
      padding: '0.85rem 1.25rem',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      fontSize: '0.92rem',
      marginBottom: '1rem'
    }}>
      <AlertCircle size={20} style={{ flexShrink: 0 }} />
      <span>{message}</span>
    </div>
  );
}
