import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserDataContext } from '../contexts/UserDataContext.jsx';

const AdminRoute = () => {
  const { user, isAdmin, loading } = useUserDataContext();

  if (loading) {
    return <div>Loading...</div>; 
  }

  return user && isAdmin ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;
