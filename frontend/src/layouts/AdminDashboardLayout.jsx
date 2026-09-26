import React from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, Users, MapPin, Mail, UserPlus, LogOut, Compass, Package, Landmark, Settings } from 'lucide-react';
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
      <header className="admin-header" style={{ background: '#0f172a', color: '#fff', padding: '0.75rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>
              <img src="/logo.png" alt="TRIP MAX" style={{ height: 32, borderRadius: 6, background: '#fff' }} />
              TRIP <span style={{ color: '#f59e0b' }}>MAX</span> <span style={{ color: '#0ea5e9', fontSize: '0.85rem', fontWeight: 600 }}>Admin</span>
            </Link>
            <span style={{ background: '#f59e0b', color: '#000', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>
              ADMIN
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/" style={{ color: '#cbd5e1', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              Main Site →
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: '1px solid #334155', paddingLeft: '1rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{user?.fullName}</div>
              </div>
              <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ color: '#fff', borderColor: '#475569', padding: '0.4rem 0.6rem' }} title="Logout">
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="dashboard-grid" style={{ minHeight: 'calc(100vh - 60px)' }}>
        <aside className="sidebar admin-sidebar" style={{ background: '#1e293b', borderRight: 'none', color: '#cbd5e1', padding: '1.25rem 1rem' }}>
          <ul className="sidebar-menu admin-sidebar-menu">
            <li>
              <NavLink to="/admin/dashboard" end className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"} style={{ color: '#cbd5e1' }}>
                <LayoutDashboard size={18} /> Stats
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/tours" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"} style={{ color: '#cbd5e1' }}>
                <Package size={18} /> Tours
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/places" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"} style={{ color: '#cbd5e1' }}>
                <Landmark size={18} /> Places
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/trips" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"} style={{ color: '#cbd5e1' }}>
                <MapPin size={18} /> Trips
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/users" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"} style={{ color: '#cbd5e1' }}>
                <Users size={18} /> Users
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/contacts" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"} style={{ color: '#cbd5e1' }}>
                <Mail size={18} /> Contacts
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/settings" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"} style={{ color: '#cbd5e1' }}>
                <Settings size={18} /> Edit Content
              </NavLink>
            </li>
            <li className="admin-add-link-item">
              <NavLink to="/admin/add-admin" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"} style={{ color: '#f59e0b' }}>
                <UserPlus size={18} /> Add Admin
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

