import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const GateRoute = () => {
  const hasGateAccess = sessionStorage.getItem('hasGateAccess');

  return hasGateAccess ? <Outlet /> : <Navigate to="/gate" />;
};

export default GateRoute;