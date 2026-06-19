import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthService } from '../services/auth.js';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validations
    if (!username.trim() || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await AuthService.register(username.trim(), password);
      navigate('/', { state: { message: 'Registration successful! Welcome to Workload.' } });
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container" id="register-form-container">
      <div className="form-header">
        <h2 className="form-title">Create Account</h2>
        <p className="form-subtitle">Register to begin tracking your projects</p>
      </div>

      {error && (
        <div className="alert-banner error" id="register-error-banner">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} id="register-form">
        <div className="form-group">
          <label className="form-label" htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            className="form-input"
            placeholder="Enter username (min 3 chars)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="form-input"
            placeholder="Enter password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            className="form-input"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '1rem' }}
          disabled={loading}
          id="register-submit-btn"
        >
          {loading ? <span className="spinner spinner-sm"></span> : 'Register'}
        </button>
      </form>

      <p className="form-link">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}
