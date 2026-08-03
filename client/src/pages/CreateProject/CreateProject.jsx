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
        ? prev.assignedTo.filter(userId => userId !== id)
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
      <button className="back-btn" onClick={() => navigate('/dashboard')}>
        <FiArrowLeft /> Back to Dashboard
      </button>

      <div className="form-card glass-panel">
        <div className="form-header">
          <div className="header-icon-badge">
            <FiFolder size={26} />
          </div>
          <div>
            <h2>Create New Project</h2>
            <p className="subtitle">Set up your client project and assign freelancers to collaborate</p>
          </div>
        </div>

        {error && <div className="error-message shake">{error}</div>}

        <form onSubmit={handleSubmit} className="project-form">
          <div className="form-group">
            <label>Project Title *</label>
            <div className="input-with-icon">
              <FiFolder className="input-icon" />
              <input 
                required 
                placeholder="e.g. Madhuri Ventures Storefront"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Client / Brand Name *</label>
            <div className="input-with-icon">
              <FiBriefcase className="input-icon" />
              <input 
                required 
                placeholder="e.g. Madhuri Ventures"
                value={formData.client}
                onChange={e => setFormData({ ...formData, client: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Assign Date (Start Date) *</label>
              <div className="input-with-icon">
                <FiCalendar className="input-icon" />
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
                <FiCalendar className="input-icon" />
                <input 
                  required 
                  type="date"
                  value={formData.deadline}
                  onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Project Description</label>
            <div className="input-with-icon textarea-icon-wrapper">
              <FiFileText className="input-icon textarea-icon" />
              <textarea 
                rows="4" 
                placeholder="Describe project requirements, scope, or key objectives..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
            </div>
          </div>

          <div className="form-group">
            <div className="section-label-row">
              <label><FiUsers size={16} /> Assign Freelancers ({formData.assignedTo.length} Selected)</label>
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
              <div className="no-freelancers-notice">
                <span>No freelancers found. Add team members in the Team section first.</span>
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
                      <div className="card-left">
                        <div 
                          className="member-avatar"
                          style={{ backgroundColor: user.avatar || '#6C5CE7' }}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="member-info">
                          <span className="member-name">{user.name}</span>
                          <span className="member-username"><FiAtSign size={12} />{user.username}</span>
                        </div>
                      </div>

                      <div className={`check-badge ${isSelected ? 'active' : ''}`}>
                        {isSelected && <FiCheck size={14} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate('/dashboard')}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating Project...' : <>Create Project <FiCheck size={16} /></>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
