import React from 'react';
import { useUserData } from '../contexts/UserDataContext';

const UserInfo = () => {
  const { user, loading, error } = useUserData();

  if (loading) {
    return <div>Loading user information...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {user ? (
        <div>
          <h2>User Information</h2>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Name:</strong> {user.displayName || 'N/A'}</p>
          {/* Add more user details as needed */}
        </div>
      ) : (
        <p>No user is currently signed in.</p>
      )}
    </div>
  );
};

export default UserInfo;
