import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../contexts/UserDataContext';

const FeatureCard = ({ title, description, path, requiresAuth, cta, icon: Icon, comingSoon }) => {
  const navigate = useNavigate();
  const { user } = useUserData();

  const handleNavigation = () => {
    if (comingSoon) return;
    if (requiresAuth && !user) {
      navigate('/login');
    } else {
      navigate(path);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 flex flex-col items-start h-full ${comingSoon ? 'cursor-not-allowed' : 'cursor-pointer'}`} onClick={handleNavigation}>
      <div className="flex items-center justify-between w-full mb-4">
        {Icon && <Icon className="text-3xl text-gray-500" />}
        {comingSoon && <span className="text-xs font-semibold text-gray-500 bg-gray-200 px-2 py-1 rounded-full">Coming Soon</span>}
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600 mb-4 flex-grow">{description}</p>
      {!comingSoon && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent the card click from firing
            handleNavigation();
          }}
          className="text-blue-600 hover:text-blue-800 font-semibold"
        >
          {cta}
        </button>
      )}
    </div>
  );
};

export default FeatureCard;
