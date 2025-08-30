import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const IngredientCompatibilityCard = ({ compatibilityData }) => {
  const [selectedConflict, setSelectedConflict] = useState(null);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'medium': return 'text-warning bg-warning/10 border-warning/20';
      case 'low': return 'text-primary bg-primary/10 border-primary/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return 'AlertTriangle';
      case 'medium': return 'AlertCircle';
      case 'low': return 'Info';
      default: return 'CheckCircle';
    }
  };

  const openConflictModal = (conflict) => {
    setSelectedConflict(conflict);
  };

  const closeConflictModal = () => {
    setSelectedConflict(null);
  };

  return (
    <>
      <div className="bg-card border border-border rounded-clinical p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Icon name="Zap" size={24} className="text-accent" />
            <div>
              <h3 className="text-lg font-heading font-heading-semibold text-foreground">
                Ingredient Compatibility
              </h3>
              <p className="text-sm font-caption font-caption-normal text-muted-foreground">
                {compatibilityData?.conflicts?.length} potential conflicts detected
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="px-3 py-1 bg-success/10 text-success rounded-clinical-sm">
              <span className="text-sm font-data font-data-normal">
                {compatibilityData?.safetyScore}% Safe
              </span>
            </div>
          </div>
        </div>

        {/* Compatibility Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-success/5 rounded-clinical border border-success/20">
            <Icon name="Shield" size={24} className="text-success mx-auto mb-2" />
            <div className="text-2xl font-heading font-heading-bold text-success">
              {compatibilityData?.safeIngredients}
            </div>
            <div className="text-sm font-caption font-caption-normal text-muted-foreground">
              Safe Combinations
            </div>
          </div>
          
          <div className="text-center p-4 bg-warning/5 rounded-clinical border border-warning/20">
            <Icon name="AlertTriangle" size={24} className="text-warning mx-auto mb-2" />
            <div className="text-2xl font-heading font-heading-bold text-warning">
              {compatibilityData?.cautionIngredients}
            </div>
            <div className="text-sm font-caption font-caption-normal text-muted-foreground">
              Use with Caution
            </div>
          </div>
          
          <div className="text-center p-4 bg-destructive/5 rounded-clinical border border-destructive/20">
            <Icon name="X" size={24} className="text-destructive mx-auto mb-2" />
            <div className="text-2xl font-heading font-heading-bold text-destructive">
              {compatibilityData?.conflictIngredients}
            </div>
            <div className="text-sm font-caption font-caption-normal text-muted-foreground">
              Avoid Together
            </div>
          </div>
        </div>

        {/* Conflicts List */}
        {compatibilityData?.conflicts?.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-heading font-heading-medium text-sm text-foreground">
              Detected Conflicts
            </h4>
            {compatibilityData?.conflicts?.map((conflict, index) => (
              <button
                key={index}
                onClick={() => openConflictModal(conflict)}
                className={`w-full text-left p-4 rounded-clinical border transition-clinical hover:shadow-clinical ${getSeverityColor(conflict?.severity)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <Icon 
                      name={getSeverityIcon(conflict?.severity)} 
                      size={20} 
                      className="mt-0.5 flex-shrink-0" 
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-body font-body-medium text-sm mb-1">
                        {conflict?.ingredient1} + {conflict?.ingredient2}
                      </div>
                      <div className="font-caption font-caption-normal text-xs opacity-80">
                        {conflict?.description}
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-xs font-data font-data-normal px-2 py-1 bg-background/50 rounded-clinical-sm">
                          {conflict?.severity?.toUpperCase()} RISK
                        </span>
                        <span className="text-xs font-caption font-caption-normal opacity-60">
                          Found in {conflict?.products?.join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Icon name="ChevronRight" size={16} className="mt-1 flex-shrink-0" />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* No Conflicts State */}
        {compatibilityData?.conflicts?.length === 0 && (
          <div className="text-center py-8">
            <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-4" />
            <h4 className="font-heading font-heading-medium text-lg text-foreground mb-2">
              No Conflicts Detected
            </h4>
            <p className="text-muted-foreground font-body font-body-normal">
              Your routine ingredients work well together!
            </p>
          </div>
        )}
      </div>
      {/* Conflict Detail Modal */}
      {selectedConflict && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-modal flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-clinical max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-heading font-heading-semibold text-foreground">
                  Ingredient Conflict Details
                </h3>
                <button
                  onClick={closeConflictModal}
                  className="p-2 hover:bg-secondary rounded-clinical transition-clinical"
                >
                  <Icon name="X" size={20} className="text-muted-foreground" />
                </button>
              </div>

              <div className={`p-4 rounded-clinical border mb-4 ${getSeverityColor(selectedConflict?.severity)}`}>
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name={getSeverityIcon(selectedConflict?.severity)} size={20} />
                  <span className="font-body font-body-medium text-sm">
                    {selectedConflict?.ingredient1} + {selectedConflict?.ingredient2}
                  </span>
                </div>
                <p className="text-sm font-body font-body-normal">
                  {selectedConflict?.detailedDescription}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-heading font-heading-medium text-sm text-foreground mb-2">
                    Why This Matters
                  </h4>
                  <p className="text-sm font-body font-body-normal text-muted-foreground">
                    {selectedConflict?.explanation}
                  </p>
                </div>

                <div>
                  <h4 className="font-heading font-heading-medium text-sm text-foreground mb-2">
                    Recommendations
                  </h4>
                  <ul className="space-y-2">
                    {selectedConflict?.recommendations?.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Icon name="ArrowRight" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm font-body font-body-normal text-muted-foreground">
                          {rec}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={closeConflictModal}
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-clinical hover:bg-primary/90 transition-clinical"
                  >
                    <span className="font-body font-body-medium text-sm">Got It</span>
                  </button>
                  <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-clinical hover:bg-secondary/80 transition-clinical">
                    <span className="font-body font-body-medium text-sm">Learn More</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IngredientCompatibilityCard;