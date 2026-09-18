import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass, MapPin, Calendar, Clock, Eye, AlertCircle, Sparkles, X } from 'lucide-react';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function UserDashboard() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null);

  useEffect(() => {
    async function loadTrips() {
      try {
        const res = await api.get('/trips/my');
        setTrips(res.data || []);
      } catch (err) {
        console.error("Failed to fetch my trips", err);
      } finally {
        setLoading(false);
      }
    }
    loadTrips();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING': return <span className="badge-status badge-pending">PENDING REVIEW</span>;
      case 'REVIEWING': return <span className="badge-status badge-reviewing">IN REVIEW</span>;
      case 'CONFIRMED': return <span className="badge-status badge-confirmed">CONFIRMED</span>;
      case 'COMPLETED': return <span className="badge-status badge-completed">COMPLETED</span>;
      case 'CANCELLED': return <span className="badge-status badge-cancelled">CANCELLED</span>;
      default: return <span className="badge-status">{status}</span>;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem' }}>My Trip Requests</h2>
          <p style={{ color: 'var(--text-muted)' }}>Track status and updates for your submitted customized trips.</p>
        </div>

        <Link to="/customize-trip" className="btn btn-amber">
          <Sparkles size={16} /> Plan Another Trip
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching your submitted trip requests..." />
      ) : trips.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
          <Compass size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
          <h3>No Trip Requests Submitted Yet</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
            Ready to embark on your next journey? Customize your travel requirements and submit a request.
          </p>
          <Link to="/customize-trip" className="btn btn-primary">
            Plan A Customized Trip Now
          </Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Destination</th>
                <th>Travelers</th>
                <th>Dates</th>
                <th>Status</th>
                <th>Submitted On</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {trips.map(trip => (
                <tr key={trip.id}>
                  <td>
                    <strong style={{ color: 'var(--primary-navy)' }}>{trip.requestId}</strong>
                  </td>
                  <td>
                    <strong style={{ color: 'var(--primary-dark)' }}>{trip.destination}</strong>
                    {trip.startingLocation && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>From: {trip.startingLocation}</div>}
                  </td>
                  <td>{trip.numberOfTravelers} Person(s)</td>
                  <td>
                    {trip.startDate ? (
                      <span style={{ fontSize: '0.85rem' }}>{trip.startDate} to {trip.endDate || 'Flexible'}</span>
                    ) : (
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Flexible Dates</span>
                    )}
                  </td>
                  <td>{getStatusBadge(trip.status)}</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {new Date(trip.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <button onClick={() => setSelectedTrip(trip)} className="btn btn-outline btn-sm">
                      <Eye size={14} /> Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Details Drawer / Modal */}
      {selectedTrip && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15,23,42,0.7)',
          backdropFilter: 'blur(6px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '24px',
            maxWidth: '650px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2.5rem',
            boxShadow: 'var(--shadow-xl)',
            position: 'relative'
          }}>
            <button 
              onClick={() => setSelectedTrip(null)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Trip Request Details</span>
              <h3 style={{ fontSize: '1.8rem', color: 'var(--primary-navy)' }}>{selectedTrip.requestId}</h3>
              <div style={{ marginTop: '0.5rem' }}>{getStatusBadge(selectedTrip.status)}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Destination</span>
                <strong style={{ fontSize: '1.05rem' }}>{selectedTrip.destination}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Starting Location</span>
                <strong style={{ fontSize: '1.05rem' }}>{selectedTrip.startingLocation || 'Not specified'}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Travel Dates</span>
                <strong>{selectedTrip.startDate ? `${selectedTrip.startDate} to ${selectedTrip.endDate}` : 'Flexible'}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Travelers & Rooms</span>
                <strong>{selectedTrip.numberOfTravelers} Person(s) / {selectedTrip.numberOfRooms} Room(s)</strong>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem' }}>
              <div><strong>Transportation:</strong> {selectedTrip.transportation || 'None specified'}</div>
              <div><strong>Accommodation:</strong> {selectedTrip.accommodation || 'None specified'}</div>
              <div><strong>Food Requirements:</strong> {selectedTrip.foodPreference || 'Standard'}</div>
              <div><strong>Estimated Budget:</strong> {selectedTrip.estimatedBudget ? `${selectedTrip.currency} ${selectedTrip.estimatedBudget}` : 'Flexible'}</div>
              <div><strong>Travel Preferences:</strong> {selectedTrip.travelPreferences || 'None'}</div>
              {selectedTrip.specialRequirements && (
                <div style={{ background: '#fffbe8', padding: '1rem', borderRadius: '12px', border: '1px solid #fef08a' }}>
                  <strong>Special Requirements / Message:</strong>
                  <p style={{ marginTop: '0.25rem', color: '#854d0e', fontSize: '0.9rem' }}>{selectedTrip.specialRequirements}</p>
                </div>
              )}
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'right' }}>
              <button onClick={() => setSelectedTrip(null)} className="btn btn-primary">Close Details</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
