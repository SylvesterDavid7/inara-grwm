import React from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const ProgressNavigation = ({ 
  steps = [], 
  currentStep = 0, 
  onStepClick = () => {}, 
  onPrevious = () => {}, 
  onNext = () => {},
  canNavigateToStep = () => true,
  showNavButtons = true,
  className = ""
}) => {
  const isStepCompleted = (stepIndex) => stepIndex < currentStep;
  const isStepCurrent = (stepIndex) => stepIndex === currentStep;
  const isStepAccessible = (stepIndex) => canNavigateToStep(stepIndex);

  return (
    <div className={`bg-background border-b border-border ${className}`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* Desktop Progress Indicators */}
        <div className="hidden md:flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {steps?.map((step, index) => (
              <div key={index} className="flex items-center">
                <button
                  onClick={() => isStepAccessible(index) && onStepClick(index)}
                  disabled={!isStepAccessible(index)}
                  className={`flex items-center space-x-3 px-4 py-2 rounded-clinical transition-clinical ${
                    isStepCurrent(index)
                      ? 'bg-primary text-primary-foreground'
                      : isStepCompleted(index)
                      ? 'bg-success text-success-foreground hover:bg-success/90'
                      : isStepAccessible(index)
                      ? 'bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground'
                      : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-data font-data-normal">
                    {isStepCompleted(index) ? (
                      <Icon name="Check" size={14} />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <span className="font-body font-body-medium text-sm">{step?.title}</span>
                </button>
                
                {index < steps?.length - 1 && (
                  <Icon 
                    name="ChevronRight" 
                    size={16} 
                    className="mx-2 text-muted-foreground" 
                  />
                )}
              </div>
            ))}
          </div>

          {/* Desktop Navigation Buttons */}
          {showNavButtons && (
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={onPrevious}
                disabled={currentStep === 0}
                iconName="ChevronLeft"
                iconPosition="left"
                iconSize={16}
              >
                Previous
              </Button>
              <Button
                variant="default"
                onClick={onNext}
                disabled={currentStep === steps?.length - 1}
                iconName="ChevronRight"
                iconPosition="right"
                iconSize={16}
              >
                Next
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Progress Display */}
        <div className="md:hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-data font-data-normal ${
                isStepCurrent(currentStep)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {currentStep + 1}
              </div>
              <div>
                <div className="font-body font-body-medium text-sm text-foreground">
                  {steps?.[currentStep]?.title}
                </div>
                <div className="font-caption font-caption-normal text-xs text-muted-foreground">
                  Step {currentStep + 1} of {steps?.length}
                </div>
              </div>
            </div>
            
            <div className="font-data font-data-normal text-xs text-muted-foreground">
              {Math.round(((currentStep + 1) / steps?.length) * 100)}%
            </div>
          </div>

          {/* Mobile Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2 mb-4">
            <div
              className="bg-primary h-2 rounded-full transition-clinical-slow"
              style={{ width: `${((currentStep + 1) / steps?.length) * 100}%` }}
            />
          </div>

          {/* Mobile Navigation Buttons */}
          {showNavButtons && (
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={onPrevious}
                disabled={currentStep === 0}
                iconName="ChevronLeft"
                iconPosition="left"
                iconSize={16}
              >
                Previous
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={onNext}
                disabled={currentStep === steps?.length - 1}
                iconName="ChevronRight"
                iconPosition="right"
                iconSize={16}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressNavigation;