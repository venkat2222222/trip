import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Hotel, Car, Utensils, CheckCircle2, XCircle, Calendar, Sparkles, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function PackageDetail() {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadPackage() {
      try {
        const res = await api.get(`/packages/${id}`);
        setPkg(res.data);
      } catch (err) {
        setError(err.message || 'Failed to load package details');
      } finally {
        setLoading(false);
      }
    }
    loadPackage();
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading tour package details..." />;
  if (error || !pkg) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2>Tour Package Not Found</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>{error || "The package you are looking for does not exist."}</p>
        <Link to="/packages" className="btn btn-primary">Back to Tour Packages</Link>
      </div>
    );
  }

  const handleCustomize = () => {
    navigate(`/customize-trip?destination=${encodeURIComponent(pkg.destination)}&packageName=${encodeURIComponent(pkg.name)}`);
  };

  const includedList = pkg.includedItems ? pkg.includedItems.split(';').map(s => s.trim()).filter(Boolean) : [];
  const excludedList = pkg.excludedItems ? pkg.excludedItems.split(';').map(s => s.trim()).filter(Boolean) : [];
  const itineraryDays = pkg.itinerary ? pkg.itinerary.split('\n').filter(Boolean) : [];

  return (
    <div className="section">
      <div className="container">
        <Link to="/packages" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-blue)', fontWeight: 600, marginBottom: '1.5rem' }}>
          <ArrowLeft size={16} /> Back to All Packages
        </Link>

        {/* Hero Header Card */}
        <div style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: 'var(--shadow-md)', marginBottom: '3rem', border: '1px solid var(--border-light)' }}>
          <div style={{ position: 'relative', height: '400px' }}>
            <img src={pkg.imageUrl} alt={pkg.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.85), transparent)' }} />
            
            <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                  <MapPin size={18} /> {pkg.destination}
                </div>
                <h1 style={{ fontSize: '2.5rem', color: '#fff' }}>{pkg.name}</h1>
              </div>

              <div style={{ background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(8px)', padding: '1rem 1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)', textAlign: 'right' }}>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block' }}>Starting From</span>
                <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f59e0b' }}>₹{pkg.price}</span>
                <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}> / person</span>
              </div>
            </div>
          </div>

          <div style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', background: '#f8fafc', borderTop: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>Duration</span>
                <strong style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Clock size={18} color="#0284c7" /> {pkg.durationDays} Days / {pkg.durationDays - 1} Nights
                </strong>
              </div>

              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>Package ID</span>
                <strong style={{ fontSize: '1.1rem', color: 'var(--primary-dark)' }}>PKG-00{pkg.id}</strong>
              </div>
            </div>

            <button onClick={handleCustomize} className="btn btn-amber btn-lg">
              <Sparkles size={18} /> Customize This Trip
            </button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="package-detail-grid" style={{ display: 'grid', gap: '2.5rem' }}>
          {/* Main Details */}
          <div>
            <div style={{ background: '#fff', padding: '1.75rem', borderRadius: '16px', border: '1px solid var(--border-light)', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Package Overview</h3>
              <p style={{ color: 'var(--text-dark)', fontSize: '1.05rem', lineHeight: '1.7' }}>{pkg.description}</p>
            </div>

            {/* Inclusions & Exclusions */}
            <div style={{ background: '#fff', padding: '1.75rem', borderRadius: '16px', border: '1px solid var(--border-light)', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>What's Included & Excluded</h3>
              <div className="inclusions-grid" style={{ display: 'grid', gap: '2rem' }}>
                <div>
                  <h4 style={{ color: '#047857', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={18} /> Included Items
                  </h4>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {includedList.map((item, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.92rem' }}>
                        <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 style={{ color: '#b91c1c', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <XCircle size={18} /> Excluded Items
                  </h4>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {excludedList.map((item, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
                        <span style={{ color: '#ef4444', fontWeight: 'bold' }}>✕</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>


            {/* Day by Day Itinerary */}
            <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Day-by-Day Itinerary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {itineraryDays.map((dayText, idx) => (
                  <div key={idx} style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', borderLeft: '4px solid var(--primary-blue)' }}>
                    <p style={{ fontWeight: 600, color: 'var(--primary-dark)', margin: 0 }}>{dayText}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Specs */}
          <div>
            <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-light)', position: 'sticky', top: '100px' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-light)' }}>
                Key Inclusions
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: 42, height: 42, borderRadius: '10px', background: 'rgba(2,132,199,0.1)', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Hotel size={20} />
                  </div>
                  <div>
                    <h5 style={{ fontSize: '0.95rem' }}>Accommodation</h5>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{pkg.accommodation}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: 42, height: 42, borderRadius: '10px', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Car size={20} />
                  </div>
                  <div>
                    <h5 style={{ fontSize: '0.95rem' }}>Transportation</h5>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{pkg.transportation}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: 42, height: 42, borderRadius: '10px', background: 'rgba(16,185,129,0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Utensils size={20} />
                  </div>
                  <div>
                    <h5 style={{ fontSize: '0.95rem' }}>Food & Meals</h5>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{pkg.food}</p>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-light)' }}>
                <button onClick={handleCustomize} className="btn btn-amber" style={{ width: '100%', padding: '1rem' }}>
                  Customize This Package
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
