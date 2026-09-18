import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import ErrorMessage from '../components/ErrorMessage';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all required fields (Name, Email, Message).');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/contact', formData);
      setSuccessMsg(res.message || 'Thank you! Your message has been received.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Get In Touch</span>
          <h2 className="section-title">Contact Tourister Team</h2>
          <p className="section-desc">Have questions about a tour package or need custom travel advice? We're here to help!</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '3rem' }}>
          {/* Contact Info Card */}
          <div style={{ background: '#1e293b', color: '#fff', padding: '3rem 2rem', borderRadius: '24px', boxShadow: 'var(--shadow-md)', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '0.75rem' }}>Contact Information</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Fill out the form or reach out directly to our travel experts.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(14, 165, 233, 0.15)', color: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={22} />
                </div>
                <div>
                  <h5 style={{ fontSize: '1rem', color: '#fff' }}>Office Address</h5>
                  <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>100 Grand Travel Way, Suite 400<br />San Francisco, CA 94107, USA</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone size={22} />
                </div>
                <div>
                  <h5 style={{ fontSize: '1rem', color: '#fff' }}>Phone Support</h5>
                  <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>+1 (800) 555-0199 (Toll-Free)<br />+1 (415) 555-0144 (Direct)</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={22} />
                </div>
                <div>
                  <h5 style={{ fontSize: '1rem', color: '#fff' }}>Email Inquiries</h5>
                  <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>support@touristerplanner.com<br />bookings@touristerplanner.com</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Clock size={22} />
                </div>
                <div>
                  <h5 style={{ fontSize: '1rem', color: '#fff' }}>Business Hours</h5>
                  <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>Mon - Fri: 8:00 AM - 8:00 PM EST<br />Sat - Sun: 9:00 AM - 5:00 PM EST</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div style={{ background: '#fff', padding: '3rem', borderRadius: '24px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-light)' }}>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '1.5rem' }}>Send Us A Message</h3>

            {successMsg && (
              <div style={{ background: '#d1fae5', border: '1px solid #6ee7b7', color: '#065f46', padding: '1rem 1.25rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle2 size={20} />
                <span>{successMsg}</span>
              </div>
            )}

            <ErrorMessage message={error} />

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input 
                    type="text" 
                    name="name" 
                    className="form-control" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input 
                    type="email" 
                    name="email" 
                    className="form-control" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    className="form-control" 
                    value={formData.phone} 
                    onChange={handleChange} 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input 
                    type="text" 
                    name="subject" 
                    className="form-control" 
                    placeholder="e.g. Booking inquiry"
                    value={formData.subject} 
                    onChange={handleChange} 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea 
                  name="message" 
                  className="form-control" 
                  rows="5" 
                  placeholder="How can we help you plan your trip?" 
                  value={formData.message} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                <Send size={18} /> {loading ? 'Sending Message...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
