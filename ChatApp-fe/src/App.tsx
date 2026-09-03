import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import ChatPage from "./pages/Chat/ChatPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import { useAuth } from "./context/AuthContext";

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <svg className="w-16 h-16 text-blue-500 animate-pulse" viewBox="0 0 88 88" fill="currentColor">
            <path d="M44 0C19.7 0 0 17.9 0 40c0 12.3 6 23.3 15.5 30.8V88l16.2-8.9C36.1 80.3 40 81 44 81c24.3 0 44-17.9 44-40S68.3 0 44 0zm4 54.4L36.2 42 14.8 54.4l23.4-24.8 11.8 12.4L71.2 29.6 48 54.4z"/>
          </svg>
          <p className="mt-3 text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Public route - redirect to chat if already authenticated
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <svg className="w-16 h-16 text-blue-500 animate-pulse" viewBox="0 0 88 88" fill="currentColor">
            <path d="M44 0C19.7 0 0 17.9 0 40c0 12.3 6 23.3 15.5 30.8V88l16.2-8.9C36.1 80.3 40 81 44 81c24.3 0 44-17.9 44-40S68.3 0 44 0zm4 54.4L36.2 42 14.8 54.4l23.4-24.8 11.8 12.4L71.2 29.6 48 54.4z"/>
          </svg>
          <p className="mt-3 text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/chat" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<PublicRoute><SignIn /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><SignUp /></PublicRoute>} />

        {/* Protected Routes */}
        <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/chat" replace />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
