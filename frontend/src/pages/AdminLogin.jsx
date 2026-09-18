import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@tourister.com');
  const [password, setPassword] = useState('Admin@12345');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');

    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.role !== 'ROLE_ADMIN') {
        setError('Access denied. This account does not possess administrator privileges.');
        return;
      }
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Admin authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ background: '#1e293b', color: '#fff', padding: '3.5rem 2.5rem', borderRadius: '24px', maxWidth: '440px', width: '100%', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', border: '1px solid #334155' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
            <Shield size={36} />
          </div>
          <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '0.5rem' }}>Admin Gateway</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.92rem' }}>Protected Area - Authorised Personnel Only</p>
        </div>

        <ErrorMessage message={error} />

        <form onSubmit={handleAdminLogin}>
          <div className="form-group">
            <label className="form-label" style={{ color: '#cbd5e1' }}>Admin Username / Email</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="email" 
                className="form-control" 
                style={{ background: '#0f172a', borderColor: '#334155', color: '#fff', paddingLeft: '2.5rem' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Mail size={18} color="#64748b" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ color: '#cbd5e1' }}>Admin Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password" 
                className="form-control" 
                style={{ background: '#0f172a', borderColor: '#334155', color: '#fff', paddingLeft: '2.5rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock size={18} color="#64748b" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-amber btn-lg" style={{ width: '100%', marginTop: '1.5rem' }}>
            <KeyRound size={18} /> {loading ? 'Authenticating...' : 'Authenticate Admin'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
          Default Seed Admin Credentials:<br />
          <code>admin@tourister.com</code> / <code>Admin@12345</code>
        </div>
      </div>
    </div>
  );
}
