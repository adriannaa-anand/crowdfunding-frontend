import { Routes, Route, Navigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useAuthStore } from './store/authStore';

import Navbar        from './components/layout/Navbar';
import Footer        from './components/layout/Footer';
import Home          from './pages/Home';
import Browse        from './pages/Browse';
import CampaignDetail from './pages/CampaignDetail';
import CreateCampaign from './pages/CreateCampaign';
import Dashboard     from './pages/Dashboard';
import Login         from './pages/Login';
import Register      from './pages/Register';
import MyDonations   from './pages/MyDonations';
import NotFound      from './pages/NotFound';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function ProtectedRoute({ children, roles }) {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Elements stripe={stripePromise}>
      <div className="min-h-screen flex flex-col bg-surface-50">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/"              element={<Home />} />
            <Route path="/browse"        element={<Browse />} />
            <Route path="/campaign/:id"  element={<CampaignDetail />} />
            <Route path="/login"         element={<Login />} />
            <Route path="/register"      element={<Register />} />

            <Route path="/create" element={
              <ProtectedRoute roles={['creator', 'admin']}>
                <CreateCampaign />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute roles={['creator', 'admin']}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/my-donations" element={
              <ProtectedRoute>
                <MyDonations />
              </ProtectedRoute>
            } />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Elements>
  );
}
