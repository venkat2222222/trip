import React, { useState, useEffect } from 'react';
import { Search, MapPin, Eye, CheckCircle2, Clock, X } from 'lucide-react';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const STATUS_LIST = ['ALL', 'PENDING', 'REVIEWING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

export default function AdminTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedTripDetails, setSelectedTripDetails] = useState(null);

  useEffect(() => {
    fetchTrips();
  }, []);

  async function fetchTrips() {
    setLoading(true);
    try {
      const res = await api.get('/admin/trips');
      setTrips(res.data || []);
    } catch (err) {
      console.error("Failed to load trip requests", err);
    } finally {
      setLoading(false);
    }
  }

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const res = await api.put(`/admin/trips/${id}/status`, { status: newStatus });
      setTrips(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    } catch (err) {
      alert(err.message || 'Failed to update trip status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredTrips = trips.filter(t => {
    const matchesSearch = t.requestId.toLowerCase().includes(search.toLowerCase()) ||
                          t.destination.toLowerCase().includes(search.toLowerCase()) ||
                          t.userFullName.toLowerCase().includes(search.toLowerCase()) ||
                          t.userEmail.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || t.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem' }}>Trip Request Management</h2>
          <p style={{ color: 'var(--text-muted)' }}>Review customer requirements and update booking progress.</p>
        </div>

        {/* Status Filter & Search */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <select 
            className="form-control" 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)} 
            style={{ width: 'auto' }}
          >
            {STATUS_LIST.map(st => (
              <option key={st} value={st}>{st === 'ALL' ? 'All Statuses' : st}</option>
            ))}
          </select>

          <div style={{ position: 'relative', width: '260px' }}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search ID, Name, Destination..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              style={{ paddingLeft: '2.5rem' }} 
            />
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching trip requests..." />
      ) : filteredTrips.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#fff', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
          <h3>No trip requests found matching filter criteria</h3>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>User / Contact</th>
                <th>Destination</th>
                <th>Travelers</th>
                <th>Submitted Date</th>
                <th>Status</th>
                <th>Update Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrips.map(trip => (
                <tr key={trip.id}>
                  <td>
                    <strong style={{ color: 'var(--primary-navy)' }}>{trip.requestId}</strong>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{trip.userFullName}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{trip.userEmail}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{trip.userPhone}</div>
                  </td>
                  <td>
                    <strong style={{ color: 'var(--primary-dark)' }}>{trip.destination}</strong>
                    {trip.startingLocation && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>From: {trip.startingLocation}</div>}
                  </td>
                  <td>{trip.numberOfTravelers} Person(s)</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {new Date(trip.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <span className={`badge-status badge-${trip.status.toLowerCase()}`}>
                      {trip.status}
                    </span>
                  </td>
                  <td>
                    <select 
                      className="form-control" 
                      style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem', width: 'auto' }}
                      value={trip.status}
                      disabled={updatingId === trip.id}
                      onChange={(e) => handleStatusUpdate(trip.id, e.target.value)}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="REVIEWING">REVIEWING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={() => setSelectedTripDetails(trip)} className="btn btn-outline btn-sm">
                      <Eye size={14} /> Full Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Admin Full Details Modal */}
      {selectedTripDetails && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15,23,42,0.75)',
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
            maxWidth: '700px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2.5rem',
            boxShadow: 'var(--shadow-xl)',
            position: 'relative'
          }}>
            <button 
              onClick={() => setSelectedTripDetails(null)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.8rem', color: 'var(--primary-navy)', marginBottom: '0.25rem' }}>
              Request #{selectedTripDetails.requestId}
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Submitted by {selectedTripDetails.userFullName} ({selectedTripDetails.userEmail})</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Destination</span>
                <strong>{selectedTripDetails.destination}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Origin</span>
                <strong>{selectedTripDetails.startingLocation || 'N/A'}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Travelers & Rooms</span>
                <strong>{selectedTripDetails.numberOfTravelers} Person(s) / {selectedTripDetails.numberOfRooms} Room(s)</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Budget</span>
                <strong>{selectedTripDetails.estimatedBudget ? `${selectedTripDetails.currency} ${selectedTripDetails.estimatedBudget}` : 'Not specified'}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              <div><strong>Transportation Requirements:</strong> {selectedTripDetails.transportation || 'None'}</div>
              <div><strong>Accommodation Preferences:</strong> {selectedTripDetails.accommodation || 'None'}</div>
              <div><strong>Food Preferences:</strong> {selectedTripDetails.foodPreference || 'None'}</div>
              <div><strong>Trip Style Preferences:</strong> {selectedTripDetails.travelPreferences || 'None'}</div>
              {selectedTripDetails.specialRequirements && (
                <div style={{ background: '#fef3c7', padding: '1rem', borderRadius: '12px', color: '#78350f' }}>
                  <strong>Special Notes / Requirements Message:</strong>
                  <p style={{ marginTop: '0.25rem' }}>{selectedTripDetails.specialRequirements}</p>
                </div>
              )}
            </div>

            <div style={{ textAlign: 'right' }}>
              <button onClick={() => setSelectedTripDetails(null)} className="btn btn-primary">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
