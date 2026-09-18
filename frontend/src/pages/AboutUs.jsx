import React from 'react';
import { Compass, ShieldCheck, HeartHandshake, Globe, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutUs() {
  return (
    <div className="section">
      <div className="container">
        {/* Intro */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3.5rem', alignItems: 'center', marginBottom: '5rem' }}>
          <div>
            <span className="section-tag">About Tourister</span>
            <h1 className="section-title" style={{ fontSize: '3rem', textAlign: 'left' }}>Crafting Unforgettable Journeys Since 2020</h1>
            <p style={{ color: 'var(--text-dark)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              At <strong>Tourister Trip Planner</strong>, we believe travel is not just about visiting places — it's about making lifelong memories, discovering rich cultures, and experiencing pure joy.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7 }}>
              Our dedicated travel concierges combine local insider knowledge with seamless logistics, ensuring that every itinerary is personalized to meet your unique desires and expectations.
            </p>
          </div>

          <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-xl)' }}>
            <img 
              src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80" 
              alt="Travel Planning Experience" 
              style={{ width: '100%', height: '420px', objectFit: 'cover' }} 
            />
          </div>
        </div>

        {/* Mission & Vision */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '5rem' }}>
          <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '20px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ width: 50, height: 50, borderRadius: '12px', background: 'rgba(2, 132, 199, 0.1)', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Globe size={28} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Our Mission</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
              To empower global travelers with effortless customized trip planning, transparent pricing, and world-class hospitality that transforms dream vacations into reality.
            </p>
          </div>

          <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '20px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ width: 50, height: 50, borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Award size={28} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Our Vision</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
              To become the world's most trusted travel platform recognized for exceptional customer satisfaction, innovative personalized itineraries, and authentic local experiences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
