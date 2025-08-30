import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CompatibilityChecker = ({ 
  isOpen, 
  onClose, 
  selectedIngredient = null,
  className = "" 
}) => {
  const [checkedIngredients, setCheckedIngredients] = useState(
    selectedIngredient ? [selectedIngredient?.name] : []
  );
  const [inputValue, setInputValue] = useState('');
  const [compatibilityResults, setCompatibilityResults] = useState(null);

  // Mock compatibility data
  const mockCompatibilityData = {
    "Retinol + Vitamin C": {
      compatibility: "caution",
      message: "Can be used together but may cause irritation. Use at different times of day.",
      recommendations: [
        "Use Vitamin C in the morning",
        "Use Retinol in the evening",
        "Start with lower concentrations",
        "Always use sunscreen during the day"
      ]
    },
    "Niacinamide + Hyaluronic Acid": {
      compatibility: "excellent",
      message: "Perfect combination! These ingredients work synergistically.",
      recommendations: [
        "Apply Hyaluronic Acid first",
        "Follow with Niacinamide",
        "Can be used morning and evening",
        "Great for all skin types"
      ]
    },
    "Salicylic Acid + Retinol": {
      compatibility: "avoid",
      message: "Not recommended together. High risk of irritation and over-exfoliation.",
      recommendations: [
        "Use on alternating days",
        "Start with one ingredient first",
        "Monitor skin for irritation",
        "Consider using a gentler alternative"
      ]
    }
  };

  const addIngredient = () => {
    if (inputValue?.trim() && !checkedIngredients?.includes(inputValue?.trim())) {
      setCheckedIngredients([...checkedIngredients, inputValue?.trim()]);
      setInputValue('');
    }
  };

  const removeIngredient = (ingredient) => {
    setCheckedIngredients(checkedIngredients?.filter(item => item !== ingredient));
    setCompatibilityResults(null);
  };

  const checkCompatibility = () => {
    if (checkedIngredients?.length < 2) return;

    // Mock compatibility check
    const combination = checkedIngredients?.slice(0, 2)?.join(' + ');
    const result = mockCompatibilityData?.[combination] || {
      compatibility: "unknown",
      message: "Limited data available for this combination. Consult with a dermatologist.",
      recommendations: [
        "Patch test before full application",
        "Start with lower concentrations",
        "Monitor skin reaction closely",
        "Consider consulting a dermatologist"
      ]
    };

    setCompatibilityResults({
      ingredients: checkedIngredients?.slice(0, 2),
      ...result
    });
  };

  const getCompatibilityColor = (level) => {
    switch (level) {
      case 'excellent': return 'text-success bg-success/10 border-success/20';
      case 'good': return 'text-accent bg-accent/10 border-accent/20';
      case 'caution': return 'text-warning bg-warning/10 border-warning/20';
      case 'avoid': return 'text-destructive bg-destructive/10 border-destructive/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getCompatibilityIcon = (level) => {
    switch (level) {
      case 'excellent': return 'CheckCircle';
      case 'good': return 'Check';
      case 'caution': return 'AlertTriangle';
      case 'avoid': return 'XCircle';
      default: return 'HelpCircle';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-modal bg-background/80 backdrop-blur-sm">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-card border border-border rounded-clinical shadow-clinical-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <Icon name="GitCompare" size={20} className="text-primary" />
              <h2 className="font-heading font-heading-semibold text-xl text-card-foreground">
                Ingredient Compatibility Checker
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              iconName="X"
              iconSize={20}
            >
              <span className="sr-only">Close</span>
            </Button>
          </div>

          <div className="p-6 overflow-y-auto max-h-96">
            {/* Add Ingredients */}
            <div className="mb-6">
              <label className="font-body font-body-medium text-sm text-foreground mb-3 block">
                Add Ingredients to Check
              </label>
              <div className="flex space-x-2 mb-4">
                <Input
                  type="text"
                  placeholder="Enter ingredient name..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e?.target?.value)}
                  onKeyDown={(e) => e?.key === 'Enter' && addIngredient()}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={addIngredient}
                  disabled={!inputValue?.trim()}
                  iconName="Plus"
                  iconSize={16}
                >
                  Add
                </Button>
              </div>

              {/* Selected Ingredients */}
              {checkedIngredients?.length > 0 && (
                <div className="space-y-2">
                  <div className="font-body font-body-medium text-sm text-foreground">
                    Selected Ingredients ({checkedIngredients?.length})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {checkedIngredients?.map((ingredient, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 bg-secondary text-secondary-foreground px-3 py-2 rounded-clinical"
                      >
                        <span className="font-body font-body-normal text-sm">{ingredient}</span>
                        <button
                          onClick={() => removeIngredient(ingredient)}
                          className="text-muted-foreground hover:text-foreground transition-clinical"
                        >
                          <Icon name="X" size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Check Button */}
            <div className="mb-6">
              <Button
                variant="default"
                onClick={checkCompatibility}
                disabled={checkedIngredients?.length < 2}
                iconName="Search"
                iconPosition="left"
                iconSize={16}
                className="w-full"
              >
                Check Compatibility
              </Button>
              {checkedIngredients?.length < 2 && (
                <p className="font-caption font-caption-normal text-xs text-muted-foreground mt-2 text-center">
                  Add at least 2 ingredients to check compatibility
                </p>
              )}
            </div>

            {/* Results */}
            {compatibilityResults && (
              <div className="space-y-4">
                <div className="border-t border-border pt-6">
                  <h3 className="font-heading font-heading-semibold text-base text-foreground mb-4">
                    Compatibility Results
                  </h3>
                  
                  {/* Compatibility Status */}
                  <div className={`border rounded-clinical p-4 mb-4 ${getCompatibilityColor(compatibilityResults?.compatibility)}`}>
                    <div className="flex items-center space-x-3 mb-2">
                      <Icon 
                        name={getCompatibilityIcon(compatibilityResults?.compatibility)} 
                        size={20} 
                      />
                      <div>
                        <div className="font-body font-body-medium text-sm">
                          {compatibilityResults?.ingredients?.join(' + ')}
                        </div>
                        <div className="font-caption font-caption-normal text-xs opacity-80">
                          Compatibility: {compatibilityResults?.compatibility?.charAt(0)?.toUpperCase() + compatibilityResults?.compatibility?.slice(1)}
                        </div>
                      </div>
                    </div>
                    <p className="font-body font-body-normal text-sm">
                      {compatibilityResults?.message}
                    </p>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="font-body font-body-medium text-sm text-foreground mb-3">
                      Recommendations
                    </h4>
                    <div className="space-y-2">
                      {compatibilityResults?.recommendations?.map((rec, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <Icon name="ArrowRight" size={14} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span className="font-body font-body-normal text-sm text-foreground">
                            {rec}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="mt-6 p-4 bg-muted rounded-clinical">
              <div className="flex items-start space-x-3">
                <Icon name="Info" size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-body font-body-medium text-sm text-foreground mb-1">
                    Important Note
                  </div>
                  <p className="font-body font-body-normal text-sm text-muted-foreground">
                    This tool provides general guidance based on common ingredient interactions. 
                    Always patch test new combinations and consult with a dermatologist for 
                    personalized advice, especially if you have sensitive skin or specific concerns.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompatibilityChecker;