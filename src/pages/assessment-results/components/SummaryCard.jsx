
import React from 'react';
import Icon from '../../../components/AppIcon';

const SummaryCard = ({ icon, title, value }) => {
  return (
    <div className="glass-card-container h-44 rounded-lg p-px bg-gradient-to-b from-white/10 to-transparent">
      <div className="glass-card h-full rounded-lg p-6 flex flex-col bg-white/5 backdrop-blur-lg">
        <div className="flex items-start justify-between mb-4">
          <h3 className="font-body font-body-medium text-white/70">{title}</h3>
          <div className="p-2 bg-white/10 rounded-full">
            <Icon name={icon} size={20} className="text-white" />
          </div>
        </div>
        <p className="font-heading font-heading-semibold text-2xl text-white mt-auto">{value || 'N/A'}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
