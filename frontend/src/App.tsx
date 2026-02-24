import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { ProfessionalSearch } from './pages/ProfessionalSearch';
import { AdminDashboard } from './pages/AdminDashboard';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) return <Navigate to="/" replace />;
  return <>{children}</>;
};



function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<ProfessionalSearch />} />

        {/* Rutas Protegidas que requieren Paywall (Auth) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

const App = () => {
  return (
    <div className="bg-background min-h-screen w-full text-white font-sans">
      {/* Header Base (Opcional, puede ir aquí) */}
      <header className="absolute top-0 w-full z-50 p-6 flex justify-between items-center">
        <div className="text-2xl font-black tracking-tighter cursor-pointer text-white">
          Trust<span className="text-primary">Market</span>
        </div>
      </header>

      <AppRoutes />
    </div>
  );
};

export default App;
