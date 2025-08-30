import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuestionNavigation = ({ 
  questions, 
  currentQuestion, 
  answers,
  onQuestionSelect,
  className = "" 
}) => {
  const getQuestionStatus = (index) => {
    if (answers?.[index] !== undefined) return 'completed';
    if (index === currentQuestion) return 'current';
    if (index < currentQuestion) return 'skipped';
    return 'upcoming';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return 'CheckCircle';
      case 'current':
        return 'Circle';
      case 'skipped':
        return 'AlertCircle';
      default:
        return 'Circle';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success';
      case 'current':
        return 'text-primary';
      case 'skipped':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className={`bg-card border border-border rounded-clinical shadow-clinical ${className}`}>
      <div className="p-4 border-b border-border">
        <h3 className="font-heading font-heading-medium text-base text-card-foreground">
          Question Navigation
        </h3>
        <p className="font-caption font-caption-normal text-xs text-muted-foreground mt-1">
          Jump to any question or track your progress
        </p>
      </div>
      <div className="p-4">
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {questions?.map((question, index) => {
            const status = getQuestionStatus(index);
            const isClickable = index <= currentQuestion || answers?.[index] !== undefined;

            return (
              <button
                key={index}
                onClick={() => isClickable && onQuestionSelect(index)}
                disabled={!isClickable}
                className={`w-full flex items-center space-x-3 p-3 rounded-clinical text-left transition-clinical ${
                  status === 'current' ?'bg-primary/10 border border-primary/20'
                    : isClickable
                    ? 'hover:bg-muted/50' :'opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex-shrink-0">
                  <Icon 
                    name={getStatusIcon(status)} 
                    size={16} 
                    className={getStatusColor(status)} 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-data font-data-normal text-xs text-muted-foreground">
                      Q{index + 1}
                    </span>
                    <span className={`font-body font-body-medium text-sm truncate ${
                      status === 'current' ? 'text-primary' : 'text-card-foreground'
                    }`}>
                      {question?.title}
                    </span>
                  </div>
                  
                  {answers?.[index] !== undefined && (
                    <div className="font-caption font-caption-normal text-xs text-success mt-1">
                      Answered
                    </div>
                  )}
                </div>
                {status === 'current' && (
                  <Icon name="ChevronRight" size={14} className="text-primary flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-4 pt-4 border-t border-border space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onQuestionSelect(0)}
            iconName="SkipBack"
            iconPosition="left"
            iconSize={14}
            className="w-full justify-start"
          >
            Go to First Question
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const nextUnanswered = questions?.findIndex((_, index) => answers?.[index] === undefined);
              if (nextUnanswered !== -1) {
                onQuestionSelect(nextUnanswered);
              }
            }}
            iconName="AlertCircle"
            iconPosition="left"
            iconSize={14}
            className="w-full justify-start"
            disabled={!questions?.some((_, index) => answers?.[index] === undefined)}
          >
            Next Unanswered
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestionNavigation;