import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import UserDashboardLayout from './layouts/UserDashboardLayout';
import AdminDashboardLayout from './layouts/AdminDashboardLayout';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import Home from './pages/Home';
import TourPackages from './pages/TourPackages';
import PackageDetail from './pages/PackageDetail';
import ExplorePlaces from './pages/ExplorePlaces';
import CustomizeTrip from './pages/CustomizeTrip';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminTrips from './pages/AdminTrips';
import AdminTours from './pages/AdminTours';
import AdminPlaces from './pages/AdminPlaces';
import AdminContacts from './pages/AdminContacts';
import AdminAddAdmin from './pages/AdminAddAdmin';
import AdminSiteContent from './pages/AdminSiteContent';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Website Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="packages" element={<TourPackages />} />
            <Route path="packages/:id" element={<PackageDetail />} />
            <Route path="places" element={<ExplorePlaces />} />
            <Route path="customize-trip" element={<CustomizeTrip />} />
            <Route path="about" element={<AboutUs />} />
            <Route path="contact" element={<ContactUs />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          {/* Admin Login Route */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected User Dashboard Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <UserDashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<UserDashboard />} />
          </Route>

          {/* Protected Admin Dashboard Routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboardLayout />
            </AdminRoute>
          }>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="tours" element={<AdminTours />} />
            <Route path="places" element={<AdminPlaces />} />
            <Route path="trips" element={<AdminTrips />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="contacts" element={<AdminContacts />} />
            <Route path="settings" element={<AdminSiteContent />} />
            <Route path="add-admin" element={<AdminAddAdmin />} />
          </Route>

          {/* Fallback 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
