import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPlus, FiX, FiTrash2, FiEdit2, FiActivity, FiCheckSquare, FiClock, FiRefreshCw, FiMessageSquare, FiSend, FiDownload, FiPrinter, FiCalendar, FiShare2, FiTag } from 'react-icons/fi';
import { getProject, getProjectTasks, getProjectActivities, getTaskComments, addComment, deleteComment, createTask, updateTask, updateTaskStatus, deleteTask, updateProject, getFreelancers } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './ProjectDetail.css';

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
};

const SECTION_PRESETS = [
  '🎨 FRONTEND ARCHITECTURE',
  '⚙️ BACKEND ARCHITECTURE & DATABASE',
  '🧪 TESTING & QUALITY ASSURANCE'
];

const PHASE_PRESETS = [
  'Frontend Phase 1',
  'Frontend Phase 2',
  'Frontend Phase 3',
  'Frontend Phase 4',
  'Frontend Phase 5',
  'Backend Phase 1',
  'Backend Phase 2',
  'Testing Phase'
];

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterAssignee, setFilterAssignee] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [allFreelancers, setAllFreelancers] = useState([]);

  // Tab State
  const [activeTab, setActiveTab] = useState('checklist'); // 'checklist' | 'activity'
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  // Task Discussion / Comment Modal State
  const [commentTask, setCommentTask] = useState(null);
  const [taskComments, setTaskComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');

  // Project Edit Modal State
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [editProjectData, setEditProjectData] = useState({
    title: '',
    client: '',
    assignDate: '',
    deadline: '',
    description: '',
    status: 'active',
    assignedTo: []
  });

  // Task Add Custom Section / Phase state
  const [sectionSelect, setSectionSelect] = useState(SECTION_PRESETS[0]);
  const [customSectionInput, setCustomSectionInput] = useState('');
  const [phaseSelect, setPhaseSelect] = useState(PHASE_PRESETS[0]);
  const [customPhaseInput, setCustomPhaseInput] = useState('');

  // Task Edit Modal State
  const [editingTask, setEditingTask] = useState(null);
  const [editTaskSectionSelect, setEditTaskSectionSelect] = useState(SECTION_PRESETS[0]);
  const [editTaskCustomSectionInput, setEditTaskCustomSectionInput] = useState('');
  const [editTaskPhaseSelect, setEditTaskPhaseSelect] = useState(PHASE_PRESETS[0]);
  const [editTaskCustomPhaseInput, setEditTaskCustomPhaseInput] = useState('');

  // Add Task Modal state
  const [newTask, setNewTask] = useState({
    taskNumber: '',
    title: '',
    componentFile: '',
    status: 'pending',
    assignedTo: '',
    priority: 'medium'
  });

  const fetchActivities = async () => {
    try {
      setLoadingActivities(true);
      const res = await getProjectActivities(id);
      setActivities(res.data.data);
    } catch (err) {
      console.error('Failed to load activity log', err);
    } finally {
      setLoadingActivities(false);
    }
  };

  const openTaskCommentModal = async (task) => {
    setCommentTask(task);
    setNewCommentText('');
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

  const handleAddCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentTask || !newCommentText.trim()) return;

    try {
      const res = await addComment(commentTask._id, newCommentText.trim());
      setTaskComments(prev => [...prev, res.data.data]);
      setNewCommentText('');
      setTasks(prevTasks => prevTasks.map(t => t._id === commentTask._id ? { ...t, commentCount: (t.commentCount || 0) + 1 } : t));
      fetchActivities();
    } catch (err) {
      console.error('Failed to add comment', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setTaskComments(prev => prev.filter(c => c._id !== commentId));
      if (commentTask) {
        setTasks(prevTasks => prevTasks.map(t => t._id === commentTask._id ? { ...t, commentCount: Math.max(0, (t.commentCount || 1) - 1) } : t));
      }
    } catch (err) {
      console.error('Failed to delete comment', err);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectRes, tasksRes] = await Promise.all([
        getProject(id),
        getProjectTasks(id)
      ]);
      setProject(projectRes.data.data);
      setTasks(tasksRes.data.data);
      fetchActivities();
    } catch (err) {
      console.error(err);
      setError('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    if (user?.role === 'admin') {
      getFreelancers().then(res => setAllFreelancers(res.data.data)).catch(console.error);
    }
  }, [id, user]);

  const handleExportCSV = () => {
    if (!tasks || tasks.length === 0) return;

    const headers = ['Task #', 'Section', 'Phase', 'Task Title', 'Component File', 'Status', 'Assigned To', 'Priority'];
    const rows = tasks.map(t => [
      `"${t.taskNumber || ''}"`,
      `"${t.section || ''}"`,
      `"${t.phase || ''}"`,
      `"${t.title ? t.title.replace(/"/g, '""') : ''}"`,
      `"${t.componentFile ? t.componentFile.replace(/"/g, '""') : ''}"`,
      `"${t.status || 'pending'}"`,
      `"${t.assignedTo ? t.assignedTo.name : 'Unassigned'}"`,
      `"${t.priority || 'medium'}"`
    ]);

    const csvString = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${project?.title?.replace(/\s+/g, '_') || 'Project'}_Checklist.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [copiedLink, setCopiedLink] = useState(false);

  const handleShareClientLink = () => {
    const publicUrl = `${window.location.origin}/public/project/${id}`;
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3500);
  };

  const handleExportPDF = () => {
    window.print();
  };

  const openEditProjectModal = () => {
    if (!project) return;
    setEditProjectData({
      title: project.title || '',
      client: project.client || '',
      assignDate: project.assignDate ? new Date(project.assignDate).toISOString().split('T')[0] : '',
      deadline: project.deadline ? new Date(project.deadline).toISOString().split('T')[0] : '',
      description: project.description || '',
      status: project.status || 'active',
      assignedTo: project.assignedTo ? project.assignedTo.map(m => m._id) : []
    });
    setIsEditProjectOpen(true);
  };

  const handleEditProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProject(id, editProjectData);
      setProject(res.data.data);
      setIsEditProjectOpen(false);
    } catch (err) {
      console.error('Failed to update project', err);
    }
  };

  const handleStatusToggle = async (taskId, currentStatus, assignedTo) => {
    if (user?.role !== 'admin' && assignedTo?._id !== user?._id) return;

    let newStatus = 'pending';
    if (currentStatus === 'pending') newStatus = 'template-ready';
    else if (currentStatus === 'template-ready' || currentStatus === 'in-progress') newStatus = 'completed';
    else if (currentStatus === 'completed') newStatus = 'pending';

    // ⚡ Optimistic update — UI changes instantly
    setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));

    try {
      await updateTaskStatus(taskId, newStatus);
    } catch (err) {
      console.error('Failed to update status', err);
      // Revert on failure
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: currentStatus } : t));
    }
  };


  const handleAssigneeChange = async (taskId, newUserId) => {
    if (user?.role !== 'admin') return;
    try {
      const assignedToId = newUserId || null;
      await updateTask(taskId, { assignedTo: assignedToId });
      const selectedMember = project?.assignedTo?.find(m => m._id === newUserId) || null;
      setTasks(tasks.map(t => t._id === taskId ? { ...t, assignedTo: selectedMember } : t));
    } catch (err) {
      console.error('Failed to reassign task', err);
    }
  };

  const openEditTaskModal = (task) => {
    setEditingTask({
      _id: task._id,
      taskNumber: task.taskNumber || '',
      title: task.title || '',
      componentFile: task.componentFile || '',
      status: task.status || 'pending',
      priority: task.priority || 'medium',
      assignedTo: task.assignedTo ? task.assignedTo._id : ''
    });

    const isPresetSec = SECTION_PRESETS.includes(task.section);
    if (isPresetSec) {
      setEditTaskSectionSelect(task.section);
      setEditTaskCustomSectionInput('');
    } else {
      setEditTaskSectionSelect('__CUSTOM__');
      setEditTaskCustomSectionInput(task.section || '');
    }

    const isPresetPh = PHASE_PRESETS.includes(task.phase);
    if (isPresetPh) {
      setEditTaskPhaseSelect(task.phase);
      setEditTaskCustomPhaseInput('');
    } else {
      setEditTaskPhaseSelect('__CUSTOM__');
      setEditTaskCustomPhaseInput(task.phase || '');
    }
  };

  const handleEditTaskSubmit = async (e) => {
    e.preventDefault();
    if (!editingTask) return;
    try {
      const finalSection = editTaskSectionSelect === '__CUSTOM__' ? editTaskCustomSectionInput : editTaskSectionSelect;
      const finalPhase = editTaskPhaseSelect === '__CUSTOM__' ? editTaskCustomPhaseInput : editTaskPhaseSelect;

      const taskData = {
        taskNumber: editingTask.taskNumber,
        title: editingTask.title,
        componentFile: editingTask.componentFile,
        status: editingTask.status,
        priority: editingTask.priority,
        assignedTo: editingTask.assignedTo || null,
        section: finalSection,
        phase: finalPhase
      };

      const res = await updateTask(editingTask._id, taskData);
      setTasks(tasks.map(t => t._id === editingTask._id ? res.data.data : t));
      setEditingTask(null);
    } catch (err) {
      console.error('Failed to update task', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (user?.role !== 'admin') return;
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter(t => t._id !== taskId));
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const finalSection = sectionSelect === '__CUSTOM__' ? customSectionInput : sectionSelect;
      const finalPhase = phaseSelect === '__CUSTOM__' ? customPhaseInput : phaseSelect;

      const taskData = {
        ...newTask,
        section: finalSection,
        phase: finalPhase,
        project: id
      };

      await createTask(taskData);
      setIsAddModalOpen(false);
      
      // Reset form
      setSectionSelect(SECTION_PRESETS[0]);
      setCustomSectionInput('');
      setPhaseSelect(PHASE_PRESETS[0]);
      setCustomPhaseInput('');
      setNewTask({
        taskNumber: '',
        title: '',
        componentFile: '',
        status: 'pending',
        assignedTo: '',
        priority: 'medium'
      });
      fetchData();
    } catch (err) {
      console.error('Failed to create task', err);
    }
  };

  // Stats computation matching exact reference HTML
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const templateReady = tasks.filter(t => t.status === 'template-ready' || t.status === 'in-progress').length;
    const pending = tasks.filter(t => t.status === 'pending' || !t.status).length;
    const completedPercent = total === 0 ? 0 : ((completed / total) * 100).toFixed(1);
    const templateReadyPercent = total === 0 ? 0 : ((templateReady / total) * 100).toFixed(1);
    
    return { total, completed, templateReady, pending, completedPercent, templateReadyPercent };
  }, [tasks]);

  // Unique assignees for filter
  const assignees = useMemo(() => {
    const map = new Map();
    tasks.forEach(t => {
      if (t.assignedTo) {
        map.set(t.assignedTo._id, t.assignedTo);
      }
    });
    return Array.from(map.values());
  }, [tasks]);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    if (filterAssignee === 'All') return tasks;
    if (filterAssignee === 'Unassigned') return tasks.filter(t => !t.assignedTo);
    return tasks.filter(t => t.assignedTo?._id === filterAssignee);
  }, [tasks, filterAssignee]);

  // Group tasks by section and phase for exact HTML table layout
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

  if (loading) return <div className="loading-screen">Loading project details...</div>;
  if (error) return <div className="error-screen">{error}</div>;
  if (!project) return null;

  return (
    <div className="project-detail">
      <button onClick={() => navigate('/dashboard')} className="back-btn">
        <FiArrowLeft /> Back to Dashboard
      </button>

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
            <button className="export-btn share-link-btn" onClick={handleShareClientLink} title="Copy Live Client Preview Link (No Login Required)">
              <FiShare2 size={14} /> {copiedLink ? '✓ Preview Link Copied!' : 'Share Client Link'}
            </button>
            <button className="export-btn" onClick={handleExportCSV} title="Export Checklist to CSV / Excel">
              <FiDownload size={14} /> Export CSV
            </button>
            <button className="export-btn" onClick={handleExportPDF} title="Print or Save as PDF Report">
              <FiPrinter size={14} /> Print / PDF
            </button>
            {user?.role === 'admin' && (
              <button 
                className="edit-project-btn" 
                onClick={openEditProjectModal}
                title="Edit Project Details"
              >
                <FiEdit2 /> Edit Project
              </button>
            )}
          </div>
        </div>
        <p className="project-desc">{project.description}</p>
        <div className="meta-row">
          {project.assignDate && (
            <div className="meta-item">
              <span className="meta-label">Assigned Date:</span> {new Date(project.assignDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          )}
          {project.deadline && (
            <div className="meta-item">
              <span className="meta-label">Deadline:</span> {new Date(project.deadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          )}
          {project.assignedTo && project.assignedTo.length > 0 && (
            <div className="meta-item team-avatars">
              <span className="meta-label">Team:</span>
              <div className="avatars-container">
                {project.assignedTo.filter(Boolean).map(member => {
                  const memberName = typeof member === 'object' ? member.name : String(member);
                  const memberAvatar = typeof member === 'object' ? member.avatar : '#6C5CE7';
                  const keyId = typeof member === 'object' ? member._id : member;
                  const initial = memberName ? memberName.charAt(0).toUpperCase() : 'U';

                  return (
                    <div key={keyId} className="avatar-circle" title={memberName || 'Team Member'} style={{ backgroundColor: memberAvatar || '#6C5CE7' }}>
                      {initial}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress Card matching Reference HTML */}
      <div className="progress-card glass-panel">
        <div className="progress-header">
          <span className="progress-title">Overall Project Progress</span>
          <span className="progress-text">
            {stats.completedPercent}% Complete ({stats.completed} / {stats.total} Micro-Tasks Done)
          </span>
        </div>
        <div className="progress-bar-bg">
          <div className="progress-fill-done" style={{ width: `${stats.completedPercent}%` }} title={`${stats.completed} Done`} />
          <div className="progress-fill-template" style={{ width: `${stats.templateReadyPercent}%` }} title={`${stats.templateReady} Templates Ready`} />
        </div>
        
        <div className="stats-grid">
          <div className="stat-box total">
            <div className="stat-num">{stats.total}</div>
            <div className="stat-label">Total Micro-Tasks</div>
          </div>
          <div className="stat-box done">
            <div className="stat-num">{stats.completed}</div>
            <div className="stat-label">Completed Tasks</div>
          </div>
          <div className="stat-box ready">
            <div className="stat-num">{stats.templateReady}</div>
            <div className="stat-label">Template Ready</div>
          </div>
          <div className="stat-box pending">
            <div className="stat-num">{stats.pending}</div>
            <div className="stat-label">Pending / Unassigned</div>
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
        <button 
          className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('activity');
            fetchActivities();
          }}
        >
          <FiActivity size={16} /> Activity Log & Audit Trail {activities.length > 0 ? `(${activities.length})` : ''}
        </button>
      </div>

      {activeTab === 'checklist' && (
        <>
          {/* Filter Bar & Controls */}
          <div className="list-controls">
            <div className="filter-bar">
              <button 
                className={`filter-btn ${filterAssignee === 'All' ? 'active' : ''}`}
                onClick={() => setFilterAssignee('All')}
              >
                Show All ({tasks.length})
              </button>
              {assignees.map(a => (
                <button 
                  key={a._id}
                  className={`filter-btn ${filterAssignee === a._id ? 'active' : ''}`}
                  onClick={() => setFilterAssignee(a._id)}
                >
                  {a.name}'s Tasks ({tasks.filter(t => t.assignedTo?._id === a._id).length})
                </button>
              ))}
              <button 
                className={`filter-btn ${filterAssignee === 'Unassigned' ? 'active' : ''}`}
                onClick={() => setFilterAssignee('Unassigned')}
              >
                Unassigned ({tasks.filter(t => !t.assignedTo).length})
              </button>
            </div>
            
            {user?.role === 'admin' && (
              <button className="add-task-btn" onClick={() => setIsAddModalOpen(true)}>
                <FiPlus /> Add Task
              </button>
            )}
          </div>

          {/* Master Task Checklist Table matching Reference HTML */}
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
                    <th className="col-actions">Actions & Notes</th>
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
                        {/* SECTION HEADER ROW */}
                        <tr className="section-header-row">
                          <td colSpan={7}>{sec}</td>
                        </tr>
                        {Object.keys(tasksBySectionAndPhase[sec]).map(ph => (
                          <React.Fragment key={ph}>
                            {/* PHASE HEADER ROW */}
                            <tr className="phase-header-row">
                              <td colSpan={7}>{ph}</td>
                            </tr>
                            {tasksBySectionAndPhase[sec][ph].map(task => {
                              const isAssignedToMe = task.assignedTo?._id === user?._id;
                              const canEditStatus = user?.role === 'admin' || isAssignedToMe;
                              
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
                                          title="Click to view discussion"
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
                                    <span 
                                      className={`badge ${badgeClass} ${canEditStatus ? 'clickable' : ''}`}
                                      onClick={() => handleStatusToggle(task._id, task.status || 'pending', task.assignedTo)}
                                      title={canEditStatus ? "Click to toggle status" : ""}
                                    >
                                      {badgeText}
                                    </span>
                                  </td>
                                  <td className="col-assignee">
                                    {user?.role === 'admin' ? (
                                      <select 
                                        className="assignee-select"
                                        value={task.assignedTo?._id || ''}
                                        onChange={(e) => handleAssigneeChange(task._id, e.target.value)}
                                      >
                                        <option value="">— Unassigned —</option>
                                        {project?.assignedTo?.map(member => (
                                          <option key={member._id} value={member._id}>{member.name}</option>
                                        ))}
                                      </select>
                                    ) : (
                                      task.assignedTo ? (
                                        <span className="assignee">{task.assignedTo.name}</span>
                                      ) : (
                                        <span className="assignee empty">— Unassigned —</span>
                                      )
                                    )}
                                  </td>
                                  <td className="col-actions">
                                    <button 
                                      className={`action-btn comment-btn ${task.commentCount > 0 ? 'has-comments' : ''}`}
                                      onClick={() => openTaskCommentModal(task)}
                                      title={task.commentCount > 0 ? `${task.commentCount} Comments/Notes` : "Task Discussion & Notes"}
                                    >
                                      <FiMessageSquare />
                                      {task.commentCount > 0 && (
                                        <span className="task-comment-count-badge">{task.commentCount}</span>
                                      )}
                                    </button>
                                    {user?.role === 'admin' && (
                                      <>
                                        <button 
                                          className="action-btn edit-btn" 
                                          onClick={() => openEditTaskModal(task)}
                                          title="Edit Task"
                                        >
                                          <FiEdit2 />
                                        </button>
                                        <button 
                                          className="action-btn delete-btn" 
                                          onClick={() => handleDeleteTask(task._id)}
                                          title="Delete Task"
                                        >
                                          <FiTrash2 />
                                        </button>
                                      </>
                                    )}
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
          {/* Header */}
          <div className="timeline-view-header">
            <div>
              <h3>Project Timeline</h3>
              <div className="timeline-subtitle">
                <span>
                  📅 Start:{' '}
                  <strong>
                    {project?.assignDate
                      ? new Date(project.assignDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                      : 'N/A'}
                  </strong>
                </span>
                <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
                <span style={{ color: '#ffb4ab' }}>
                  🚩 Deadline:{' '}
                  <strong>
                    {project?.deadline
                      ? new Date(project.deadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                      : 'N/A'}
                  </strong>
                </span>
              </div>
            </div>
          </div>

          {/* Gantt Body */}
          <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {phaseTimelineData.map((item, idx) => {
              const isDone   = item.percent === 100;
              const isActive = item.percent > 0 && item.percent < 100;
              const stateClass = isDone ? 'phase-done' : isActive ? 'phase-active' : 'phase-todo';
              const badgeState = isDone ? 'done' : isActive ? 'active' : 'todo';
              const barClass   = isDone ? 'done-bar' : isActive ? 'active-bar' : 'scheduled-bar';
              const fillClass  = isDone ? 'done' : 'progress';

              return (
                <div key={item.phase} style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '16px',
                  padding: '20px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  borderLeft: isDone ? '3px solid #2edcd7' : isActive ? '3px solid #c6bfff' : '3px solid rgba(255,255,255,0.08)',
                  transition: 'all 0.2s ease',
                }}>
                  {/* Phase top row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className={`step-badge ${badgeState}`}>Phase {item.step}</span>
                      <span style={{
                        fontSize: '14px', fontWeight: '600',
                        fontFamily: "'Geist','Inter',monospace",
                        color: isDone ? '#2edcd7' : isActive ? '#c6bfff' : '#929095',
                      }}>
                        {item.phase}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', fontFamily: "'Geist','Inter',monospace", color: '#929095' }}>
                      <span>
                        <span style={{ fontWeight: 700, color: '#e1e3e4' }}>{item.completed}</span>/{item.total} Tasks
                      </span>
                      <span style={{ color: isDone ? '#2edcd7' : isActive ? '#c6bfff' : '#47464b', fontWeight: 700 }}>
                        {item.percent}%
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '99px', overflow: 'hidden', position: 'relative' }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.max(item.percent, item.percent > 0 ? 5 : 0)}%`,
                      borderRadius: '99px',
                      background: isDone
                        ? 'linear-gradient(90deg, #2edcd7, #6C5CE7)'
                        : isActive
                        ? 'linear-gradient(90deg, rgba(64,41,186,0.8), #c6bfff)'
                        : 'rgba(71,70,75,0.4)',
                      boxShadow: isDone ? '0 0 10px rgba(46,220,215,0.5)' : isActive ? '0 0 10px rgba(198,191,255,0.3)' : 'none',
                      transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
                    }} />
                  </div>

                  {/* Assignees row */}
                  {item.assignees.length > 0 && (
                    <div style={{ fontSize: '12px', color: '#929095', fontFamily: "'Geist','Inter',monospace" }}>
                      👤 {item.assignees.join(', ')}
                    </div>
                  )}
                </div>
              );
            })}

            {phaseTimelineData.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px 24px', color: '#929095' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>📅</div>
                <p>No phase data available yet.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Activity Log & Audit Trail View */}
      {activeTab === 'activity' && (
        <div className="activity-log-card glass-panel">
          <div className="activity-header">
            <h3>📜 Real-Time Audit Trail & Activity Log</h3>
            <button className="refresh-btn" onClick={fetchActivities} title="Refresh Log">
              <FiRefreshCw size={14} className={loadingActivities ? 'spin' : ''} /> Refresh Log
            </button>
          </div>

          {loadingActivities ? (
            <div className="loading-state">Loading activity log...</div>
          ) : activities.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px 20px' }}>
              <div className="empty-icon">📜</div>
              <h4>No activity recorded yet</h4>
              <p>Task status changes, assignments, and project updates will be logged here in real-time.</p>
            </div>
          ) : (
            <div className="timeline-container">
              {activities.map((act) => {
                let badgeClass = 'act-badge-info';
                if (act.action === 'status_change') badgeClass = 'act-badge-status';
                else if (act.action === 'reassigned') badgeClass = 'act-badge-assign';
                else if (act.action === 'task_created') badgeClass = 'act-badge-create';
                else if (act.action === 'task_deleted') badgeClass = 'act-badge-delete';

                const timeAgo = formatTimeAgo(act.createdAt);

                return (
                  <div key={act._id} className="timeline-item">
                    <div className="timeline-avatar" style={{ backgroundColor: act.user?.avatar || '#6C5CE7' }}>
                      {act.user?.name ? act.user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-meta">
                        <span className="timeline-user">{act.user?.name || 'User'}</span>
                        <span className="timeline-username">@{act.user?.username || 'user'}</span>
                        <span className={`act-type-tag ${badgeClass}`}>{act.action.replace('_', ' ')}</span>
                        <span className="timeline-time"><FiClock size={12} /> {timeAgo}</span>
                      </div>
                      <div className="timeline-details">{act.details}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Edit Project Modal */}
      {isEditProjectOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <div className="modal-header">
              <h2>Edit Project Details</h2>
              <button className="close-btn" onClick={() => setIsEditProjectOpen(false)}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleEditProjectSubmit} className="modal-form">
              <div className="form-group">
                <label>Project Title *</label>
                <input 
                  type="text" 
                  value={editProjectData.title} 
                  onChange={e => setEditProjectData({...editProjectData, title: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Client Name</label>
                  <input 
                    type="text" 
                    value={editProjectData.client} 
                    onChange={e => setEditProjectData({...editProjectData, client: e.target.value})} 
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Assign Date (Start Date)</label>
                  <input 
                    type="date" 
                    value={editProjectData.assignDate} 
                    onChange={e => setEditProjectData({...editProjectData, assignDate: e.target.value})} 
                  />
                </div>
                <div className="form-group">
                  <label>Deadline Date</label>
                  <input 
                    type="date" 
                    value={editProjectData.deadline} 
                    onChange={e => setEditProjectData({...editProjectData, deadline: e.target.value})} 
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Project Description</label>
                <textarea 
                  rows="3"
                  value={editProjectData.description} 
                  onChange={e => setEditProjectData({...editProjectData, description: e.target.value})} 
                  style={{ background: '#0f111a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '10px', borderRadius: '6px' }}
                />
              </div>

              {/* Team Assignment Details */}
              <div className="form-group team-assignment-section">
                <label className="section-label font-semibold" style={{ color: '#d4a853', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
                  👥 Team Assignment & Member Details
                </label>
                <div className="team-members-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {allFreelancers.map(freelancer => {
                    const isAssignedToProject = editProjectData.assignedTo.includes(freelancer._id);
                    const memberTaskCount = tasks.filter(t => t.assignedTo?._id === freelancer._id).length;

                    return (
                      <div 
                        key={freelancer._id} 
                        className={`member-assign-card ${isAssignedToProject ? 'assigned' : ''}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: isAssignedToProject ? 'rgba(108, 92, 231, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                          border: isAssignedToProject ? '1px solid #6C5CE7' : '1px solid rgba(255, 255, 255, 0.08)',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onClick={() => {
                          if (isAssignedToProject) {
                            setEditProjectData({
                              ...editProjectData,
                              assignedTo: editProjectData.assignedTo.filter(id => id !== freelancer._id)
                            });
                          } else {
                            setEditProjectData({
                              ...editProjectData,
                              assignedTo: [...editProjectData.assignedTo, freelancer._id]
                            });
                          }
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <input 
                            type="checkbox"
                            checked={isAssignedToProject}
                            onChange={() => {}}
                            style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                          />
                          <div 
                            className="member-avatar-lg" 
                            style={{ 
                              width: '32px', 
                              height: '32px', 
                              borderRadius: '50%', 
                              backgroundColor: freelancer.avatar || '#6C5CE7',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: '700',
                              fontSize: '13px',
                              color: '#fff'
                            }}
                          >
                            {freelancer.name ? freelancer.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <div style={{ fontWeight: '600', color: '#fff', fontSize: '14px' }}>{freelancer.name}</div>
                            <div style={{ fontSize: '12px', color: '#a0a0b8' }}>@{freelancer.username} • {freelancer.email || 'Freelancer'}</div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '12px', color: '#d1d1e0', fontWeight: '500' }}>
                            {memberTaskCount} Tasks Assigned
                          </span>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: '700',
                            padding: '4px 10px',
                            borderRadius: '10px',
                            textTransform: 'uppercase',
                            background: isAssignedToProject ? 'rgba(46, 204, 113, 0.2)' : 'rgba(149, 165, 166, 0.15)',
                            color: isAssignedToProject ? '#2ecc71' : '#95a5a6'
                          }}>
                            {isAssignedToProject ? 'Assigned' : 'Not Assigned'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsEditProjectOpen(false)}>Cancel</button>
                <button type="submit" className="btn-submit">Save Project Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <div className="modal-header">
              <h2>Edit Task #{editingTask.taskNumber}</h2>
              <button className="close-btn" onClick={() => setEditingTask(null)}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleEditTaskSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Task Number (Task #)</label>
                  <input 
                    type="text" 
                    value={editingTask.taskNumber} 
                    onChange={e => setEditingTask({...editingTask, taskNumber: e.target.value})} 
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select 
                    value={editingTask.status} 
                    onChange={e => setEditingTask({...editingTask, status: e.target.value})}
                  >
                    <option value="pending">PENDING</option>
                    <option value="template-ready">TEMPLATE READY</option>
                    <option value="completed">DONE</option>
                  </select>
                </div>
              </div>

              {/* Section Header Selection */}
              <div className="form-group">
                <label>Section Header</label>
                <select 
                  value={editTaskSectionSelect} 
                  onChange={e => setEditTaskSectionSelect(e.target.value)}
                >
                  {SECTION_PRESETS.map(sec => (
                    <option key={sec} value={sec}>{sec}</option>
                  ))}
                  <option value="__CUSTOM__">➕ + Custom Section...</option>
                </select>
                {editTaskSectionSelect === '__CUSTOM__' && (
                  <input 
                    type="text" 
                    className="custom-input"
                    value={editTaskCustomSectionInput} 
                    onChange={e => setEditTaskCustomSectionInput(e.target.value)} 
                    placeholder="Enter Custom Section Title"
                    required
                  />
                )}
              </div>

              {/* Phase Header Selection */}
              <div className="form-group">
                <label>Phase Header *</label>
                <select 
                  value={editTaskPhaseSelect} 
                  onChange={e => setEditTaskPhaseSelect(e.target.value)}
                >
                  {PHASE_PRESETS.map(ph => (
                    <option key={ph} value={ph}>{ph}</option>
                  ))}
                  <option value="__CUSTOM__">➕ + Custom Phase...</option>
                </select>
                {editTaskPhaseSelect === '__CUSTOM__' && (
                  <input 
                    type="text" 
                    className="custom-input"
                    value={editTaskCustomPhaseInput} 
                    onChange={e => setEditTaskCustomPhaseInput(e.target.value)} 
                    placeholder="Enter Custom Phase Title"
                    required
                  />
                )}
              </div>

              <div className="form-group">
                <label>Task / Feature Name *</label>
                <input 
                  type="text" 
                  value={editingTask.title} 
                  onChange={e => setEditingTask({...editingTask, title: e.target.value})} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Component / File / Route</label>
                <input 
                  type="text" 
                  value={editingTask.componentFile} 
                  onChange={e => setEditingTask({...editingTask, componentFile: e.target.value})} 
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Assign To</label>
                  <select 
                    value={editingTask.assignedTo} 
                    onChange={e => setEditingTask({...editingTask, assignedTo: e.target.value})}
                  >
                    <option value="">— Unassigned —</option>
                    {project?.assignedTo?.map(member => (
                      <option key={member._id} value={member._id}>{member.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select 
                    value={editingTask.priority} 
                    onChange={e => setEditingTask({...editingTask, priority: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setEditingTask(null)}>Cancel</button>
                <button type="submit" className="btn-submit">Save Task Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Task Modal with Exact Checklist Format Fields + Custom Section/Phase */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <div className="modal-header">
              <h2>Add New Task to Checklist</h2>
              <button className="close-btn" onClick={() => setIsAddModalOpen(false)}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleAddTask} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Task Number (Task #)</label>
                  <input 
                    type="text" 
                    value={newTask.taskNumber} 
                    onChange={e => setNewTask({...newTask, taskNumber: e.target.value})} 
                    placeholder="e.g. 1.37 or 8.16"
                  />
                </div>
                <div className="form-group">
                  <label>Initial Status</label>
                  <select 
                    value={newTask.status} 
                    onChange={e => setNewTask({...newTask, status: e.target.value})}
                  >
                    <option value="pending">PENDING</option>
                    <option value="template-ready">TEMPLATE READY</option>
                    <option value="completed">DONE</option>
                  </select>
                </div>
              </div>

              {/* Section Header Selection */}
              <div className="form-group">
                <label>Section Header</label>
                <select 
                  value={sectionSelect} 
                  onChange={e => setSectionSelect(e.target.value)}
                >
                  {SECTION_PRESETS.map(sec => (
                    <option key={sec} value={sec}>{sec}</option>
                  ))}
                  <option value="__CUSTOM__">➕ + Add New Custom Section...</option>
                </select>
                {sectionSelect === '__CUSTOM__' && (
                  <input 
                    type="text" 
                    className="custom-input"
                    value={customSectionInput} 
                    onChange={e => setCustomSectionInput(e.target.value)} 
                    placeholder="Enter Custom Section Title (e.g. ⚡ MOBILE APP ARCHITECTURE)"
                    required
                  />
                )}
              </div>

              {/* Phase Header Selection */}
              <div className="form-group">
                <label>Phase Header *</label>
                <select 
                  value={phaseSelect} 
                  onChange={e => setPhaseSelect(e.target.value)}
                >
                  {PHASE_PRESETS.map(ph => (
                    <option key={ph} value={ph}>{ph}</option>
                  ))}
                  <option value="__CUSTOM__">➕ + Add New Custom Phase...</option>
                </select>
                {phaseSelect === '__CUSTOM__' && (
                  <input 
                    type="text" 
                    className="custom-input"
                    value={customPhaseInput} 
                    onChange={e => setCustomPhaseInput(e.target.value)} 
                    placeholder="Enter Custom Phase Title (e.g. Mobile Phase 1: Push Notifications)"
                    required
                  />
                )}
              </div>

              <div className="form-group">
                <label>Task / Feature Name *</label>
                <input 
                  type="text" 
                  value={newTask.title} 
                  onChange={e => setNewTask({...newTask, title: e.target.value})} 
                  placeholder="e.g. Shopping Cart Coupon Validation"
                  required 
                />
              </div>

              <div className="form-group">
                <label>Component / File / Route</label>
                <input 
                  type="text" 
                  value={newTask.componentFile} 
                  onChange={e => setNewTask({...newTask, componentFile: e.target.value})} 
                  placeholder="e.g. src/pages/Cart/Cart.jsx"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Assign To</label>
                  <select 
                    value={newTask.assignedTo} 
                    onChange={e => setNewTask({...newTask, assignedTo: e.target.value})}
                  >
                    <option value="">— Unassigned —</option>
                    {project?.assignedTo?.map(member => (
                      <option key={member._id} value={member._id}>{member.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select 
                    value={newTask.priority} 
                    onChange={e => setNewTask({...newTask, priority: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-submit">Add Task to Checklist</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Discussion & Comments Center Modal */}
      {commentTask && (
        <div className="modal-overlay" onClick={() => setCommentTask(null)}>
          <div className="comment-modal-card" onClick={e => e.stopPropagation()}>

            {/* Modal Header */}
            <div className="comment-modal-header">
              <div className="modal-header-left">
                <div className="task-tag-badge">
                  <FiTag size={12} />
                  <span>TASK #{commentTask.taskNumber || ''}</span>
                </div>
                <h2>{commentTask.title}</h2>
                <div className="modal-header-meta">
                  <span className={`drawer-status-badge status-${commentTask.status || 'pending'}`}>
                    <span className="dot" /> {commentTask.status === 'template-ready' ? 'Ready' : commentTask.status === 'in-progress' ? 'In Progress' : commentTask.status === 'completed' ? 'Completed' : 'Pending'}
                  </span>
                  {commentTask.componentFile && (
                    <span className="drawer-file-tag">
                      <code>{commentTask.componentFile}</code>
                    </span>
                  )}
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setCommentTask(null)} aria-label="Close modal">
                <FiX size={18} />
              </button>
            </div>

            {/* Scrollable Comments Feed */}
            <div className="task-comment-body">
              {loadingComments ? (
                <div className="loading-state" style={{ minHeight: '180px' }}>Loading discussion...</div>
              ) : taskComments.length === 0 ? (
                <div className="empty-discussion-state">
                  <div className="empty-icon">💬</div>
                  <h4>No notes or comments yet</h4>
                  <p>Start the discussion with your team on this micro-task.</p>
                </div>
              ) : (
                <div className="comments-list">
                  {taskComments.map(comment => {
                    const isSelf = comment.user?._id === user?._id;
                    return (
                      <div key={comment._id} className={`comment-item ${isSelf ? 'comment-self' : ''}`}>
                        <div className="comment-avatar" style={{ backgroundColor: comment.user?.avatar || '#6C5CE7' }}>
                          {comment.user?.name ? comment.user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="comment-content-wrapper">
                          <div className="comment-top">
                            <span className="comment-author">{isSelf ? 'You' : (comment.user?.name || 'User')}</span>
                            <span className={`comment-role-badge role-${comment.user?.role || 'freelancer'}`}>
                              {comment.user?.role || 'freelancer'}
                            </span>
                            <span className="comment-time">{formatTimeAgo(comment.createdAt)}</span>
                            {(user?.role === 'admin' || user?._id === comment.user?._id) && (
                              <button className="comment-del-btn" onClick={() => handleDeleteComment(comment._id)} title="Delete comment">
                                <FiTrash2 size={12} />
                              </button>
                            )}
                          </div>
                          <div className="comment-bubble">
                            <p className="comment-text">{comment.text}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Input Footer */}
            <div className="comment-modal-footer">
              {(user?.role === 'admin' || !commentTask.assignedTo || commentTask.assignedTo._id === user?._id || commentTask.assignedTo === user?._id) ? (
                <form onSubmit={handleAddCommentSubmit} className="comment-form-stitch">
                  <input 
                    type="text" 
                    placeholder="Type your note or update here..." 
                    value={newCommentText}
                    onChange={e => setNewCommentText(e.target.value)}
                    required
                  />
                  <button type="submit" className="comment-send-btn-stitch">
                    Send Note <FiSend size={15} />
                  </button>
                </form>
              ) : (
                <div className="comment-readonly-notice">
                  <FiClock size={16} style={{ flexShrink: 0 }} />
                  <span>Only <strong>{commentTask.assignedTo?.name || 'assigned freelancer'}</strong> or Admin can post comments on this task. You are in read-only mode.</span>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
