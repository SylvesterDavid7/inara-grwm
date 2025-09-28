import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import QuickAccessToolbar from '../../components/ui/QuickAccessToolbar';
import SectionContextMenu from '../../components/ui/SectionContextMenu';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import IngredientCard from './components/IngredientCard';
import IngredientDetailModal from './components/IngredientDetailModal';
import IngredientSearchBar from './components/IngredientSearchBar';
import IngredientFilters from './components/IngredientFilters';
import CompatibilityChecker from './components/CompatibilityChecker';
import EducationalContent from './components/EducationalContent';
import { ingredients as mockIngredients } from '../../data/ingredients';

const IngredientEducationHub = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCompatibilityCheckerOpen, setIsCompatibilityCheckerOpen] = useState(false);
  const [bookmarkedIngredients, setBookmarkedIngredients] = useState([]);
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [searchSuggestions, setSearchSuggestions] = useState([]);

  useEffect(() => {
    // Initialize with all ingredients
    setFilteredIngredients(mockIngredients);
  }, []);

  useEffect(() => {
    // Filter ingredients based on search and filters
    let filtered = mockIngredients;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered?.filter(ingredient =>
        ingredient?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        ingredient?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        ingredient?.skinConcerns?.some(concern => 
          concern?.toLowerCase()?.includes(searchQuery?.toLowerCase())
        )
      );
    }

    // Apply category filter
    if (activeFilters?.category) {
      filtered = filtered?.filter(ingredient => 
        ingredient?.category === activeFilters?.category
      );
    }

    // Apply safety rating filter
    if (activeFilters?.safetyRating) {
      filtered = filtered?.filter(ingredient => 
        ingredient?.safetyRating === activeFilters?.safetyRating
      );
    }

    // Apply skin concerns filter
    if (activeFilters?.skinConcerns && activeFilters?.skinConcerns?.length > 0) {
      filtered = filtered?.filter(ingredient =>
        activeFilters?.skinConcerns?.some(concern =>
          ingredient?.skinConcerns?.includes(concern)
        )
      );
    }

    // Apply special filters
    if (activeFilters?.specialFilters) {
      const specialFilters = activeFilters?.specialFilters;
      if (specialFilters?.pregnancySafe) {
        filtered = filtered?.filter(ingredient => 
          !['retinol', 'salicylic acid']?.includes(ingredient?.name?.toLowerCase())
        );
      }
      if (specialFilters?.fraganceFree) {
        // Mock filter - in real app would check ingredient list
        filtered = filtered?.filter(ingredient => ingredient?.id !== 999);
      }
    }

    setFilteredIngredients(filtered);
  }, [searchQuery, activeFilters]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Generate search suggestions based on query
    if (query) {
      const suggestions = mockSuggestions?.filter(suggestion =>
        suggestion?.name?.toLowerCase()?.includes(query?.toLowerCase())
      );
      setSearchSuggestions(suggestions);
    } else {
      setSearchSuggestions([]);
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    setSearchQuery(suggestion?.name);
    setSearchSuggestions([]);
  };

  const handleFiltersChange = (newFilters) => {
    setActiveFilters(newFilters);
  };

  const handleClearFilters = () => {
    setActiveFilters({});
    setSearchQuery('');
  };

  const handleViewDetails = (ingredient) => {
    setSelectedIngredient(ingredient);
    setIsDetailModalOpen(true);
  };

  const handleBookmark = (ingredientId) => {
    setBookmarkedIngredients(prev => 
      prev?.includes(ingredientId)
        ? prev?.filter(id => id !== ingredientId)
        : [...prev, ingredientId]
    );
  };

  const handleCheckCompatibility = (ingredient) => {
    setSelectedIngredient(ingredient);
    setIsCompatibilityCheckerOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Ingredient Education Hub - SkinScore Analyzer</title>
        <meta name="description" content="Comprehensive skincare ingredient database with safety information, compatibility checker, and educational content." />
      </Helmet>
      <Header />
      <QuickAccessToolbar />
      <main className="pt-2">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading font-heading-bold text-3xl text-foreground mb-2">
                Ingredient Education Hub
              </h1>
              <p className="font-body font-body-normal text-lg text-muted-foreground">
                Discover, learn, and understand skincare ingredients with our comprehensive database
              </p>
            </div>
            <SectionContextMenu />
          </div>

        
          {/* Main Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <IngredientFilters
                onFiltersChange={handleFiltersChange}
                activeFilters={activeFilters}
                onClearFilters={handleClearFilters}
                className="sticky top-32"
              />
            </div>

            {/* Ingredients Grid */}
            <div className="lg:col-span-3">
              {/* View Controls */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <span className="font-body font-body-medium text-sm text-foreground">
                    {filteredIngredients?.length} ingredients found
                  </span>
                  {searchQuery && (
                    <span className="font-body font-body-normal text-sm text-muted-foreground">
                      for "{searchQuery}"
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    iconName="Grid3X3"
                    iconSize={16}
                  >
                    <span className="sr-only">Grid view</span>
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    iconName="List"
                    iconSize={16}
                  >
                    <span className="sr-only">List view</span>
                  </Button>
                </div>
              </div>

              {/* Ingredients Display */}
              {filteredIngredients?.length > 0 ? (
                <div className={`${viewMode === 'grid' ?'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' :'space-y-4'}`}>
                  {filteredIngredients?.map((ingredient) => (
                    <IngredientCard
                      key={ingredient?.id}
                      ingredient={ingredient}
                      onViewDetails={handleViewDetails}
                      onBookmark={handleBookmark}
                      onCheckCompatibility={handleCheckCompatibility}
                      isBookmarked={bookmarkedIngredients?.includes(ingredient?.id)}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-heading font-heading-semibold text-lg text-foreground mb-2">
                    No ingredients found
                  </h3>
                  <p className="font-body font-body-normal text-muted-foreground mb-4">
                    Try adjusting your search terms or filters
                  </p>
                  <Button variant="outline" onClick={handleClearFilters}>
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Educational Content Section */}
          <div className="mt-16">
            <EducationalContent />
          </div>

          {/* Quick Actions */}
          <div className="mt-12 bg-card border border-border rounded-clinical p-6">
            <h2 className="font-heading font-heading-semibold text-xl text-card-foreground mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                onClick={() => setIsCompatibilityCheckerOpen(true)}
                iconName="GitCompare"
                iconPosition="left"
                iconSize={16}
                className="justify-start"
              >
                Check Ingredient Compatibility
              </Button>
              <Button
                variant="outline"
                iconName="Bookmark"
                iconPosition="left"
                iconSize={16}
                className="justify-start"
              >
                View Bookmarked Ingredients ({bookmarkedIngredients?.length})
              </Button>
              <Button
                variant="outline"
                iconName="Download"
                iconPosition="left"
                iconSize={16}
                className="justify-start"
              >
                Download Ingredient Guide
              </Button>
            </div>
          </div>
        </div>
      </main>
      {/* Modals */}
      <IngredientDetailModal
        ingredient={selectedIngredient}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onBookmark={handleBookmark}
        isBookmarked={selectedIngredient && bookmarkedIngredients?.includes(selectedIngredient?.id)}
      />
      <CompatibilityChecker
        isOpen={isCompatibilityCheckerOpen}
        onClose={() => setIsCompatibilityCheckerOpen(false)}
        selectedIngredient={selectedIngredient}
      />
    </div>
  );
};

export default IngredientEducationHub;
