import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import UserPortal from '../pages/UserPortal';
import { APP_ROUTES } from '../Auth/authActions';

const AppRouter = () => {
  return (
    <Routes>
     <Route path={APP_ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={APP_ROUTES.SIGNUP} element={<SignupPage />} />
      <Route path={APP_ROUTES.PROFILE} element={<UserPortal />} />

      {/* 404 Redirect */}
      <Route path="*" element={<Navigate to={APP_ROUTES.LOGIN} />} />
    </Routes>
  );
};

export default AppRouter;