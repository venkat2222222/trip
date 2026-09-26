import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, Compass, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import PlaceCard from '../components/PlaceCard';
import LoadingSpinner from '../components/LoadingSpinner';

const CATEGORIES = [
  'ALL',
  'BEACHES',
  'MOUNTAINS',
  'HISTORICAL',
  'RELIGIOUS',
  'ADVENTURE',
  'WILDLIFE',
  'CITY',
  'NATURE'
];

export default function ExplorePlaces() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'ALL');

  useEffect(() => {
    fetchPlaces();
  }, [searchParams]);

  async function fetchPlaces() {
    setLoading(true);
    try {
      const qSearch = searchParams.get('search') || '';
      const qLoc = searchParams.get('location') || '';
      const qCat = searchParams.get('category') || '';

      const queryParts = [];
      if (qSearch) queryParts.push(`search=${encodeURIComponent(qSearch)}`);
      if (qLoc) queryParts.push(`location=${encodeURIComponent(qLoc)}`);
      if (qCat && qCat !== 'ALL') queryParts.push(`category=${qCat}`);

      const queryString = queryParts.length ? `?${queryParts.join('&')}` : '';
      const res = await api.get(`/places${queryString}`);
      setPlaces(res.data || []);
    } catch (err) {
      console.error("Failed to load places", err);
    } finally {
      setLoading(false);
    }
  }

  const handleCategorySelect = (cat) => {
    setActiveCategory(cat);
    const params = {};
    if (search) params.search = search;
    if (location) params.location = location;
    if (cat !== 'ALL') params.category = cat;
    setSearchParams(params);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (search) params.search = search;
    if (location) params.location = location;
    if (activeCategory !== 'ALL') params.category = activeCategory;
    setSearchParams(params);
  };

  return (
    <div className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Destination Discovery</span>
          <h2 className="section-title">Explore Breathtaking Places</h2>
          <p className="section-desc">Search through world-renowned travel destinations and add them to your custom trip itinerary.</p>
        </div>

        {/* Category Pills */}
        <div className="category-scroll-container">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`btn btn-sm ${activeCategory === cat ? 'btn-primary' : 'btn-outline'}`}
              style={{ borderRadius: '9999px', textTransform: 'capitalize', whiteSpace: 'nowrap', flexShrink: 0 }}
            >
              {cat === 'ALL' ? '🌟 All Destinations' : cat.toLowerCase()}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="search-filter-bar">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Search Keyword / Attraction</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. Santorini, Matterhorn, Waterfalls..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Location / Country</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. Greece, Switzerland, Peru..." 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ height: '48px', alignSelf: 'end', width: '100%' }}>
            <Search size={18} /> Search Places
          </button>
        </form>


        {/* Results Grid */}
        {loading ? (
          <LoadingSpinner message="Searching destinations..." />
        ) : places.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#fff', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
            <h3>No places found in this category</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>Try choosing another category or clearing your search filter.</p>
            <button onClick={() => handleCategorySelect('ALL')} className="btn btn-primary">
              View All Places
            </button>
          </div>
        ) : (
          <div className="cards-grid">
            {places.map(place => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
