import React, { useState } from 'react';
import { changePassword } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FiLock, FiKey, FiCheckCircle } from 'react-icons/fi';
import './ChangePasswordModal.css';

const ChangePasswordModal = () => {
  const { user, updateUser } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Admin is never forced to change password, only freelancers on first login
  if (!user || user.role === 'admin' || !user.isFirstLogin) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const res = await changePassword(oldPassword, newPassword);
      setSuccess('Password updated successfully! Welcome to Jigcks Workspace.');
      setTimeout(() => {
        updateUser(res.data.data);
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password. Please check your old password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="password-modal-overlay">
      <div className="password-modal-card glass-panel">
        <div className="password-modal-header">
          <div className="lock-icon-circle">
            <FiLock size={28} />
          </div>
          <h2>Set Your New Password</h2>
          <p>Please update your temporary password to secure your account before proceeding.</p>
        </div>

        {error && <div className="error-message shake">{error}</div>}
        {success && <div className="success-message"><FiCheckCircle /> {success}</div>}

        <form onSubmit={handleSubmit} className="password-modal-form">
          <div className="form-group">
            <label>Current / Old Password *</label>
            <div className="input-with-icon">
              <FiKey className="input-icon" />
              <input
                type="password"
                placeholder="Enter old password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>New Password *</label>
            <div className="input-with-icon">
              <FiLock className="input-icon" />
              <input
                type="password"
                placeholder="Enter new password (min 6 chars)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Confirm New Password *</label>
            <div className="input-with-icon">
              <FiLock className="input-icon" />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
            {loading ? 'Updating Password...' : 'Save New Password & Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
