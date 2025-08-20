import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import Dashboard from './pages/dashboard/Dashboard';
import ReviewsPage from './pages/dashboard/ReviewsPage';
import StatisticsPage from './pages/dashboard/StatisticsPage';
import ProfilePage from './pages/dashboard/ProfilePage';
import WidgetSettingsPage from './pages/dashboard/WidgetSettingsPage';
import QRCodePage from './pages/dashboard/QRCodePage';
import ArchivePage from './pages/dashboard/ArchivePage';
import UpgradePlanPage from './pages/dashboard/UpgradePlanPage'

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected Dashboard Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="reviews" element={<ReviewsPage />} />
                <Route path="statistics" element={<StatisticsPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="widget-settings" element={<WidgetSettingsPage />} />
                <Route path="qr-code" element={<QRCodePage />} />
                <Route path="archive" element={<ArchivePage />} />
                <Route path="upgrade-plan" element={<UpgradePlanPage />} />
              </Route>
              
              {/* Redirect old routes */}
              <Route path="/reviews" element={<Navigate to="/dashboard/reviews" replace />} />
              <Route path="/statistics" element={<Navigate to="/dashboard/statistics" replace />} />
              <Route path="/profile" element={<Navigate to="/dashboard/profile" replace />} />
              <Route path="/widget-settings" element={<Navigate to="/dashboard/widget-settings" replace />} />
              <Route path="/qr-code" element={<Navigate to="/dashboard/qr-code" replace />} />
              <Route path="/archive" element={<Navigate to="/dashboard/archive" replace />} />
              <Route path="/upgrade-plan" element={<Navigate to="/dashboard/upgrade-plan" replace />} />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;