import React from 'react';
import Icon from '../../../components/AppIcon';

// A new, redesigned card for displaying a single ingredient compatibility pairing.
const CompatibilityItemCard = ({ ingredientA, ingredientB, compatible, reason }) => {
  const isCompatible = compatible;

  const baseBorderColor = isCompatible ? 'border-success/30' : 'border-destructive/30';
  const accentColor = isCompatible ? 'text-success' : 'text-destructive';
  const iconName = isCompatible ? 'CheckCircle2' : 'XCircle';
  const labelText = isCompatible ? 'Compatible' : 'Not Recommended';

  return (
    <div className={`bg-card-alt border-l-4 ${baseBorderColor} rounded-clinical overflow-hidden shadow-sm`}>
      <div className="p-5">
        {/* Header Section */}
        <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
                <h4 className="font-heading font-heading-semibold text-base text-foreground">
                    {ingredientA} + {ingredientB}
                </h4>
            </div>
            <div className={`flex items-center space-x-2 ${accentColor}`}>
                <Icon name={iconName} size={18} />
                <span className="font-caption font-caption-medium text-sm">{labelText}</span>
            </div>
        </div>

        {/* Reason/Explanation Section */}
        <div className="mt-3">
            <p className="font-body font-body-normal text-sm text-muted-foreground">
                {reason}
            </p>
        </div>
      </div>
    </div>
  );
};

// The main component that renders a list of the new cards.
const IngredientCompatibilityCard = ({ compatibility }) => {
    if (!compatibility || compatibility.length === 0) {
        return null;
    }

    return (
        <div className="bg-card border border-border rounded-clinical p-6">
            <h3 className="font-heading font-heading-semibold text-lg text-foreground mb-1">Ingredient Compatibility</h3>
            <p className="text-muted-foreground text-sm mb-4">Analysis of how active ingredients in your routine interact.</p>
            <div className="space-y-4">
                {compatibility.map((comp, index) => (
                    // The props from the AI response (ingredientA, ingredientB, compatible, reason) 
                    // are passed directly to the new card component.
                    <CompatibilityItemCard key={index} {...comp} />
                ))}
            </div>
        </div>
    );
};

export default IngredientCompatibilityCard;
