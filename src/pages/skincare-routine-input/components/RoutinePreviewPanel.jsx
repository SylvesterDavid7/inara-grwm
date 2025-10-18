import React, { useMemo } from 'react';
import ProductPill from './ProductPill';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RoutinePreviewPanel = ({ 
  morningProducts, 
  eveningProducts, 
  weeklyTreatments, 
  isCollapsed, 
  onToggleCollapse,
  onSave,
  onAnalyze,
  onClearAll,
  isAnalyzing
}) => {
  const totalProducts = morningProducts.length + eveningProducts.length + weeklyTreatments.length;

  const conflictingCombinations = [
    ['Vitamin C', 'Retinol'],
    ['Vitamin C', 'AHAs'],
    ['Vitamin C', 'BHAs'],
    ['Retinol', 'AHAs'],
    ['Retinol', 'BHAs'],
    ['Niacinamide', 'Vitamin C (L-Ascorbic Acid)'],
  ];

  const getIngredientsAsArray = (ingredients) => {
    if (!ingredients) return [];
    if (Array.isArray(ingredients)) return ingredients.map(ing => ing.trim());
    return ingredients.split(',').map(ing => ing.trim());
  };

  const calculateConflicts = (products) => {
    let conflictCount = 0;
    for (let i = 0; i < products.length; i++) {
        for (let j = i + 1; j < products.length; j++) {
            const ingredients1 = getIngredientsAsArray(products[i]?.ingredients);
            const ingredients2 = getIngredientsAsArray(products[j]?.ingredients);

            for (const combination of conflictingCombinations) {
                const hasFirst = ingredients1.some(ing => ing.includes(combination[0])) && ingredients2.some(ing => ing.includes(combination[1]));
                const hasSecond = ingredients1.some(ing => ing.includes(combination[1])) && ingredients2.some(ing => ing.includes(combination[0]));
                
                if (hasFirst || hasSecond) {
                    conflictCount++;
                }
            }
        }
    }
    return conflictCount;
  };

  const totalConflicts = useMemo(() => {
    return calculateConflicts(morningProducts) + calculateConflicts(eveningProducts) + calculateConflicts(weeklyTreatments);
  }, [morningProducts, eveningProducts, weeklyTreatments]);


  return (
    <div className={`bg-card border border-border rounded-clinical shadow-clinical-sm overflow-hidden transition-all duration-300 ${isCollapsed ? 'h-16' : 'h-auto'}`}>
      <div className="flex items-center justify-between p-4 cursor-pointer lg:cursor-default" onClick={onToggleCollapse}>
        <div className="flex items-center space-x-3">
          <Icon name="ClipboardList" size={20} className="text-primary" />
          <h3 className="font-heading font-heading-semibold text-foreground">Routine Preview</h3>
        </div>
        <div className="flex items-center space-x-2">
          {totalConflicts > 0 && 
            <span className="bg-red-500/10 text-red-500 font-mono text-xs rounded-full px-2 py-1">{totalConflicts} Conflicts</span>
          }
          <span className="bg-primary/10 text-primary font-mono text-xs rounded-full px-2 py-1">{totalProducts}</span>
          <button className="lg:hidden text-muted-foreground">
            <Icon name={isCollapsed ? 'ChevronDown' : 'ChevronUp'} size={18} />
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-4 border-t border-border">
        <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
          <RoutineSection title="Morning" icon="Sun" products={morningProducts} />
          <RoutineSection title="Evening" icon="Moon" products={eveningProducts} />
          <RoutineSection title="Weekly" icon="Sparkles" products={weeklyTreatments} />
        </div>
          
          <div className="mt-6 space-y-3">
             <Button 
                variant="default"
                onClick={onAnalyze}
                disabled={totalProducts === 0}
                className="w-full"
                loading={isAnalyzing}
                iconName="Zap"
                iconPosition="left"
             >
                {isAnalyzing ? 'Analyzing...' : 'Get Analysis'}
            </Button>
            <Button 
                variant="outline"
                onClick={onSave}
                className="w-full"
                iconName="Save"
                iconPosition="left"
            >
                Save Routine to Cloud
            </Button>
            <Button
                variant="ghost"
                onClick={onClearAll}
                disabled={totalProducts === 0}
                className="w-full text-destructive"
                iconName="Trash2"
                iconPosition="left"
            >
                Clear All Products
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const RoutineSection = ({ title, icon, products }) => {
  if (products.length === 0) return null;

  return (
    <div>
      <div className="flex items-center space-x-2 mb-2">
        <Icon name={icon} size={14} className="text-muted-foreground" />
        <h4 className="font-body font-body-semibold text-sm text-muted-foreground">{title}</h4>
      </div>
      <div className="flex flex-wrap gap-2">
        {products.map(product => (
          <ProductPill key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RoutinePreviewPanel;