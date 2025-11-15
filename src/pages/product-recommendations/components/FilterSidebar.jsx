import React from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterSidebar = ({ filters, onFiltersChange, onClearFilters, className = "", products = [] }) => {

  const popularBrands = React.useMemo(() => {
    const brands = new Set(products.map(p => p.brand).filter(Boolean));
    return Array.from(brands).sort().map(brand => ({
      id: brand.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
      label: brand
    }));
  }, [products]);

  const preferredIngredients = React.useMemo(() => {
    const ingredients = new Set(products.flatMap(p => p.keyIngredients || []).filter(Boolean));
    return Array.from(ingredients).sort().map(ingredient => ({
        id: ingredient.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        label: ingredient
    }));
  }, [products]);

  const skinConcerns = [
    { id: 'acne', label: 'Acne & Breakouts' },
    { id: 'aging', label: 'Anti-Aging' },
    { id: 'dryness', label: 'Dryness' },
    { id: 'sensitivity', label: 'Sensitivity' },
    { id: 'hyperpigmentation', label: 'Dark Spots' },
    { id: 'redness', label: 'Redness' },
    { id: 'oiliness', label: 'Excess Oil' },
    { id: 'clogged-pores', label: 'Clogged Pores' },
    { id: 'texture', label: 'Texture' },
  ];

  const sortOptions = [
    { value: 'compatibility', label: 'Best Match' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'popular', label: 'Most Popular' }
  ];

  const handleCheckboxChange = (filterType, value, isChecked) => {
    const currentValues = filters?.[filterType] || [];
    const updatedValues = isChecked
        ? [...currentValues, value]
        : currentValues.filter(v => v !== value);
    onFiltersChange({ ...filters, [filterType]: updatedValues });
  };

  const handlePriceChange = (index, value) => {
    const currentPriceRange = filters?.priceRange || [0, 200];
    const updated = [...currentPriceRange];
    updated[index] = parseInt(value) || (index === 0 ? 0 : 200);
    onFiltersChange({ ...filters, priceRange: updated });
  };

  const handleSortChange = (value) => {
    onFiltersChange({ ...filters, sortBy: value });
  };

  const priceRange = filters?.priceRange || [0, 200];
  const activeFilterCount = (filters?.skinConcerns?.length || 0) +
                            (filters?.ingredients?.length || 0) +
                            (filters?.brands?.length || 0) +
                            (filters.onSale ? 1 : 0) + 
                            (filters.crueltyFree ? 1 : 0) + 
                            (filters.fragranceFree ? 1 : 0) + 
                            (filters.sampleAvailable ? 1 : 0) +
                            (priceRange[0] > 0 || priceRange[1] < 200 ? 1 : 0);

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
              onClick={onClearFilters}
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
              value={priceRange[0]}
              onChange={(e) => handlePriceChange(0, e.target.value)}
              className="flex-1"
            />
            <span className="text-muted-foreground">-</span>
            <Input
              type="number"
              placeholder="Max"
              value={priceRange[1]}
              onChange={(e) => handlePriceChange(1, e.target.value)}
              className="flex-1"
            />
          </div>
          <div className="text-xs text-muted-foreground">
            ${priceRange[0]} - ${priceRange[1]}
          </div>
        </div>

        {/* Skin Concerns */}
        <div className="space-y-3">
          <h3 className="font-heading font-heading-medium text-sm text-foreground">
            Skin Concerns
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {skinConcerns.map((concern) => (
              <Checkbox
                key={concern.id}
                label={concern.label}
                checked={filters.skinConcerns?.includes(concern.id)}
                onChange={(e) => handleCheckboxChange('skinConcerns', concern.id, e.target.checked)}
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
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {preferredIngredients.map((ingredient) => (
              <Checkbox
                key={ingredient.id}
                label={ingredient.label}
                checked={filters.ingredients?.includes(ingredient.label)}
                onChange={(e) => handleCheckboxChange('ingredients', ingredient.label, e.target.checked)}
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
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {popularBrands.map((brand) => (
              <Checkbox
                key={brand.id}
                label={brand.label}
                checked={filters.brands?.includes(brand.label)}
                onChange={(e) => handleCheckboxChange('brands', brand.label, e.target.checked)}
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
              checked={filters.sampleAvailable || false}
              onChange={(e) => onFiltersChange({ ...filters, sampleAvailable: e.target.checked })}
              size="sm"
            />
            <Checkbox
              label="On Sale"
              checked={filters.onSale || false}
              onChange={(e) => onFiltersChange({ ...filters, onSale: e.target.checked })}
              size="sm"
            />
            <Checkbox
              label="Cruelty-Free"
              checked={filters.crueltyFree || false}
              onChange={(e) => onFiltersChange({ ...filters, crueltyFree: e.target.checked })}
              size="sm"
            />
            <Checkbox
              label="Fragrance-Free"
              checked={filters.fragranceFree || false}
              onChange={(e) => onFiltersChange({ ...filters, fragranceFree: e.target.checked })}
              size="sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
