import React from 'react';
import { FiCheckCircle, FiCircle, FiClock, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './TaskCard.css';

const TaskCard = ({ task, onToggleStatus, onEdit, onDelete }) => {
  const { user, isAdmin } = useAuth();
  
  const isAssigned = task.assignedTo && task.assignedTo._id === user?._id;
  const canModify = isAdmin || isAssigned;
  
  const handleToggle = () => {
    if (!canModify) return;
    const newStatus = task.status === 'completed' ? 'pending' : (task.status === 'pending' ? 'in-progress' : 'completed');
    onToggleStatus(task._id, newStatus);
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'var(--danger)';
      case 'medium': return 'var(--warning)';
      case 'low': return 'var(--accent)';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div className={`task-card ${task.status === 'completed' ? 'completed' : ''}`}>
      <div className="task-left">
        <button 
          className={`status-toggle ${canModify ? 'clickable' : ''}`} 
          onClick={handleToggle}
          disabled={!canModify}
        >
          {task.status === 'completed' ? (
            <FiCheckCircle size={24} className="icon-completed" />
          ) : task.status === 'in-progress' ? (
            <FiClock size={24} className="icon-progress" />
          ) : (
            <FiCircle size={24} className="icon-pending" />
          )}
        </button>
      </div>
      
      <div className="task-content">
        <div className="task-header">
          <h4 className="task-title">{task.title}</h4>
          <span className="priority-badge" style={{ backgroundColor: `${getPriorityColor(task.priority)}20`, color: getPriorityColor(task.priority) }}>
            {task.priority}
          </span>
        </div>
        <p className="task-description">{task.description}</p>
        
        <div className="task-footer">
          <div className="task-assignee">
            {task.assignedTo && (
              <>
                <div className="avatar-small">{task.assignedTo.name?.charAt(0).toUpperCase()}</div>
                <span>{task.assignedTo.name}</span>
              </>
            )}
          </div>
          <div className="task-status-text">
            {task.status === 'completed' ? (
              <span className="text-success">Done ✓</span>
            ) : task.status === 'in-progress' ? (
              <span className="text-warning">In Progress</span>
            ) : (
              <span className="text-muted">Pending</span>
            )}
          </div>
        </div>
      </div>

      {isAdmin && (
        <div className="task-actions">
          <button className="action-btn edit" onClick={() => onEdit(task)}>
            <FiEdit2 size={16} />
          </button>
          <button className="action-btn delete" onClick={() => onDelete(task._id)}>
            <FiTrash2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
