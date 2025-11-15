import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = ({ onAction, className = "" }) => {
  const quickActions = [
    {
      id: 'log-routine',
      title: 'Log Today\'s Routine',
      description: 'Record your morning and evening skincare routine',
      icon: 'Plus',
      color: 'bg-primary text-primary-foreground',
    },
    {
      id: 'upload-photo',
      title: 'Upload Progress Photo',
      description: 'Take a new progress photo to track improvements',
      icon: 'Camera',
      color: 'bg-accent text-accent-foreground',
    },
    {
      id: 'update-assessment',
      title: 'Update Skin Assessment',
      description: 'Reassess your current skin condition and concerns',
      icon: 'ClipboardList',
      color: 'bg-success text-success-foreground',
    },
    {
      id: 'schedule-review',
      title: 'Schedule Routine Review',
      description: 'Set up your next routine evaluation appointment',
      icon: 'Calendar',
      color: 'bg-warning text-warning-foreground',
    }
  ];

  return (
    <div className={`bg-card border border-border rounded-clinical p-4 sm:p-6 shadow-clinical ${className}`}>
      <h3 className="font-heading font-heading-semibold text-lg text-card-foreground mb-4 sm:mb-6">
        Quick Actions
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quickActions?.map((action) => (
          <button
            key={action?.id}
            onClick={() => onAction(action.id)}
            className="group text-left p-3 sm:p-4 rounded-clinical border border-border hover:border-primary/20 hover:shadow-clinical transition-clinical bg-background hover:bg-secondary/50"
          >
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-clinical ${action?.color} group-hover:scale-105 transition-clinical flex-shrink-0`}>
                <Icon name={action?.icon} size={18} sm:size={20} />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-body font-body-medium text-sm text-card-foreground group-hover:text-primary transition-clinical mb-1">
                  {action?.title}
                </h4>
                <p className="font-caption font-caption-normal text-xs text-muted-foreground">
                  {action?.description}
                </p>
              </div>
              
              <Icon 
                name="ArrowRight" 
                size={16} 
                className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-clinical mt-1"
              />
            </div>
          </button>
        ))}
      </div>
      {/* Additional Actions */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <span className="font-body font-body-medium text-sm text-card-foreground text-center sm:text-left">
            Need help with your routine?
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            iconName="HelpCircle" 
            iconSize={16} 
            className="w-full sm:w-auto"
            onClick={() => onAction('get-support')}
          >
            Get Support
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
