import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AssessmentSummary = ({ 
  answers, 
  questions, 
  onEdit, 
  onComplete, 
  className = "" 
}) => {
  const getAnswerDisplay = (question, answer) => {
    if (!answer) return 'Not answered';

    switch (question?.type) {
      case 'single-select': case'image-select':
        const option = question?.options?.find(opt => opt?.value === answer);
        return option ? option?.label : answer;
      
      case 'multi-select':
        if (!Array.isArray(answer)) return 'Not answered';
        return answer?.map(value => {
          const option = question?.options?.find(opt => opt?.value === value);
          return option ? option?.label : value;
        })?.join(', ');
      
      case 'slider':
        return `${answer}${question?.unit || ''}`;
      
      case 'text':
        return answer;
      
      default:
        return String(answer);
    }
  };

  const completedQuestions = questions?.filter((_, index) => answers?.[index] !== undefined);
  const completionRate = Math.round((completedQuestions?.length / questions?.length) * 100);

  return (
    <div className={`bg-card border border-border rounded-clinical shadow-clinical ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading font-heading-semibold text-xl text-card-foreground">
              Assessment Summary
            </h2>
            <p className="font-body font-body-normal text-sm text-muted-foreground mt-1">
              Review your responses before completing the assessment
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`px-3 py-1 rounded-clinical text-xs font-data font-data-normal ${
              completionRate === 100
                ? 'bg-success/10 text-success'
                : completionRate >= 80
                ? 'bg-warning/10 text-warning' :'bg-muted text-muted-foreground'
            }`}>
              {completionRate}% Complete
            </div>
          </div>
        </div>
      </div>
      {/* Summary Content */}
      <div className="p-6">
        <div className="space-y-6">
          {questions?.map((question, index) => {
            const answer = answers?.[index];
            const isAnswered = answer !== undefined;

            return (
              <div key={index} className="flex items-start space-x-4 p-4 rounded-clinical bg-muted/30">
                <div className="flex-shrink-0 mt-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-data font-data-normal ${
                    isAnswered
                      ? 'bg-success text-success-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {isAnswered ? (
                      <Icon name="Check" size={14} />
                    ) : (
                      index + 1
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-body font-body-medium text-sm text-card-foreground">
                        {question?.title}
                      </h3>
                      <div className={`mt-1 font-body font-body-normal text-sm ${
                        isAnswered ? 'text-card-foreground' : 'text-muted-foreground italic'
                      }`}>
                        {getAnswerDisplay(question, answer)}
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(index)}
                      iconName="Edit2"
                      iconSize={14}
                      className="ml-2 flex-shrink-0"
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Completion Status */}
        <div className="mt-8 p-4 rounded-clinical bg-primary/5 border border-primary/20">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={20} className="text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-body font-body-medium text-sm text-primary mb-1">
                Assessment Status
              </h4>
              <p className="font-body font-body-normal text-sm text-card-foreground">
                You've completed {completedQuestions?.length} out of {questions?.length} questions. 
                {completionRate < 100 && (
                  <span className="text-muted-foreground">
                    {' '}While you can proceed with incomplete responses, answering all questions will provide more accurate recommendations.
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-8 pt-6 border-t border-border space-y-3 sm:space-y-0 sm:space-x-4">
          <Button
            variant="outline"
            onClick={() => onEdit(0)}
            iconName="ArrowLeft"
            iconPosition="left"
            iconSize={16}
            className="w-full sm:w-auto"
          >
            Review Answers
          </Button>

          <Button
            variant="default"
            onClick={onComplete}
            iconName="CheckCircle"
            iconPosition="right"
            iconSize={16}
            className="w-full sm:w-auto bg-success hover:bg-success/90"
          >
            Complete Assessment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentSummary;