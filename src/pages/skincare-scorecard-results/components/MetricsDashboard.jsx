import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import MetricDetailModal from './MetricDetailModal'; // Import the modal

const MetricsDashboard = ({ metrics }) => {
  const [modalMetric, setModalMetric] = useState(null);

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

  // Corrected keys to match the API response (PascalCase)
  const metricConfigs = [
    {
      key: 'Effectiveness',
      title: 'Routine Effectiveness',
      icon: 'TrendingUp',
      suffix: '%',
      thresholds: { excellent: 85, good: 70, fair: 50 },
    },
    {
      key: 'Safety',
      title: 'Ingredient Safety',
      icon: 'Shield',
      suffix: '%',
      thresholds: { excellent: 90, good: 80, fair: 60 },
    },
    {
      key: 'Goal Alignment',
      title: 'Skin Goal Alignment',
      icon: 'Target',
      suffix: '%',
      thresholds: { excellent: 80, good: 65, fair: 45 },
    },
    {
      key: 'Routine Consistency',
      title: 'Routine Consistency',
      icon: 'Repeat',
      suffix: '%',
      thresholds: { excellent: 90, good: 75, fair: 50 },
    },
  ];

  const handleMetricClick = (config) => {
    const metricData = metrics?.[config.key];
    if (metricData && metricData.explanation) {
      setModalMetric({ ...config, ...metricData, score: metricData.score, rating: metricData.rating });
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricConfigs.map((config) => {
          const metricData = metrics?.[config.key];
          const value = metricData?.score; // Use .score as returned by the API
          const rating = metricData?.rating; // Use .rating as returned by the API
          const colorClass = getMetricColor(value, config.thresholds);
          const backgroundClass = getMetricBackground(value, config.thresholds);

          return (
            <button
              key={config.key}
              onClick={() => handleMetricClick(config)}
              disabled={!metricData}
              className={`w-full text-left bg-card border rounded-clinical p-6 transition-clinical hover:shadow-clinical focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed ${backgroundClass}`}
            >
              <div className="flex items-center justify-between mb-4">
                <Icon name={config.icon} size={24} className={colorClass} />
                <div className={`text-2xl font-heading font-heading-bold ${colorClass}`}>
                  {value !== undefined ? `${value}${config.suffix}` : 'N/A'}
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-body font-body-medium text-sm text-foreground">
                  {config.title}
                </h4>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-clinical-slow ${
                      getMetricColor(value, { excellent: 100, good: config.thresholds.good, fair: config.thresholds.fair, destructive: 0 }).replace('text-', 'bg-')
                    }`}
                    style={{
                      width: `${value !== undefined ? value : 0}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-caption font-caption-normal text-muted-foreground">
                    {rating || 'Not available'}
                  </span>
                  {metricData?.explanation && <span className="text-xs text-primary font-semibold">Details</span>}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <MetricDetailModal 
        isOpen={!!modalMetric}
        onClose={() => setModalMetric(null)}
        metric={modalMetric}
      />
    </>
  );
};

export default MetricsDashboard;
