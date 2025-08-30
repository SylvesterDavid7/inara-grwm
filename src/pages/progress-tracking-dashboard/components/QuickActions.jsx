import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = ({ className = "" }) => {
  const quickActions = [
    {
      id: 'log-routine',
      title: 'Log Today\'s Routine',
      description: 'Record your morning and evening skincare routine',
      icon: 'Plus',
      color: 'bg-primary text-primary-foreground',
      action: () => console.log('Log routine')
    },
    {
      id: 'upload-photo',
      title: 'Upload Progress Photo',
      description: 'Take a new progress photo to track improvements',
      icon: 'Camera',
      color: 'bg-accent text-accent-foreground',
      action: () => console.log('Upload photo')
    },
    {
      id: 'update-assessment',
      title: 'Update Skin Assessment',
      description: 'Reassess your current skin condition and concerns',
      icon: 'ClipboardList',
      color: 'bg-success text-success-foreground',
      action: () => console.log('Update assessment')
    },
    {
      id: 'schedule-review',
      title: 'Schedule Routine Review',
      description: 'Set up your next routine evaluation appointment',
      icon: 'Calendar',
      color: 'bg-warning text-warning-foreground',
      action: () => console.log('Schedule review')
    }
  ];

  return (
    <div className={`bg-card border border-border rounded-clinical p-6 shadow-clinical ${className}`}>
      <h3 className="font-heading font-heading-semibold text-lg text-card-foreground mb-6">
        Quick Actions
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quickActions?.map((action) => (
          <button
            key={action?.id}
            onClick={action?.action}
            className="group text-left p-4 rounded-clinical border border-border hover:border-primary/20 hover:shadow-clinical transition-clinical bg-background hover:bg-secondary/50"
          >
            <div className="flex items-start space-x-4">
              <div className={`flex items-center justify-center w-12 h-12 rounded-clinical ${action?.color} group-hover:scale-105 transition-clinical`}>
                <Icon name={action?.icon} size={20} />
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
                className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-clinical" 
              />
            </div>
          </button>
        ))}
      </div>
      {/* Additional Actions */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="font-body font-body-medium text-sm text-card-foreground">
            Need help with your routine?
          </span>
          <Button variant="outline" size="sm" iconName="HelpCircle" iconSize={16}>
            Get Support
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;