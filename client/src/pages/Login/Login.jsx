import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiLock, FiEye, FiEyeOff, FiAlertTriangle, FiArrowRight, FiShield } from 'react-icons/fi';
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
      {/* Ambient Glow Orbs */}
      <div className="ambient-glow-purple"></div>
      <div className="ambient-glow-cyan"></div>

      {/* Grid pattern background */}
      <svg className="grid-pattern" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gridPattern)" />
      </svg>

      {/* Center Glass Panel */}
      <div className="login-card">
        {/* Inner top edge highlight */}
        <div className="card-edge-highlight"></div>

        {/* Header */}
        <div className="login-header">
          <div className="logo-icon">
            <span style={{ fontSize: '28px' }}>⚡</span>
          </div>
          <h1 className="gradient-text">Jigcks Workspace</h1>
          <p className="login-subtitle">FREELANCER PROJECT MANAGEMENT</p>
        </div>

        {/* Session expired warning */}
        {isSessionExpired && (
          <div className="session-warning-notice">
            <FiAlertTriangle size={18} style={{ flexShrink: 0 }} />
            <span>Security Alert: You were automatically logged out because your account was logged in from another device.</span>
          </div>
        )}

        {/* Error message */}
        {error && <div className="error-message shake">{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* Username Input */}
          <div className="input-group">
            <label className="input-label" htmlFor="username">Username</label>
            <div className="input-wrapper">
              <FiUser className="input-icon" />
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoCapitalize="none"
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="input-group">
            <label className="input-label" htmlFor="password">Password</label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="login-btn" disabled={isSubmitting}>
            <span className="btn-content">
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Authenticating...
                </>
              ) : (
                <>
                  Enter Workspace
                  <FiArrowRight className="btn-arrow" />
                </>
              )}
            </span>
            <div className="btn-shimmer"></div>
          </button>
        </form>

        {/* Footer */}
        <div className="login-footer">
          <FiShield size={13} className="footer-shield" />
          <span>Protected by Single-Device Session Security</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
