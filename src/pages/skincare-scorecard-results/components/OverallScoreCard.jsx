import React from 'react';
import Icon from '../../../components/AppIcon';

const OverallScoreCard = ({ score, rating, improvement }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBackground = (score) => {
    if (score >= 80) return 'bg-success/10';
    if (score >= 60) return 'bg-warning/10';
    return 'bg-destructive/10';
  };

  const getRatingIcon = (rating) => {
    switch (rating) {
      case 'Excellent': return 'Star';
      case 'Good': return 'ThumbsUp';
      case 'Fair': return 'AlertTriangle';
      default: return 'AlertCircle';
    }
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`bg-card border border-border rounded-clinical p-6 ${getScoreBackground(score)}`}>
      <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
        {/* Score Circle */}
        <div className="relative flex items-center justify-center">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted opacity-20"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              className={getScoreColor(score)}
              style={{
                strokeDasharray,
                strokeDashoffset,
                transition: 'stroke-dashoffset 1s ease-in-out'
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-heading font-heading-bold ${getScoreColor(score)}`}>
              {score}
            </span>
            <span className="text-sm font-caption font-caption-normal text-muted-foreground">
              out of 100
            </span>
          </div>
        </div>

        {/* Score Details */}
        <div className="flex-1 text-center lg:text-left lg:ml-8">
          <div className="flex items-center justify-center lg:justify-start space-x-2 mb-2">
            <Icon 
              name={getRatingIcon(rating)} 
              size={24} 
              className={getScoreColor(score)} 
            />
            <h2 className="text-2xl font-heading font-heading-bold text-foreground">
              {rating} Routine
            </h2>
          </div>
          
          <p className="text-muted-foreground font-body font-body-normal mb-4">
            Your skincare routine shows {rating?.toLowerCase()} compatibility and effectiveness. 
            {improvement && ` ${improvement}`}
          </p>

          <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
            <div className="flex items-center space-x-1 px-3 py-1 bg-secondary rounded-clinical-sm">
              <Icon name="Shield" size={16} className="text-accent" />
              <span className="text-sm font-caption font-caption-normal text-secondary-foreground">
                Ingredient Safe
              </span>
            </div>
            <div className="flex items-center space-x-1 px-3 py-1 bg-secondary rounded-clinical-sm">
              <Icon name="Clock" size={16} className="text-primary" />
              <span className="text-sm font-caption font-caption-normal text-secondary-foreground">
                Routine Optimized
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col space-y-2 lg:ml-6">
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-clinical hover:bg-primary/90 transition-clinical">
            <Icon name="Download" size={16} />
            <span className="font-body font-body-medium text-sm">Export PDF</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-accent text-accent-foreground rounded-clinical hover:bg-accent/90 transition-clinical">
            <Icon name="Share2" size={16} />
            <span className="font-body font-body-medium text-sm">Share Results</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OverallScoreCard;