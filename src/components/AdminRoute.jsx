
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserDataContext } from '../contexts/UserDataContext.jsx';

const AdminRoute = () => {
  const { user, userData, loading } = useUserDataContext();

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p className="font-heading text-lg text-gray-600">Loading your experience...</p>
      </div>
    );
  }

  // The user must be logged in, have their data loaded, and be an admin.
  if (user && userData && userData.isAdmin) {
    return <Outlet />;
  }

  // If not an admin, redirect them to the access restricted page.
  return <Navigate to="/access-restricted" replace />;
};

export default AdminRoute;
