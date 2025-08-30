import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const RoutinePreviewPanel = ({ 
  morningProducts = [], 
  eveningProducts = [], 
  weeklyTreatments = [],
  isCollapsed = false,
  onToggleCollapse = () => {},
  onAnalyze = () => {}
}) => {
  const getTotalProducts = () => {
    return morningProducts?.length + eveningProducts?.length + weeklyTreatments?.length;
  };

  const getRoutineCompleteness = () => {
    const totalSteps = 3; // Morning, Evening, Weekly
    let completedSteps = 0;
    
    if (morningProducts?.length > 0) completedSteps++;
    if (eveningProducts?.length > 0) completedSteps++;
    if (weeklyTreatments?.length > 0) completedSteps++;
    
    return Math.round((completedSteps / totalSteps) * 100);
  };

  const renderProductList = (products, title, emptyMessage) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-heading font-heading-medium text-sm text-foreground">
          {title}
        </h4>
        <span className="font-data font-data-normal text-xs text-muted-foreground">
          {products?.length} {products?.length === 1 ? 'product' : 'products'}
        </span>
      </div>
      
      {products?.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          <Icon name="Package" size={24} className="mx-auto mb-2 opacity-50" />
          <div className="font-caption font-caption-normal text-xs">
            {emptyMessage}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {products?.sort((a, b) => (parseInt(a?.order) || 999) - (parseInt(b?.order) || 999))?.map((product, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-muted/50 rounded-clinical border border-border/50"
              >
                {product?.image && (
                  <div className="w-8 h-8 rounded-clinical overflow-hidden flex-shrink-0">
                    <Image
                      src={product?.image}
                      alt={product?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-body font-body-medium text-sm text-foreground truncate">
                    {product?.name || 'Unnamed Product'}
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    {product?.order && (
                      <span className="font-data font-data-normal text-xs text-primary">
                        #{product?.order}
                      </span>
                    )}
                    {product?.frequency && (
                      <span className="font-caption font-caption-normal text-xs text-muted-foreground">
                        {product?.frequency?.replace('-', ' ')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );

  if (isCollapsed) {
    return (
      <div className="bg-card border border-border rounded-clinical shadow-clinical p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-clinical">
              <Icon name="Eye" size={20} className="text-primary" />
            </div>
            <div>
              <div className="font-body font-body-medium text-sm text-foreground">
                Routine Preview
              </div>
              <div className="font-caption font-caption-normal text-xs text-muted-foreground">
                {getTotalProducts()} products added
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            iconName="ChevronRight"
            iconSize={16}
          >
            <span className="sr-only">Expand preview</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-clinical shadow-clinical">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-clinical">
              <Icon name="Eye" size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-heading font-heading-medium text-base text-foreground">
                Routine Preview
              </h3>
              <div className="font-caption font-caption-normal text-xs text-muted-foreground">
                Live preview of your skincare routine
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            iconName="ChevronLeft"
            iconSize={16}
            className="lg:hidden"
          >
            <span className="sr-only">Collapse preview</span>
          </Button>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="font-body font-body-medium text-sm text-foreground">
            Routine Completeness
          </span>
          <span className="font-data font-data-normal text-sm text-primary">
            {getRoutineCompleteness()}%
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-clinical-slow"
            style={{ width: `${getRoutineCompleteness()}%` }}
          />
        </div>
        <div className="font-caption font-caption-normal text-xs text-muted-foreground mt-2">
          {getTotalProducts()} total products across all routines
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6 max-h-96 overflow-y-auto">
        {renderProductList(
          morningProducts,
          "Morning Routine",
          "No morning products added yet"
        )}
        
        {renderProductList(
          eveningProducts,
          "Evening Routine",
          "No evening products added yet"
        )}
        
        {renderProductList(
          weeklyTreatments,
          "Weekly Treatments",
          "No weekly treatments added yet"
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-border">
        <div className="space-y-3">
          <Button
            variant="default"
            fullWidth
            onClick={onAnalyze}
            disabled={getTotalProducts() === 0}
            iconName="Zap"
            iconPosition="left"
            iconSize={16}
          >
            Get AI Analysis
          </Button>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Save"
              iconPosition="left"
              iconSize={14}
            >
              Save Draft
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="RotateCcw"
              iconPosition="left"
              iconSize={14}
            >
              Clear All
            </Button>
          </div>
        </div>

        {getTotalProducts() === 0 && (
          <div className="mt-3 p-3 bg-muted/50 rounded-clinical border border-border/50">
            <div className="flex items-start space-x-2">
              <Icon name="Info" size={14} className="text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="font-caption font-caption-normal text-xs text-muted-foreground">
                Add products to your routine to enable AI analysis and get personalized recommendations.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutinePreviewPanel;