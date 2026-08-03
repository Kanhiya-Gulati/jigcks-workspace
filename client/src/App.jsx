import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Navbar from './components/Navbar/Navbar';

import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import ProjectDetail from './pages/ProjectDetail/ProjectDetail';
import CreateProject from './pages/CreateProject/CreateProject';
import ManageTeam from './pages/ManageTeam/ManageTeam';
import NotFound from './pages/NotFound/NotFound';

import ChangePasswordModal from './components/ChangePasswordModal/ChangePasswordModal';

import './App.css';

function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
      <ChangePasswordModal />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
            <Route path="/projects/:id" element={<AppLayout><ProjectDetail /></AppLayout>} />
          </Route>

          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/projects/new" element={<AppLayout><CreateProject /></AppLayout>} />
            <Route path="/team" element={<AppLayout><ManageTeam /></AppLayout>} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
