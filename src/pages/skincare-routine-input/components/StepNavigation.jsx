import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const StepNavigation = ({ 
  currentStep = 0, 
  steps = [], 
  onStepChange = () => {},
  onComplete = () => {},
  canNavigateToStep = () => true, 
}) => {
  const navigate = useNavigate();
  const isStepCompleted = (stepIndex) => stepIndex < currentStep;
  const isStepCurrent = (stepIndex) => stepIndex === currentStep;
  const isStepAccessible = (stepIndex) => canNavigateToStep(stepIndex);

  const handleNextOrComplete = () => {
    if (currentStep === steps.length - 1) {
      onComplete();
    } else {
      onStepChange(Math.min(steps.length - 1, currentStep + 1));
    }
  };

  return (
    <div className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* Desktop Step Navigation */}
        <div className="hidden md:flex items-center justify-center space-x-8">
          {steps?.map((step, index) => (
            <div key={index} className="flex items-center">
              <button
                onClick={() => isStepAccessible(index) && onStepChange(index)}
                disabled={!isStepAccessible(index)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-clinical transition-clinical ${
                  isStepCurrent(index)
                    ? 'bg-primary text-primary-foreground shadow-clinical'
                    : isStepCompleted(index)
                    ? 'bg-success text-success-foreground hover:bg-success/90'
                    : isStepAccessible(index)
                    ? 'bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground'
                    : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                }`}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-data font-data-normal">
                  {isStepCompleted(index) ? (
                    <Icon name="Check" size={16} />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="text-left">
                  <div className="font-body font-body-medium text-sm">
                    {step?.title}
                  </div>
                  <div className="font-caption font-caption-normal text-xs opacity-80">
                    {step?.description}
                  </div>
                </div>
              </button>
              
              {index < steps?.length - 1 && (
                <div className="mx-4">
                  <Icon 
                    name="ChevronRight" 
                    size={16} 
                    className="text-muted-foreground" 
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Step Navigation */}
        <div className="md:hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-data font-data-normal ${
                isStepCurrent(currentStep)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {isStepCompleted(currentStep) ? (
                  <Icon name="Check" size={18} />
                ) : (
                  <span>{currentStep + 1}</span>
                )}
              </div>
              <div>
                <div className="font-body font-body-medium text-base text-foreground">
                  {steps?.[currentStep]?.title}
                </div>
                <div className="font-caption font-caption-normal text-sm text-muted-foreground">
                  {steps?.[currentStep]?.description}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-data font-data-normal text-sm text-primary">
                {currentStep + 1} of {steps?.length}
              </div>
              <div className="font-caption font-caption-normal text-xs text-muted-foreground">
                {Math.round(((currentStep + 1) / steps?.length) * 100)}% complete
              </div>
            </div>
          </div>

          {/* Mobile Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2 mb-4">
            <div
              className="bg-primary h-2 rounded-full transition-clinical-slow"
              style={{ width: `${((currentStep + 1) / steps?.length) * 100}%` }}
            />
          </div>

          {/* Mobile Step Dots */}
          <div className="flex items-center justify-center space-x-2">
            {steps?.map((_, index) => (
              <button
                key={index}
                onClick={() => isStepAccessible(index) && onStepChange(index)}
                disabled={!isStepAccessible(index)}
                className={`w-3 h-3 rounded-full transition-clinical ${
                  isStepCurrent(index)
                    ? 'bg-primary'
                    : isStepCompleted(index)
                    ? 'bg-success'
                    : isStepAccessible(index)
                    ? 'bg-muted hover:bg-secondary' :'bg-muted opacity-50 cursor-not-allowed'
                }`}
              >
                <span className="sr-only">Go to step {index + 1}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => onStepChange(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            iconName="ChevronLeft"
            iconPosition="left"
            iconSize={16}
          >
            Previous
          </Button>

          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="Save"
              iconPosition="left"
              iconSize={14}
            >
              Save Draft
            </Button>
          </div>

          <Button
            variant="default"
            onClick={handleNextOrComplete}
            iconName={currentStep === steps.length - 1 ? 'Check' : 'ChevronRight'}
            iconPosition="right"
            iconSize={16}
          >
            {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepNavigation;
