import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GoalProgressWidget = ({ goals, className = "" }) => {
  const getProgressColor = (progress) => {
    if (progress >= 90) return 'bg-success';
    if (progress >= 70) return 'bg-accent';
    if (progress >= 50) return 'bg-warning';
    return 'bg-destructive/60';
  };

  const getProgressTextColor = (progress) => {
    if (progress >= 90) return 'text-success';
    if (progress >= 70) return 'text-accent';
    if (progress >= 50) return 'text-warning';
    return 'text-destructive';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle2';
      case 'on-track': return 'TrendingUp';
      case 'behind': return 'AlertTriangle';
      case 'at-risk': return 'AlertCircle';
      default: return 'Circle';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'on-track': return 'text-accent';
      case 'behind': return 'text-warning';
      case 'at-risk': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className={`bg-card border border-border rounded-clinical p-4 sm:p-6 shadow-clinical ${className}`}>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="font-heading font-heading-semibold text-lg text-card-foreground">
          Goal Progress
        </h3>
        <Button variant="outline" size="sm" iconName="Plus" iconSize={16}>
          Add Goal
        </Button>
      </div>
      <div className="space-y-4 sm:space-y-6">
        {goals?.map((goal) => (
          <div key={goal?.id} className="space-y-3">
            {/* Goal Header */}
            <div className="flex flex-col sm:flex-row items-start justify-between">
              <div className="flex-1 mb-2 sm:mb-0">
                <div className="flex items-center space-x-2 mb-1">
                  <Icon 
                    name={getStatusIcon(goal?.status)} 
                    size={16} 
                    className={getStatusColor(goal?.status)} 
                  />
                  <h4 className="font-body font-body-medium text-sm text-card-foreground">
                    {goal?.title}
                  </h4>
                </div>
                <p className="font-caption font-caption-normal text-xs text-muted-foreground">
                  Target: {goal?.target} | Deadline: {goal?.deadline}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <div className={`font-data font-data-normal text-sm ${getProgressTextColor(goal?.progress)}`}>
                  {goal?.progress}%
                </div>
                <div className="font-caption font-caption-normal text-xs text-muted-foreground capitalize">
                  {goal?.status?.replace('-', ' ')}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-clinical-slow ${getProgressColor(goal?.progress)}`}
                style={{ width: `${goal?.progress}%` }}
              />
            </div>

            {/* Goal Details */}
            <div className="bg-muted/50 rounded-clinical p-3">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-caption font-caption-normal text-muted-foreground">Current</span>
                  <div className="font-data font-data-normal text-foreground">{goal?.current}</div>
                </div>
                <div>
                  <span className="font-caption font-caption-normal text-muted-foreground">Remaining</span>
                  <div className="font-data font-data-normal text-foreground">{goal?.remaining}</div>
                </div>
              </div>
              
              {goal?.milestones && goal?.milestones?.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border">
                  <span className="font-caption font-caption-normal text-xs text-muted-foreground mb-2 block">
                    Recent Milestones
                  </span>
                  <div className="space-y-1">
                    {goal?.milestones?.slice(0, 2)?.map((milestone, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Icon name="Check" size={12} className="text-success" />
                        <span className="font-caption font-caption-normal text-xs text-foreground">
                          {milestone?.title}
                        </span>
                        <span className="font-caption font-caption-normal text-xs text-muted-foreground">
                          {milestone?.date}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex flex-wrap items-center justify-around gap-4 text-center">
          <div>
            <div className="font-data font-data-normal text-lg text-success">
              {goals?.filter(g => g?.status === 'completed')?.length}
            </div>
            <div className="font-caption font-caption-normal text-xs text-muted-foreground">
              Completed
            </div>
          </div>
          <div>
            <div className="font-data font-data-normal text-lg text-accent">
              {goals?.filter(g => g?.status === 'on-track')?.length}
            </div>
            <div className="font-caption font-caption-normal text-xs text-muted-foreground">
              On Track
            </div>
          </div>
          <div>
            <div className="font-data font-data-normal text-lg text-warning">
              {goals?.filter(g => ['behind', 'at-risk']?.includes(g?.status))?.length}
            </div>
            <div className="font-caption font-caption-normal text-xs text-muted-foreground">
              Need Attention
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalProgressWidget;