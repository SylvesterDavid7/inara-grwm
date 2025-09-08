import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StepNavigation from './components/StepNavigation';
import RoutineStepContent from './components/RoutineStepContent';
import RoutinePreviewPanel from './components/RoutinePreviewPanel';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const SkincareRoutineInput = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPreviewCollapsed, setIsPreviewCollapsed] = useState(false);
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Routine data state
  const [morningProducts, setMorningProducts] = useState([]);
  const [eveningProducts, setEveningProducts] = useState([]);
  const [weeklyTreatments, setWeeklyTreatments] = useState([]);

  const steps = [
    {
      title: 'Morning Routine',
      description: 'Products you use in the morning',
      icon: 'Sun',
      guidelines: [
        'Start with cleanser, then apply products from thinnest to thickest consistency',
        'Always end with sunscreen during the day',
        'Wait 10-15 minutes between active ingredients',
        'Vitamin C serums work best in the morning for antioxidant protection'
      ]
    },
    {
      title: 'Evening Routine',
      description: 'Products you use at night',
      icon: 'Moon',
      guidelines: [
        'Double cleanse if you wear makeup or sunscreen',
        'Evening is ideal for active ingredients like retinoids and AHA/BHA',
        'Use heavier moisturizers at night for repair and hydration',
        'Avoid photosensitizing ingredients that make skin sun-sensitive'
      ]
    },
    {
      title: 'Weekly Treatments',
      description: 'Special treatments and masks',
      icon: 'Sparkles',
      guidelines: [
        'Face masks should be used 1-3 times per week depending on skin type',
        'Exfoliating treatments should not exceed 2-3 times per week',
        'Always patch test new treatments before full application',
        'Schedule treatments on days when you\'re not using other actives'
      ]
    }
  ];

  // Auto-save functionality
  useEffect(() => {
    const saveData = {
      morningProducts,
      eveningProducts,
      weeklyTreatments,
      currentStep,
      timestamp: new Date()?.toISOString()
    };
    
    localStorage.setItem('skincare-routine-draft', JSON.stringify(saveData));
    setLastSaved(new Date());
  }, [morningProducts, eveningProducts, weeklyTreatments, currentStep]);

  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('skincare-routine-draft');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setMorningProducts(parsed?.morningProducts || []);
        setEveningProducts(parsed?.eveningProducts || []);
        setWeeklyTreatments(parsed?.weeklyTreatments || []);
        setCurrentStep(parsed?.currentStep || 0);
        setLastSaved(new Date(parsed.timestamp));
      } catch (error) {
        console.error('Error loading saved routine:', error);
      }
    }
  }, []);

  const getCurrentStepProducts = () => {
    switch (currentStep) {
      case 0: return morningProducts;
      case 1: return eveningProducts;
      case 2: return weeklyTreatments;
      default: return [];
    }
  };

  const updateCurrentStepProducts = (products) => {
    switch (currentStep) {
      case 0: setMorningProducts(products); break;
      case 1: setEveningProducts(products); break;
      case 2: setWeeklyTreatments(products); break;
    }
  };

  const canNavigateToStep = (stepIndex) => {
    // Allow navigation to any step for flexibility
    return true;
  };

  const handleStepChange = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  const handleAnalyze = () => {
    const totalProducts = morningProducts?.length + eveningProducts?.length + weeklyTreatments?.length;
    
    if (totalProducts === 0) {
      alert('Please add at least one product to your routine before analyzing.');
      return;
    }

    // Save current state before navigating
    const analysisData = {
      morningProducts,
      eveningProducts,
      weeklyTreatments,
      timestamp: new Date()?.toISOString()
    };
    
    localStorage.setItem('skincare-analysis-data', JSON.stringify(analysisData));
    navigate('/skincare-scorecard-results');
  };

  const handleClearAll = () => {
    setShowClearConfirmation(true);
  };

  const confirmClearAll = () => {
    setMorningProducts([]);
    setEveningProducts([]);
    setWeeklyTreatments([]);
    setCurrentStep(0);
    setShowClearConfirmation(false);
    localStorage.removeItem('skincare-routine-draft');
  };

  const handleSaveDraft = () => {
    // Manual save with user feedback
    const saveData = {
      morningProducts,
      eveningProducts,
      weeklyTreatments,
      currentStep,
      timestamp: new Date()?.toISOString()
    };
    
    localStorage.setItem('skincare-routine-draft', JSON.stringify(saveData));
    setLastSaved(new Date());
    
    // Show success message
    alert('Routine draft saved successfully!');
  };

  const getTotalProducts = () => {
    return morningProducts?.length + eveningProducts?.length + weeklyTreatments?.length;
  };

  // Mobile responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsPreviewCollapsed(true);
      } else {
        setIsPreviewCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Navigation */}
      <StepNavigation
        currentStep={currentStep}
        steps={steps}
        onStepChange={handleStepChange}
        canNavigateToStep={canNavigateToStep}
      />
      {/* Main Content */}
      <div className="flex-1">
        <div className="lg:grid lg:grid-cols-4 lg:gap-6 lg:max-w-7xl lg:mx-auto lg:px-6">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <RoutineStepContent
              step={steps?.[currentStep]}
              products={getCurrentStepProducts()}
              onProductsChange={updateCurrentStepProducts}
              stepIndex={currentStep}
            />
          </div>

          {/* Side Preview Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 p-6 lg:p-0">
              <RoutinePreviewPanel
                morningProducts={morningProducts}
                eveningProducts={eveningProducts}
                weeklyTreatments={weeklyTreatments}
                isCollapsed={isPreviewCollapsed}
                onToggleCollapse={() => setIsPreviewCollapsed(!isPreviewCollapsed)}
                onAnalyze={handleAnalyze}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Action Bar - Mobile */}
      <div className="lg:hidden sticky bottom-0 bg-background border-t border-border p-4">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSaveDraft}
              iconName="Save"
              iconSize={14}
            >
              Save
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              iconName="RotateCcw"
              iconSize={14}
            >
              Clear
            </Button>
          </div>
          
          <Button
            variant="default"
            onClick={handleAnalyze}
            disabled={getTotalProducts() === 0}
            iconName="Zap"
            iconPosition="left"
            iconSize={16}
          >
            Analyze ({getTotalProducts()})
          </Button>
        </div>
      </div>
      {/* Auto-save Indicator */}
      {lastSaved && (
        <div className="fixed bottom-20 lg:bottom-6 right-6 bg-card border border-border rounded-clinical shadow-clinical px-3 py-2">
          <div className="flex items-center space-x-2">
            <Icon name="Check" size={14} className="text-success" />
            <span className="font-caption font-caption-normal text-xs text-muted-foreground">
              Saved {lastSaved?.toLocaleTimeString()}
            </span>
          </div>
        </div>
      )}
      {/* Clear Confirmation Modal */}
      {showClearConfirmation && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-clinical shadow-clinical-lg max-w-md w-full p-6">
            <div className="flex items-start space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-warning/10 rounded-clinical flex-shrink-0">
                <Icon name="AlertTriangle" size={20} className="text-warning" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading font-heading-medium text-lg text-foreground mb-2">
                  Clear All Products?
                </h3>
                <p className="font-body font-body-normal text-sm text-muted-foreground mb-6">
                  This will remove all products from your routine. This action cannot be undone.
                </p>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="destructive"
                    onClick={confirmClearAll}
                    iconName="Trash2"
                    iconPosition="left"
                    iconSize={14}
                  >
                    Clear All
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowClearConfirmation(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkincareRoutineInput;