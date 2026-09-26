import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Compass, User, LogOut, Shield, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand-logo" onClick={closeMenu}>
          <img src="/logo.png" alt="TRIP MAX Logo" style={{ height: 44, width: 'auto', borderRadius: 8, objectFit: 'contain' }} />
          TRIP <span>MAX</span>
        </Link>

        {/* Desktop Links */}
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

        {/* Desktop Actions */}
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

          {/* Mobile Hamburger Toggle Button */}
          <button 
            className="mobile-menu-toggle" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Backdrop Overlay */}
      <div 
        className={`mobile-nav-overlay ${mobileMenuOpen ? 'open' : ''}`}
        onClick={closeMenu}
      />

      {/* Mobile Navigation Slide-in Drawer */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-header">
          <Link to="/" className="brand-logo" onClick={closeMenu}>
            <img src="/logo.png" alt="TRIP MAX Logo" style={{ height: 36, width: 'auto', borderRadius: 6 }} />
            TRIP MAX
          </Link>
          <button 
            onClick={closeMenu} 
            style={{ background: 'none', border: 'none', color: 'var(--text-dark)', cursor: 'pointer' }}
          >
            <X size={24} />
          </button>
        </div>

        <ul className="mobile-drawer-links">
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? "mobile-drawer-link active" : "mobile-drawer-link"} onClick={closeMenu}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/packages" className={({ isActive }) => isActive ? "mobile-drawer-link active" : "mobile-drawer-link"} onClick={closeMenu}>
              Tour Packages
            </NavLink>
          </li>
          <li>
            <NavLink to="/places" className={({ isActive }) => isActive ? "mobile-drawer-link active" : "mobile-drawer-link"} onClick={closeMenu}>
              Explore Places
            </NavLink>
          </li>
          <li>
            <NavLink to="/customize-trip" className={({ isActive }) => isActive ? "mobile-drawer-link active" : "mobile-drawer-link"} onClick={closeMenu}>
              Customize Trip
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={({ isActive }) => isActive ? "mobile-drawer-link active" : "mobile-drawer-link"} onClick={closeMenu}>
              About Us
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={({ isActive }) => isActive ? "mobile-drawer-link active" : "mobile-drawer-link"} onClick={closeMenu}>
              Contact Us
            </NavLink>
          </li>
        </ul>

        <div className="mobile-drawer-actions">
          {user ? (
            <>
              {isAdmin ? (
                <Link to="/admin/dashboard" className="btn btn-amber" onClick={closeMenu} style={{ width: '100%' }}>
                  <Shield size={18} /> Admin Panel
                </Link>
              ) : (
                <Link to="/dashboard" className="btn btn-primary" onClick={closeMenu} style={{ width: '100%' }}>
                  <User size={18} /> My Dashboard
                </Link>
              )}
              <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%', color: 'var(--rose-red)', borderColor: 'var(--rose-red)' }}>
                <LogOut size={18} /> Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline" onClick={closeMenu} style={{ width: '100%' }}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" onClick={closeMenu} style={{ width: '100%' }}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

