import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Compass, User, LogOut, Shield, Menu, X, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand-logo">
          <div className="brand-icon">
            <Compass size={24} />
          </div>
          Tourister <span>Planner</span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Home
          </NavLink>
          <NavLink to="/packages" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Tour Packages
          </NavLink>
          <NavLink to="/places" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Explore Places
          </NavLink>
          <NavLink to="/customize-trip" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Customize Trip
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            About Us
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Contact Us
          </NavLink>
        </nav>

        <div className="nav-actions">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {isAdmin ? (
                <Link to="/admin/dashboard" className="btn btn-amber btn-sm">
                  <Shield size={16} /> Admin Panel
                </Link>
              ) : (
                <Link to="/dashboard" className="btn btn-outline btn-sm">
                  <User size={16} /> My Dashboard
                </Link>
              )}
              <button onClick={handleLogout} className="btn btn-outline btn-sm" title="Logout" style={{ padding: '0.5rem' }}>
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
