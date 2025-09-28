import React from 'react';

const AccessRestricted = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="text-center">
        <h1 className="text-6xl font-heading font-extrabold text-red-500">Access Restricted</h1>
        <p className="mt-4 text-lg text-gray-700">You do not have permission to view this page.</p>
      </div>
    </div>
  );
};

export default AccessRestricted;
