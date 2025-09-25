import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const GateRoute = () => {
  const isAuthenticated = sessionStorage.getItem('is-authenticated');

  return isAuthenticated ? <Outlet /> : <Navigate to="/gate" replace />;
};

export default GateRoute;
