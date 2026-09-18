import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, PlusCircle, ArrowRight } from 'lucide-react';

export default function PlaceCard({ place }) {
  const navigate = useNavigate();

  const handleAddToTrip = () => {
    navigate(`/customize-trip?destination=${encodeURIComponent(place.name + ', ' + place.location)}`);
  };

  return (
    <div className="travel-card">
      <div className="card-img-wrapper">
        <img 
          src={place.imageUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'} 
          alt={place.name} 
        />
        <span className="card-badge" style={{ background: 'var(--primary-blue)' }}>{place.category}</span>
      </div>
      <div className="card-body">
        <div className="card-location">
          <MapPin size={15} /> {place.location}
        </div>
        <h3 className="card-title">{place.name}</h3>
        <p className="card-desc">{place.description}</p>
        
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div><strong>Est. Cost:</strong> ${place.estimatedCost} / person</div>
          <div><strong>Best Season:</strong> {place.bestTimeToVisit}</div>
        </div>

        <div className="card-meta">
          <button onClick={handleAddToTrip} className="btn btn-amber btn-sm" style={{ width: '100%' }}>
            <PlusCircle size={15} /> Add to My Trip
          </button>
        </div>
      </div>
    </div>
  );
}
