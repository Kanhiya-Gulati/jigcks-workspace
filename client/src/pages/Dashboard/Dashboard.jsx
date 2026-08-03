import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProjects } from '../../services/api';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import { FiFolder, FiCheckSquare, FiCheckCircle, FiUsers, FiPlus } from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getProjects();
        setProjects(res.data.data);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return <div className="loading-state">Loading dashboard...</div>;
  }

  // Dummy stats calculations
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  // Tasks info would ideally come from backend summary API, mocking here based on projects
  const totalTasks = projects.reduce((acc, p) => acc + (p.taskCount || 0), 0);
  const completedTasks = projects.reduce((acc, p) => acc + (p.completedTaskCount || 0), 0);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2>{isAdmin ? 'Dashboard' : 'My Projects'}</h2>
          <p className="greeting">Welcome back, {user?.name}</p>
        </div>
        {isAdmin && (
          <Link to="/projects/new" className="btn-primary">
            <FiPlus /> Create Project
          </Link>
        )}
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(108, 92, 231, 0.1)', color: '#6C5CE7' }}>
            <FiFolder size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Projects</span>
            <span className="stat-value">{totalProjects}</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(0, 206, 201, 0.1)', color: '#00cec9' }}>
            <FiCheckSquare size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Tasks</span>
            <span className="stat-value">{totalTasks}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(0, 184, 148, 0.1)', color: '#00b894' }}>
            <FiCheckCircle size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Completed Tasks</span>
            <span className="stat-value">{completedTasks}</span>
          </div>
        </div>

        {isAdmin && (
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(253, 203, 110, 0.1)', color: '#fdcb6e' }}>
              <FiUsers size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Active Projects</span>
              <span className="stat-value">{activeProjects}</span>
            </div>
          </div>
        )}
      </div>

      <div className="projects-section">
        <h3 className="section-title">Recent Projects</h3>
        
        {projects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📂</div>
            <h4>No projects found</h4>
            <p>Get started by {isAdmin ? 'creating a new project' : 'waiting for an assignment'}.</p>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map(project => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
