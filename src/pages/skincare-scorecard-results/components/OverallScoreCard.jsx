import React from 'react';
import Icon from '../../../components/AppIcon';

const OverallScoreCard = ({ score, rating, improvement, insights, onGenerateCardClick, onExportWithHtml2Canvas, isGenerating, isSharedView }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-card border border-border rounded-clinical p-6">
      <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
        {/* Score Circle */}
        <div className="relative flex items-center justify-center">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted opacity-20" />
            <circle
              cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" fill="none"
              strokeLinecap="round" className={getScoreColor(score)}
              style={{ strokeDasharray: circumference, strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-heading font-heading-bold ${getScoreColor(score)}`}>{score}</span>
            <span className="text-sm font-caption font-caption-normal text-muted-foreground">out of 100</span>
          </div>
        </div>

        {/* Score Details & Insights */}
        <div className="flex-1 text-center lg:text-left lg:ml-8">
           <p className="text-muted-foreground font-body font-body-normal mb-4">
            Your skincare routine shows {rating?.toLowerCase()} compatibility and effectiveness.
            {improvement && ` ${improvement}`}
          </p>
          
          {/* Dynamic Routine Insights */}
          <div className="border-t border-border pt-4 mt-4">
            <h4 className="font-heading font-heading-medium text-sm text-foreground mb-3">Key Insights</h4>
            <div className="space-y-2">
              {insights?.map((insight, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <Icon name={insight.icon} size={16} className="text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-body font-body-normal text-muted-foreground">{insight.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        {!isSharedView && (
          <div className="w-full lg:w-auto flex flex-col space-y-2 lg:ml-6">
            <button 
              onClick={onExportWithHtml2Canvas} 
              disabled={isGenerating}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-clinical hover:bg-primary/90 transition-clinical w-full disabled:opacity-50"
            >
              {isGenerating ? <Icon name="Loader2" size={16} className="animate-spin" /> : <Icon name="Download" size={16} />}
              <span className="font-body font-body-medium text-sm">{isGenerating ? 'Exporting...' : 'Export'}</span>
            </button>
            <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-clinical hover:bg-secondary/80 transition-clinical w-full">
              <Icon name="Share2" size={16} />
              <span className="font-body font-body-medium text-sm">Share</span>
            </button>
            <button onClick={onGenerateCardClick} className="flex items-center justify-center space-x-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-clinical hover:bg-secondary/80 transition-clinical w-full">
              <Icon name="CreditCard" size={16} />
              <span className="font-body font-body-medium text-sm">Generate Card</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverallScoreCard;