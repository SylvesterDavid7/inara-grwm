import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressMetricsCard = ({ title, value, change, changeType, icon, description, className = "" }) => {
  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-success';
    if (changeType === 'negative') return 'text-destructive';
    return 'text-muted-foreground';
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') return 'TrendingUp';
    if (changeType === 'negative') return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className={`bg-card border border-border rounded-clinical p-4 sm:p-6 shadow-clinical ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-clinical">
              <Icon name={icon} size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-heading font-heading-medium text-sm text-muted-foreground uppercase tracking-wide">
                {title}
              </h3>
            </div>
          </div>
          
          <div className="mb-3">
            <div className="font-heading font-heading-semibold text-2xl text-card-foreground mb-1">
              {value}
            </div>
            {change && (
              <div className={`flex items-center space-x-1 ${getChangeColor()}`}>
                <Icon name={getChangeIcon()} size={14} />
                <span className="font-data font-data-normal text-sm">{change}</span>
                <span className="font-caption font-caption-normal text-xs">vs last period</span>
              </div>
            )}
          </div>
          
          {description && (
            <p className="font-body font-body-normal text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressMetricsCard;