import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Upload, MapPin, DollarSign, Clock, Calendar, Check, X, Image as ImageIcon, Flame } from 'lucide-react';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const CATEGORIES = ['ALL', 'BEACHES', 'MOUNTAINS', 'HISTORICAL', 'RELIGIOUS', 'ADVENTURE', 'WILDLIFE', 'CITY', 'NATURE'];

export default function AdminPlaces() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const initialFormState = {
    name: '',
    location: '',
    category: 'BEACHES',
    description: '',
    imageUrl: '',
    estimatedCost: 15000,
    recommendedDuration: '2-3 Days',
    bestTimeToVisit: 'October to March',
    attractions: 'Local Sightseeing\nHistorical Monuments\nLocal Cuisine',
    popular: false
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchPlaces();
  }, []);

  async function fetchPlaces() {
    setLoading(true);
    try {
      const res = await api.get('/places');
      setPlaces(res.data || []);
    } catch (err) {
      console.error("Failed to load places", err);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAddModal = () => {
    setEditingPlace(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (place) => {
    setEditingPlace(place);
    setFormData({
      name: place.name || '',
      location: place.location || '',
      category: place.category || 'BEACHES',
      description: place.description || '',
      imageUrl: place.imageUrl || '',
      estimatedCost: place.estimatedCost || 0,
      recommendedDuration: place.recommendedDuration || '',
      bestTimeToVisit: place.bestTimeToVisit || '',
      attractions: place.attractions || '',
      popular: !!place.popular
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
      alert("Failed to upload place image: " + (err.message || 'Error occurred'));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.location || !formData.category) {
      alert("Please fill in all required fields (Name, Location, Category).");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        estimatedCost: parseFloat(formData.estimatedCost || 0)
      };

      if (editingPlace) {
        const res = await api.put(`/places/${editingPlace.id}`, payload);
        setPlaces(prev => prev.map(p => p.id === editingPlace.id ? res.data : p));
      } else {
        const res = await api.post('/places', payload);
        setPlaces(prev => [res.data, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert("Failed to save place: " + (err.message || "Server error"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/places/${id}`);
      setPlaces(prev => prev.filter(p => p.id !== id));
      setDeleteConfirmId(null);
    } catch (err) {
      alert("Failed to delete place: " + (err.message || "Server error"));
    }
  };

  const filteredPlaces = places.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.location.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)' }}>Explore Places Management</h2>
          <p style={{ color: 'var(--text-muted)' }}>Add new travel destinations, edit details, and upload place images.</p>
        </div>

        <button onClick={handleOpenAddModal} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Add New Place
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '280px', flex: '1 1 200px' }}>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search places or locations..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            style={{ paddingLeft: '2.5rem' }} 
          />
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
        </div>

        <select 
          className="form-control" 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)} 
          style={{ width: 'auto', minWidth: '160px' }}
        >
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat === 'ALL' ? 'All Categories' : cat}</option>
          ))}
        </select>
      </div>

      {/* Places List / Table */}
      {loading ? (
        <LoadingSpinner message="Fetching destination places..." />
      ) : filteredPlaces.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#fff', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
          <h3>No places found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Try adjusting search filters or upload/add a new place.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Place / Image</th>
                <th>Location</th>
                <th>Category</th>
                <th>Est. Cost & Duration</th>
                <th>Popularity</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlaces.map(place => (
                <tr key={place.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <img 
                        src={place.imageUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&q=80'} 
                        alt={place.name} 
                        style={{ width: 52, height: 52, borderRadius: 10, objectFit: 'cover', border: '1px solid #e2e8f0' }} 
                      />
                      <div>
                        <strong style={{ color: 'var(--primary-dark)', fontSize: '0.95rem' }}>{place.name}</strong>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', maxWidth: '280px' }}>
                          {place.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--primary-blue)', fontWeight: 600, fontSize: '0.9rem' }}>
                      <MapPin size={14} /> {place.location}
                    </div>
                  </td>
                  <td>
                    <span className="badge-status" style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '0.75rem' }}>
                      {place.category}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--primary-navy)' }}>₹{place.estimatedCost} / person</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>⏱️ {place.recommendedDuration || 'N/A'}</div>
                  </td>
                  <td>
                    {place.popular ? (
                      <span className="badge-status badge-pending" style={{ fontSize: '0.75rem', background: '#ffedd5', color: '#c2410c' }}>
                        <Flame size={12} /> Popular
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Normal</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button onClick={() => handleOpenEditModal(place)} className="btn btn-outline btn-sm" title="Edit Place">
                        <Edit2 size={14} /> Edit
                      </button>
                      <button onClick={() => setDeleteConfirmId(place.id)} className="btn btn-outline btn-sm" style={{ color: 'var(--rose-red)', borderColor: '#fca5a5' }} title="Delete Place">
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

      {/* Add / Edit Place Modal */}
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
            maxWidth: '750px',
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
              {editingPlace ? 'Edit Place' : 'Add New Place'}
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Fill place details and upload a place image.</p>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Place Name *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g., Kuta Beach & Sunset Coast" 
                    value={formData.name} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Location *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g., Bali, Indonesia" 
                    value={formData.location} 
                    onChange={e => setFormData({ ...formData, location: e.target.value })} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select 
                    className="form-control" 
                    value={formData.category} 
                    onChange={e => setFormData({ ...formData, category: e.target.value })} 
                    required
                  >
                    {CATEGORIES.filter(c => c !== 'ALL').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Estimated Cost (₹ INR / Person)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    className="form-control" 
                    placeholder="e.g., 25000" 
                    value={formData.estimatedCost} 
                    onChange={e => setFormData({ ...formData, estimatedCost: e.target.value })} 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Recommended Duration</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g., 2-3 Days" 
                    value={formData.recommendedDuration} 
                    onChange={e => setFormData({ ...formData, recommendedDuration: e.target.value })} 
                  />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Best Time to Visit</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g., October to March" 
                    value={formData.bestTimeToVisit} 
                    onChange={e => setFormData({ ...formData, bestTimeToVisit: e.target.value })} 
                  />
                </div>

                {/* Upload Place Image Box */}
                <div className="form-group" style={{ gridColumn: '1 / -1', background: '#f8fafc', padding: '1.25rem', borderRadius: '16px', border: '1px border-light' }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ImageIcon size={18} color="var(--primary-blue)" /> Place Image (URL or Upload Image File)
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
                      <Upload size={16} /> {uploadingImage ? 'Uploading Image...' : 'Upload Image File'}
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
                        alt="Place Preview" 
                        style={{ width: 100, height: 60, borderRadius: 8, objectFit: 'cover', border: '1px solid #cbd5e1' }}
                      />
                      <span style={{ fontSize: '0.85rem', color: 'var(--emerald-green)', fontWeight: 600 }}>✓ Place image uploaded & preview ready</span>
                    </div>
                  )}
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Description</label>
                  <textarea 
                    className="form-control" 
                    rows="3" 
                    placeholder="Provide highlights and attractive details about this place..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Key Attractions / Highlights (One per line)</label>
                  <textarea 
                    className="form-control" 
                    rows="3" 
                    placeholder="Sunset Point&#10;Water Sports Center&#10;Night Market"
                    value={formData.attractions}
                    onChange={e => setFormData({ ...formData, attractions: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', gridColumn: '1 / -1' }}>
                  <input 
                    type="checkbox" 
                    id="popular-check" 
                    checked={formData.popular} 
                    onChange={e => setFormData({ ...formData, popular: e.target.checked })} 
                    style={{ width: 18, height: 18, cursor: 'pointer' }}
                  />
                  <label htmlFor="popular-check" style={{ fontWeight: 600, cursor: 'pointer', color: 'var(--primary-dark)' }}>
                    🔥 Mark as Popular Destination
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn btn-primary">
                  {saving ? 'Saving...' : editingPlace ? 'Update Place' : 'Add Place'}
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
            <h3 style={{ fontSize: '1.4rem', color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>Confirm Delete Place</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Are you sure you want to permanently delete this place? This action cannot be undone.</p>
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
