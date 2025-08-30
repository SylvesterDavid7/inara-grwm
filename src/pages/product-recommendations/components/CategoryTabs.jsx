import React from 'react';
import Icon from '../../../components/AppIcon';

const CategoryTabs = ({ categories, activeCategory, onCategoryChange, className = "" }) => {
  const categoryIcons = {
    'missing-essentials': 'AlertCircle',
    'upgrade-options': 'TrendingUp',
    'concern-specific': 'Target',
    'budget-alternatives': 'DollarSign',
    'all': 'Grid3X3'
  };

  return (
    <div className={`bg-background border-b border-border ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Desktop Tabs */}
        <div className="hidden md:flex items-center space-x-1 py-4">
          {categories?.map((category) => (
            <button
              key={category?.id}
              onClick={() => onCategoryChange(category?.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-clinical transition-clinical ${
                activeCategory === category?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-secondary hover:text-primary'
              }`}
            >
              <Icon
                name={categoryIcons?.[category?.id] || 'Circle'}
                size={16}
              />
              <span className="font-body font-body-medium text-sm">
                {category?.label}
              </span>
              {category?.count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-data font-data-normal ${
                  activeCategory === category?.id
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {category?.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Mobile Dropdown */}
        <div className="md:hidden py-4">
          <div className="relative">
            <select
              value={activeCategory}
              onChange={(e) => onCategoryChange(e?.target?.value)}
              className="w-full appearance-none bg-background border border-border rounded-clinical px-4 py-3 pr-10 font-body font-body-medium text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            >
              {categories?.map((category) => (
                <option key={category?.id} value={category?.id}>
                  {category?.label} {category?.count > 0 && `(${category?.count})`}
                </option>
              ))}
            </select>
            <Icon
              name="ChevronDown"
              size={16}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryTabs;