import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';
import Select from './Select';

const QuickAccessToolbar = ({
  onSearch,
  className = "",
  onToggleLibraryView,
  isLibraryView,
  bookmarkedCount = 0
}) => {
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
        const libraryAction = isLibraryView
          ? {
              label: 'All Ingredients',
              icon: 'BookOpen',
              variant: 'default',
              action: () => { onToggleLibraryView(); },
            }
          : {
              label: `My Library (${bookmarkedCount})`,
              icon: 'Library',
              variant: 'outline',
              action: () => { onToggleLibraryView(); },
            };

        return {
          showSearch: !isLibraryView,
          showFilters: false,
          searchPlaceholder: 'Search ingredients, articles...',
          actions: [libraryAction]
        };

      default:
        return null;
    }
  };

  const config = getToolbarConfig();

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleFilterChange = (value) => {
    setSelectedFilter(value);
    console.log('Filter changed to:', value);
  };

  const toggleSearchExpanded = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      setTimeout(() => {
        const searchInput = document.querySelector('[data-search-input]');
        if (searchInput) searchInput.focus();
      }, 100);
    }
  };

  if (!config) {
    return null;
  }

  return (
    <div className={`sticky top-16 z-30 bg-background border-b border-border ${className}`}>
      <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-3">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4 flex-1">
              {config?.showSearch && (
                <div className="relative flex-1 max-w-md">
                  <div className="hidden md:block">
                    <Input
                      type="search"
                      placeholder={config?.searchPlaceholder}
                      value={searchQuery}
                      onChange={handleSearch}
                      className="pl-10 border border-border"
                      data-search-input
                    />
                    <Icon
                      name="Search"
                      size={16}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none"
                    />
                  </div>
                  <div className="md:hidden">
                    {isSearchExpanded ? (
                      <div className="flex items-center space-x-2">
                        <Input
                          type="search"
                          placeholder={config?.searchPlaceholder}
                          value={searchQuery}
                          onChange={handleSearch}
                          className="flex-1 border border-border"
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

            {!isSearchExpanded && (
              <div className="flex items-center space-x-2">
                {/* Desktop Buttons */}
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

                {/* Mobile: Single Action Button */}
                {config?.actions?.[0] && (
                  <Button
                    variant={config.actions[0].variant}
                    size="sm"
                    onClick={config.actions[0].action}
                    iconName={config.actions[0].icon}
                    iconPosition="left"
                    iconSize={16}
                    className="sm:hidden"
                  >
                    {config.actions[0].label}
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Mobile filters */}
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
