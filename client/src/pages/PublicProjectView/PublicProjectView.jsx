import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { FiCheckSquare, FiCalendar, FiMessageSquare, FiX, FiShield, FiClock } from 'react-icons/fi';
import { getPublicProject, getPublicProjectTasks, getTaskComments } from '../../services/api';
import './PublicProjectView.css';

const PublicProjectView = () => {
  const { id } = useParams();
  
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterAssignee, setFilterAssignee] = useState('All');

  // Tab State
  const [activeTab, setActiveTab] = useState('checklist'); // 'checklist' | 'timeline'

  // Task Discussion Modal State (Read Only)
  const [commentTask, setCommentTask] = useState(null);
  const [taskComments, setTaskComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projectRes, tasksRes] = await Promise.all([
          getPublicProject(id),
          getPublicProjectTasks(id)
        ]);
        setProject(projectRes.data.data);
        setTasks(tasksRes.data.data);
      } catch (err) {
        setError('Failed to load project details or invalid link.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const openTaskCommentModal = async (task) => {
    setCommentTask(task);
    try {
      setLoadingComments(true);
      const res = await getTaskComments(task._id);
      setTaskComments(res.data.data);
    } catch (err) {
      console.error('Failed to load comments', err);
    } finally {
      setLoadingComments(false);
    }
  };

  // Stats calculation
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const templateReadyTasks = tasks.filter(t => t.status === 'template-ready' || t.status === 'in-progress').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending' || !t.status).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Filter tasks
  const filteredTasks = useMemo(() => {
    if (filterAssignee === 'All') return tasks;
    if (filterAssignee === 'Unassigned') return tasks.filter(t => !t.assignedTo);
    return tasks.filter(t => t.assignedTo?._id === filterAssignee);
  }, [tasks, filterAssignee]);

  // Group tasks by section and phase
  const tasksBySectionAndPhase = useMemo(() => {
    const sections = {};
    filteredTasks.forEach(task => {
      const sec = task.section || '🎨 FRONTEND ARCHITECTURE';
      const ph = task.phase || 'General Phase';
      if (!sections[sec]) sections[sec] = {};
      if (!sections[sec][ph]) sections[sec][ph] = [];
      sections[sec][ph].push(task);
    });

    // Natural numerical sorting for task numbers (1.1, 1.2 ... 1.10)
    Object.keys(sections).forEach(sec => {
      Object.keys(sections[sec]).forEach(ph => {
        sections[sec][ph].sort((a, b) => 
          (a.taskNumber || '').localeCompare(b.taskNumber || '', undefined, { numeric: true, sensitivity: 'base' })
        );
      });
    });

    return sections;
  }, [filteredTasks]);

  // Phase progress summary for Timeline view
  const phaseTimelineData = useMemo(() => {
    const map = {};
    tasks.forEach(t => {
      const ph = t.phase || 'General Phase';
      if (!map[ph]) {
        map[ph] = { total: 0, completed: 0, templateReady: 0, assignees: new Set() };
      }
      map[ph].total += 1;
      if (t.status === 'completed') map[ph].completed += 1;
      else if (t.status === 'template-ready' || t.status === 'in-progress') map[ph].templateReady += 1;
      if (t.assignedTo?.name) map[ph].assignees.add(t.assignedTo.name);
    });

    return Object.keys(map).map((ph, index) => {
      const data = map[ph];
      const percent = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
      return {
        phase: ph,
        total: data.total,
        completed: data.completed,
        percent,
        assignees: Array.from(data.assignees),
        step: index + 1
      };
    });
  }, [tasks]);

  if (loading) return <div className="loading-screen">Loading live client project preview...</div>;
  if (error) return <div className="error-screen">{error}</div>;
  if (!project) return null;

  return (
    <div className="public-project-page">
      {/* Top Banner Notice */}
      <div className="client-preview-banner">
        <FiShield size={16} />
        <span>CLIENT LIVE PREVIEW MODE — Real-Time Project Progress (Read-Only)</span>
      </div>

      {/* Project Header Card */}
      <div className="detail-header glass-panel">
        <div className="header-top">
          <div>
            <span className="brand-badge">♦ {project.client || 'CLIENT PROJECT'}</span>
            <h1 className="project-title">{project.title}</h1>
          </div>
          <div className="header-actions">
            <span className={`status-badge status-${project.status || 'active'}`}>
              {project.status || 'Active'}
            </span>
          </div>
        </div>
        <p className="project-desc">{project.description}</p>
        <div className="meta-row">
          {project.assignDate && (
            <div className="meta-item">
              <span className="meta-label">Start Date:</span> {new Date(project.assignDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          )}
          {project.deadline && (
            <div className="meta-item">
              <span className="meta-label">Deadline:</span> {new Date(project.deadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          )}
        </div>
      </div>

      {/* Overall Progress Progress Card */}
      <div className="progress-card glass-panel">
        <div className="progress-header">
          <span className="progress-title">Overall Project Progress</span>
          <span className="progress-text">{progressPercent}% Complete ({completedTasks} / {totalTasks} Micro-Tasks Done)</span>
        </div>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-box stat-purple">
            <div className="stat-num">{totalTasks}</div>
            <div className="stat-label">TOTAL MICRO-TASKS</div>
          </div>
          <div className="stat-box stat-green">
            <div className="stat-num">{completedTasks}</div>
            <div className="stat-label">COMPLETED TASKS</div>
          </div>
          <div className="stat-box stat-yellow">
            <div className="stat-num">{templateReadyTasks}</div>
            <div className="stat-label">TEMPLATE READY</div>
          </div>
          <div className="stat-box stat-blue">
            <div className="stat-num">{pendingTasks}</div>
            <div className="stat-label">PENDING / UNASSIGNED</div>
          </div>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="view-switcher-tabs">
        <button 
          className={`tab-btn ${activeTab === 'checklist' ? 'active' : ''}`}
          onClick={() => setActiveTab('checklist')}
        >
          <FiCheckSquare size={16} /> Master Task Checklist ({tasks.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
          onClick={() => setActiveTab('timeline')}
        >
          <FiCalendar size={16} /> Phase Schedule Timeline
        </button>
      </div>

      {activeTab === 'checklist' && (
        <>
          {/* Filter Bar */}
          <div className="list-controls">
            <div className="filter-bar">
              <button 
                className={`filter-btn ${filterAssignee === 'All' ? 'active' : ''}`}
                onClick={() => setFilterAssignee('All')}
              >
                Show All ({tasks.length})
              </button>
              <button 
                className={`filter-btn ${filterAssignee === 'Unassigned' ? 'active' : ''}`}
                onClick={() => setFilterAssignee('Unassigned')}
              >
                Unassigned ({tasks.filter(t => !t.assignedTo).length})
              </button>
            </div>
          </div>

          {/* Master Task Checklist Table */}
          <div className="checklist-table-card glass-panel">
            <div className="table-responsive">
              <table id="checklistTable">
                <thead>
                  <tr>
                    <th className="col-num">Task #</th>
                    <th className="col-phase">Section & Phase</th>
                    <th className="col-title">Task / Feature Name</th>
                    <th className="col-file">Component / File / Route</th>
                    <th className="col-status">Status</th>
                    <th className="col-assignee">Assigned To</th>
                    <th className="col-actions">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(tasksBySectionAndPhase).length === 0 ? (
                    <tr>
                      <td colSpan={7} className="empty-state-row">
                        No tasks found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    Object.keys(tasksBySectionAndPhase).map(sec => (
                      <React.Fragment key={sec}>
                        <tr className="section-header-row">
                          <td colSpan={7}>{sec}</td>
                        </tr>
                        {Object.keys(tasksBySectionAndPhase[sec]).map(ph => (
                          <React.Fragment key={ph}>
                            <tr className="phase-header-row">
                              <td colSpan={7}>{ph}</td>
                            </tr>
                            {tasksBySectionAndPhase[sec][ph].map(task => {
                              let badgeClass = 'badge-pending';
                              let badgeText = 'PENDING';

                              if (task.status === 'completed') {
                                badgeClass = 'badge-done';
                                badgeText = 'DONE';
                              } else if (task.status === 'template-ready' || task.status === 'in-progress') {
                                badgeClass = 'badge-ready';
                                badgeText = 'TEMPLATE READY';
                              }

                              return (
                                <tr key={task._id} className={`task-row ${task.commentCount > 0 ? 'has-active-comments' : ''}`}>
                                  <td className="col-num">{task.taskNumber || '-'}</td>
                                  <td className="col-phase">{task.phase}</td>
                                  <td className="col-title font-medium">
                                    <div className="title-with-comment-badge">
                                      <span>{task.title}</span>
                                      {task.commentCount > 0 && (
                                        <span 
                                          className="title-comment-pill" 
                                          onClick={() => openTaskCommentModal(task)}
                                          title="Click to view notes"
                                        >
                                          <FiMessageSquare size={11} /> {task.commentCount} {task.commentCount === 1 ? 'comment' : 'comments'}
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="col-file">
                                    {task.componentFile ? (
                                      <code className="component-code">{task.componentFile}</code>
                                    ) : '-'}
                                  </td>
                                  <td className="col-status">
                                    <span className={`badge ${badgeClass}`}>
                                      {badgeText}
                                    </span>
                                  </td>
                                  <td className="col-assignee">
                                    {task.assignedTo ? (
                                      <span className="assignee">{task.assignedTo.name}</span>
                                    ) : (
                                      <span className="assignee empty">— Unassigned —</span>
                                    )}
                                  </td>
                                  <td className="col-actions">
                                    <button 
                                      className={`action-btn comment-btn ${task.commentCount > 0 ? 'has-comments' : ''}`}
                                      onClick={() => openTaskCommentModal(task)}
                                      title="Task Notes"
                                    >
                                      <FiMessageSquare />
                                      {task.commentCount > 0 && (
                                        <span className="task-comment-count-badge">{task.commentCount}</span>
                                      )}
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </React.Fragment>
                        ))}
                      </React.Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Phase Schedule Timeline View */}
      {activeTab === 'timeline' && (
        <div className="timeline-view-card glass-panel">
          <div className="timeline-view-header">
            <div>
              <h3>📅 Project Schedule & Phase Progress Timeline</h3>
              <p className="timeline-subtitle">
                Start Date: <strong>{project?.assignDate ? new Date(project.assignDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '01 Aug 2026'}</strong> — Deadline: <strong>{project?.deadline ? new Date(project.deadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '13 Aug 2026'}</strong>
              </p>
            </div>
          </div>

          <div className="gantt-container">
            {phaseTimelineData.map((item) => (
              <div key={item.phase} className="gantt-row">
                <div className="gantt-phase-info">
                  <span className="step-badge">Phase {item.step}</span>
                  <span className="gantt-phase-name">{item.phase}</span>
                </div>
                <div className="gantt-progress-wrapper">
                  <div className="gantt-bar-bg">
                    <div 
                      className={`gantt-bar-fill ${item.percent === 100 ? 'done' : item.percent > 0 ? 'progress' : ''}`}
                      style={{ width: `${Math.max(item.percent, 8)}%` }}
                    >
                      <span className="gantt-percent-text">{item.percent}%</span>
                    </div>
                  </div>
                  <div className="gantt-meta-row">
                    <span className="gantt-count">{item.completed} / {item.total} Micro-Tasks Done</span>
                    <span className="gantt-assignees">
                      {item.assignees.length > 0 ? `Team: ${item.assignees.join(', ')}` : 'Unassigned'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Task Discussion Modal (Read Only) */}
      {commentTask && (
        <div className="modal-overlay" onClick={() => setCommentTask(null)}>
          <div className="modal-content glass-panel comment-modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="comment-modal-title">
                <span className="task-pill">Task #{commentTask.taskNumber || ''}</span>
                <h3>{commentTask.title}</h3>
              </div>
              <button className="close-btn" onClick={() => setCommentTask(null)}>
                <FiX />
              </button>
            </div>

            <div className="task-comment-body">
              {loadingComments ? (
                <div className="loading-state" style={{ minHeight: '150px' }}>Loading notes...</div>
              ) : taskComments.length === 0 ? (
                <div className="empty-state" style={{ padding: '30px 16px' }}>
                  <div className="empty-icon">💬</div>
                  <h4>No notes yet</h4>
                  <p>There are no notes recorded for this task.</p>
                </div>
              ) : (
                <div className="comments-list">
                  {taskComments.map(comment => (
                    <div key={comment._id} className="comment-item">
                      <div className="comment-avatar" style={{ backgroundColor: comment.user?.avatar || '#6C5CE7' }}>
                        {comment.user?.name ? comment.user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="comment-bubble">
                        <div className="comment-top">
                          <span className="comment-author">{comment.user?.name || 'User'}</span>
                          <span className="comment-role">({comment.user?.role || 'member'})</span>
                        </div>
                        <p className="comment-text">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="comment-readonly-notice">
                <FiClock size={16} style={{ flexShrink: 0 }} />
                <span>Client Live Preview Mode. Commenting and editing require account login.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicProjectView;
