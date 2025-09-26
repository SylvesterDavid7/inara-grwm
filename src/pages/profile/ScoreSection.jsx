import React from 'react';
import Icon from '../../components/AppIcon';

const ScoreSection = ({ score, level, progress }) => {

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-lg font-bold text-gray-800">Your Progress</h3>
        <Icon name="TrendingUp" size={24} className="text-green-600"/>
      </div>

      {/* Progress Bar Container */}
      <div className="relative h-24 bg-green-100/50 rounded-xl overflow-hidden">
        
        {/* Progress Fill */}
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-teal-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>

        {/* Content Overlay */}
        <div className="absolute inset-0 p-4 flex items-center justify-between">
          
          {/* Score Side */}
          <div className="text-white">
            <p className="text-4xl font-heading font-extrabold" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.2)' }}>{score}</p>
            <p className="text-sm font-heading opacity-90" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>Points</p>
          </div>

          {/* Level Side */}
          <div className="text-slate uppercase text-right">
            <p className="text-sm font-medium opacity-90" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>Current Level</p>
            <p className="text-4xl font-extrabold font-heading" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.2)' }}>{level}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreSection;
