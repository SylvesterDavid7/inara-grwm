import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';
import Select from './Select';

const QuickAccessToolbar = ({ className = "" }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const location = useLocation();

  const getToolbarConfig = () => {
    const path = location?.pathname;
    
    switch (path) {
      case '/progress-tracking-dashboard':
        return {
          showSearch: true,
          showFilters: true,
          searchPlaceholder: 'Search progress entries...',
          filters: [
            { value: '', label: 'All Time Periods' },
            { value: 'week', label: 'This Week' },
            { value: 'month', label: 'This Month' },
            { value: 'quarter', label: 'This Quarter' },
            { value: 'year', label: 'This Year' }
          ],
          actions: [
            { 
              label: 'Add Entry', 
              icon: 'Plus', 
              variant: 'default',
              action: () => console.log('Add Entry')
            },
            { 
              label: 'View Calendar', 
              icon: 'Calendar', 
              variant: 'outline',
              action: () => console.log('View Calendar')
            }
          ]
        };
      
      case '/ingredient-education-hub':
        return {
          showSearch: true,
          showFilters: true,
          searchPlaceholder: 'Search ingredients, articles...',
          filters: [
            { value: '', label: 'All Categories' },
            { value: 'actives', label: 'Active Ingredients' },
            { value: 'moisturizers', label: 'Moisturizers' },
            { value: 'cleansers', label: 'Cleansers' },
            { value: 'sunscreens', label: 'Sunscreens' },
            { value: 'treatments', label: 'Treatments' }
          ],
          actions: [
            { 
              label: 'Bookmark', 
              icon: 'Bookmark', 
              variant: 'outline',
              action: () => console.log('Bookmark')
            },
            { 
              label: 'My Library', 
              icon: 'Library', 
              variant: 'outline',
              action: () => console.log('My Library')
            }
          ]
        };
      
      default:
        return null;
    }
  };

  const config = getToolbarConfig();

  const handleSearch = (e) => {
    setSearchQuery(e?.target?.value);
    // Implement search logic here
    console.log('Searching for:', e?.target?.value);
  };

  const handleFilterChange = (value) => {
    setSelectedFilter(value);
    // Implement filter logic here
    console.log('Filter changed to:', value);
  };

  const toggleSearchExpanded = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      // Focus search input when expanded
      setTimeout(() => {
        const searchInput = document.querySelector('[data-search-input]');
        if (searchInput) searchInput?.focus();
      }, 100);
    }
  };

  if (!config) {
    return null;
  }

  return (
    <div className={`sticky top-16 z-20 bg-background border-b border-border ${className}`}>
      <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-3">
            <div className="flex items-center justify-between space-x-4">
            {/* Search and Filters */}
            <div className="flex items-center space-x-4 flex-1">
                {config?.showSearch && (
                <div className="relative flex-1 max-w-md">
                    {/* Desktop Search */}
                    <div className="hidden md:block">
                    <Input
                        type="search"
                        placeholder={config?.searchPlaceholder}
                        value={searchQuery}
                        onChange={handleSearch}
                        className="pl-10"
                        data-search-input
                    />
                    <Icon 
                        name="Search" 
                        size={16} 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" 
                    />
                    </div>

                    {/* Mobile Search */}
                    <div className="md:hidden">
                    {isSearchExpanded ? (
                        <div className="flex items-center space-x-2">
                        <Input
                            type="search"
                            placeholder={config?.searchPlaceholder}
                            value={searchQuery}
                            onChange={handleSearch}
                            className="flex-1"
                            data-search-input
                        />
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleSearchExpanded}
                            iconName="X"
                            iconSize={16}
                        >
                            <span className="sr-only">Close search</span>
                        </Button>
                        </div>
                    ) : (
                        <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleSearchExpanded}
                        iconName="Search"
                        iconSize={16}
                        >
                        Search
                        </Button>
                    )}
                    </div>
                </div>
                )}

                {config?.showFilters && !isSearchExpanded && (
                <div className="flex items-center space-x-3">
                    <Select
                    options={config?.filters}
                    value={selectedFilter}
                    onChange={handleFilterChange}
                    placeholder="Filter"
                    className="w-40"
                    />
                </div>
                )}
            </div>

            {/* Action Buttons */}
            {!isSearchExpanded && (
                <div className="flex items-center space-x-2">
                {config?.actions?.map((action, index) => (
                    <Button
                    key={index}
                    variant={action?.variant}
                    size="sm"
                    onClick={action?.action}
                    iconName={action?.icon}
                    iconPosition="left"
                    iconSize={16}
                    className="hidden sm:flex"
                    >
                    {action?.label}
                    </Button>
                ))}
                
                {/* Mobile Action Menu */}
                <div className="sm:hidden">
                    <Button
                    variant="outline"
                    size="sm"
                    iconName="MoreHorizontal"
                    iconSize={16}
                    >
                    <span className="sr-only">More actions</span>
                    </Button>
                </div>
                </div>
            )}
            </div>

            {/* Mobile Filters (when search is not expanded) */}
            {config?.showFilters && !isSearchExpanded && (
            <div className="md:hidden mt-3">
                <Select
                options={config?.filters}
                value={selectedFilter}
                onChange={handleFilterChange}
                placeholder="Filter results"
                className="w-full"
                />
            </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default QuickAccessToolbar;
