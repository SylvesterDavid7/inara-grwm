import React from 'react';

const Gauge = ({ value, maxValue }) => {
  const percentage = (value / maxValue) * 100;

  const getGradientColor = () => {
    if (percentage < 33) return '#34D399'; // Green
    if (percentage < 66) return '#FBBF24'; // Yellow
    return '#EF4444'; // Red
  };

  return (
    <div className="relative w-full h-8 mt-2">
      <div className="h-2 rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500"></div>
      <div
        className="absolute top-0 h-4 w-1 bg-white rounded-full transform -translate-x-1/2"
        style={{ 
          left: `${percentage}%`, 
          boxShadow: '0 0 5px rgba(255, 255, 255, 0.7)'
        }}
      ></div>
    </div>
  );
};

export default Gauge;
