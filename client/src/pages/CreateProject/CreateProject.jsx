import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiFolder, FiFileText, FiBriefcase, FiCalendar, FiUsers, FiCheck, FiAtSign } from 'react-icons/fi';
import { createProject, getFreelancers } from '../../services/api';
import './CreateProject.css';

const CreateProject = () => {
  const navigate = useNavigate();
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    client: '',
    assignDate: '',
    deadline: '',
    assignedTo: []
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getFreelancers();
        setFreelancers(res.data.data.filter(u => u.role === 'freelancer'));
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  const handleMemberToggle = (id) => {
    setFormData(prev => {
      const assignedTo = prev.assignedTo.includes(id)
        ? prev.assignedTo.filter(uid => uid !== id)
        : [...prev.assignedTo, id];
      return { ...prev, assignedTo };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.title.trim()) {
      setError('Please enter a project title.');
      return;
    }
    setLoading(true);
    try {
      await createProject(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
      setLoading(false);
    }
  };

  return (
    <div className="create-project-page">

      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate('/dashboard')}>
        <FiArrowLeft /> Back to Dashboard
      </button>

      {/* Form Card */}
      <div className="form-card">

        {/* Header */}
        <div className="form-header">
          <div className="form-header-left">
            <div className="header-icon-badge">
              <FiFolder size={22} />
            </div>
            <div>
              <h2>New Project</h2>
              <p className="subtitle">Set up your client project and assign freelancers</p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && <div className="error-banner">{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="project-form">

          {/* Title */}
          <div className="form-group">
            <label>Project Title *</label>
            <div className="input-with-icon">
              <FiFolder className="field-icon" />
              <input
                required
                placeholder="e.g. Madhuri Ventures Storefront"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
          </div>

          {/* Client */}
          <div className="form-group">
            <label>Client / Brand Name *</label>
            <div className="input-with-icon">
              <FiBriefcase className="field-icon" />
              <input
                required
                placeholder="e.g. Madhuri Ventures"
                value={formData.client}
                onChange={e => setFormData({ ...formData, client: e.target.value })}
              />
            </div>
          </div>

          {/* Dates Row */}
          <div className="form-row">
            <div className="form-group">
              <label>Start Date *</label>
              <div className="input-with-icon">
                <FiCalendar className="field-icon" />
                <input
                  required
                  type="date"
                  value={formData.assignDate}
                  onChange={e => setFormData({ ...formData, assignDate: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Target Deadline *</label>
              <div className="input-with-icon">
                <FiCalendar className="field-icon" />
                <input
                  required
                  type="date"
                  value={formData.deadline}
                  onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Project Description</label>
            <div className="input-with-icon" style={{ alignItems: 'flex-start' }}>
              <FiFileText className="field-icon" style={{ top: '14px', position: 'absolute' }} />
              <textarea
                rows="4"
                placeholder="Describe project requirements, scope, or key objectives..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          {/* Assign Freelancers */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label style={{ marginBottom: 0 }}>
                <span className="section-label">
                  <span /> Assign Freelancers
                  {formData.assignedTo.length > 0 && (
                    <span style={{
                      marginLeft: '6px',
                      background: 'rgba(180,171,255,0.15)',
                      color: '#b4abff',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '1px 8px',
                      borderRadius: '99px',
                    }}>
                      {formData.assignedTo.length} selected
                    </span>
                  )}
                </span>
              </label>
              {freelancers.length > 0 && (
                <button
                  type="button"
                  className="btn-select-all"
                  onClick={() => {
                    if (formData.assignedTo.length === freelancers.length) {
                      setFormData({ ...formData, assignedTo: [] });
                    } else {
                      setFormData({ ...formData, assignedTo: freelancers.map(f => f._id) });
                    }
                  }}
                >
                  {formData.assignedTo.length === freelancers.length ? 'Deselect All' : 'Select All'}
                </button>
              )}
            </div>

            {freelancers.length === 0 ? (
              <div className="no-freelancers">
                No freelancers found. Add team members in the Team section first.
              </div>
            ) : (
              <div className="freelancer-cards-grid">
                {freelancers.map(user => {
                  const isSelected = formData.assignedTo.includes(user._id);
                  return (
                    <div
                      key={user._id}
                      className={`freelancer-select-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleMemberToggle(user._id)}
                    >
                      <div className="member-avatar" style={{ backgroundColor: user.avatar || '#6C5CE7' }}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="member-info">
                        <span className="member-name">{user.name}</span>
                        <span className="member-role-tag">
                          <FiAtSign size={10} /> {user.username}
                        </span>
                      </div>
                      <div className={`check-badge ${isSelected ? 'active' : ''}`}>
                        {isSelected && <FiCheck size={12} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </form>

        {/* Footer Actions */}
        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate('/dashboard')}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading} onClick={handleSubmit}>
            {loading ? 'Creating...' : <><FiCheck size={15} /> Create Project</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
