import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, Save, Info, Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AdminSiteContent() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('contact'); // 'contact' | 'about'
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    contactPhone: '',
    contactEmail: '',
    contactAddress: '',
    operatingHours: '',
    aboutTitle: '',
    aboutTagline: '',
    aboutStory: '',
    aboutMission: '',
    aboutVision: '',
    happyTravelers: '',
    destinationsCount: '',
    experienceYears: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setLoading(true);
    try {
      const res = await api.get('/settings');
      if (res.data) {
        setFormData(res.data);
      }
    } catch (err) {
      console.error("Failed to load site content settings", err);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      const res = await api.put('/settings', formData);
      if (res.data) {
        setFormData(res.data);
      }
      setSuccessMsg("Site content updated successfully!");
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      alert("Failed to update site content: " + (err.message || 'Server error'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading Site Content Settings..." />;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)' }}>Edit Site Content & Information</h2>
        <p style={{ color: 'var(--text-muted)' }}>Manage contact numbers, business address, operating hours, and About Us story for TRIP MAX.</p>
      </div>

      {successMsg && (
        <div style={{ background: '#d1fae5', border: '1px solid #6ee7b7', color: '#047857', padding: '1rem 1.25rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600 }}>
          <CheckCircle2 size={20} /> {successMsg}
        </div>
      )}

      {/* Tabs Bar */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #e2e8f0', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('contact')}
          style={{
            padding: '0.85rem 1.5rem',
            fontWeight: 700,
            fontSize: '1rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'contact' ? '3px solid var(--primary-blue)' : '3px solid transparent',
            color: activeTab === 'contact' ? 'var(--primary-blue)' : 'var(--text-muted)',
            cursor: 'pointer',
            marginBottom: '-2px',
            transition: 'all 0.2s ease'
          }}
        >
          📞 Contact Information Settings
        </button>

        <button 
          onClick={() => setActiveTab('about')}
          style={{
            padding: '0.85rem 1.5rem',
            fontWeight: 700,
            fontSize: '1rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'about' ? '3px solid var(--primary-blue)' : '3px solid transparent',
            color: activeTab === 'about' ? 'var(--primary-blue)' : 'var(--text-muted)',
            cursor: 'pointer',
            marginBottom: '-2px',
            transition: 'all 0.2s ease'
          }}
        >
          ℹ️ About Us Page Content
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ background: '#ffffff', padding: '2rem', borderRadius: '20px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
        {activeTab === 'contact' ? (
          <div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: 'var(--primary-navy)' }}>Contact Page & Footer Details</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Support Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="+91 98765 43210" 
                    value={formData.contactPhone || ''} 
                    onChange={e => setFormData({ ...formData, contactPhone: e.target.value })} 
                    style={{ paddingLeft: '2.5rem' }} 
                  />
                  <Phone size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Support Email Address</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="support@tripmax.com" 
                    value={formData.contactEmail || ''} 
                    onChange={e => setFormData({ ...formData, contactEmail: e.target.value })} 
                    style={{ paddingLeft: '2.5rem' }} 
                  />
                  <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Office Address</label>
                <div style={{ position: 'relative' }}>
                  <textarea 
                    className="form-control" 
                    rows="3" 
                    placeholder="TRIP MAX Towers, Brigade Road, Bengaluru, Karnataka 560001, India" 
                    value={formData.contactAddress || ''} 
                    onChange={e => setFormData({ ...formData, contactAddress: e.target.value })} 
                    style={{ paddingLeft: '2.5rem' }} 
                  />
                  <MapPin size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.9rem', top: '1.1rem' }} />
                </div>
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Operating / Support Hours</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Monday - Saturday: 9:00 AM - 8:00 PM IST" 
                    value={formData.operatingHours || ''} 
                    onChange={e => setFormData({ ...formData, operatingHours: e.target.value })} 
                    style={{ paddingLeft: '2.5rem' }} 
                  />
                  <Clock size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: 'var(--primary-navy)' }}>About Us Page Copy & Statistics</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Main Heading Title</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Crafting Extraordinary Journeys Beyond Limits" 
                  value={formData.aboutTitle || ''} 
                  onChange={e => setFormData({ ...formData, aboutTitle: e.target.value })} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tagline / Subtitle</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="TRIP MAX - India's Premier Custom Travel Planner" 
                  value={formData.aboutTagline || ''} 
                  onChange={e => setFormData({ ...formData, aboutTagline: e.target.value })} 
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Our Story</label>
                <textarea 
                  className="form-control" 
                  rows="4" 
                  placeholder="Tell your brand story and journey..." 
                  value={formData.aboutStory || ''} 
                  onChange={e => setFormData({ ...formData, aboutStory: e.target.value })} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Our Mission Statement</label>
                <textarea 
                  className="form-control" 
                  rows="3" 
                  placeholder="State your company mission..." 
                  value={formData.aboutMission || ''} 
                  onChange={e => setFormData({ ...formData, aboutMission: e.target.value })} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Our Vision Statement</label>
                <textarea 
                  className="form-control" 
                  rows="3" 
                  placeholder="State your company vision..." 
                  value={formData.aboutVision || ''} 
                  onChange={e => setFormData({ ...formData, aboutVision: e.target.value })} 
                />
              </div>

              {/* Stats Counters */}
              <div className="form-group">
                <label className="form-label">Happy Travelers Count</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="25,000+" 
                  value={formData.happyTravelers || ''} 
                  onChange={e => setFormData({ ...formData, happyTravelers: e.target.value })} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Destinations Count</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="150+" 
                  value={formData.destinationsCount || ''} 
                  onChange={e => setFormData({ ...formData, destinationsCount: e.target.value })} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Years of Experience</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="10+" 
                  value={formData.experienceYears || ''} 
                  onChange={e => setFormData({ ...formData, experienceYears: e.target.value })} 
                />
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
          <button type="submit" disabled={saving} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 2rem' }}>
            <Save size={18} /> {saving ? 'Saving Changes...' : 'Save Site Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
