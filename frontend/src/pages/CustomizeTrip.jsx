import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Compass, Calendar, MapPin, Users, Car, Hotel, UtensilsCrossed, DollarSign, MessageSquare, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import ErrorMessage from '../components/ErrorMessage';

const TRANSPORT_OPTIONS = ['Flight', 'Train', 'Bus', 'Car', 'Rental Car', 'Local Transportation', 'No transportation required'];
const ACCOMMODATION_OPTIONS = ['No accommodation required', 'Budget', 'Standard', 'Premium', 'Luxury'];
const FOOD_OPTIONS = ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Jain', 'Halal', 'No special requirement', 'Other'];
const PREFERENCE_OPTIONS = ['Adventure activities', 'Sightseeing', 'Relaxation', 'Family trip', 'Honeymoon', 'Solo travel', 'Business travel', 'Cultural experience'];

export default function CustomizeTrip() {
  const [searchParams] = useSearchParams();
  const { user, saveDraftTrip, draftTrip, clearDraftTrip } = useAuth();
  const navigate = useNavigate();

  // Initial Form State
  const [formData, setFormData] = useState({
    userFullName: user?.fullName || '',
    userEmail: user?.email || '',
    userPhone: user?.phone || '',
    numberOfTravelers: 2,
    
    startingLocation: '',
    destination: searchParams.get('destination') || searchParams.get('packageName') || '',
    startDate: '',
    endDate: '',
    flexibleDates: false,
    
    transportation: ['Flight', 'Local Transportation'],
    accommodation: 'Standard',
    numberOfRooms: 1,
    roomPreferences: '',
    
    foodPreference: 'No special requirement',
    estimatedBudget: '',
    currency: 'USD',
    specialRequirements: '',
    travelPreferences: ['Sightseeing', 'Cultural experience']
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedTrip, setSubmittedTrip] = useState(null);
  const [showAuthGateModal, setShowAuthGateModal] = useState(false);

  // Restore draft if available
  useEffect(() => {
    if (draftTrip) {
      setFormData(prev => ({
        ...prev,
        ...draftTrip,
        userFullName: user?.fullName || draftTrip.userFullName,
        userEmail: user?.email || draftTrip.userEmail,
        userPhone: user?.phone || draftTrip.userPhone
      }));
    }
  }, [draftTrip, user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCheckboxGroup = (category, value) => {
    setFormData(prev => {
      const currentList = prev[category] || [];
      const updated = currentList.includes(value)
        ? currentList.filter(item => item !== value)
        : [...currentList, value];
      return { ...prev, [category]: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.destination.trim()) {
      setError('Please specify your desired travel destination.');
      return;
    }

    if (!user) {
      // Unauthenticated flow: Save draft & show Auth Gate Modal
      saveDraftTrip(formData);
      setShowAuthGateModal(true);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        userFullName: formData.userFullName || user.fullName,
        userEmail: formData.userEmail || user.email,
        userPhone: formData.userPhone || user.phone,
        transportation: Array.isArray(formData.transportation) ? formData.transportation.join(', ') : formData.transportation,
        travelPreferences: Array.isArray(formData.travelPreferences) ? formData.travelPreferences.join(', ') : formData.travelPreferences,
        estimatedBudget: formData.estimatedBudget ? parseFloat(formData.estimatedBudget) : null
      };

      const res = await api.post('/trips', payload);
      setSubmittedTrip(res.data);
      clearDraftTrip();
    } catch (err) {
      setError(err.message || 'Failed to submit trip request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedTrip) {
    return (
      <div className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ background: '#fff', borderRadius: '24px', padding: '3.5rem 2.5rem', textAlign: 'center', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-light)' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #047857)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
              <CheckCircle2 size={48} />
            </div>

            <span className="badge-status badge-pending" style={{ fontSize: '0.9rem', padding: '0.5rem 1.25rem', marginBottom: '1.25rem' }}>
              Status: {submittedTrip.status}
            </span>

            <h2 style={{ fontSize: '2.4rem', marginBottom: '0.75rem' }}>Your Trip Request Has Been Submitted!</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2.5rem' }}>
              Thank you for choosing Tourister. Our destination specialists are reviewing your requirements and will contact you shortly.
            </p>

            <div style={{ background: '#f8fafc', padding: '1.75rem', borderRadius: '16px', border: '1px solid var(--border-light)', textAlign: 'left', marginBottom: '2.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>Request ID</span>
                  <strong style={{ fontSize: '1.2rem', color: 'var(--primary-navy)' }}>{submittedTrip.requestId}</strong>
                </div>

                <div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>Destination</span>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--primary-dark)' }}>{submittedTrip.destination}</strong>
                </div>

                <div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>Number of Travelers</span>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--primary-dark)' }}>{submittedTrip.numberOfTravelers} Person(s)</strong>
                </div>

                <div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>Submission Date</span>
                  <strong style={{ fontSize: '1rem', color: 'var(--primary-dark)' }}>{new Date(submittedTrip.createdAt).toLocaleDateString()}</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                View in My Dashboard
              </Link>
              <Link to="/" className="btn btn-outline btn-lg">
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '960px' }}>
        <div className="section-header">
          <span className="section-tag">Custom Itinerary</span>
          <h2 className="section-title">Design Your Tailor-Made Trip</h2>
          <p className="section-desc">Fill out your travel preferences below. Our travel experts will create a customized package tailored specifically for you.</p>
        </div>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '3rem', borderRadius: '24px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-light)' }}>
          {/* Section 1: User Contact Details */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-navy)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={20} color="#0284c7" /> 1. Traveler Information
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input 
                  type="text" 
                  name="userFullName" 
                  className="form-control" 
                  value={formData.userFullName} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input 
                  type="email" 
                  name="userEmail" 
                  className="form-control" 
                  value={formData.userEmail} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input 
                  type="tel" 
                  name="userPhone" 
                  className="form-control" 
                  value={formData.userPhone} 
                  onChange={handleInputChange} 
                  placeholder="+1 (555) 000-0000"
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Number of Travelers *</label>
                <input 
                  type="number" 
                  name="numberOfTravelers" 
                  className="form-control" 
                  min="1" 
                  max="50" 
                  value={formData.numberOfTravelers} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '2.5rem 0' }} />

          {/* Section 2: Travel Details */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-navy)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={20} color="#0284c7" /> 2. Travel Destinations & Schedule
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Starting Location / Origin City</label>
                <input 
                  type="text" 
                  name="startingLocation" 
                  className="form-control" 
                  placeholder="e.g. New York, London, Mumbai" 
                  value={formData.startingLocation} 
                  onChange={handleInputChange} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Destination *</label>
                <input 
                  type="text" 
                  name="destination" 
                  className="form-control" 
                  placeholder="e.g. Swiss Alps, Bali, Japan..." 
                  value={formData.destination} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Travel Start Date</label>
                <input 
                  type="date" 
                  name="startDate" 
                  className="form-control" 
                  value={formData.startDate} 
                  onChange={handleInputChange} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Travel End Date</label>
                <input 
                  type="date" 
                  name="endDate" 
                  className="form-control" 
                  value={formData.endDate} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>

            <div style={{ marginTop: '0.5rem' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 500 }}>
                <input 
                  type="checkbox" 
                  name="flexibleDates" 
                  checked={formData.flexibleDates} 
                  onChange={handleInputChange} 
                  style={{ width: 18, height: 18 }} 
                />
                My travel dates are flexible (+/- 3 days)
              </label>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '2.5rem 0' }} />

          {/* Section 3: Transportation & Accommodation */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-navy)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Car size={20} color="#0284c7" /> 3. Transportation & Accommodation
            </h3>

            <div className="form-group">
              <label className="form-label">Preferred Modes of Transportation</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                {TRANSPORT_OPTIONS.map(opt => (
                  <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.92rem', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={formData.transportation.includes(opt)} 
                      onChange={() => handleCheckboxGroup('transportation', opt)} 
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginTop: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Accommodation Level</label>
                <select 
                  name="accommodation" 
                  className="form-control" 
                  value={formData.accommodation} 
                  onChange={handleInputChange}
                >
                  {ACCOMMODATION_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Number of Rooms</label>
                <input 
                  type="number" 
                  name="numberOfRooms" 
                  className="form-control" 
                  min="1" 
                  value={formData.numberOfRooms} 
                  onChange={handleInputChange} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Food Preference</label>
                <select 
                  name="foodPreference" 
                  className="form-control" 
                  value={formData.foodPreference} 
                  onChange={handleInputChange}
                >
                  {FOOD_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '2.5rem 0' }} />

          {/* Section 4: Budget & Special Preferences */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-navy)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <DollarSign size={20} color="#0284c7" /> 4. Budget & Special Requirements
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Estimated Budget Amount</label>
                <input 
                  type="number" 
                  name="estimatedBudget" 
                  className="form-control" 
                  placeholder="e.g. 3000" 
                  value={formData.estimatedBudget} 
                  onChange={handleInputChange} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Currency</label>
                <select name="currency" className="form-control" value={formData.currency} onChange={handleInputChange}>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Trip Style & Preferences</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                {PREFERENCE_OPTIONS.map(opt => (
                  <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.92rem', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={formData.travelPreferences.includes(opt)} 
                      onChange={() => handleCheckboxGroup('travelPreferences', opt)} 
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label className="form-label">Special Requirements / Notes</label>
              <textarea 
                name="specialRequirements" 
                className="form-control" 
                rows="4" 
                placeholder="Tell us about any specific activities, dietary needs, accessibility preferences, or special requests..." 
                value={formData.specialRequirements} 
                onChange={handleInputChange} 
              />
            </div>
          </div>

          <div style={{ textAlign: 'center', paddingTop: '1rem' }}>
            <button type="submit" disabled={submitting} className="btn btn-amber btn-lg" style={{ minWidth: '280px' }}>
              {submitting ? 'Submitting Request...' : 'Submit Customized Trip Request'}
            </button>
          </div>
        </form>

        {/* Unauthenticated Auth Gate Modal */}
        {showAuthGateModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,42,0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}>
            <div style={{
              background: '#fff',
              borderRadius: '24px',
              padding: '2.5rem',
              maxWidth: '520px',
              width: '100%',
              textAlign: 'center',
              boxShadow: 'var(--shadow-xl)'
            }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
                <ShieldAlert size={36} />
              </div>
              <h3 style={{ fontSize: '1.6rem', marginBottom: '0.75rem' }}>Account Authentication Required</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '2rem' }}>
                You need to create an account or log in before submitting your trip request. Don't worry — your customized trip selections have been saved!
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <Link to="/login?redirect=/customize-trip" className="btn btn-primary btn-lg">
                  Log In To Submit
                </Link>
                <Link to="/register?redirect=/customize-trip" className="btn btn-amber btn-lg">
                  Create New Account
                </Link>
                <button onClick={() => setShowAuthGateModal(false)} className="btn btn-outline" style={{ marginTop: '0.5rem' }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
