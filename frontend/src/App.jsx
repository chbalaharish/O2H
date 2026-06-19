import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AddTask from './pages/AddTask.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import { AuthService } from './services/auth.js';

// Route helper to protect routes requiring authentication
function ProtectedRoute({ children }) {
  const isAuthenticated = AuthService.isAuthenticated();
  return isAuthenticated ? (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
    </div>
  ) : (
    <Navigate to="/login" replace />
  );
}

// Route helper for auth-only pages (login/register should redirect to home if logged in)
function PublicRoute({ children }) {
  const isAuthenticated = AuthService.isAuthenticated();
  return !isAuthenticated ? (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
    </div>
  ) : (
    <Navigate to="/" replace />
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-task"
          element={
            <ProtectedRoute>
              <AddTask />
            </ProtectedRoute>
          }
        />

        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
