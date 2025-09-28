import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { ingredients } from '../../../data/ingredients';
import { fetchIngredientCompatibility as runGemini } from '../../../utils/gemini';

const CompatibilityChecker = ({
  isOpen,
  onClose,
  selectedIngredient = null,
}) => {
  const [checkedIngredients, setCheckedIngredients] = useState(
    selectedIngredient ? [selectedIngredient?.name] : []
  );
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [allIngredients, setAllIngredients] = useState([]);
  const [compatibilityResults, setCompatibilityResults] = useState(null);

  useEffect(() => {
    const ingredientNames = ingredients.map(ingredient => ingredient.name);
    setAllIngredients(ingredientNames);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setCompatibilityResults(null);
      setCheckedIngredients(selectedIngredient ? [selectedIngredient?.name] : []);
    }
  }, [isOpen, selectedIngredient]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.trim()) {
      const filteredSuggestions = allIngredients.filter(ingredient =>
        ingredient.toLowerCase().includes(value.toLowerCase()) && !checkedIngredients.includes(ingredient)
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const addIngredient = (ingredient) => {
    if (ingredient && !checkedIngredients.includes(ingredient)) {
      setCheckedIngredients([...checkedIngredients, ingredient]);
      setInputValue('');
      setSuggestions([]);
      setCompatibilityResults(null);
    }
  };
  
  const addIngredientFromInput = () => {
    if (inputValue.trim() && !checkedIngredients.includes(inputValue.trim())) {
      addIngredient(inputValue.trim());
    }
  };

  const removeIngredient = (ingredient) => {
    setCheckedIngredients(checkedIngredients?.filter(item => item !== ingredient));
    setCompatibilityResults(null);
  };

  const checkCompatibility = async () => {
    if (checkedIngredients.length < 2) return;

    const [ing1Name, ing2Name] = checkedIngredients.slice(0, 2);

    setCompatibilityResults({
      ingredients: [ing1Name, ing2Name],
      compatibility: "loading",
      message: "Consulting with our AI Dermatologist...",
      recommendations: []
    });

    try {
      // The new utility function handles the prompt and parsing.
      const result = await runGemini(ing1Name, ing2Name);

      setCompatibilityResults({
        ingredients: [ing1Name, ing2Name],
        ...result
      });

    } catch (error) {
      console.error("Error during Gemini compatibility check:", error);
      setCompatibilityResults({
        ingredients: [ing1Name, ing2Name],
        compatibility: "unknown",
        message: "The AI analysis failed. This could be due to a network issue or an invalid response from the AI.",
        recommendations: [`Error details: ${error.message}`]
      });
    }
  };

  const getCompatibilityColor = (level) => {
    switch (level) {
      case 'loading': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'excellent': return 'text-success bg-success/10 border-success/20';
      case 'good': return 'text-accent bg-accent/10 border-accent/20';
      case 'caution': return 'text-warning bg-warning/10 border-warning/20';
      case 'avoid': return 'text-destructive bg-destructive/10 border-destructive/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getCompatibilityIcon = (level) => {
    switch (level) {
      case 'loading': return 'Loader';
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
        <div className="bg-card border border-border rounded-clinical shadow-clinical-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
            <div className="flex items-center space-x-3">
              <Icon name="GitCompare" size={20} className="text-primary" />
              <h2 className="font-heading font-heading-semibold text-xl text-card-foreground">
                Ingredient Compatibility Checker
              </h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} iconName="X" iconSize={20}>
              <span className="sr-only">Close</span>
            </Button>
          </div>

          <div className="p-6 overflow-y-auto">
            <div className="mb-6">
              <label className="font-body font-body-medium text-sm text-foreground mb-3 block">
                Add Ingredients to Check
              </label>
              <div className="flex space-x-2 mb-4">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="Enter ingredient name..."
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={(e) => e?.key === 'Enter' && addIngredientFromInput()}
                    className="flex-1"
                  />
                  {suggestions.length > 0 && (
                    <ul className="absolute z-10 w-full bg-card border border-border rounded-md shadow-lg mt-1 max-h-40 overflow-y-auto">
                      {suggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          className="px-4 py-2 cursor-pointer hover:bg-muted"
                          onClick={() => addIngredient(suggestion)}
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <Button variant="outline" onClick={addIngredientFromInput} disabled={!inputValue?.trim()} iconName="Plus" iconSize={16}>
                  Add
                </Button>
              </div>

              {checkedIngredients?.length > 0 && (
                <div className="space-y-2">
                  <div className="font-body font-body-medium text-sm text-foreground">
                    Selected Ingredients ({checkedIngredients?.length})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {checkedIngredients?.map((ingredient, index) => (
                      <div key={index} className="flex items-center space-x-2 bg-secondary text-secondary-foreground px-3 py-2 rounded-clinical">
                        <span className="font-body font-body-normal text-sm">{ingredient}</span>
                        <button onClick={() => removeIngredient(ingredient)} className="text-muted-foreground hover:text-foreground transition-clinical">
                          <Icon name="X" size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mb-6">
              <Button
                variant="default"
                onClick={checkCompatibility}
                disabled={checkedIngredients?.length < 2 || compatibilityResults?.compatibility === 'loading'}
                iconName={compatibilityResults?.compatibility === 'loading' ? "Loader" : "Sparkles"}
                iconPosition="left"
                iconSize={16}
                className="w-full"
              >
                {compatibilityResults?.compatibility === 'loading' ? 'Checking with AI...' : 'Check Compatibility with AI'}
              </Button>
              {checkedIngredients?.length < 2 && (
                <p className="font-caption font-caption-normal text-xs text-muted-foreground mt-2 text-center">
                  Add at least 2 ingredients to check compatibility
                </p>
              )}
            </div>

            {compatibilityResults && (
              <div className="space-y-4">
                <div className="border-t border-border pt-6">
                  <h3 className="font-heading font-heading-semibold text-base text-foreground mb-4">
                    AI-Powered Compatibility Results
                  </h3>

                  <div className={`border rounded-clinical p-4 mb-4 ${getCompatibilityColor(compatibilityResults?.compatibility)}`}>
                    <div className="flex items-center space-x-3 mb-2">
                      <Icon
                        name={getCompatibilityIcon(compatibilityResults?.compatibility)}
                        size={20}
                        className={compatibilityResults.compatibility === 'loading' ? 'animate-spin' : ''}
                      />
                      <div>
                        <div className="font-body font-body-medium text-sm">
                          {compatibilityResults?.ingredients?.join(' + ')}
                        </div>
                        {compatibilityResults.compatibility !== 'loading' &&
                          <div className="font-caption font-caption-normal text-xs opacity-80">
                            Compatibility: {compatibilityResults?.compatibility?.charAt(0)?.toUpperCase() + compatibilityResults?.compatibility?.slice(1)}
                          </div>
                        }
                      </div>
                    </div>
                    <p className="font-body font-body-normal text-sm">
                      {compatibilityResults?.message}
                    </p>
                  </div>

                  {compatibilityResults?.recommendations?.length > 0 &&
                    <div>
                      <h4 className="font-body font-body-medium text-sm text-foreground mb-3">
                        Recommendations
                      </h4>
                      <div className="space-y-2">
                        {compatibilityResults.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <Icon name="ArrowRight" size={14} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                            <span className="font-body font-body-normal text-sm text-foreground">
                              {rec}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  }
                </div>
              </div>
            )}

            <div className="mt-6 p-4 bg-muted rounded-clinical">
              <div className="flex items-start space-x-3">
                <Icon name="Info" size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-body font-body-medium text-sm text-foreground mb-1">
                    Important Note
                  </div>
                  <p className="font-body font-body-normal text-sm text-muted-foreground">
                    This tool provides AI-powered guidance. Always patch test new combinations and consult with a dermatologist for personalized advice.
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
