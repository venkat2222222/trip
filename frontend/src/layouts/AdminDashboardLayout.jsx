import React from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, Users, MapPin, Mail, UserPlus, LogOut, Compass, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="app-container" style={{ background: '#f1f5f9' }}>
      {/* Top Navbar */}
      <header style={{ height: '70px', background: '#0f172a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontWeight: 700, fontSize: '1.2rem' }}>
            <Compass color="#0ea5e9" size={24} /> Tourister Admin Panel
          </Link>
          <span style={{ background: '#f59e0b', color: '#000', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
            ADMIN ACCESS
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/" style={{ color: '#cbd5e1', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            View Main Site →
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: '1px solid #334155', paddingLeft: '1.5rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.fullName}</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>System Admin</div>
            </div>
            <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ color: '#fff', borderColor: '#475569' }} title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="dashboard-grid" style={{ minHeight: 'calc(100vh - 70px)' }}>
        <aside className="sidebar" style={{ background: '#1e293b', borderRight: 'none', color: '#cbd5e1' }}>
          <ul className="sidebar-menu">
            <li>
              <NavLink to="/admin/dashboard" end className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"} style={{ color: '#cbd5e1' }}>
                <LayoutDashboard size={18} /> Overview Stats
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/trips" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"} style={{ color: '#cbd5e1' }}>
                <MapPin size={18} /> Trip Requests
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/users" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"} style={{ color: '#cbd5e1' }}>
                <Users size={18} /> User Management
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/contacts" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"} style={{ color: '#cbd5e1' }}>
                <Mail size={18} /> Contact Messages
              </NavLink>
            </li>
            <li style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #334155' }}>
              <NavLink to="/admin/add-admin" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"} style={{ color: '#f59e0b' }}>
                <UserPlus size={18} /> Add New Admin
              </NavLink>
            </li>
          </ul>
        </aside>

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
