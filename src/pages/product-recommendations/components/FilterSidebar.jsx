import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterSidebar = ({ filters, onFiltersChange, onClearFilters, className = "" }) => {
  const [priceRange, setPriceRange] = useState(filters?.priceRange || [0, 200]);
  const [selectedConcerns, setSelectedConcerns] = useState(filters?.skinConcerns || []);
  const [selectedIngredients, setSelectedIngredients] = useState(filters?.ingredients || []);
  const [selectedBrands, setSelectedBrands] = useState(filters?.brands || []);

  const skinConcerns = [
    { id: 'acne', label: 'Acne & Breakouts' },
    { id: 'aging', label: 'Anti-Aging' },
    { id: 'dryness', label: 'Dryness' },
    { id: 'sensitivity', label: 'Sensitivity' },
    { id: 'hyperpigmentation', label: 'Dark Spots' },
    { id: 'rosacea', label: 'Rosacea' },
    { id: 'oiliness', label: 'Excess Oil' },
    { id: 'pores', label: 'Large Pores' }
  ];

  const preferredIngredients = [
    { id: 'retinol', label: 'Retinol' },
    { id: 'vitamin-c', label: 'Vitamin C' },
    { id: 'niacinamide', label: 'Niacinamide' },
    { id: 'hyaluronic-acid', label: 'Hyaluronic Acid' },
    { id: 'salicylic-acid', label: 'Salicylic Acid' },
    { id: 'glycolic-acid', label: 'Glycolic Acid' },
    { id: 'ceramides', label: 'Ceramides' },
    { id: 'peptides', label: 'Peptides' }
  ];

  const popularBrands = [
    { id: 'cerave', label: 'CeraVe' },
    { id: 'ordinary', label: 'The Ordinary' },
    { id: 'paula-choice', label: "Paula\'s Choice" },
    { id: 'skinceuticals', label: 'SkinCeuticals' },
    { id: 'drunk-elephant', label: 'Drunk Elephant' },
    { id: 'la-roche-posay', label: 'La Roche-Posay' },
    { id: 'neutrogena', label: 'Neutrogena' },
    { id: 'olay', label: 'Olay' }
  ];

  const sortOptions = [
    { value: 'compatibility', label: 'Best Match' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'popular', label: 'Most Popular' }
  ];

  const handleConcernChange = (concernId, checked) => {
    const updated = checked
      ? [...selectedConcerns, concernId]
      : selectedConcerns?.filter(id => id !== concernId);
    setSelectedConcerns(updated);
    onFiltersChange({ ...filters, skinConcerns: updated });
  };

  const handleIngredientChange = (ingredientId, checked) => {
    const updated = checked
      ? [...selectedIngredients, ingredientId]
      : selectedIngredients?.filter(id => id !== ingredientId);
    setSelectedIngredients(updated);
    onFiltersChange({ ...filters, ingredients: updated });
  };

  const handleBrandChange = (brandId, checked) => {
    const updated = checked
      ? [...selectedBrands, brandId]
      : selectedBrands?.filter(id => id !== brandId);
    setSelectedBrands(updated);
    onFiltersChange({ ...filters, brands: updated });
  };

  const handlePriceChange = (index, value) => {
    const updated = [...priceRange];
    updated[index] = parseInt(value) || 0;
    setPriceRange(updated);
    onFiltersChange({ ...filters, priceRange: updated });
  };

  const handleSortChange = (value) => {
    onFiltersChange({ ...filters, sortBy: value });
  };

  const clearAllFilters = () => {
    setPriceRange([0, 200]);
    setSelectedConcerns([]);
    setSelectedIngredients([]);
    setSelectedBrands([]);
    onClearFilters();
  };

  const activeFilterCount = selectedConcerns?.length + selectedIngredients?.length + selectedBrands?.length + 
    (priceRange?.[0] > 0 || priceRange?.[1] < 200 ? 1 : 0);

  return (
    <div className={`bg-background border-r border-border h-full overflow-y-auto ${className}`}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-heading-semibold text-lg text-foreground">
            Filters
          </h2>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              iconName="X"
              iconPosition="left"
              iconSize={14}
            >
              Clear ({activeFilterCount})
            </Button>
          )}
        </div>

        {/* Sort By */}
        <div className="space-y-3">
          <h3 className="font-heading font-heading-medium text-sm text-foreground">
            Sort By
          </h3>
          <Select
            options={sortOptions}
            value={filters?.sortBy || 'compatibility'}
            onChange={handleSortChange}
            placeholder="Select sorting"
          />
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <h3 className="font-heading font-heading-medium text-sm text-foreground">
            Price Range
          </h3>
          <div className="flex items-center space-x-3">
            <Input
              type="number"
              placeholder="Min"
              value={priceRange?.[0]}
              onChange={(e) => handlePriceChange(0, e?.target?.value)}
              className="flex-1"
            />
            <span className="text-muted-foreground">-</span>
            <Input
              type="number"
              placeholder="Max"
              value={priceRange?.[1]}
              onChange={(e) => handlePriceChange(1, e?.target?.value)}
              className="flex-1"
            />
          </div>
          <div className="text-xs text-muted-foreground">
            ${priceRange?.[0]} - ${priceRange?.[1]}
          </div>
        </div>

        {/* Skin Concerns */}
        <div className="space-y-3">
          <h3 className="font-heading font-heading-medium text-sm text-foreground">
            Skin Concerns
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {skinConcerns?.map((concern) => (
              <Checkbox
                key={concern?.id}
                label={concern?.label}
                checked={selectedConcerns?.includes(concern?.id)}
                onChange={(e) => handleConcernChange(concern?.id, e?.target?.checked)}
                size="sm"
              />
            ))}
          </div>
        </div>

        {/* Preferred Ingredients */}
        <div className="space-y-3">
          <h3 className="font-heading font-heading-medium text-sm text-foreground">
            Preferred Ingredients
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {preferredIngredients?.map((ingredient) => (
              <Checkbox
                key={ingredient?.id}
                label={ingredient?.label}
                checked={selectedIngredients?.includes(ingredient?.id)}
                onChange={(e) => handleIngredientChange(ingredient?.id, e?.target?.checked)}
                size="sm"
              />
            ))}
          </div>
        </div>

        {/* Brands */}
        <div className="space-y-3">
          <h3 className="font-heading font-heading-medium text-sm text-foreground">
            Brands
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {popularBrands?.map((brand) => (
              <Checkbox
                key={brand?.id}
                label={brand?.label}
                checked={selectedBrands?.includes(brand?.id)}
                onChange={(e) => handleBrandChange(brand?.id, e?.target?.checked)}
                size="sm"
              />
            ))}
          </div>
        </div>

        {/* Additional Filters */}
        <div className="space-y-3">
          <h3 className="font-heading font-heading-medium text-sm text-foreground">
            Additional Options
          </h3>
          <div className="space-y-2">
            <Checkbox
              label="Sample Available"
              checked={filters?.sampleAvailable || false}
              onChange={(e) => onFiltersChange({ ...filters, sampleAvailable: e?.target?.checked })}
              size="sm"
            />
            <Checkbox
              label="On Sale"
              checked={filters?.onSale || false}
              onChange={(e) => onFiltersChange({ ...filters, onSale: e?.target?.checked })}
              size="sm"
            />
            <Checkbox
              label="Cruelty-Free"
              checked={filters?.crueltyFree || false}
              onChange={(e) => onFiltersChange({ ...filters, crueltyFree: e?.target?.checked })}
              size="sm"
            />
            <Checkbox
              label="Fragrance-Free"
              checked={filters?.fragranceFree || false}
              onChange={(e) => onFiltersChange({ ...filters, fragranceFree: e?.target?.checked })}
              size="sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;