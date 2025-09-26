import React from 'react';
import Icon from '../../components/AppIcon';

const Badge = ({ icon, title, description, earned }) => {
  return (
    <div className={`relative text-center p-4 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 ${
      earned
      ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg'
      : 'bg-gray-100 border border-gray-200/80'
    }`}>
        {earned && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                <Icon name='Check' size={16} className='text-orange-600'/>
            </div>
        )}
      <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 mb-3 ${
        earned
        ? 'bg-white/10'
        : 'bg-white'
      }`}>
        <Icon name={icon} size={32} className={`${earned ? 'text-white' : 'text-gray-400'}`} style={{ filter: earned ? 'drop-shadow(0 1px 1px rgba(0,0,0,0.2))' : 'none' }}/>
      </div>
      <h4 className={`font-bold text-sm ${earned ? 'text-white' : 'text-gray-800'}`} style={{ textShadow: earned ? '1px 1px 2px rgba(0,0,0,0.2)' : 'none' }}>{title}</h4>
      <p className={`text-xs mt-1 ${earned ? 'text-amber-100/80' : 'text-gray-600'}`}>{description}</p>
    </div>
  );
};

const BadgesSection = ({ badges }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-lg font-bold text-gray-800">Your Badges</h3>
        <Icon name="Shield" size={24} className="text-purple-600" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {badges.map((badge, index) => (
          <Badge key={index} {...badge} />
        ))}
      </div>
    </div>
  );
};

export default BadgesSection;
