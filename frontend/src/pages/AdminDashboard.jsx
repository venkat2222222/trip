import React, { useState, useEffect } from 'react';
import { Users, MapPin, Clock, CheckCircle2, Shield, Mail } from 'lucide-react';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load admin stats", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) return <LoadingSpinner message="Loading Admin Overview Statistics..." />;

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Admin Dashboard Overview</h2>
        <p style={{ color: 'var(--text-muted)' }}>Real-time statistics and summary of Tourister business performance.</p>
      </div>

      {/* Stat Cards Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, #0284c7, #1e3a8a)' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="stat-val">{stats?.totalUsers || 0}</div>
            <div className="stat-lbl">Total Registered Users</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            <MapPin size={24} />
          </div>
          <div>
            <div className="stat-val">{stats?.totalTripRequests || 0}</div>
            <div className="stat-lbl">Total Trip Requests</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, #f97316, #c2410c)' }}>
            <Clock size={24} />
          </div>
          <div>
            <div className="stat-val">{stats?.pendingRequests || 0}</div>
            <div className="stat-lbl">Pending Review</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, #10b981, #047857)' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="stat-val">{stats?.confirmedRequests || 0}</div>
            <div className="stat-lbl">Confirmed Trips</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}>
            <Shield size={24} />
          </div>
          <div>
            <div className="stat-val">{stats?.totalAdmins || 0}</div>
            <div className="stat-lbl">Active Administrators</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, #ec4899, #be185d)' }}>
            <Mail size={24} />
          </div>
          <div>
            <div className="stat-val">{stats?.totalContactMessages || 0}</div>
            <div className="stat-lbl">Contact Messages</div>
          </div>
        </div>
      </div>
    </div>
  );
}
