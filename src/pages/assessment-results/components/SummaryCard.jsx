import React from 'react';
import Icon from '../../../components/AppIcon';
import Gauge from './Gauge';

const SummaryCard = ({ icon, title, value, image }) => {
  const isSensitivityCard = title === 'Sensitivity';
  const isClimateCard = title === 'Climate';
  const isBudgetCard = title === 'Budget';
  const isRoutineStyleCard = title === 'Routine Style';
  const sensitivityValue = isSensitivityCard ? parseInt(value.split('/')[0]) : null;

  const getClimateIcon = (climate) => {
    if (climate.toLowerCase().includes('humid')) {
      return 'Cloud';
    }
    if (climate.toLowerCase().includes('dry')) {
      return 'Sun';
    }
    if (climate.toLowerCase().includes('temperate')) {
        return 'Thermometer';
    }
    if (climate.toLowerCase().includes('cold')) {
      return 'Moon';
    }
    return 'Thermometer';
  };

  const getRoutineStyleIcon = (routine) => {
    if (routine.toLowerCase().includes('minimal')) {
        return 'Plus';
    }
    if (routine.toLowerCase().includes('moderate')) {
        return 'ClipboardList';
    }
    if (routine.toLowerCase().includes('extensive')) {
        return 'BookOpen';
    }
    if (routine.toLowerCase().includes('inconsistent')) {
        return 'Beaker';
    }
    return 'Calendar';
  };

  const getIconName = () => {
    if (isClimateCard) {
      return getClimateIcon(value);
    }
    if (isBudgetCard) {
      return 'Wallet';
    }
    if (isRoutineStyleCard) {
        return getRoutineStyleIcon(value);
    }
    return icon;
  };

  const iconName = getIconName();

  return (
    <div className="glass-card-container relative h-44 rounded-lg p-px bg-gradient-to-b from-white/10 to-transparent overflow-visible">
      <div className="glass-card h-full rounded-lg p-6 flex flex-col bg-white/5 backdrop-blur-lg">
        <div className="flex items-start justify-between mb-4">
          <h3 className="font-body font-body-medium text-white/70">{title}</h3>
          <div className="p-2 bg-white/10 rounded-full">
            <Icon name={iconName} size={20} className="text-white" />
          </div>
        </div>
        
        <div className="mt-auto text-left">
            {isSensitivityCard && sensitivityValue !== null && (
              <Gauge value={sensitivityValue} maxValue={10} />
            )}
            {(isClimateCard || isBudgetCard || isRoutineStyleCard) && (
                <Icon name={iconName} size={32} className="text-white/70 mb-1" />
            )}
            <p className="font-heading font-heading-semibold text-2xl text-white">{value || 'N/A'}</p>
        </div>
      </div>
      {image && (
        <img
          src={image}
          alt={title}
          className="absolute -bottom-10 -right-12 w-72 h-72 object-contain z-10 transform scale-150"
        />
      )}
    </div>
  );
};

export default SummaryCard;
