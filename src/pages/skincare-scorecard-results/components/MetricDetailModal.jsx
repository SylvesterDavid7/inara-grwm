import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricDetailModal = ({ isOpen, onClose, metric }) => {
  if (!isOpen || !metric) return null;

  const getMetricColor = (value, thresholds) => {
    if (value >= thresholds?.excellent) return 'text-success';
    if (value >= thresholds?.good) return 'text-primary';
    if (value >= thresholds?.fair) return 'text-warning';
    return 'text-destructive';
  };

  const colorClass = getMetricColor(metric.score, metric.thresholds);

  return (
    <div 
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-card border border-border rounded-clinical shadow-xl max-w-lg w-full animate-in fade-in-90 zoom-in-95"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Icon name={metric.icon} size={28} className={colorClass} />
              <div>
                <h3 className="text-lg font-heading font-heading-semibold text-foreground">{metric.title}</h3>
                <p className={`text-2xl font-heading font-heading-bold ${colorClass}`}>
                  {metric.score}{metric.suffix}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          {/* Explanation */}
          <div className="mt-4 pt-4 border-t border-border">
            <h4 className="font-semibold text-foreground mb-2">What this score means:</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {metric.explanation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricDetailModal;
