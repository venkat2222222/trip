import React, { useState, useEffect } from 'react';
import { Compass, ShieldCheck, HeartHandshake, Globe, Award, Sparkles, Users, MapPin, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export default function AboutUs() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    async function loadAboutSettings() {
      try {
        const res = await api.get('/settings');
        if (res.data) {
          setSettings(res.data);
        }
      } catch (err) {
        console.error("Failed to load about us site settings", err);
      }
    }
    loadAboutSettings();
  }, []);

  return (
    <div className="section">
      <div className="container">
        {/* Intro */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3.5rem', alignItems: 'center', marginBottom: '5rem' }}>
          <div>
            <span className="section-tag" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <img src="/logo.png" alt="TRIP MAX" style={{ height: 28, borderRadius: 6 }} />
              About TRIP MAX
            </span>
            <h1 className="section-title" style={{ fontSize: '2.8rem', textAlign: 'left', marginTop: '0.5rem' }}>
              {settings?.aboutTitle || "Crafting Extraordinary Journeys Beyond Limits"}
            </h1>
            <p style={{ color: 'var(--primary-blue)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.25rem' }}>
              {settings?.aboutTagline || "TRIP MAX - India's Premier Custom Travel Planner"}
            </p>
            <p style={{ color: 'var(--text-dark)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1.5rem', whiteSpace: 'pre-line' }}>
              {settings?.aboutStory || "Founded with a passion for wanderlust, TRIP MAX was born out of a desire to make custom travel seamless, memorable, and thrilling. We craft bespoke itineraries, handpick luxury accommodations, and deliver unmatched travel experiences across domestic and international destinations in Indian Rupees."}
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/customize-trip" className="btn btn-primary">
                Start Planning <Sparkles size={16} />
              </Link>
              <Link to="/contact" className="btn btn-outline">
                Contact Us
              </Link>
            </div>
          </div>

          <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-xl)', position: 'relative' }}>
            <img 
              src="/logo.png" 
              alt="TRIP MAX Experience" 
              style={{ width: '100%', height: '440px', objectFit: 'cover' }} 
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid" style={{ marginBottom: '5rem' }}>
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a8a)', color: '#fff' }}>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <Users size={28} color="#f59e0b" />
            </div>
            <div>
              <div className="stat-val" style={{ color: '#fff' }}>{settings?.happyTravelers || '25,000+'}</div>
              <div className="stat-lbl" style={{ color: '#cbd5e1' }}>Happy Travelers</div>
            </div>
          </div>

          <div className="stat-card" style={{ background: 'linear-gradient(135deg, #0f172a, #0284c7)', color: '#fff' }}>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <MapPin size={28} color="#38bdf8" />
            </div>
            <div>
              <div className="stat-val" style={{ color: '#fff' }}>{settings?.destinationsCount || '150+'}</div>
              <div className="stat-lbl" style={{ color: '#cbd5e1' }}>Global Destinations</div>
            </div>
          </div>

          <div className="stat-card" style={{ background: 'linear-gradient(135deg, #0f172a, #10b981)', color: '#fff' }}>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <Calendar size={28} color="#34d399" />
            </div>
            <div>
              <div className="stat-val" style={{ color: '#fff' }}>{settings?.experienceYears || '10+'}</div>
              <div className="stat-lbl" style={{ color: '#cbd5e1' }}>Years of Excellence</div>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '5rem' }}>
          <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '20px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ width: 50, height: 50, borderRadius: '12px', background: 'rgba(2, 132, 199, 0.1)', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Globe size={28} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--primary-dark)' }}>Our Mission</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
              {settings?.aboutMission || "To empower travelers with tailor-made, hassle-free travel itineraries, exceptional service, and transparent pricing in Indian Rupees."}
            </p>
          </div>

          <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '20px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ width: 50, height: 50, borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Award size={28} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--primary-dark)' }}>Our Vision</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
              {settings?.aboutVision || "To become the most trusted and innovative travel planning brand worldwide, inspiring wanderlust and creating lifelong memories."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
