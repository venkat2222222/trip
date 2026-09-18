import React, { useState, useEffect } from 'react';
import { Mail, Clock, User, Phone } from 'lucide-react';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AdminContacts() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContacts() {
      try {
        const res = await api.get('/admin/contact-messages');
        setMessages(res.data || []);
      } catch (err) {
        console.error("Failed to load contact messages", err);
      } finally {
        setLoading(false);
      }
    }
    loadContacts();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem' }}>Customer Contact Submissions</h2>
        <p style={{ color: 'var(--text-muted)' }}>Messages submitted by public visitors through the Contact Us form.</p>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching contact messages..." />
      ) : messages.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#fff', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
          <Mail size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
          <h3>No Contact Messages Yet</h3>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Sender Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Subject</th>
                <th>Message Snippet</th>
                <th>Date Received</th>
              </tr>
            </thead>
            <tbody>
              {messages.map(msg => (
                <tr key={msg.id}>
                  <td>#MSG-{msg.id}</td>
                  <td><strong>{msg.name}</strong></td>
                  <td>{msg.email}</td>
                  <td>{msg.phone || 'N/A'}</td>
                  <td><span style={{ fontWeight: 600, color: 'var(--primary-navy)' }}>{msg.subject || 'General'}</span></td>
                  <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {msg.message}
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
