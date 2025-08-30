import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import QuickAccessToolbar from '../../components/ui/QuickAccessToolbar';
import SectionContextMenu from '../../components/ui/SectionContextMenu';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import RecommendationCard from './components/RecommendationCard';
import FilterSidebar from './components/FilterSidebar';
import CategoryTabs from './components/CategoryTabs';
import ActiveFilters from './components/ActiveFilters';
import ProductDetailModal from './components/ProductDetailModal';

const ProductRecommendations = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    priceRange: [0, 200],
    skinConcerns: [],
    ingredients: [],
    brands: [],
    sortBy: 'compatibility',
    sampleAvailable: false,
    onSale: false,
    crueltyFree: false,
    fragranceFree: false
  });

  // Mock product data
  const mockProducts = [
    {
      id: 1,
      name: "Hydrating Hyaluronic Acid Serum",
      brand: "CeraVe",
      category: "Missing Essentials",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop&crop=center",
      price: 24.99,
      originalPrice: 29.99,
      pricePerOz: 12.50,
      rating: 4.6,
      reviewCount: 2847,
      compatibilityScore: 94,
      keyIngredients: ["Hyaluronic Acid", "Vitamin B5", "Ceramides"],
      isWishlisted: false,
      sampleAvailable: true,
      description: `A lightweight, fast-absorbing serum that delivers intense hydration to all skin types. Formulated with three types of hyaluronic acid to plump and smooth the skin while strengthening the moisture barrier.`
    },
    {
      id: 2,
      name: "Vitamin C + E Brightening Serum",
      brand: "SkinCeuticals",
      category: "Upgrade Options",
      image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop&crop=center",
      price: 89.00,
      originalPrice: null,
      pricePerOz: 29.67,
      rating: 4.8,
      reviewCount: 1523,
      compatibilityScore: 87,
      keyIngredients: ["L-Ascorbic Acid", "Vitamin E", "Ferulic Acid"],
      isWishlisted: true,
      sampleAvailable: false,
      description: `A potent antioxidant serum that brightens skin tone, reduces fine lines, and provides environmental protection. Clinical-grade vitamin C formula for maximum efficacy.`
    },
    {
      id: 3,
      name: "Niacinamide 10% + Zinc 1%",
      brand: "The Ordinary",
      category: "Concern-Specific",
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop&crop=center",
      price: 7.90,
      originalPrice: null,
      pricePerOz: 2.63,
      rating: 4.3,
      reviewCount: 8934,
      compatibilityScore: 91,
      keyIngredients: ["Niacinamide", "Zinc PCA"],
      isWishlisted: false,
      sampleAvailable: true,
      description: `A high-strength niacinamide serum that reduces the appearance of blemishes and congestion while balancing sebum production. Ideal for oily and acne-prone skin.`
    },
    {
      id: 4,
      name: "Gentle Foaming Cleanser",
      brand: "La Roche-Posay",
      category: "Budget Alternatives",
      image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=center",
      price: 14.99,
      originalPrice: 18.99,
      pricePerOz: 1.25,
      rating: 4.5,
      reviewCount: 3421,
      compatibilityScore: 89,
      keyIngredients: ["Thermal Spring Water", "Glycerin", "Coco-Betaine"],
      isWishlisted: false,
      sampleAvailable: false,
      description: `A soap-free, gentle cleanser that removes makeup and impurities without stripping the skin. Suitable for sensitive skin and maintains the skin's natural pH balance.`
    },
    {
      id: 5,
      name: "Retinol 0.5% in Squalane",
      brand: "The Ordinary",
      category: "Upgrade Options",
      image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop&crop=center",
      price: 9.90,
      originalPrice: null,
      pricePerOz: 3.30,
      rating: 4.4,
      reviewCount: 5672,
      compatibilityScore: 76,
      keyIngredients: ["Retinol", "Squalane"],
      isWishlisted: false,
      sampleAvailable: true,
      description: `A moderate-strength retinol treatment that targets signs of aging while being gentle on the skin. Suspended in squalane for enhanced stability and reduced irritation.`
    },
    {
      id: 6,
      name: "Daily Moisturizing Lotion",
      brand: "CeraVe",
      category: "Missing Essentials",
      image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop&crop=center",
      price: 16.99,
      originalPrice: null,
      pricePerOz: 1.42,
      rating: 4.7,
      reviewCount: 12847,
      compatibilityScore: 96,
      keyIngredients: ["Ceramides", "Hyaluronic Acid", "MVE Technology"],
      isWishlisted: true,
      sampleAvailable: false,
      description: `A lightweight, non-greasy moisturizer that provides 24-hour hydration. Features patented MVE technology for controlled release of moisturizing ingredients throughout the day.`
    }
  ];

  const categories = [
    { id: 'all', label: 'All Recommendations', count: mockProducts?.length },
    { id: 'missing-essentials', label: 'Missing Essentials', count: mockProducts?.filter(p => p?.category === 'Missing Essentials')?.length },
    { id: 'upgrade-options', label: 'Upgrade Options', count: mockProducts?.filter(p => p?.category === 'Upgrade Options')?.length },
    { id: 'concern-specific', label: 'Concern-Specific', count: mockProducts?.filter(p => p?.category === 'Concern-Specific')?.length },
    { id: 'budget-alternatives', label: 'Budget Alternatives', count: mockProducts?.filter(p => p?.category === 'Budget Alternatives')?.length }
  ];

  const filteredProducts = mockProducts?.filter(product => {
    // Category filter
    if (activeCategory !== 'all') {
      const categoryMap = {
        'missing-essentials': 'Missing Essentials',
        'upgrade-options': 'Upgrade Options',
        'concern-specific': 'Concern-Specific',
        'budget-alternatives': 'Budget Alternatives'
      };
      if (product?.category !== categoryMap?.[activeCategory]) return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery?.toLowerCase();
      if (!product?.name?.toLowerCase()?.includes(query) && 
          !product?.brand?.toLowerCase()?.includes(query) &&
          !product?.keyIngredients?.some(ing => ing?.toLowerCase()?.includes(query))) {
        return false;
      }
    }

    // Price range filter
    if (product?.price < filters?.priceRange?.[0] || product?.price > filters?.priceRange?.[1]) {
      return false;
    }

    // Additional filters
    if (filters?.sampleAvailable && !product?.sampleAvailable) return false;
    if (filters?.onSale && (!product?.originalPrice || product?.originalPrice <= product?.price)) return false;

    return true;
  });

  const sortedProducts = [...filteredProducts]?.sort((a, b) => {
    switch (filters?.sortBy) {
      case 'compatibility':
        return b?.compatibilityScore - a?.compatibilityScore;
      case 'rating':
        return b?.rating - a?.rating;
      case 'price-low':
        return a?.price - b?.price;
      case 'price-high':
        return b?.price - a?.price;
      case 'newest':
        return b?.id - a?.id;
      case 'popular':
        return b?.reviewCount - a?.reviewCount;
      default:
        return 0;
    }
  });

  const handleAddToRoutine = (product) => {
    console.log('Adding to routine:', product);
    // Implement add to routine logic
  };

  const handleSaveToWishlist = (productId, isWishlisted) => {
    console.log('Wishlist toggle:', productId, isWishlisted);
    // Implement wishlist logic
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleRemoveFilter = (filterType, filterValue) => {
    const newFilters = { ...filters };
    
    if (filterType === 'priceRange') {
      newFilters.priceRange = [0, 200];
    } else if (Array.isArray(newFilters?.[filterType])) {
      newFilters[filterType] = newFilters?.[filterType]?.filter(item => item !== filterValue);
    } else {
      newFilters[filterType] = false;
    }
    
    setFilters(newFilters);
  };

  const handleClearAllFilters = () => {
    setFilters({
      priceRange: [0, 200],
      skinConcerns: [],
      ingredients: [],
      brands: [],
      sortBy: 'compatibility',
      sampleAvailable: false,
      onSale: false,
      crueltyFree: false,
      fragranceFree: false
    });
  };

  return (
    <>
      <Helmet>
        <title>Product Recommendations - SkinScore Analyzer</title>
        <meta name="description" content="Discover personalized skincare product recommendations based on your routine analysis and skin assessment. Find the perfect products for your skin type and concerns." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <QuickAccessToolbar />

        {/* Page Header */}
        <div className="bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-heading font-heading-bold text-3xl text-foreground mb-2">
                  Product Recommendations
                </h1>
                <p className="font-body font-body-normal text-muted-foreground">
                  Personalized product suggestions based on your skin analysis and routine compatibility
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <SectionContextMenu />
                
                {/* View Mode Toggle */}
                <div className="hidden md:flex items-center space-x-1 bg-muted rounded-clinical p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    iconName="Grid3X3"
                    iconSize={16}
                    className="h-8 w-8 p-0"
                  >
                    <span className="sr-only">Grid view</span>
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    iconName="List"
                    iconSize={16}
                    className="h-8 w-8 p-0"
                  >
                    <span className="sr-only">List view</span>
                  </Button>
                </div>

                {/* Filter Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  iconName="Filter"
                  iconPosition="left"
                  iconSize={16}
                  className="lg:hidden"
                >
                  Filters
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Active Filters */}
        <ActiveFilters
          filters={filters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearAllFilters}
        />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex gap-6">
            {/* Desktop Filter Sidebar */}
            <div className={`hidden lg:block w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden'}`}>
              <div className="sticky top-32">
                <FilterSidebar
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onClearFilters={handleClearAllFilters}
                />
              </div>
            </div>

            {/* Mobile Filter Overlay */}
            {showFilters && (
              <div className="lg:hidden fixed inset-0 z-secondary-nav bg-background/80 backdrop-blur-sm">
                <div className="absolute inset-y-0 left-0 w-80 bg-background border-r border-border">
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <h2 className="font-heading font-heading-semibold text-lg text-foreground">
                      Filters
                    </h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowFilters(false)}
                      iconName="X"
                      iconSize={20}
                    >
                      <span className="sr-only">Close filters</span>
                    </Button>
                  </div>
                  <FilterSidebar
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    onClearFilters={handleClearAllFilters}
                    className="h-full"
                  />
                </div>
              </div>
            )}

            {/* Products Grid */}
            <div className="flex-1">
              {/* Search and Results Count */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Input
                      type="search"
                      placeholder="Search products, brands, ingredients..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e?.target?.value)}
                      className="w-80 pl-10"
                    />
                    <Icon
                      name="Search"
                      size={16}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none"
                    />
                  </div>
                </div>

                <div className="font-body font-body-normal text-sm text-muted-foreground">
                  {sortedProducts?.length} products found
                </div>
              </div>

              {/* Products */}
              {sortedProducts?.length > 0 ? (
                <div className={`grid gap-6 ${
                  viewMode === 'grid' ?'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' :'grid-cols-1'
                }`}>
                  {sortedProducts?.map((product) => (
                    <RecommendationCard
                      key={product?.id}
                      product={product}
                      onAddToRoutine={handleAddToRoutine}
                      onSaveToWishlist={handleSaveToWishlist}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-heading font-heading-medium text-lg text-foreground mb-2">
                    No products found
                  </h3>
                  <p className="font-body font-body-normal text-muted-foreground mb-4">
                    Try adjusting your filters or search terms to find more products.
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleClearAllFilters}
                    iconName="RotateCcw"
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

        {/* Product Detail Modal */}
        <ProductDetailModal
          product={selectedProduct}
          isOpen={showProductModal}
          onClose={() => setShowProductModal(false)}
          onAddToRoutine={handleAddToRoutine}
          onSaveToWishlist={handleSaveToWishlist}
        />
      </div>
    </>
  );
};

export default ProductRecommendations;