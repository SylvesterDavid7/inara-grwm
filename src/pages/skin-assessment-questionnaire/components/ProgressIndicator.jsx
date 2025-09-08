import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressIndicator = ({ 
  currentStep, 
  totalSteps, 
  completedSteps = [],
  className = "" 
}) => {
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;
  const completedPercentage = (completedSteps?.length / totalSteps) * 100;

  return (
    <div className={`bg-background border-b border-border ${className}`}>
      <div className="max-w-4xl mx-auto px-6 py-4">
        {/* Desktop Progress */}
        <div className="hidden md:flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="ClipboardList" size={20} className="text-primary" />
            <span className="font-heading font-heading-medium text-lg text-foreground">
              Skin Assessment
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="font-data font-data-normal text-sm text-muted-foreground">
              Question {currentStep + 1} of {totalSteps}
            </span>
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span className="font-caption font-caption-normal text-xs text-success">
                {completedSteps?.length} completed
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Progress */}
        <div className="md:hidden mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Icon name="ClipboardList" size={18} className="text-primary" />
              <span className="font-heading font-heading-medium text-base text-foreground">
                Assessment
              </span>
            </div>
            <span className="font-data font-data-normal text-sm text-muted-foreground">
              {currentStep + 1}/{totalSteps}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-clinical-slow relative overflow-hidden"
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            </div>
          </div>
          
          {/* Completion Indicator */}
          {completedSteps?.length > 0 && (
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-1">
                <Icon name="Target" size={14} className="text-accent" />
                <span className="font-caption font-caption-normal text-xs text-accent">
                  {Math.round(completedPercentage)}% complete
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={14} className="text-muted-foreground" />
                <span className="font-caption font-caption-normal text-xs text-muted-foreground">
                  ~{Math.max(1, totalSteps - currentStep - 1)} min remaining
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Step Indicators (Desktop) */}
        <div className="hidden lg:flex items-center justify-center space-x-2 mt-4">
          {Array.from({ length: totalSteps }, (_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-clinical ${
                index <= currentStep
                  ? 'bg-primary'
                  : completedSteps?.includes(index)
                  ? 'bg-success' :'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
