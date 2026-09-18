import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="brand-logo" style={{ color: '#fff' }}>
              <div className="brand-icon">
                <Compass size={24} />
              </div>
              Tourister <span>Planner</span>
            </Link>
            <p>
              Your trusted partner for personalized travel experiences, handcrafted tour packages, and seamless adventure planning across the globe.
            </p>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/packages">Tour Packages</Link></li>
              <li><Link to="/places">Explore Destinations</Link></li>
              <li><Link to="/customize-trip">Customize Your Trip</Link></li>
              <li><Link to="/about">About Tourister</Link></li>
              <li><Link to="/contact">Contact Support</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Popular Destinations</h4>
            <ul className="footer-links">
              <li><Link to="/places?category=BEACHES">Santorini, Greece</Link></li>
              <li><Link to="/places?category=MOUNTAINS">Swiss Alps</Link></li>
              <li><Link to="/places?category=HISTORICAL">Machu Picchu, Peru</Link></li>
              <li><Link to="/places?category=BEACHES">Bali, Indonesia</Link></li>
              <li><Link to="/places?category=CITY">Tokyo, Japan</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact Info</h4>
            <ul className="footer-links" style={{ color: '#94a3b8' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} color="#0ea5e9" /> 100 Grand Travel Way, Suite 400
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} color="#0ea5e9" /> +1 (800) 555-0199
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} color="#0ea5e9" /> support@touristerplanner.com
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Tourister Trip Planner. All rights reserved. Crafted with care for global travelers.</p>
        </div>
      </div>
    </footer>
  );
}
