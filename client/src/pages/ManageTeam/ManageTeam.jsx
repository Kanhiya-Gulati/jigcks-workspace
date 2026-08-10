import React, { useState, useEffect } from 'react';
import { getFreelancers, createFreelancer, resetUserPassword, deleteFreelancer } from '../../services/api';
import { FiPlus, FiTrash2, FiUser, FiKey, FiX, FiShield, FiAtSign, FiRefreshCw, FiCheckCircle } from 'react-icons/fi';
import './ManageTeam.css';

const ManageTeam = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', username: '', password: '', role: 'freelancer' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [resetUser, setResetUser] = useState(null);
  const [newTempPassword, setNewTempPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetSubmitting, setResetSubmitting] = useState(false);

  useEffect(() => { fetchTeam(); }, []);

  const fetchTeam = async () => {
    try {
      const res = await getFreelancers();
      setTeam(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.name.trim() || !formData.username.trim() || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      await createFreelancer(formData);
      setFormData({ name: '', username: '', password: '', role: 'freelancer' });
      setShowAddModal(false);
      fetchTeam();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create team member');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');
    if (!newTempPassword || newTempPassword.trim().length < 4) {
      setResetError('Temporary password must be at least 4 characters long.');
      return;
    }
    setResetSubmitting(true);
    try {
      await resetUserPassword(resetUser._id, newTempPassword);
      setResetSuccess(`Password reset for ${resetUser.name}! They will be prompted to change their password on next login.`);
      setTimeout(() => {
        setResetUser(null);
        setNewTempPassword('');
        setResetSuccess('');
        fetchTeam();
      }, 2000);
    } catch (err) {
      setResetError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setResetSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from your team?`)) {
      try {
        await deleteFreelancer(id);
        fetchTeam();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to remove member');
      }
    }
  };

  if (loading) return <div className="loading-state">Loading team members...</div>;

  return (
    <div className="manage-team">

      {/* ── Header ── */}
      <div className="team-header-card glass-panel">
        <div className="header-info">
          <h2>Manage Team &amp; Freelancers</h2>
          <p className="subtitle">Oversee your workforce, manage access and reset passwords</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          <FiPlus size={18} /> Add Freelancer
        </button>
      </div>

      {/* ── Add Member Modal ── */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <div className="icon-badge"><FiUser size={20} /></div>
                <div>
                  <h3>Add Team Member</h3>
                  <p>Member will use this username to log in for the first time</p>
                </div>
              </div>
              <button className="close-btn" onClick={() => setShowAddModal(false)}><FiX size={20} /></button>
            </div>

            {error && <div className="error-message shake">{error}</div>}

            <form onSubmit={handleAdd} className="team-add-form">
              <div className="form-group">
                <label>Full Name *</label>
                <div className="input-icon-wrapper">
                  <FiUser className="input-icon" />
                  <input type="text" placeholder="e.g. Rahul Sharma" value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>
              </div>

              <div className="form-group">
                <label>Username * (Used for Login)</label>
                <div className="input-icon-wrapper">
                  <FiAtSign className="input-icon" />
                  <input type="text" placeholder="e.g. rahul_dev" value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required autoCapitalize="none" />
                </div>
              </div>

              <div className="form-group">
                <label>Temporary Password *</label>
                <div className="input-icon-wrapper">
                  <FiKey className="input-icon" />
                  <input type="password" placeholder="Set temporary password" value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                </div>
              </div>

              <div className="form-group">
                <label>Role</label>
                <div className="role-selector">
                  <button type="button"
                    className={`role-option ${formData.role === 'freelancer' ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, role: 'freelancer' })}>
                    <FiUser size={16} /><span>Freelancer</span>
                  </button>
                  <button type="button"
                    className={`role-option ${formData.role === 'admin' ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, role: 'admin' })}>
                    <FiShield size={16} /><span>Admin</span>
                  </button>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Member Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Reset Password Modal ── */}
      {resetUser && (
        <div className="modal-overlay" onClick={() => setResetUser(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <div className="icon-badge reset-badge"><FiRefreshCw size={20} /></div>
                <div>
                  <h3>Reset Password</h3>
                  <p>Set a new temporary password for <strong>{resetUser.name}</strong> (@{resetUser.username})</p>
                </div>
              </div>
              <button className="close-btn" onClick={() => setResetUser(null)}><FiX size={20} /></button>
            </div>

            {resetError && <div className="error-message shake">{resetError}</div>}
            {resetSuccess && <div className="success-message"><FiCheckCircle /> {resetSuccess}</div>}

            <form onSubmit={handleResetPassword} className="team-add-form">
              <div className="form-group">
                <label>New Temporary Password for {resetUser.name} *</label>
                <div className="input-icon-wrapper">
                  <FiKey className="input-icon" />
                  <input type="text" placeholder="Enter new temporary password" value={newTempPassword}
                    onChange={(e) => setNewTempPassword(e.target.value)} required />
                </div>
                <small className="form-hint">
                  The member will use this password to log in. Upon login, they will be prompted to set their own password.
                </small>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setResetUser(null)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={resetSubmitting}>
                  {resetSubmitting ? 'Resetting...' : 'Recreate Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Team Grid ── */}
      <div className="team-members-grid">
        {team.length === 0 ? (
          <div className="empty-state glass-panel">
            <div className="empty-icon">👥</div>
            <h4>No members added yet</h4>
            <p>Click "Add Freelancer" to add freelancers to your workspace.</p>
          </div>
        ) : (
          team.map((member) => (
            <div key={member._id} className="member-card">
              {/* Card Body */}
              <div className="member-card-body">
                <div className="member-card-header">
                  <div className="member-avatar-lg" style={{ backgroundColor: member.avatar || '#6C5CE7' }}>
                    {member.name ? member.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className={`role-badge role-${member.role}`}>
                    {member.role === 'admin' ? <FiShield size={11} /> : <FiUser size={11} />}
                    {member.role}
                  </span>
                </div>

                <div className="member-details">
                  <h4 className="member-name">{member.name}</h4>
                  <div className="member-username">
                    <FiAtSign size={13} />
                    <span>{member.username || 'no_username'}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="member-card-footer">
                <button className="btn-action-member btn-reset-password"
                  onClick={() => { setResetUser(member); setNewTempPassword(''); setResetError(''); setResetSuccess(''); }}
                  title="Reset password">
                  <FiKey size={14} /> Reset Password
                </button>
                <button className="btn-action-member btn-delete-member"
                  onClick={() => handleDelete(member._id, member.name)}
                  title="Remove Member">
                  <FiTrash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageTeam;
