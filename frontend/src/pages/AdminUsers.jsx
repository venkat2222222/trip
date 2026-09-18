import React, { useState, useEffect } from 'react';
import { Search, UserCheck, Shield } from 'lucide-react';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await api.get('/admin/users');
        setUsers(res.data || []);
      } catch (err) {
        console.error("Failed to load user list", err);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.phone.includes(searchTerm)
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem' }}>User Management</h2>
          <p style={{ color: 'var(--text-muted)' }}>View registered users and administrator accounts.</p>
        </div>

        {/* Search input */}
        <div style={{ position: 'relative', width: '300px' }}>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search users..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            style={{ paddingLeft: '2.5rem' }} 
          />
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching user directory..." />
      ) : (
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Full Name</th>
                <th>Email Address</th>
                <th>Phone Number</th>
                <th>Role</th>
                <th>Registered On</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td><strong>#USR-{user.id}</strong></td>
                  <td>
                    <strong style={{ color: 'var(--primary-dark)' }}>{user.fullName}</strong>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.phone || 'N/A'}</td>
                  <td>
                    {user.role === 'ROLE_ADMIN' ? (
                      <span className="badge-status" style={{ background: '#fef3c7', color: '#b45309' }}>
                        <Shield size={14} /> ADMIN
                      </span>
                    ) : (
                      <span className="badge-status" style={{ background: '#e0f2fe', color: '#0369a1' }}>
                        <UserCheck size={14} /> USER
                      </span>
                    )}
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {new Date(user.createdAt).toLocaleDateString()}
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
