import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsDashboard = ({ metrics }) => {
  const getMetricColor = (value, thresholds) => {
    if (value >= thresholds?.excellent) return 'text-success';
    if (value >= thresholds?.good) return 'text-primary';
    if (value >= thresholds?.fair) return 'text-warning';
    return 'text-destructive';
  };

  const getMetricBackground = (value, thresholds) => {
    if (value >= thresholds?.excellent) return 'bg-success/10 border-success/20';
    if (value >= thresholds?.good) return 'bg-primary/10 border-primary/20';
    if (value >= thresholds?.fair) return 'bg-warning/10 border-warning/20';
    return 'bg-destructive/10 border-destructive/20';
  };

  const metricConfigs = [
    {
      key: 'effectiveness',
      title: 'Routine Effectiveness',
      icon: 'TrendingUp',
      suffix: '%',
      thresholds: { excellent: 85, good: 70, fair: 50 }
    },
    {
      key: 'safety',
      title: 'Ingredient Safety',
      icon: 'Shield',
      suffix: '%',
      thresholds: { excellent: 90, good: 80, fair: 60 }
    },
    {
      key: 'goalAlignment',
      title: 'Skin Goal Alignment',
      icon: 'Target',
      suffix: '%',
      thresholds: { excellent: 80, good: 65, fair: 45 }
    },
    {
      key: 'costEfficiency',
      title: 'Cost Efficiency',
      icon: 'DollarSign',
      suffix: '/10',
      thresholds: { excellent: 8, good: 6, fair: 4 }
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metricConfigs?.map((config) => {
        const value = metrics?.[config?.key];
        const colorClass = getMetricColor(value, config?.thresholds);
        const backgroundClass = getMetricBackground(value, config?.thresholds);
        
        return (
          <div
            key={config?.key}
            className={`bg-card border rounded-clinical p-6 transition-clinical hover:shadow-clinical ${backgroundClass}`}
          >
            <div className="flex items-center justify-between mb-4">
              <Icon name={config?.icon} size={24} className={colorClass} />
              <div className={`text-2xl font-heading font-heading-bold ${colorClass}`}>
                {value}{config?.suffix}
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-body font-body-medium text-sm text-foreground">
                {config?.title}
              </h4>
              
              {/* Progress Bar */}
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-clinical-slow ${
                    value >= config?.thresholds?.excellent ? 'bg-success' :
                    value >= config?.thresholds?.good ? 'bg-primary' :
                    value >= config?.thresholds?.fair ? 'bg-warning' : 'bg-destructive'
                  }`}
                  style={{ 
                    width: `${config?.suffix === '%' ? value : (value / 10) * 100}%` 
                  }}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs font-caption font-caption-normal text-muted-foreground">
                  {value >= config?.thresholds?.excellent ? 'Excellent' :
                   value >= config?.thresholds?.good ? 'Good' :
                   value >= config?.thresholds?.fair ? 'Fair' : 'Needs Improvement'}
                </span>
                <button className="text-xs text-primary hover:text-primary/80 transition-clinical">
                  Details
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MetricsDashboard;