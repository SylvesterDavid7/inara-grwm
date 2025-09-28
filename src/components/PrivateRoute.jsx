import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserData } from '../contexts/UserDataContext';

const PrivateRoute = () => {
  const { userData } = useUserData();

  return userData ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
