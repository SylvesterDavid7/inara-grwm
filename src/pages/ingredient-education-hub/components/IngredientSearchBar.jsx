import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';

const IngredientSearchBar = ({ 
  onSearch, 
  onSuggestionSelect, 
  suggestions = [], 
  placeholder = "Search ingredients, benefits, concerns...",
  className = "" 
}) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef?.current && !suggestionsRef?.current?.contains(event?.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e?.target?.value;
    setQuery(value);
    setSelectedIndex(-1);
    
    if (value?.trim()) {
      setShowSuggestions(true);
      onSearch(value);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions?.length === 0) return;

    switch (e?.key) {
      case 'ArrowDown':
        e?.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions?.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e?.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions?.length - 1
        );
        break;
      case 'Enter':
        e?.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions?.[selectedIndex]);
        } else if (query?.trim()) {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef?.current?.blur();
        break;
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion?.name || suggestion?.term);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    onSuggestionSelect(suggestion);
  };

  const handleSearch = () => {
    if (query?.trim()) {
      onSearch(query);
      setShowSuggestions(false);
    }
  };

  const getSuggestionIcon = (type) => {
    switch (type) {
      case 'ingredient': return 'Beaker';
      case 'concern': return 'AlertCircle';
      case 'benefit': return 'Heart';
      case 'category': return 'Tag';
      default: return 'Search';
    }
  };

  const getSuggestionTypeLabel = (type) => {
    switch (type) {
      case 'ingredient': return 'Ingredient';
      case 'concern': return 'Skin Concern';
      case 'benefit': return 'Benefit';
      case 'category': return 'Category';
      default: return '';
    }
  };

  return (
    <div className={`relative ${className}`} ref={suggestionsRef}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10"
        />
        <Icon 
          name="Search" 
          size={18} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" 
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setShowSuggestions(false);
              onSearch('');
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-clinical"
          >
            <Icon name="X" size={16} />
          </button>
        )}
      </div>
      {showSuggestions && suggestions?.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-clinical shadow-clinical-lg z-dropdown max-h-80 overflow-y-auto">
          <div className="py-2">
            {suggestions?.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-clinical ${
                  index === selectedIndex
                    ? 'bg-secondary text-primary' :'hover:bg-secondary/50 text-popover-foreground'
                }`}
              >
                <Icon 
                  name={getSuggestionIcon(suggestion?.type)} 
                  size={16} 
                  className={`flex-shrink-0 ${
                    index === selectedIndex ? 'text-primary' : 'text-muted-foreground'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-body font-body-medium text-sm truncate">
                      {suggestion?.name || suggestion?.term}
                    </span>
                    {suggestion?.type && (
                      <span className="font-caption font-caption-normal text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-clinical-sm">
                        {getSuggestionTypeLabel(suggestion?.type)}
                      </span>
                    )}
                  </div>
                  {suggestion?.description && (
                    <p className="font-body font-body-normal text-xs text-muted-foreground mt-1 truncate">
                      {suggestion?.description}
                    </p>
                  )}
                </div>
                {suggestion?.matchCount && (
                  <span className="font-data font-data-normal text-xs text-muted-foreground">
                    {suggestion?.matchCount} results
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IngredientSearchBar;