import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const LoginPage = React.lazy(() => import('../pages/LoginPage'));
const SignupPage = React.lazy(() => import('../pages/SignupPage'));
const UserPortal = React.lazy(() => import('../pages/UserPortal'));

import { APP_ROUTES } from '../Auth/authActions';
import { useAuth } from '../Auth/authHandler';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to={APP_ROUTES.LOGIN} replace />;
};

const GuestRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to={APP_ROUTES.PROFILE} replace /> : children;
};

const AppRouter = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path={APP_ROUTES.LOGIN} element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path={APP_ROUTES.SIGNUP} element={<GuestRoute><SignupPage /></GuestRoute>} />
        <Route path={APP_ROUTES.PROFILE} element={<ProtectedRoute><UserPortal /></ProtectedRoute>} />

        {/* Root and 404 Redirect */}
        <Route path="/" element={<Navigate to={APP_ROUTES.LOGIN} replace />} />
        <Route path="*" element={<Navigate to={APP_ROUTES.LOGIN} replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;