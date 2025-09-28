import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserData } from '../contexts/UserDataContext';

const AdminRoute = () => {
  const { user, isAdmin, loading } = useUserData();

  if (loading) {
    return <div>Loading...</div>; 
  }

  return user && isAdmin ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;
