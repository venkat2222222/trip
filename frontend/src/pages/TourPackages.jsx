import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import PackageCard from '../components/PackageCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function TourPackages() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [destination, setDestination] = useState(searchParams.get('destination') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [maxDuration, setMaxDuration] = useState(searchParams.get('maxDuration') || '');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchPackages();
  }, [searchParams]);

  async function fetchPackages() {
    setLoading(true);
    try {
      const qSearch = searchParams.get('search') || '';
      const qDest = searchParams.get('destination') || '';
      const qPrice = searchParams.get('maxPrice') || '';
      const qDur = searchParams.get('maxDuration') || '';

      const queryParts = [];
      if (qSearch) queryParts.push(`search=${encodeURIComponent(qSearch)}`);
      if (qDest) queryParts.push(`destination=${encodeURIComponent(qDest)}`);
      if (qPrice) queryParts.push(`maxPrice=${qPrice}`);
      if (qDur) queryParts.push(`maxDuration=${qDur}`);

      const queryString = queryParts.length ? `?${queryParts.join('&')}` : '';
      const res = await api.get(`/packages${queryString}`);
      setPackages(res.data || []);
    } catch (err) {
      console.error("Failed to load packages", err);
    } finally {
      setLoading(false);
    }
  }

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (search) params.search = search;
    if (destination) params.destination = destination;
    if (maxPrice) params.maxPrice = maxPrice;
    if (maxDuration) params.maxDuration = maxDuration;
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    setSearch('');
    setDestination('');
    setMaxPrice('');
    setMaxDuration('');
    setSearchParams({});
  };

  // Sort packages
  const sortedPackages = [...packages].sort((a, b) => {
    if (sortBy === 'newest') return (b.id || 0) - (a.id || 0);
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'duration-asc') return a.durationDays - b.durationDays;
    return 0;
  });

  return (
    <div className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Curated Itineraries</span>
          <h2 className="section-title">Explore Tour Packages</h2>
          <p className="section-desc">Browse our collection of expertly designed tour packages with transparent pricing and top accommodations.</p>
        </div>

        {/* Filter & Search Bar */}
        <form onSubmit={handleFilterSubmit} className="search-filter-bar">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Search Keywords</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Package name or keyword..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Destination</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. Switzerland, Bali..." 
              value={destination} 
              onChange={(e) => setDestination(e.target.value)} 
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Max Price ($)</label>
            <input 
              type="number" 
              className="form-control" 
              placeholder="e.g. 2000" 
              value={maxPrice} 
              onChange={(e) => setMaxPrice(e.target.value)} 
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Max Days</label>
            <input 
              type="number" 
              className="form-control" 
              placeholder="e.g. 7" 
              value={maxDuration} 
              onChange={(e) => setMaxDuration(e.target.value)} 
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              <Filter size={16} /> Filter
            </button>
            <button type="button" onClick={handleResetFilters} className="btn btn-outline" title="Reset">
              <RefreshCw size={16} />
            </button>
          </div>
        </form>

        {/* Sort & Count Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
            Showing <strong>{sortedPackages.length}</strong> available tour package{sortedPackages.length !== 1 ? 's' : ''}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Sort by:</span>
            <select 
              className="form-control" 
              style={{ width: 'auto', padding: '0.5rem 1rem' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest Packages First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="duration-asc">Duration: Shortest First</option>
            </select>
          </div>
        </div>

        {/* Package Grid */}
        {loading ? (
          <LoadingSpinner message="Searching tour packages..." />
        ) : sortedPackages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#fff', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
            <h3>No tour packages matched your criteria</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>Try broadening your search term or resetting the filters.</p>
            <button onClick={handleResetFilters} className="btn btn-primary">
              Reset Search Filters
            </button>
          </div>
        ) : (
          <div className="cards-grid">
            {sortedPackages.map(pkg => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
