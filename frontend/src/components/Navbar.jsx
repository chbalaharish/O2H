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
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
          <path d="m9 12 2 2 4-4"></path>
        </svg>
        <span>ProjectPortal</span>
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
