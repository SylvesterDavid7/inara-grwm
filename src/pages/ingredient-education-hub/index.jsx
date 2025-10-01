import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import QuickAccessToolbar from '../../components/ui/QuickAccessToolbar';
import SectionContextMenu from '../../components/ui/SectionContextMenu';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import IngredientCard from './components/IngredientCard';
import IngredientDetailModal from './components/IngredientDetailModal';
import IngredientFilters from './components/IngredientFilters';
import CompatibilityChecker from './components/CompatibilityChecker';
import EducationalContent from './components/EducationalContent';
import { ingredients as mockIngredients } from '../../data/ingredients';
import { useUserDataContext } from '../../contexts/UserDataContext.jsx';

const IngredientEducationHub = () => {
  const { userData, updateUserData } = useUserDataContext();
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCompatibilityCheckerOpen, setIsCompatibilityCheckerOpen] = useState(false);
  const [isLibraryView, setIsLibraryView] = useState(false);
  const [filteredIngredients, setFilteredIngredients] = useState([]);

  const bookmarkedIngredients = userData?.bookmarkedIngredients || [];

  useEffect(() => {
    let ingredients = isLibraryView
      ? mockIngredients.filter(ing => bookmarkedIngredients.includes(ing.id))
      : mockIngredients;

    if (searchQuery && !isLibraryView) {
      ingredients = ingredients.filter(ingredient =>
        ingredient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ingredient.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ingredient.skinConcerns.some(concern => 
          concern.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    if (activeFilters.category && !isLibraryView) {
      ingredients = ingredients.filter(ingredient => 
        ingredient.category === activeFilters.category
      );
    }

    if (activeFilters.safetyRating && !isLibraryView) {
      ingredients = ingredients.filter(ingredient => 
        ingredient.safetyRating === activeFilters.safetyRating
      );
    }

    if (activeFilters.skinConcerns && activeFilters.skinConcerns.length > 0 && !isLibraryView) {
      ingredients = ingredients.filter(ingredient =>
        activeFilters.skinConcerns.some(concern =>
          ingredient.skinConcerns.includes(concern)
        )
      );
    }

    setFilteredIngredients(ingredients);
  }, [searchQuery, activeFilters, isLibraryView, bookmarkedIngredients]);

  const handleSearch = (query) => {
    setSearchQuery(query);
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
    const viewed = userData.viewedIngredients || [];
    if (!viewed.includes(ingredient.id)) {
      updateUserData({ viewedIngredients: [...viewed, ingredient.id] });
    }
  };

  const handleBookmark = (ingredientId) => {
    const updatedBookmarks = bookmarkedIngredients.includes(ingredientId)
      ? bookmarkedIngredients.filter(id => id !== ingredientId)
      : [...bookmarkedIngredients, ingredientId];
    updateUserData({ bookmarkedIngredients: updatedBookmarks });
  };
  
  const handleToggleLibraryView = () => {
    setIsLibraryView(!isLibraryView);
    setSearchQuery('');
    setActiveFilters({});
  };

  const handleCheckCompatibility = (ingredient) => {
    setSelectedIngredient(ingredient);
    setIsCompatibilityCheckerOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Ingredient Education Hub - SkinScore Analyzer</title>
        <meta name="description" content="Comprehensive skincare ingredient database..." />
      </Helmet>
      <Header />
      <QuickAccessToolbar 
        onSearch={handleSearch}
        onToggleLibraryView={handleToggleLibraryView}
        isLibraryView={isLibraryView}
        bookmarkedCount={bookmarkedIngredients.length}
      />
      <main className="pt-2">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading font-heading-bold text-3xl text-foreground mb-2">
                {isLibraryView ? 'My Library' : 'Ingredient Education Hub'}
              </h1>
              <p className="font-body font-body-normal text-lg text-muted-foreground">
                {isLibraryView 
                  ? 'Your curated collection of skincare ingredients.'
                  : 'Discover, learn, and understand skincare ingredients.'}
              </p>
            </div>
            {!isLibraryView && <SectionContextMenu />}
          </div>

          <div className={`grid grid-cols-1 ${!isLibraryView ? 'lg:grid-cols-4' : ''} gap-8`}>
            {!isLibraryView && (
              <div className="lg:col-span-1">
                <IngredientFilters
                  onFiltersChange={handleFiltersChange}
                  activeFilters={activeFilters}
                  onClearFilters={handleClearFilters}
                  className="sticky top-32"
                />
              </div>
            )}

            <div className={!isLibraryView ? 'lg:col-span-3' : 'col-span-1'}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <span className="font-body font-body-medium text-sm text-foreground">
                    {filteredIngredients.length} ingredients found
                  </span>
                  {searchQuery && !isLibraryView && (
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
                  >
                    <span className="sr-only">Grid view</span>
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    iconName="List"
                  >
                    <span className="sr-only">List view</span>
                  </Button>
                </div>
              </div>

              {filteredIngredients.length > 0 ? (
                <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}`}>
                  {filteredIngredients.map((ingredient) => (
                    <IngredientCard
                      key={ingredient.id}
                      ingredient={ingredient}
                      onViewDetails={handleViewDetails}
                      onBookmark={handleBookmark}
                      onCheckCompatibility={handleCheckCompatibility}
                      isBookmarked={bookmarkedIngredients.includes(ingredient.id)}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Icon name={isLibraryView ? 'BookmarkX' : 'Search'} size={48} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-heading font-heading-semibold text-lg text-foreground mb-2">
                    {isLibraryView ? 'No Bookmarked Ingredients' : 'No ingredients found'}
                  </h3>
                  <p className="font-body font-body-normal text-muted-foreground mb-4">
                    {isLibraryView 
                      ? 'You haven\'t bookmarked any ingredients yet.'
                      : 'Try adjusting your search terms or filters'}
                  </p>
                  {!isLibraryView && (
                    <Button variant="outline" onClick={handleClearFilters}>
                      Clear all filters
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          {!isLibraryView && (
            <>
              <div className="mt-16">
                <EducationalContent />
              </div>
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
                    className="justify-start"
                  >
                    Check Ingredient Compatibility
                  </Button>
                   <Button
                    variant="outline"
                    onClick={handleToggleLibraryView}
                    iconName="Bookmark"
                    iconPosition="left"
                    className="justify-start"
                  >
                    View Bookmarked Ingredients ({bookmarkedIngredients.length})
                  </Button>
                   <Button
                    variant="outline"
                    iconName="Download"
                    iconPosition="left"
                    className="justify-start"
                  >
                    Download Ingredient Guide
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <IngredientDetailModal
        ingredient={selectedIngredient}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onBookmark={handleBookmark}
        isBookmarked={selectedIngredient && bookmarkedIngredients.includes(selectedIngredient.id)}
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
