import React, { useState } from 'react';
import { UserPlus, Shield, CheckCircle2, Lock, Mail, Phone, User } from 'lucide-react';
import { api } from '../services/api';
import ErrorMessage from '../components/ErrorMessage';

export default function AdminAddAdmin() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/admin/admins', {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });

      setSuccessMsg(`Administrator account successfully created for ${res.data.fullName} (${res.data.email})!`);
      setFormData({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' });
    } catch (err) {
      setError(err.message || 'Failed to create administrator account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
          <Shield size={32} />
        </div>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Create New Administrator</h2>
        <p style={{ color: 'var(--text-muted)' }}>Grant administrative access privileges to a trusted team member.</p>
      </div>

      <div style={{ background: '#fff', padding: '3rem', borderRadius: '24px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-light)' }}>
        {successMsg && (
          <div style={{ background: '#d1fae5', border: '1px solid #6ee7b7', color: '#065f46', padding: '1rem 1.25rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CheckCircle2 size={20} />
            <span>{successMsg}</span>
          </div>
        )}

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Admin Full Name *</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                name="fullName"
                className="form-control" 
                placeholder="Jane Smith"
                value={formData.fullName}
                onChange={handleChange}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
              <User size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="email" 
                  name="email"
                  className="form-control" 
                  placeholder="admin2@tourister.com"
                  value={formData.email}
                  onChange={handleChange}
                  style={{ paddingLeft: '2.5rem' }}
                  required
                />
                <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="tel" 
                  name="phone"
                  className="form-control" 
                  placeholder="+1 (800) 555-0199"
                  value={formData.phone}
                  onChange={handleChange}
                  style={{ paddingLeft: '2.5rem' }}
                  required
                />
                <Phone size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Password *</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="password" 
                  name="password"
                  className="form-control" 
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  style={{ paddingLeft: '2.5rem' }}
                  required
                />
                <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="password" 
                  name="confirmPassword"
                  className="form-control" 
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={{ paddingLeft: '2.5rem' }}
                  required
                />
                <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-amber btn-lg" style={{ width: '100%', marginTop: '1rem' }}>
            <UserPlus size={18} /> {loading ? 'Creating Admin Account...' : 'Create Admin Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
