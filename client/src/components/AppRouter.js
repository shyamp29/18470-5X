import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import UserPortal from '../pages/UserPortal';

const AppRouter = () => {
  return (
    <Routes>
      {/* root page (Login) */}
      <Route path="/" element={<LoginPage />} />
      
      {/* Signup page */}
      <Route path="/signup" element={<SignupPage />} />

      {/* User portal page */}
      <Route path="/user-portal" element={<UserPortal />} />

      {/* 404 Redirect - Optional but professional */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;