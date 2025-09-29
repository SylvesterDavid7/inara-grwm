import React from 'react';
import { Link } from 'react-router-dom';

const AccessRestricted = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="text-center">
        <h1 className="text-6xl font-heading font-extrabold text-red-500">Access Restricted</h1>
        <p className="mt-4 text-lg text-gray-700">You do not have permission to view this page.</p>
        <div className="mt-8">
          <Link
            to="/home"
            className="px-6 py-3 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccessRestricted;
