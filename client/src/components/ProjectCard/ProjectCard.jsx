import React from 'react';
import { Link } from 'react-router-dom';
import { FiUser } from 'react-icons/fi';
import './ProjectCard.css';

const ProjectCard = ({ project }) => {
  const { _id, title, client, status, deadline, assignedTo } = project;
  
  // Dummy calculation as we might not have tasks array inside project object
  // Assume a default progress if not provided
  const taskCount = project.taskCount || 0;
  const completedTaskCount = project.completedTaskCount || 0;
  const progress = taskCount === 0 ? 0 : Math.round((completedTaskCount / taskCount) * 100);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'var(--success)';
      case 'completed': return 'var(--accent)';
      case 'on-hold': return 'var(--warning)';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <Link to={`/projects/${_id}`} className="project-card">
      <div className="project-card-header">
        <h3 className="project-title">{title}</h3>
        <span className="project-status" style={{ backgroundColor: `${getStatusColor(status)}20`, color: getStatusColor(status) }}>
          {status}
        </span>
      </div>
      
      <div className="project-client">
        <FiUser className="client-icon" />
        <span>{client}</span>
      </div>

      <div className="project-deadline">
        {project.assignDate && (
          <span style={{ marginRight: '12px' }}>Start: <strong>{new Date(project.assignDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</strong></span>
        )}
        {deadline && (
          <span>Deadline: <strong>{new Date(deadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</strong></span>
        )}
      </div>

      <div className="project-progress">
        <div className="progress-info">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="project-footer">
        <div className="assigned-avatars">
          {assignedTo && assignedTo.map((user, index) => (
            <div key={user._id || index} className="avatar" title={user.name}>
              {user.name ? user.name.charAt(0).toUpperCase() : '?'}
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
