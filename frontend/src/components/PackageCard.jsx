import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, ArrowRight } from 'lucide-react';

export default function PackageCard({ pkg }) {
  return (
    <div className="travel-card">
      <div className="card-img-wrapper">
        <img 
          src={pkg.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'} 
          alt={pkg.name} 
        />
        <span className="card-badge">{pkg.durationDays} Days / {pkg.durationDays - 1} Nights</span>
        <div className="card-price-tag">${pkg.price}</div>
      </div>
      <div className="card-body">
        <div className="card-location">
          <MapPin size={15} /> {pkg.destination}
        </div>
        <h3 className="card-title">{pkg.name}</h3>
        <p className="card-desc">{pkg.description}</p>
        
        <div className="card-meta">
          <span><Clock size={14} inline style={{ marginRight: 4 }} /> Best Value</span>
          <Link to={`/packages/${pkg.id}`} className="btn btn-primary btn-sm">
            View Details <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
