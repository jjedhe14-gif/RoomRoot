import { lazy, Suspense } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import { AdminLayout } from './layout/AdminLayout';
import { LoadingState } from './components/PageState';
import AccessDenied from './pages/AccessDenied';
import AdminLogin from './pages/AdminLogin';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Users = lazy(() => import('./pages/Users'));
const UserDetails = lazy(() => import('./pages/UserDetails'));
const Listings = lazy(() => import('./pages/Listings'));
const Applications = lazy(() => import('./pages/Applications'));
const OtpActivity = lazy(() => import('./pages/OtpActivity'));
const Reports = lazy(() => import('./pages/Reports'));
const Conversations = lazy(() => import('./pages/Conversations'));
const Notifications = lazy(() => import('./pages/Notifications'));
const ActivityLogs = lazy(() => import('./pages/ActivityLogs'));
const SystemOverview = lazy(() => import('./pages/SystemOverview'));
const ServiceRequests = lazy(() => import('./pages/ServiceRequests'));

function RequireAdmin() {
  const location = useLocation();
  const isLoggedIn = useAppStore(state => state.isLoggedIn);
  const authUser = useAppStore(state => state.authUser);
  const isAdmin = authUser?.role?.toUpperCase() === 'ADMIN';

  if (!isLoggedIn || !authUser) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }
  if (!isAdmin) {
    return <AccessDenied />;
  }
  return <Outlet />;
}

function RouteLoader() {
  return <LoadingState label="Loading view…" />;
}

export default function AdminApp() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<RequireAdmin />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Suspense fallback={<RouteLoader />}><Dashboard /></Suspense>} />
          <Route path="users" element={<Suspense fallback={<RouteLoader />}><Users /></Suspense>} />
          <Route path="users/:id" element={<Suspense fallback={<RouteLoader />}><UserDetails /></Suspense>} />
          <Route path="listings" element={<Suspense fallback={<RouteLoader />}><Listings /></Suspense>} />
          <Route path="applications" element={<Suspense fallback={<RouteLoader />}><Applications /></Suspense>} />
          <Route path="otp" element={<Suspense fallback={<RouteLoader />}><OtpActivity /></Suspense>} />
          <Route path="reports" element={<Suspense fallback={<RouteLoader />}><Reports /></Suspense>} />
          <Route path="conversations" element={<Suspense fallback={<RouteLoader />}><Conversations /></Suspense>} />
          <Route path="notifications" element={<Suspense fallback={<RouteLoader />}><Notifications /></Suspense>} />
          <Route path="activity" element={<Suspense fallback={<RouteLoader />}><ActivityLogs /></Suspense>} />
          <Route path="system" element={<Suspense fallback={<RouteLoader />}><SystemOverview /></Suspense>} />
          <Route path="service-requests" element={<Suspense fallback={<RouteLoader />}><ServiceRequests /></Suspense>} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}
