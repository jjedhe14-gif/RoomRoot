import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/ui/Toast';
import { useAppStore } from './stores/appStore';
import { SuspensionGuard } from './components/SuspensionGuard';

// Separately chunked admin console (backend viewer) - lives under /admin/*
const AdminApp = lazy(() => import('./admin/AdminApp'));

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const ExplorePage = lazy(() => import('./pages/ExplorePage'));
const PropertyPage = lazy(() => import('./pages/PropertyPage'));
const RoommatesPage = lazy(() => import('./pages/RoommatesPage'));
const MessagesPage = lazy(() => import('./pages/MessagesPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const MaidsPage = lazy(() => import('./pages/MaidsPage'));
const SavedPage = lazy(() => import('./pages/SavedPage'));
const ComparePage = lazy(() => import('./pages/ComparePage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const CalculatorPage = lazy(() => import('./pages/CalculatorPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

function PageLoader() {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <img src="/logo.svg" alt="RoomRoot" className="w-10 h-10 object-contain animate-pulse" />
        <p className="text-sm text-[var(--text-tertiary)]">Loading...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();
  const isLoggedIn = useAppStore(state => state.isLoggedIn);
  const isLoginPage = location.pathname === '/login';

  // The admin console is a completely separate surface (own layout, auth guard,
  // routing). It never renders the student-facing chrome.
  if (location.pathname.startsWith('/admin')) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)]">
        <ToastContainer />
        <Suspense fallback={<PageLoader />}>
          <AdminApp />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] transition-colors duration-300">
      {!isLoginPage && isLoggedIn && <Navbar />}
      <ToastContainer />
      {isLoggedIn && <SuspensionGuard />}
      <main>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={isLoggedIn ? <Navigate to="/" replace /> : <LoginPage />} />
            {!isLoggedIn ? <Route path="*" element={<Navigate to="/login" replace />} /> : <>
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/property/:id" element={<PropertyPage />} />
              <Route path="/roommates" element={<RoommatesPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/maids" element={<MaidsPage />} />
              <Route path="/saved" element={<SavedPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/calculator" element={<CalculatorPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="*" element={
                <div className="min-h-screen pt-20 flex items-center justify-center px-4">
                  <div className="text-center">
                    <div className="text-7xl mb-4">404</div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Page Not Found</h1>
                    <p className="text-[var(--text-secondary)]">The page you're looking for doesn't exist.</p>
                    <a href="/" className="inline-block mt-4 text-brand-600 font-semibold hover:underline">Go Home →</a>
                  </div>
                </div>
              } />
            </>}
          </Routes>
        </Suspense>
      </main>
      {isLoggedIn && <Footer />}
      {isLoggedIn && <BottomNav />}
    </div>
  );
}
