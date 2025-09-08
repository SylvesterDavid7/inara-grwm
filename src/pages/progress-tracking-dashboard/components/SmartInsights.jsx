import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SmartInsights = ({ insights, className = "" }) => {
  const getInsightIcon = (type) => {
    switch (type) {
      case 'improvement': return 'TrendingUp';
      case 'concern': return 'AlertTriangle';
      case 'achievement': return 'Award';
      case 'recommendation': return 'Lightbulb';
      case 'milestone': return 'Target';
      default: return 'Info';
    }
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'improvement': return 'text-success bg-success/10 border-success/20';
      case 'concern': return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'achievement': return 'text-accent bg-accent/10 border-accent/20';
      case 'recommendation': return 'text-warning bg-warning/10 border-warning/20';
      case 'milestone': return 'text-primary bg-primary/10 border-primary/20';
      default: return 'text-muted-foreground bg-muted/10 border-muted/20';
    }
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      high: 'bg-destructive text-destructive-foreground',
      medium: 'bg-warning text-warning-foreground',
      low: 'bg-muted text-muted-foreground'
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-clinical text-xs font-caption font-caption-normal ${colors?.[priority]}`}>
        {priority?.charAt(0)?.toUpperCase() + priority?.slice(1)}
      </span>
    );
  };

  return (
    <div className={`bg-card border border-border rounded-clinical p-4 sm:p-6 shadow-clinical ${className}`}>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="font-heading font-heading-semibold text-lg text-card-foreground">
          Smart Insights
        </h3>
        <Button variant="outline" size="sm" iconName="RefreshCw" iconSize={16}>
          Refresh
        </Button>
      </div>
      <div className="space-y-4">
        {insights?.map((insight) => (
          <div
            key={insight?.id}
            className={`border rounded-clinical p-3 sm:p-4 transition-clinical hover:shadow-clinical ${getInsightColor(insight?.type)}`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                <Icon name={getInsightIcon(insight?.type)} size={18} sm:size={20} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2">
                  <h4 className="font-body font-body-medium text-sm text-card-foreground mb-1 sm:mb-0">
                    {insight?.title}
                  </h4>
                  <div className="flex items-center space-x-2">
                    {insight?.priority && getPriorityBadge(insight?.priority)}
                    <span className="font-caption font-caption-normal text-xs text-muted-foreground">
                      {insight?.date}
                    </span>
                  </div>
                </div>
                
                <p className="font-body font-body-normal text-sm text-muted-foreground mb-3">
                  {insight?.description}
                </p>

                {/* Metrics or Data */}
                {insight?.metrics && (
                  <div className="bg-background/50 rounded-clinical p-3 mb-3">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      {insight?.metrics?.map((metric, index) => (
                        <div key={index} className="text-center sm:text-left">
                          <div className="font-data font-data-normal text-base sm:text-lg text-card-foreground">
                            {metric?.value}
                          </div>
                          <div className="font-caption font-caption-normal text-xs text-muted-foreground">
                            {metric?.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Items */}
                {insight?.actions && insight?.actions?.length > 0 && (
                  <div className="space-y-2">
                    <span className="font-caption font-caption-normal text-xs text-muted-foreground">
                      Recommended Actions:
                    </span>
                    <div className="space-y-1">
                      {insight?.actions?.map((action, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Icon name="ArrowRight" size={12} className="text-muted-foreground" />
                          <span className="font-body font-body-normal text-sm text-card-foreground">
                            {action}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {insight?.actionButtons && (
                  <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-border">
                    {insight?.actionButtons?.map((button, index) => (
                      <Button
                        key={index}
                        variant={button?.variant || 'outline'}
                        size="sm"
                        onClick={button?.action}
                        iconName={button?.icon}
                        iconSize={14}
                      >
                        {button?.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* View All Insights */}
      <div className="mt-6 pt-6 border-t border-border text-center">
        <Button variant="outline" iconName="ArrowRight" iconPosition="right" iconSize={16}>
          View All Insights
        </Button>
      </div>
    </div>
  );
};

export default SmartInsights;