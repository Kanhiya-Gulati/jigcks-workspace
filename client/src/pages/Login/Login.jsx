import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiLock, FiEye, FiEyeOff, FiAlertTriangle } from 'react-icons/fi';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const isSessionExpired = searchParams.get('reason') === 'session_expired';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="animated-bg"></div>
      <div className="login-card glass-panel">
        <div className="login-header">
          <h1 className="gradient-text">Jigcks Workspace</h1>
          <p>Freelancer Project Management</p>
        </div>

        {isSessionExpired && (
          <div className="session-warning-notice">
            <FiAlertTriangle size={20} style={{ flexShrink: 0 }} />
            <span>Security Alert: You were automatically logged out because your account was logged in from another browser or device.</span>
          </div>
        )}

        {error && <div className="error-message shake">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <FiUser className="input-icon" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoCapitalize="none"
            />
          </div>

          <div className="input-group">
            <FiLock className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <button type="submit" className="login-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
