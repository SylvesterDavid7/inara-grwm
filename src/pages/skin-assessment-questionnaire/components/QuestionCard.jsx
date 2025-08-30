import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const QuestionCard = ({ 
  question, 
  currentAnswer, 
  onAnswerChange, 
  onNext, 
  onPrevious, 
  isFirst, 
  isLast,
  className = "" 
}) => {
  const renderQuestionInput = () => {
    switch (question?.type) {
      case 'single-select':
        return (
          <div className="space-y-3">
            {question?.options?.map((option) => (
              <button
                key={option?.value}
                onClick={() => onAnswerChange(option?.value)}
                className={`w-full p-4 rounded-clinical border-2 text-left transition-clinical ${
                  currentAnswer === option?.value
                    ? 'border-primary bg-primary/5 text-primary' :'border-border bg-card hover:border-primary/50 hover:bg-primary/5'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    currentAnswer === option?.value
                      ? 'border-primary bg-primary' :'border-muted-foreground'
                  }`}>
                    {currentAnswer === option?.value && (
                      <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-body font-body-medium text-sm text-card-foreground">
                      {option?.label}
                    </div>
                    {option?.description && (
                      <div className="font-caption font-caption-normal text-xs text-muted-foreground mt-1">
                        {option?.description}
                      </div>
                    )}
                  </div>
                  {option?.icon && (
                    <Icon name={option?.icon} size={20} className="text-muted-foreground" />
                  )}
                </div>
              </button>
            ))}
          </div>
        );

      case 'multi-select':
        const selectedValues = Array.isArray(currentAnswer) ? currentAnswer : [];
        return (
          <div className="space-y-3">
            {question?.options?.map((option) => (
              <div key={option?.value} className="flex items-start space-x-3 p-4 rounded-clinical border border-border bg-card">
                <Checkbox
                  checked={selectedValues?.includes(option?.value)}
                  onChange={(e) => {
                    const newValues = e?.target?.checked
                      ? [...selectedValues, option?.value]
                      : selectedValues?.filter(v => v !== option?.value);
                    onAnswerChange(newValues);
                  }}
                />
                <div className="flex-1">
                  <div className="font-body font-body-medium text-sm text-card-foreground">
                    {option?.label}
                  </div>
                  {option?.description && (
                    <div className="font-caption font-caption-normal text-xs text-muted-foreground mt-1">
                      {option?.description}
                    </div>
                  )}
                </div>
                {option?.icon && (
                  <Icon name={option?.icon} size={20} className="text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        );

      case 'slider':
        return (
          <div className="space-y-6">
            <div className="px-2">
              <input
                type="range"
                min={question?.min || 0}
                max={question?.max || 10}
                step={question?.step || 1}
                value={currentAnswer || question?.min || 0}
                onChange={(e) => onAnswerChange(parseInt(e?.target?.value))}
                className="w-full h-2 bg-muted rounded-clinical appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between mt-2">
                <span className="font-caption font-caption-normal text-xs text-muted-foreground">
                  {question?.minLabel || question?.min || 0}
                </span>
                <span className="font-data font-data-normal text-sm text-primary font-medium">
                  {currentAnswer || question?.min || 0}
                </span>
                <span className="font-caption font-caption-normal text-xs text-muted-foreground">
                  {question?.maxLabel || question?.max || 10}
                </span>
              </div>
            </div>
            {question?.scaleLabels && (
              <div className="grid grid-cols-3 gap-4 text-center">
                {question?.scaleLabels?.map((label, index) => (
                  <div key={index} className="font-caption font-caption-normal text-xs text-muted-foreground">
                    {label}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'image-select':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {question?.options?.map((option) => (
              <button
                key={option?.value}
                onClick={() => onAnswerChange(option?.value)}
                className={`relative p-3 rounded-clinical border-2 transition-clinical ${
                  currentAnswer === option?.value
                    ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                }`}
              >
                <div className="aspect-square rounded-clinical overflow-hidden mb-3">
                  <img
                    src={option?.image}
                    alt={option?.label}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="font-body font-body-medium text-sm text-card-foreground text-center">
                  {option?.label}
                </div>
                {currentAnswer === option?.value && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Icon name="Check" size={14} className="text-primary-foreground" />
                  </div>
                )}
              </button>
            ))}
          </div>
        );

      case 'text':
        return (
          <Input
            type="text"
            placeholder={question?.placeholder}
            value={currentAnswer || ''}
            onChange={(e) => onAnswerChange(e?.target?.value)}
            className="w-full"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={`bg-card border border-border rounded-clinical shadow-clinical p-6 ${className}`}>
      {/* Question Header */}
      <div className="mb-6">
        <h2 className="font-heading font-heading-semibold text-xl text-card-foreground mb-2">
          {question?.title}
        </h2>
        {question?.description && (
          <p className="font-body font-body-normal text-sm text-muted-foreground">
            {question?.description}
          </p>
        )}
        {question?.required && (
          <div className="flex items-center space-x-1 mt-2">
            <Icon name="AlertCircle" size={14} className="text-warning" />
            <span className="font-caption font-caption-normal text-xs text-warning">
              Required question
            </span>
          </div>
        )}
      </div>
      {/* Question Input */}
      <div className="mb-8">
        {renderQuestionInput()}
      </div>
      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={isFirst}
          iconName="ChevronLeft"
          iconPosition="left"
          iconSize={16}
        >
          Previous
        </Button>

        <Button
          variant="default"
          onClick={onNext}
          iconName={isLast ? "Check" : "ChevronRight"}
          iconPosition="right"
          iconSize={16}
        >
          {isLast ? "Complete" : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default QuestionCard;