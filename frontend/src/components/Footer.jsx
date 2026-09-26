import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { api } from '../services/api';

export default function Footer() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    async function loadFooterSettings() {
      try {
        const res = await api.get('/settings');
        if (res.data) {
          setSettings(res.data);
        }
      } catch (err) {
        console.error("Failed to load footer site settings", err);
      }
    }
    loadFooterSettings();
  }, []);

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="brand-logo" style={{ color: '#fff' }}>
              <img src="/logo.png" alt="TRIP MAX Logo" style={{ height: 44, width: 'auto', borderRadius: 8, background: '#fff' }} />
              TRIP <span style={{ color: '#f59e0b' }}>MAX</span>
            </Link>
            <p>
              Travel Beyond Limits. Your trusted partner for personalized travel experiences, handcrafted tour packages, and seamless custom trip planning in Indian Rupees.
            </p>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/packages">Tour Packages</Link></li>
              <li><Link to="/places">Explore Destinations</Link></li>
              <li><Link to="/customize-trip">Customize Your Trip</Link></li>
              <li><Link to="/about">About TRIP MAX</Link></li>
              <li><Link to="/contact">Contact Support</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Popular Destinations</h4>
            <ul className="footer-links">
              <li><Link to="/places?category=BEACHES">Santorini, Greece</Link></li>
              <li><Link to="/places?category=MOUNTAINS">Swiss Alps</Link></li>
              <li><Link to="/places?category=HISTORICAL">Royal Rajasthan</Link></li>
              <li><Link to="/places?category=BEACHES">Bali, Indonesia</Link></li>
              <li><Link to="/places?category=CITY">Tokyo, Japan</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact Info</h4>
            <ul className="footer-links" style={{ color: '#94a3b8' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <MapPin size={18} color="#0ea5e9" style={{ flexShrink: 0, marginTop: 2 }} /> 
                <span>{settings?.contactAddress || "TRIP MAX Towers, Brigade Road, Bengaluru, Karnataka 560001, India"}</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} color="#0ea5e9" style={{ flexShrink: 0 }} /> 
                <span>{settings?.contactPhone || "+91 98765 43210"}</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} color="#0ea5e9" style={{ flexShrink: 0 }} /> 
                <span>{settings?.contactEmail || "support@tripmax.com"}</span>
              </li>
              {settings?.operatingHours && (
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#64748b' }}>
                  <Clock size={15} color="#f59e0b" style={{ flexShrink: 0 }} />
                  <span>{settings.operatingHours}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} TRIP MAX. All rights reserved. Travel Beyond Limits.</p>
        </div>
      </div>
    </footer>
  );
}
