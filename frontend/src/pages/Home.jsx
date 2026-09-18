import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Compass, MapPin, Calendar, Award, ShieldCheck, HeartHandshake, Car, Hotel, Headset, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import PackageCard from '../components/PackageCard';
import PlaceCard from '../components/PlaceCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Home() {
  const [featuredPackages, setFeaturedPackages] = useState([]);
  const [popularPlaces, setPopularPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const [pkgRes, placeRes] = await Promise.all([
          api.get('/packages/featured'),
          api.get('/places/popular')
        ]);
        setFeaturedPackages(pkgRes.data || []);
        setPopularPlaces(placeRes.data || []);
      } catch (err) {
        console.error("Failed to load home page data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/packages?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <Compass size={18} /> Premier Travel & Tourism Agency
            </div>
            <h1 className="hero-title">
              Plan Your <span>Perfect Journey</span> With Expert Guidance
            </h1>
            <p className="hero-subtitle">
              Explore handpicked luxury tour packages, discover breathtaking destinations across the world, and create personalized itineraries tailored to your unique preferences.
            </p>

            {/* Quick Search Form */}
            <form onSubmit={handleSearchSubmit} style={{
              background: 'rgba(255, 255, 255, 0.95)',
              padding: '0.6rem',
              borderRadius: '16px',
              display: 'flex',
              gap: '0.5rem',
              maxWidth: '620px',
              boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
              marginBottom: '2rem'
            }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '1rem' }}>
                <Search size={20} color="#0284c7" />
                <input 
                  type="text" 
                  placeholder="Where do you want to go? (e.g., Swiss Alps, Bali, Tokyo)" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ border: 'none', background: 'transparent', width: '100%', color: '#0f172a', fontWeight: 500, outline: 'none' }}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem 1.5rem', borderRadius: '12px' }}>
                Search
              </button>
            </form>

            <div className="hero-actions">
              <Link to="/packages" className="btn btn-primary btn-lg">
                Explore Tour Packages
              </Link>
              <Link to="/customize-trip" className="btn btn-amber btn-lg">
                Customize Your Trip
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Packages Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Popular Tours</span>
            <h2 className="section-title">Featured Tour Packages</h2>
            <p className="section-desc">Handcrafted itineraries designed for unforgettable memories and hassle-free travel.</p>
          </div>

          {loading ? (
            <LoadingSpinner message="Fetching featured packages..." />
          ) : (
            <div className="cards-grid">
              {featuredPackages.slice(0, 3).map(pkg => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          )}

          <div className="text-center mt-4">
            <Link to="/packages" className="btn btn-outline btn-lg">
              View All Tour Packages <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Places Section */}
      <section className="section" style={{ background: '#f1f5f9' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Destinations</span>
            <h2 className="section-title">Popular Destinations To Explore</h2>
            <p className="section-desc">From tropical beaches to soaring mountain peaks, discover world-renowned travel spots.</p>
          </div>

          {loading ? (
            <LoadingSpinner message="Fetching popular places..." />
          ) : (
            <div className="cards-grid">
              {popularPlaces.slice(0, 3).map(place => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          )}

          <div className="text-center mt-4">
            <Link to="/places" className="btn btn-outline btn-lg">
              Explore All Places <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Tourister Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Why Tourister</span>
            <h2 className="section-title">Why Choose Tourister Trip Planner</h2>
            <p className="section-desc">We combine global travel expertise with personalized customer service to deliver seamless trips.</p>
          </div>

          <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            <div className="travel-card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(2, 132, 199, 0.1)', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
                <Compass size={32} />
              </div>
              <h3 style={{ marginBottom: '0.75rem' }}>Customized Trips</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                Tailor your dates, accommodation preferences, transportation, and activities to fit your unique schedule and budget.
              </p>
            </div>

            <div className="travel-card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
                <Award size={32} />
              </div>
              <h3 style={{ marginBottom: '0.75rem' }}>Affordable Packages</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                Transparent pricing with no hidden costs. Get maximum value for your travel investment with zero compromise on quality.
              </p>
            </div>

            <div className="travel-card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
                <Hotel size={32} />
              </div>
              <h3 style={{ marginBottom: '0.75rem' }}>Comfortable Stay</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                Handpicked 4-star and 5-star hotels, boutique resorts, and heritage stays offering world-class comfort and hospitality.
              </p>
            </div>

            <div className="travel-card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(249, 115, 22, 0.1)', color: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
                <Car size={32} />
              </div>
              <h3 style={{ marginBottom: '0.75rem' }}>Reliable Transport</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                Enjoy smooth transfers via private chauffeurs, express rail passes, and luxury AC coaches throughout your trip.
              </p>
            </div>

            <div className="travel-card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
                <HeartHandshake size={32} />
              </div>
              <h3 style={{ marginBottom: '0.75rem' }}>Local Experiences</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                Immerse yourself in authentic culture, local culinary delights, guided historic walks, and hidden gem attractions.
              </p>
            </div>

            <div className="travel-card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
                <Headset size={32} />
              </div>
              <h3 style={{ marginBottom: '0.75rem' }}>24/7 Dedicated Support</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                Our experienced travel concierge team is available around the clock to assist you at every step of your journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="section" style={{
        background: 'linear-gradient(135deg, #0f172a, #1e3a8a)',
        color: '#ffffff',
        textAlign: 'center',
        padding: '5rem 1rem'
      }}>
        <div className="container">
          <h2 style={{ fontSize: '2.8rem', marginBottom: '1rem', color: '#fff' }}>Ready To Plan Your Next Adventure?</h2>
          <p style={{ fontSize: '1.2rem', color: '#94a3b8', maxWidth: '650px', margin: '0 auto 2.5rem auto' }}>
            Tell us where you want to travel, and our destination specialists will craft a customized itinerary just for you.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <Link to="/customize-trip" className="btn btn-amber btn-lg">
              Plan My Customized Trip
            </Link>
            <Link to="/packages" className="btn btn-outline btn-lg" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>
              Explore Packages
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
