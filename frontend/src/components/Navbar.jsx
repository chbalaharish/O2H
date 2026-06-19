import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthService } from '../services/auth.js';
import ThemeToggle from './ThemeToggle.jsx';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = AuthService.getCurrentUser();
  const isAuthenticated = AuthService.isAuthenticated();

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Left green side */}
          <path d="M50 10C27.9 10 10 27.9 10 50C10 65.5 18.8 79 31.7 85.7L85.7 31.7C79 18.8 65.5 10 50 10Z" fill="#00b074" />
          {/* Right orange/yellow side */}
          <path d="M50 90C72.1 90 90 72.1 90 50C90 34.5 81.2 21 68.3 14.3L14.3 68.3C21 81.2 34.5 90 50 90Z" fill="#ff9f43" />
        </svg>
        <span style={{ fontWeight: '700', fontSize: '1.5rem', letterSpacing: '-0.5px' }}>Workload</span>
      </Link>

      <div className="navbar-actions">
        {isAuthenticated && (
          <div className="nav-links">
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              id="nav-dashboard-link"
            >
              Dashboard
            </Link>
            <Link
              to="/add-task"
              className={`nav-link ${location.pathname === '/add-task' ? 'active' : ''}`}
              id="nav-add-task-link"
            >
              Add Task
            </Link>
          </div>
        )}

        <div className="user-profile">
          <ThemeToggle />
          
          {isAuthenticated && (
            <>
              <span className="username-tag" id="user-display-name">
                {user?.username}
              </span>
              <button
                onClick={handleLogout}
                className="btn btn-outline btn-icon"
                title="Logout"
                aria-label="Logout"
                id="logout-btn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
