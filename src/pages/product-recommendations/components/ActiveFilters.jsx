import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActiveFilters = ({ filters, onRemoveFilter, onClearAll, className = "" }) => {
  const getActiveFilters = () => {
    const active = [];

    // Price range
    if (filters?.priceRange && (filters?.priceRange?.[0] > 0 || filters?.priceRange?.[1] < 200)) {
      active?.push({
        type: 'priceRange',
        label: `$${filters?.priceRange?.[0]} - $${filters?.priceRange?.[1]}`,
        value: 'priceRange'
      });
    }

    // Skin concerns
    if (filters?.skinConcerns && filters?.skinConcerns?.length > 0) {
      filters?.skinConcerns?.forEach(concern => {
        const labels = {
          'acne': 'Acne & Breakouts',
          'aging': 'Anti-Aging',
          'dryness': 'Dryness',
          'sensitivity': 'Sensitivity',
          'hyperpigmentation': 'Dark Spots',
          'rosacea': 'Rosacea',
          'oiliness': 'Excess Oil',
          'pores': 'Large Pores'
        };
        active?.push({
          type: 'skinConcerns',
          label: labels?.[concern] || concern,
          value: concern
        });
      });
    }

    // Ingredients
    if (filters?.ingredients && filters?.ingredients?.length > 0) {
      filters?.ingredients?.forEach(ingredient => {
        const labels = {
          'retinol': 'Retinol',
          'vitamin-c': 'Vitamin C',
          'niacinamide': 'Niacinamide',
          'hyaluronic-acid': 'Hyaluronic Acid',
          'salicylic-acid': 'Salicylic Acid',
          'glycolic-acid': 'Glycolic Acid',
          'ceramides': 'Ceramides',
          'peptides': 'Peptides'
        };
        active?.push({
          type: 'ingredients',
          label: labels?.[ingredient] || ingredient,
          value: ingredient
        });
      });
    }

    // Brands
    if (filters?.brands && filters?.brands?.length > 0) {
      filters?.brands?.forEach(brand => {
        const labels = {
          'cerave': 'CeraVe',
          'ordinary': 'The Ordinary',
          'paula-choice': "Paula\'s Choice",
          'skinceuticals': 'SkinCeuticals',
          'drunk-elephant': 'Drunk Elephant',
          'la-roche-posay': 'La Roche-Posay',
          'neutrogena': 'Neutrogena',
          'olay': 'Olay'
        };
        active?.push({
          type: 'brands',
          label: labels?.[brand] || brand,
          value: brand
        });
      });
    }

    // Additional filters
    if (filters?.sampleAvailable) {
      active?.push({
        type: 'sampleAvailable',
        label: 'Sample Available',
        value: 'sampleAvailable'
      });
    }

    if (filters?.onSale) {
      active?.push({
        type: 'onSale',
        label: 'On Sale',
        value: 'onSale'
      });
    }

    if (filters?.crueltyFree) {
      active?.push({
        type: 'crueltyFree',
        label: 'Cruelty-Free',
        value: 'crueltyFree'
      });
    }

    if (filters?.fragranceFree) {
      active?.push({
        type: 'fragranceFree',
        label: 'Fragrance-Free',
        value: 'fragranceFree'
      });
    }

    return active;
  };

  const activeFilters = getActiveFilters();

  if (activeFilters?.length === 0) {
    return null;
  }

  return (
    <div className={`bg-muted/50 border-b border-border ${className}`}>
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="font-body font-body-medium text-sm text-foreground">
              Active Filters:
            </span>
            <div className="flex flex-wrap gap-2">
              {activeFilters?.map((filter, index) => (
                <div
                  key={`${filter?.type}-${filter?.value}-${index}`}
                  className="flex items-center space-x-1 px-3 py-1 bg-background border border-border rounded-clinical-sm"
                >
                  <span className="font-caption font-caption-normal text-xs text-foreground">
                    {filter?.label}
                  </span>
                  <button
                    onClick={() => onRemoveFilter(filter?.type, filter?.value)}
                    className="text-muted-foreground hover:text-foreground transition-clinical"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            iconName="X"
            iconPosition="left"
            iconSize={14}
          >
            Clear All
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ActiveFilters;