import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Upload, Sparkles, MapPin, DollarSign, Clock, Check, X, Image as ImageIcon } from 'lucide-react';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AdminTours() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const initialFormState = {
    name: '',
    destination: '',
    description: '',
    imageUrl: '',
    durationDays: 3,
    price: 499,
    accommodation: '4-Star Luxury Resort',
    transportation: 'AC Coach & Transfers',
    food: 'All Meals Included',
    includedItems: 'Airport Pickup\nDaily Breakfast\nGuided Sightseeing\nHotel Stay',
    excludedItems: 'Personal Expenses\nFlight Tickets\nTips & Gratuities',
    itinerary: 'Day 1: Arrival & Hotel Check-in\nDay 2: Guided City Tour & Local Cuisine\nDay 3: Departure',
    featured: false
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchTours();
  }, []);

  async function fetchTours() {
    setLoading(true);
    try {
      const res = await api.get('/packages');
      setTours(res.data || []);
    } catch (err) {
      console.error("Failed to load tour packages", err);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAddModal = () => {
    setEditingTour(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (tour) => {
    setEditingTour(tour);
    setFormData({
      name: tour.name || '',
      destination: tour.destination || '',
      description: tour.description || '',
      imageUrl: tour.imageUrl || '',
      durationDays: tour.durationDays || 1,
      price: tour.price || 0,
      accommodation: tour.accommodation || '',
      transportation: tour.transportation || '',
      food: tour.food || '',
      includedItems: tour.includedItems || '',
      excludedItems: tour.excludedItems || '',
      itinerary: tour.itinerary || '',
      featured: !!tour.featured
    });
    setIsModalOpen(true);
  };

  const handleImageFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await api.uploadFile(file);
      if (res.data && res.data.url) {
        setFormData(prev => ({ ...prev, imageUrl: res.data.url }));
      }
    } catch (err) {
      alert("Failed to upload image: " + (err.message || 'Error occurred'));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.destination || !formData.price || !formData.durationDays) {
      alert("Please fill in all required fields (Name, Destination, Price, Duration).");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        durationDays: parseInt(formData.durationDays, 10)
      };

      if (editingTour) {
        const res = await api.put(`/packages/${editingTour.id}`, payload);
        setTours(prev => prev.map(t => t.id === editingTour.id ? res.data : t));
      } else {
        const res = await api.post('/packages', payload);
        setTours(prev => [res.data, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert("Failed to save tour package: " + (err.message || "Server error"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/packages/${id}`);
      setTours(prev => prev.filter(t => t.id !== id));
      setDeleteConfirmId(null);
    } catch (err) {
      alert("Failed to delete tour package: " + (err.message || "Server error"));
    }
  };

  const filteredTours = tours.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
                          t.destination.toLowerCase().includes(search.toLowerCase());
    const matchesFeatured = featuredFilter === 'ALL' || 
                            (featuredFilter === 'FEATURED' && t.featured) ||
                            (featuredFilter === 'STANDARD' && !t.featured);
    return matchesSearch && matchesFeatured;
  });

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)' }}>Tour Packages Management</h2>
          <p style={{ color: 'var(--text-muted)' }}>Add new tour packages, edit existing packages, update images & details.</p>
        </div>

        <button onClick={handleOpenAddModal} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Add New Tour
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '280px', flex: '1 1 200px' }}>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search tours or destinations..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            style={{ paddingLeft: '2.5rem' }} 
          />
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
        </div>

        <select 
          className="form-control" 
          value={featuredFilter} 
          onChange={(e) => setFeaturedFilter(e.target.value)} 
          style={{ width: 'auto', minWidth: '160px' }}
        >
          <option value="ALL">All Packages</option>
          <option value="FEATURED">Featured Only</option>
          <option value="STANDARD">Standard Packages</option>
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner message="Fetching tour packages..." />
      ) : filteredTours.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#fff', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
          <h3>No tour packages found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Try adjusting your search criteria or add a new tour package.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Tour Package</th>
                <th>Destination</th>
                <th>Duration & Price</th>
                <th>Featured</th>
                <th>Inclusions</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTours.map(tour => (
                <tr key={tour.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <img 
                        src={tour.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=200&q=80'} 
                        alt={tour.name} 
                        style={{ width: 52, height: 52, borderRadius: 10, objectFit: 'cover', border: '1px solid #e2e8f0' }} 
                      />
                      <div>
                        <strong style={{ color: 'var(--primary-dark)', fontSize: '0.95rem' }}>{tour.name}</strong>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', maxWidth: '280px' }}>
                          {tour.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--primary-blue)', fontWeight: 600, fontSize: '0.9rem' }}>
                      <MapPin size={14} /> {tour.destination}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--primary-navy)' }}>₹{tour.price}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{tour.durationDays} Days / {tour.durationDays - 1} Nights</div>
                  </td>
                  <td>
                    {tour.featured ? (
                      <span className="badge-status badge-confirmed" style={{ fontSize: '0.75rem' }}>
                        <Sparkles size={12} /> Featured
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Standard</span>
                    )}
                  </td>
                  <td>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <div>🏨 {tour.accommodation || 'Included'}</div>
                      <div>🚗 {tour.transportation || 'Included'}</div>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button onClick={() => handleOpenEditModal(tour)} className="btn btn-outline btn-sm" title="Edit Tour">
                        <Edit2 size={14} /> Edit
                      </button>
                      <button onClick={() => setDeleteConfirmId(tour.id)} className="btn btn-outline btn-sm" style={{ color: 'var(--rose-red)', borderColor: '#fca5a5' }} title="Delete Tour">
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Tour Modal */}
      {isModalOpen && (
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
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2.5rem',
            boxShadow: 'var(--shadow-xl)',
            position: 'relative'
          }}>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.8rem', color: 'var(--primary-navy)', marginBottom: '0.25rem' }}>
              {editingTour ? 'Edit Tour Package' : 'Create New Tour Package'}
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Provide complete package details and upload a high-resolution banner image.</p>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Package Name *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g., Bali Tropical Paradise Experience" 
                    value={formData.name} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Destination *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g., Bali, Indonesia" 
                    value={formData.destination} 
                    onChange={e => setFormData({ ...formData, destination: e.target.value })} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Price (₹ INR) *</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    className="form-control" 
                    placeholder="e.g., 49999" 
                    value={formData.price} 
                    onChange={e => setFormData({ ...formData, price: e.target.value })} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Duration (Days) *</label>
                  <input 
                    type="number" 
                    min="1" 
                    className="form-control" 
                    value={formData.durationDays} 
                    onChange={e => setFormData({ ...formData, durationDays: e.target.value })} 
                    required 
                  />
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1.8rem' }}>
                  <input 
                    type="checkbox" 
                    id="featured-check" 
                    checked={formData.featured} 
                    onChange={e => setFormData({ ...formData, featured: e.target.checked })} 
                    style={{ width: 18, height: 18, cursor: 'pointer' }}
                  />
                  <label htmlFor="featured-check" style={{ fontWeight: 600, cursor: 'pointer', color: 'var(--primary-dark)' }}>
                    ⭐ Mark as Featured Package on Homepage
                  </label>
                </div>

                {/* Tour Image Upload & URL */}
                <div className="form-group" style={{ gridColumn: '1 / -1', background: '#f8fafc', padding: '1.25rem', borderRadius: '16px', border: '1px border-light' }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ImageIcon size={18} color="var(--primary-blue)" /> Tour Image (URL or Upload File)
                  </label>
                  
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem' }}>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="https://images.unsplash.com/... or /uploads/..." 
                      value={formData.imageUrl} 
                      onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} 
                      style={{ flex: 1 }}
                    />
                    <label className="btn btn-outline" style={{ cursor: 'pointer', background: '#fff', whiteSpace: 'nowrap' }}>
                      <Upload size={16} /> {uploadingImage ? 'Uploading...' : 'Upload Image File'}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageFileUpload} 
                        style={{ display: 'none' }} 
                        disabled={uploadingImage}
                      />
                    </label>
                  </div>

                  {formData.imageUrl && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img 
                        src={formData.imageUrl} 
                        alt="Preview" 
                        style={{ width: 100, height: 60, borderRadius: 8, objectFit: 'cover', border: '1px solid #cbd5e1' }}
                      />
                      <span style={{ fontSize: '0.85rem', color: 'var(--emerald-green)', fontWeight: 600 }}>✓ Image preview loaded</span>
                    </div>
                  )}
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Description</label>
                  <textarea 
                    className="form-control" 
                    rows="3" 
                    placeholder="Provide a detailed summary of the tour package experience..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Accommodation Info</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g., 4-Star Ocean View Resort" 
                    value={formData.accommodation} 
                    onChange={e => setFormData({ ...formData, accommodation: e.target.value })} 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Transportation Info</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g., AC Coach & Private Transfers" 
                    value={formData.transportation} 
                    onChange={e => setFormData({ ...formData, transportation: e.target.value })} 
                  />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Food & Dining Info</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g., Daily Breakfast & Special Beach Dinner" 
                    value={formData.food} 
                    onChange={e => setFormData({ ...formData, food: e.target.value })} 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Included Items (One per line)</label>
                  <textarea 
                    className="form-control" 
                    rows="3" 
                    placeholder="Airport Pickup&#10;Daily Breakfast&#10;Sightseeing Tickets"
                    value={formData.includedItems}
                    onChange={e => setFormData({ ...formData, includedItems: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Excluded Items (One per line)</label>
                  <textarea 
                    className="form-control" 
                    rows="3" 
                    placeholder="Flight Tickets&#10;Personal Expenses"
                    value={formData.excludedItems}
                    onChange={e => setFormData({ ...formData, excludedItems: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Itinerary Details</label>
                  <textarea 
                    className="form-control" 
                    rows="4" 
                    placeholder="Day 1: Arrival...&#10;Day 2: Beach & Temple Tour..."
                    value={formData.itinerary}
                    onChange={e => setFormData({ ...formData, itinerary: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn btn-primary">
                  {saving ? 'Saving...' : editingTour ? 'Update Package' : 'Create Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
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
            borderRadius: '20px',
            maxWidth: '450px',
            width: '100%',
            padding: '2rem',
            boxShadow: 'var(--shadow-xl)',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>Confirm Delete Package</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Are you sure you want to permanently delete this tour package? This action cannot be undone.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button onClick={() => setDeleteConfirmId(null)} className="btn btn-outline">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirmId)} className="btn btn-primary" style={{ background: 'var(--rose-red)' }}>Confirm Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
