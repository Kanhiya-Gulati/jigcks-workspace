import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProjects } from '../../services/api';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import { FiFolder, FiCheckSquare, FiCheckCircle, FiPlay, FiPlus, FiArrowRight, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';
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
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <span>Loading dashboard...</span>
      </div>
    );
  }

  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const totalTasks = projects.reduce((acc, p) => acc + (p.taskCount || 0), 0);
  const completedTasks = projects.reduce((acc, p) => acc + (p.completedTaskCount || 0), 0);

  const stats = [
    {
      label: 'Total Projects',
      value: totalProjects,
      icon: <FiFolder size={22} />,
      color: 'cyan',
      trend: '+12% from last month',
      trendColor: 'cyan',
      trendIcon: <FiTrendingUp size={14} />,
    },
    {
      label: 'Total Micro-Tasks',
      value: totalTasks,
      icon: <FiCheckSquare size={22} />,
      color: 'purple',
      trend: '+5% this week',
      trendColor: 'purple',
      trendIcon: <FiTrendingUp size={14} />,
    },
    {
      label: 'Completed Tasks',
      value: completedTasks,
      icon: <FiCheckCircle size={22} />,
      color: 'cyan',
      trend: 'Last completion 2h ago',
      trendColor: 'muted',
      trendIcon: null,
    },
    ...(isAdmin ? [{
      label: 'Active Projects',
      value: activeProjects,
      icon: <FiPlay size={22} />,
      color: 'purple',
      trend: '2 nearing deadline',
      trendColor: 'danger',
      trendIcon: <FiAlertCircle size={14} />,
    }] : []),
  ];

  return (
    <div className="dashboard">

      {/* Header */}
      <header className="dashboard-header">
        <div className="header-text">
          <h1 className="dashboard-title">{isAdmin ? 'Dashboard' : 'My Projects'}</h1>
          <p className="dashboard-greeting">Welcome back, {user?.name}</p>
        </div>
        {isAdmin && (
          <Link to="/projects/new" className="btn-create">
            <FiPlus size={20} />
            Create Project
          </Link>
        )}
      </header>

      {/* Stats Grid */}
      <section className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className={`stat-card stat-card--${stat.color}`}>
            <div className="stat-card-glow"></div>
            <div className="stat-card-top">
              <div className="stat-text">
                <span className="stat-label">{stat.label}</span>
                <span className="stat-value">{stat.value}</span>
              </div>
              <div className={`stat-icon-wrap stat-icon--${stat.color}`}>
                {stat.icon}
              </div>
            </div>
            <div className={`stat-trend stat-trend--${stat.trendColor}`}>
              {stat.trendIcon}
              <span>{stat.trend}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Recent Projects */}
      <section className="projects-section">
        <div className="section-header">
          <h2 className="section-title">Recent Projects</h2>
          {isAdmin && (
            <Link to="/projects/new" className="view-all-btn">
              View All <FiArrowRight size={16} />
            </Link>
          )}
        </div>

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
      </section>
    </div>
  );
};

export default Dashboard;
