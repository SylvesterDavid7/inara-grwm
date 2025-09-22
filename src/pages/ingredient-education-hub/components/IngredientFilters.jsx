import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const IngredientFilters = ({ 
  onFiltersChange, 
  activeFilters = {}, 
  onClearFilters,
  className = "" 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'actives', label: 'Active Ingredients' },
    { value: 'moisturizers', label: 'Moisturizers' },
    { value: 'cleansers', label: 'Cleansers' },
    { value: 'sunscreens', label: 'Sunscreens' },
    { value: 'treatments', label: 'Treatments' },
    { value: 'exfoliants', label: 'Exfoliants' },
    { value: 'antioxidants', label: 'Antioxidants' }
  ];

  const safetyOptions = [
    { value: '', label: 'All Safety Ratings' },
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'caution', label: 'Use with Caution' }
  ];

  const skinConcernOptions = [
    { value: 'acne', label: 'Acne' },
    { value: 'aging', label: 'Anti-Aging' },
    { value: 'hyperpigmentation', label: 'Hyperpigmentation' },
    { value: 'sensitivity', label: 'Sensitivity' },
    { value: 'dryness', label: 'Dryness' },
    { value: 'oiliness', label: 'Oiliness' },
    { value: 'rosacea', label: 'Rosacea' },
    { value: 'eczema', label: 'Eczema' }
  ];

  const specialFilters = [
    { id: 'pregnancySafe', label: 'Pregnancy Safe' },
    { id: 'fraganceFree', label: 'Fragrance Free' },
    { id: 'naturalOrigin', label: 'Natural Origin' },
    { id: 'clinicallyTested', label: 'Clinically Tested' },
    { id: 'hypoallergenic', label: 'Hypoallergenic' },
    { id: 'nonComedogenic', label: 'Non-Comedogenic' }
  ];

  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...activeFilters,
      [filterType]: value
    };
    onFiltersChange(newFilters);
  };

  const handleSkinConcernChange = (concern, checked) => {
    const currentConcerns = activeFilters?.skinConcerns || [];
    const newConcerns = checked
      ? [...currentConcerns, concern]
      : currentConcerns?.filter(c => c !== concern);
    
    handleFilterChange('skinConcerns', newConcerns);
  };

  const handleSpecialFilterChange = (filterId, checked) => {
    const currentSpecial = activeFilters?.specialFilters || {};
    const newSpecial = {
      ...currentSpecial,
      [filterId]: checked
    };
    handleFilterChange('specialFilters', newSpecial);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (activeFilters?.category) count++;
    if (activeFilters?.safetyRating) count++;
    if (activeFilters?.skinConcerns?.length > 0) count += activeFilters?.skinConcerns?.length;
    if (activeFilters?.specialFilters) {
      count += Object.values(activeFilters?.specialFilters)?.filter(Boolean)?.length;
    }
    return count;
  };

  const activeCount = getActiveFilterCount();

  return (
    <div className={`bg-card border border-border rounded-clinical ${className}`}>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full justify-between p-4"
          iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
          iconSize={16}
        >
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={16} />
            <span>Filters</span>
            {activeCount > 0 && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-clinical-sm">
                {activeCount}
              </span>
            )}
          </div>
        </Button>
      </div>
      {/* Filter Content */}
      <div className={`${isExpanded ? 'block' : 'hidden'} lg:block`}>
        <div className="p-4 space-y-6">
          {/* Header - Desktop Only */}
          <div className="hidden lg:flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Filter" size={16} className="text-muted-foreground" />
              <h3 className="font-heading font-heading-semibold text-base text-foreground">
                Filters
              </h3>
              {activeCount > 0 && (
                <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-clinical-sm">
                  {activeCount}
                </span>
              )}
            </div>
            {activeCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear All
              </Button>
            )}
          </div>

          {/* Category Filter */}
          <div className="relative z-30">
            <label className="font-body font-body-medium text-sm text-foreground mb-2 block">
              Category
            </label>
            <Select
              options={categoryOptions}
              value={activeFilters?.category || ''}
              onChange={(value) => handleFilterChange('category', value)}
              placeholder="Select category"
            />
          </div>

          {/* Safety Rating Filter */}
          <div className="relative z-20">
            <label className="font-body font-body-medium text-sm text-foreground mb-2 block">
              Safety Rating
            </label>
            <Select
              options={safetyOptions}
              value={activeFilters?.safetyRating || ''}
              onChange={(value) => handleFilterChange('safetyRating', value)}
              placeholder="Select safety rating"
            />
          </div>

          {/* Skin Concerns Filter */}
          <div className="relative z-10">
            <label className="font-body font-body-medium text-sm text-foreground mb-3 block">
              Skin Concerns
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {skinConcernOptions?.map((concern) => (
                <Checkbox
                  key={concern?.value}
                  label={concern?.label}
                  checked={(activeFilters?.skinConcerns || [])?.includes(concern?.value)}
                  onChange={(e) => handleSkinConcernChange(concern?.value, e?.target?.checked)}
                />
              ))}
            </div>
          </div>

          {/* Special Filters */}
          <div>
            <label className="font-body font-body-medium text-sm text-foreground mb-3 block">
              Special Properties
            </label>
            <div className="space-y-2">
              {specialFilters?.map((filter) => (
                <Checkbox
                  key={filter?.id}
                  label={filter?.label}
                  checked={(activeFilters?.specialFilters || {})?.[filter?.id] || false}
                  onChange={(e) => handleSpecialFilterChange(filter?.id, e?.target?.checked)}
                />
              ))}
            </div>
          </div>

          {/* Mobile Clear Button */}
          {activeCount > 0 && (
            <div className="lg:hidden pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={onClearFilters}
                className="w-full"
                iconName="X"
                iconPosition="left"
                iconSize={16}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IngredientFilters;