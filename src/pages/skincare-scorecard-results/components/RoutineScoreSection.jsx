import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const RoutineScoreSection = ({ title, score, products, timeOfDay, insights, isExpanded: initialExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  const getScoreBadgeColor = (s) => {
    if (s >= 80) return 'bg-success text-success-foreground';
    if (s >= 60) return 'bg-warning text-warning-foreground';
    return 'bg-destructive text-destructive-foreground';
  };

  const getProductRatingIcon = (rating) => {
    switch (rating) {
      case 'Excellent': return 'Star';
      case 'Good': return 'ThumbsUp';
      case 'Fair': return 'Minus';
      default: return 'AlertTriangle';
    }
  };

  const getProductRatingColor = (rating) => {
    switch (rating) {
      case 'Excellent': return 'text-success';
      case 'Good': return 'text-primary';
      case 'Fair': return 'text-warning';
      default: return 'text-destructive';
    }
  };

  const scoreValue = score || 0;

  return (
    <div className="bg-card border border-border rounded-clinical overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 sm:p-6 hover:bg-secondary/50 transition-clinical"
      >
        <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
          <Icon 
            name={timeOfDay === 'morning' ? 'Sun' : 'Moon'} 
            size={24} 
            className="text-primary flex-shrink-0" 
          />
          <div className="text-left min-w-0">
            <h3 className="text-lg font-heading font-heading-semibold text-foreground truncate">
              {title}
            </h3>
            <p className="text-sm font-caption font-caption-normal text-muted-foreground">
              {products?.length} products analyzed
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3 pl-3">
          <div className={`px-3 py-1 rounded-clinical-sm font-data font-data-normal text-sm ${getScoreBadgeColor(scoreValue)}`}>
            {scoreValue}/100
          </div>
          <Icon 
            name={isExpanded ? "ChevronUp" : "ChevronDown"} 
            size={20} 
            className="text-muted-foreground flex-shrink-0" 
          />
        </div>
      </button>
      {isExpanded && (
        <div className="border-t border-border p-4 sm:p-6 space-y-4">
          {/* Products List */}
          <div className="space-y-3">
            {products?.map((product, index) => {
                const productRatingValue = product?.rating;
                const productScoreValue = product?.score;
                
                return (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-clinical">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <div className="w-12 h-12 bg-secondary rounded-clinical flex items-center justify-center flex-shrink-0">
                                <Icon name="Package" size={20} className="text-secondary-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-body font-body-medium text-sm text-foreground">
                                {product?.name}
                                </h4>
                                <p className="text-xs font-caption font-caption-normal text-muted-foreground">
                                {product?.category} • {product?.step}
                                </p>
                                {product?.issues && product?.issues?.length > 0 && (
                                <div className="flex items-center space-x-1 mt-1">
                                    <Icon name="AlertTriangle" size={12} className="text-warning" />
                                    <span className="text-xs text-warning">
                                    {product?.issues?.length} issue{product?.issues?.length > 1 ? 's' : ''}
                                    </span>
                                </div>
                                )}
                            </div>
                        </div>
                
                        <div className="flex items-center space-x-2 pl-2">
                            <Icon 
                                name={getProductRatingIcon(productRatingValue)} 
                                size={16} 
                                className={`${getProductRatingColor(productRatingValue)} flex-shrink-0`}
                            />
                            <span className={`text-sm font-data font-data-normal ${getProductRatingColor(productRatingValue)}`}>
                                {productScoreValue}/10
                            </span>
                        </div>
                    </div>
                )}
            )}
          </div>

          {/* Routine Insights - NOW DYNAMIC */}
          {insights && insights.length > 0 && (
            <div className="bg-secondary/50 rounded-clinical p-4">
              <h4 className="font-heading font-heading-medium text-sm text-foreground mb-2">
                Routine Insights
              </h4>
              <div className="space-y-2">
                {insights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Icon name={insight.icon || 'Info'} size={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm font-body font-body-normal text-foreground">
                      {insight.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RoutineScoreSection;
