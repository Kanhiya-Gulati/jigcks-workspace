import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content glass-panel">
        <h1 className="error-code gradient-text">404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for doesn't exist or has been moved.</p>
        <Link to="/dashboard" className="btn-primary">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
