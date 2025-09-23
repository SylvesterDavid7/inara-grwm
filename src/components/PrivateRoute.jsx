import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserDataContext } from '../contexts/UserDataContext';

const PrivateRoute = () => {
  const { userData } = useUserDataContext();

  return userData ? <Outlet /> : <Navigate to="/home" />;
};

export default PrivateRoute;
