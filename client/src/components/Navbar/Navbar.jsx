import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiHome, FiUsers, FiMenu, FiX, FiLogOut, FiBell, FiCalendar, FiShield, FiMessageSquare, FiTrash2 } from 'react-icons/fi';
import { getNotifications, markNotificationsRead, deleteNotification, clearAllNotifications } from '../../services/api';
import './Navbar.css';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Close mobile navigation drawer whenever route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const fetchNotifs = async () => {
    try {
      const res = await getNotifications();
      if (res.data.success) {
        setNotifications(res.data.data.notifications);
        setUnreadCount(res.data.data.unreadCount);
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifs();
      const interval = setInterval(fetchNotifs, 8000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const toggleNotif = async () => {
    setIsOpen(false); // Always close mobile side drawer when opening notifications
    const nextState = !isNotifOpen;
    setIsNotifOpen(nextState);
    if (nextState && unreadCount > 0) {
      setUnreadCount(0);
      try {
        await markNotificationsRead();
      } catch (err) {
        console.error('Failed to mark notifications read', err);
      }
    }
  };

  const handleDeleteNotif = async (e, notifId) => {
    e.stopPropagation();
    try {
      await deleteNotification(notifId);
      setNotifications(prev => prev.filter(n => (n._id || n.id) !== notifId));
    } catch (err) {
      console.error('Failed to delete notification', err);
    }
  };

  const handleClearAllNotifs = async () => {
    try {
      await clearAllNotifications();
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to clear notifications', err);
    }
  };

  return (
    <>
      <div className="mobile-top-bar">
        <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle navigation">
          {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
        <span className="mobile-brand-title">Jigcks Workspace</span>
        <button className="notif-bell-btn mobile-bell" onClick={toggleNotif} aria-label="Notifications">
          <FiBell size={20} />
          {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
        </button>
      </div>

      <nav className={`navbar ${isOpen ? 'open' : ''}`}>
        <div className="navbar-brand">
          <h1>Jigcks Workspace</h1>
        </div>

        <div className="navbar-links">
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
            <FiHome size={20} />
            <span>Dashboard</span>
          </NavLink>

          {isAdmin && (
            <NavLink to="/team" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
              <FiUsers size={20} />
              <span>Team</span>
            </NavLink>
          )}

          <div className="nav-notif-wrapper">
            <button className="nav-link notif-link-btn" onClick={toggleNotif}>
              <div className="bell-icon-container">
                <FiBell size={20} />
                {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
              </div>
              <span>Notifications</span>
            </button>
          </div>
        </div>

        <div className="navbar-footer">
          <div className="user-info">
            <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
            <div className="user-details">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">{isAdmin ? 'Admin' : 'Freelancer'}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={logout}>
            <FiLogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Notification Dropdown Drawer / Panel */}
      {isNotifOpen && (
        <div className="notif-dropdown glass-panel">
          <div className="notif-header">
            <h3>🔔 Workspace Notifications</h3>
            <div className="notif-header-actions">
              {notifications.length > 0 && (
                <button className="clear-all-btn" onClick={handleClearAllNotifs} title="Clear all notification history">
                  Clear All
                </button>
              )}
              <button className="close-notif-btn" onClick={() => setIsNotifOpen(false)}>
                <FiX size={16} />
              </button>
            </div>
          </div>
          <div className="notif-list">
            {notifications.length === 0 ? (
              <div className="empty-notif" style={{ padding: '20px', textAlign: 'center', color: '#a0a0b8', fontSize: '13px' }}>
                No notifications yet
              </div>
            ) : (
              notifications.map(n => (
                <div key={n._id || n.id} className={`notif-item ${!n.isRead ? 'unread' : ''}`}>
                  <FiMessageSquare className="notif-icon comment" />
                  <div className="notif-body">
                    <span className="notif-title">{n.title}</span>
                    <span className="notif-desc">{n.message}</span>
                  </div>
                  <button className="notif-del-btn" onClick={(e) => handleDeleteNotif(e, n._id || n.id)} title="Delete notification">
                    <FiTrash2 size={13} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {isOpen && <div className="mobile-overlay" onClick={toggleMenu}></div>}
      {isNotifOpen && <div className="notif-backdrop" onClick={() => setIsNotifOpen(false)}></div>}
    </>
  );
};

export default Navbar;
