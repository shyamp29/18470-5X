import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';

const AppRouter = () => {
  return (
    <Routes>
      {/* root page (Login) */}
      <Route path="/" element={<LoginPage />} />
      
      {/* Signup page */}
      <Route path="/signup" element={<SignupPage />} />

      {/* 404 Redirect - Optional but professional */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;