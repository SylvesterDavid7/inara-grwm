import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserDataContext } from '../contexts/UserDataContext.jsx';

const PrivateRoute = () => {
  const { user, userData, loading } = useUserDataContext();

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p className="font-heading text-lg text-gray-600">Loading your experience...</p>
      </div>
    );
  }

  // Redirect to login if user is not authenticated or essential data is not loaded
  return user && userData ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
