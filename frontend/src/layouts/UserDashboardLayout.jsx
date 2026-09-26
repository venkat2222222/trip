import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { LayoutDashboard, Compass, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function UserDashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="container dashboard-container" style={{ flex: 1, padding: '1.5rem 1rem' }}>
        <div className="dashboard-grid" style={{ minHeight: 'auto', background: '#fff', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
          <aside className="sidebar">
            <div className="user-profile-summary" style={{ paddingBottom: '1.25rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #0284c7, #1e3a8a)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem', flexShrink: 0 }}>
                  {user?.fullName?.charAt(0) || 'U'}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.1rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.fullName}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.email}</p>
                </div>
              </div>
            </div>

            <ul className="sidebar-menu">
              <li>
                <NavLink to="/dashboard" end className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
                  <LayoutDashboard size={18} /> My Trip Requests
                </NavLink>
              </li>
              <li>
                <NavLink to="/customize-trip" className="sidebar-link">
                  <Compass size={18} /> Plan New Trip
                </NavLink>
              </li>
            </ul>

            <div className="sidebar-logout-wrapper" style={{ marginTop: 'auto', paddingTop: '1.25rem', borderTop: '1px solid var(--border-light)' }}>
              <button onClick={handleLogout} className="sidebar-link" style={{ width: '100%', color: 'var(--rose-red)', background: 'transparent' }}>
                <LogOut size={18} /> Log Out
              </button>
            </div>
          </aside>

          <main className="dashboard-content">
            <Outlet />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}

