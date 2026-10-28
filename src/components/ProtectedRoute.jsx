import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ role, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-brand-600" /></div>;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (role && user.role !== role) return <Navigate to="/dashboard" replace />;
  return children;
}
