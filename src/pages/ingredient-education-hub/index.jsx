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

  // Mock ingredients data
  const mockIngredients = [
    {
      id: 1,
      name: "Retinol",
      scientificName: "Vitamin A",
      description: "A powerful anti-aging ingredient that promotes cell turnover and collagen production, helping to reduce fine lines and improve skin texture.",
      detailedDescription: `Retinol is a derivative of Vitamin A and one of the most researched anti-aging ingredients in skincare. It works by accelerating cell turnover, promoting the shedding of old skin cells and the generation of new ones. This process helps to smooth fine lines, improve skin texture, and fade dark spots.\n\nRetinol also stimulates collagen production in the deeper layers of the skin, which helps to improve skin firmness and elasticity over time. It's particularly effective for treating acne, as it helps to unclog pores and prevent the formation of new breakouts.`,
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop",
      safetyRating: "moderate",
      rating: 4.5,
      concentration: "0.25-1%",
      frequency: "Evening only",
      skinConcerns: ["aging", "acne", "hyperpigmentation"],
      category: "actives",
      phLevel: "5.5-6.0",
      molecularWeight: "286.45 Da",
      solubility: "Oil-soluble",
      stability: "Light-sensitive",
      timeOfUse: ["evening"],
      usageInstructions: "Start with 2-3 times per week and gradually increase frequency. Always use sunscreen during the day as retinol increases photosensitivity.",
      benefits: [
        { title: "Anti-aging", description: "Reduces fine lines and wrinkles by stimulating collagen production" },
        { title: "Acne treatment", description: "Unclogs pores and prevents new breakouts" },
        { title: "Skin texture", description: "Smooths rough skin and improves overall texture" },
        { title: "Hyperpigmentation", description: "Fades dark spots and evens skin tone" }
      ],
      sideEffects: [
        { title: "Initial irritation", description: "May cause redness, peeling, and dryness when first starting" },
        { title: "Photosensitivity", description: "Increases skin\'s sensitivity to sun exposure" },
        { title: "Pregnancy concerns", description: "Not recommended during pregnancy or breastfeeding" }
      ],
      compatibleWith: [
        { name: "Hyaluronic Acid", reason: "Provides hydration to counteract dryness" },
        { name: "Niacinamide", reason: "Reduces irritation and enhances barrier function" }
      ],
      incompatibleWith: [
        { name: "Vitamin C", reason: "May cause irritation when used together" },
        { name: "Benzoyl Peroxide", reason: "Can deactivate retinol and cause excessive dryness" }
      ],
      studies: [
        {
          title: "Efficacy of Retinol in Photoaging Treatment",
          year: "2023",
          journal: "Journal of Dermatological Science",
          summary: "12-week study showing significant improvement in fine lines and skin texture with 0.5% retinol use."
        },
        {
          title: "Retinol vs Retinyl Palmitate: Comparative Analysis",
          year: "2022",
          journal: "Clinical Dermatology Review",
          summary: "Comparative study demonstrating superior efficacy of retinol over retinyl palmitate in anti-aging applications."
        }
      ]
    },
    {
      id: 2,
      name: "Niacinamide",
      scientificName: "Nicotinamide",
      description: "A versatile form of Vitamin B3 that regulates oil production, minimizes pores, and strengthens the skin barrier.",
      detailedDescription: `Niacinamide, also known as nicotinamide, is a water-soluble form of Vitamin B3 that offers multiple benefits for all skin types. It's particularly effective for oily and acne-prone skin due to its ability to regulate sebum production and minimize the appearance of pores.\n\nThis ingredient also strengthens the skin barrier by increasing ceramide production, which helps to retain moisture and protect against environmental stressors. Niacinamide has anti-inflammatory properties that can help calm irritated skin and reduce redness.`,
      image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=300&fit=crop",
      safetyRating: "excellent",
      rating: 4.7,
      concentration: "2-10%",
      frequency: "Morning and evening",
      skinConcerns: ["oiliness", "acne", "sensitivity", "hyperpigmentation"],
      category: "actives",
      phLevel: "5.0-7.0",
      molecularWeight: "122.12 Da",
      solubility: "Water-soluble",
      stability: "Very stable",
      timeOfUse: ["morning", "evening"],
      usageInstructions: "Can be used twice daily. Start with lower concentrations (2-5%) and increase as tolerated. Compatible with most other ingredients.",
      benefits: [
        { title: "Oil control", description: "Regulates sebum production for balanced skin" },
        { title: "Pore minimizing", description: "Reduces the appearance of enlarged pores" },
        { title: "Barrier strengthening", description: "Improves skin barrier function and hydration" },
        { title: "Anti-inflammatory", description: "Calms irritation and reduces redness" }
      ],
      sideEffects: [
        { title: "Minimal side effects", description: "Generally well-tolerated by all skin types" },
        { title: "Rare flushing", description: "Very high concentrations may cause temporary flushing in sensitive individuals" }
      ],
      compatibleWith: [
        { name: "Retinol", reason: "Reduces retinol irritation and enhances tolerance" },
        { name: "Hyaluronic Acid", reason: "Works synergistically for hydration and barrier repair" },
        { name: "Vitamin C", reason: "Stable combination that enhances antioxidant benefits" }
      ],
      incompatibleWith: [],
      studies: [
        {
          title: "Niacinamide in Acne Treatment: A Comprehensive Review",
          year: "2023",
          journal: "International Journal of Dermatology",
          summary: "Meta-analysis of 15 studies confirming niacinamide\'s efficacy in reducing acne lesions and sebum production."
        }
      ]
    },
    {
      id: 3,
      name: "Hyaluronic Acid",
      scientificName: "Sodium Hyaluronate",
      description: "A powerful humectant that can hold up to 1000 times its weight in water, providing intense hydration to all skin types.",
      detailedDescription: `Hyaluronic Acid is a naturally occurring substance in our skin that acts as a powerful humectant, capable of holding up to 1000 times its weight in water. As we age, our natural hyaluronic acid levels decrease, leading to dryness and loss of plumpness.\n\nTopical hyaluronic acid helps to replenish moisture levels and create a plumping effect that can temporarily reduce the appearance of fine lines. It's suitable for all skin types, including oily skin, as it provides hydration without adding oil.`,
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
      safetyRating: "excellent",
      rating: 4.6,
      concentration: "0.5-2%",
      frequency: "Morning and evening",
      skinConcerns: ["dryness", "aging", "sensitivity"],
      category: "moisturizers",
      phLevel: "6.0-8.0",
      molecularWeight: "1500-1800 kDa",
      solubility: "Water-soluble",
      stability: "Stable",
      timeOfUse: ["morning", "evening"],
      usageInstructions: "Apply to damp skin and follow with a moisturizer to seal in hydration. Can be used twice daily.",
      benefits: [
        { title: "Intense hydration", description: "Provides immediate and long-lasting moisture" },
        { title: "Plumping effect", description: "Temporarily reduces appearance of fine lines" },
        { title: "Suitable for all skin types", description: "Provides hydration without clogging pores" },
        { title: "Healing support", description: "Promotes wound healing and skin repair" }
      ],
      sideEffects: [
        { title: "Rare allergic reactions", description: "Very uncommon, but possible in sensitive individuals" },
        { title: "Potential dryness", description: "May draw moisture from skin if not sealed with moisturizer" }
      ],
      compatibleWith: [
        { name: "Niacinamide", reason: "Enhances barrier function and hydration" },
        { name: "Vitamin C", reason: "Provides hydration while vitamin C works" },
        { name: "Retinol", reason: "Counteracts dryness from retinol use" }
      ],
      incompatibleWith: [],
      studies: [
        {
          title: "Topical Hyaluronic Acid in Skin Hydration",
          year: "2023",
          journal: "Dermatology Research and Practice",
          summary: "Clinical study demonstrating significant improvement in skin hydration and elasticity with topical hyaluronic acid."
        }
      ]
    },
    {
      id: 4,
      name: "Vitamin C",
      scientificName: "L-Ascorbic Acid",
      description: "A potent antioxidant that brightens skin, stimulates collagen production, and protects against environmental damage.",
      detailedDescription: `Vitamin C is one of the most researched and effective antioxidants in skincare. L-Ascorbic Acid is the most potent form, offering superior antioxidant protection and collagen-stimulating benefits.\n\nThis ingredient helps to neutralize free radicals that cause premature aging, while also inhibiting melanin production to fade dark spots and brighten overall skin tone. Vitamin C also plays a crucial role in collagen synthesis, helping to maintain skin firmness and elasticity.`,
      image: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400&h=300&fit=crop",
      safetyRating: "good",
      rating: 4.4,
      concentration: "10-20%",
      frequency: "Morning preferred",
      skinConcerns: ["hyperpigmentation", "aging", "dryness"],
      category: "antioxidants",
      phLevel: "3.5-4.0",
      molecularWeight: "176.12 Da",
      solubility: "Water-soluble",
      stability: "Unstable (light and air sensitive)",
      timeOfUse: ["morning"],
      usageInstructions: "Use in the morning under sunscreen. Start with lower concentrations and gradually increase. Store in a cool, dark place.",
      benefits: [
        { title: "Antioxidant protection", description: "Neutralizes free radicals and environmental damage" },
        { title: "Brightening", description: "Fades dark spots and evens skin tone" },
        { title: "Collagen synthesis", description: "Stimulates collagen production for firmer skin" },
        { title: "Sun damage repair", description: "Helps repair existing sun damage" }
      ],
      sideEffects: [
        { title: "Initial irritation", description: "May cause stinging or redness when first introduced" },
        { title: "Oxidation", description: "Product may turn brown/orange, indicating loss of potency" },
        { title: "Photosensitivity", description: "May increase sun sensitivity in some individuals" }
      ],
      compatibleWith: [
        { name: "Hyaluronic Acid", reason: "Provides hydration and reduces irritation" },
        { name: "Vitamin E", reason: "Synergistic antioxidant combination" }
      ],
      incompatibleWith: [
        { name: "Retinol", reason: "May cause irritation when used together" },
        { name: "Benzoyl Peroxide", reason: "Can oxidize and deactivate vitamin C" }
      ],
      studies: [
        {
          title: "Vitamin C in Photoaging Prevention",
          year: "2023",
          journal: "Journal of Clinical and Aesthetic Dermatology",
          summary: "Randomized controlled trial showing significant improvement in photoaging signs with 15% L-Ascorbic Acid."
        }
      ]
    },
    {
      id: 5,
      name: "Salicylic Acid",
      scientificName: "2-Hydroxybenzoic Acid",
      description: "A beta-hydroxy acid that penetrates pores to exfoliate from within, making it ideal for acne-prone and oily skin.",
      detailedDescription: `Salicylic Acid is a beta-hydroxy acid (BHA) that is oil-soluble, allowing it to penetrate deep into pores to dissolve excess sebum and dead skin cells. This makes it particularly effective for treating acne and preventing future breakouts.\n\nUnlike alpha-hydroxy acids that work on the skin's surface, salicylic acid can work inside the pore, making it ideal for blackheads and whiteheads. It also has anti-inflammatory properties that help reduce redness and swelling associated with acne.`,
      image: "https://images.unsplash.com/photo-1556228578-dd6f8cfc2c2d?w=400&h=300&fit=crop",
      safetyRating: "good",
      rating: 4.3,
      concentration: "0.5-2%",
      frequency: "Evening or as needed",
      skinConcerns: ["acne", "oiliness", "hyperpigmentation"],
      category: "exfoliants",
      phLevel: "3.0-4.0",
      molecularWeight: "138.12 Da",
      solubility: "Oil-soluble",
      stability: "Stable",
      timeOfUse: ["evening"],
      usageInstructions: "Start with 2-3 times per week and increase as tolerated. Always use sunscreen as BHAs can increase photosensitivity.",
      benefits: [
        { title: "Pore cleansing", description: "Penetrates and clears clogged pores" },
        { title: "Acne treatment", description: "Reduces existing breakouts and prevents new ones" },
        { title: "Exfoliation", description: "Removes dead skin cells for smoother texture" },
        { title: "Anti-inflammatory", description: "Reduces redness and swelling" }
      ],
      sideEffects: [
        { title: "Initial dryness", description: "May cause dryness and peeling when first starting" },
        { title: "Increased sun sensitivity", description: "Makes skin more susceptible to sun damage" },
        { title: "Over-exfoliation", description: "Excessive use can lead to irritation and barrier damage" }
      ],
      compatibleWith: [
        { name: "Niacinamide", reason: "Reduces irritation and balances oil production" },
        { name: "Hyaluronic Acid", reason: "Provides hydration to counteract dryness" }
      ],
      incompatibleWith: [
        { name: "Retinol", reason: "May cause excessive irritation and dryness" },
        { name: "Vitamin C", reason: "pH incompatibility may reduce effectiveness" }
      ],
      studies: [
        {
          title: "Salicylic Acid in Acne Management",
          year: "2022",
          journal: "Clinical, Cosmetic and Investigational Dermatology",
          summary: "Comprehensive review of salicylic acid\'s efficacy in treating various forms of acne."
        }
      ]
    },
    {
      id: 6,
      name: "Glycolic Acid",
      scientificName: "Hydroxyacetic Acid",
      description: "The smallest alpha-hydroxy acid that provides effective surface exfoliation to improve skin texture and radiance.",
      detailedDescription: `Glycolic Acid is the smallest molecule in the alpha-hydroxy acid (AHA) family, which allows it to penetrate the skin most effectively. It works by breaking down the bonds between dead skin cells, promoting their removal and revealing fresher, more radiant skin underneath.\n\nRegular use of glycolic acid can improve skin texture, reduce the appearance of fine lines, and help fade hyperpigmentation. It's particularly effective for sun-damaged skin and can help improve the absorption of other skincare products.`,
      image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop",
      safetyRating: "moderate",
      rating: 4.2,
      concentration: "5-30%",
      frequency: "Evening, 2-3 times per week",
      skinConcerns: ["aging", "hyperpigmentation", "dryness"],
      category: "exfoliants",
      phLevel: "3.0-4.0",
      molecularWeight: "76.05 Da",
      solubility: "Water-soluble",
      stability: "Stable",
      timeOfUse: ["evening"],
      usageInstructions: "Start with lower concentrations and gradually increase. Use 2-3 times per week initially. Always follow with sunscreen during the day.",
      benefits: [
        { title: "Surface exfoliation", description: "Removes dead skin cells for smoother texture" },
        { title: "Anti-aging", description: "Reduces fine lines and improves skin firmness" },
        { title: "Brightening", description: "Fades dark spots and improves radiance" },
        { title: "Enhanced absorption", description: "Improves penetration of other skincare products" }
      ],
      sideEffects: [
        { title: "Initial irritation", description: "May cause redness, stinging, and peeling" },
        { title: "Photosensitivity", description: "Significantly increases sun sensitivity" },
        { title: "Over-exfoliation risk", description: "Can damage skin barrier if overused" }
      ],
      compatibleWith: [
        { name: "Hyaluronic Acid", reason: "Provides essential hydration after exfoliation" },
        { name: "Niacinamide", reason: "Helps reduce irritation and strengthen barrier" }
      ],
      incompatibleWith: [
        { name: "Retinol", reason: "Combined use may cause severe irritation" },
        { name: "Vitamin C", reason: "pH levels may conflict and reduce effectiveness" }
      ],
      studies: [
        {
          title: "Glycolic Acid Peels in Photoaging Treatment",
          year: "2023",
          journal: "Aesthetic Surgery Journal",
          summary: "Clinical trial demonstrating significant improvement in photoaging signs with glycolic acid treatments."
        }
      ]
    }
  ];

  // Mock search suggestions
  const mockSuggestions = [
    { name: "Retinol", type: "ingredient", description: "Anti-aging vitamin A derivative", matchCount: 1 },
    { name: "Acne", type: "concern", description: "Breakouts and blemishes", matchCount: 3 },
    { name: "Anti-aging", type: "benefit", description: "Reduces signs of aging", matchCount: 4 },
    { name: "Active Ingredients", type: "category", description: "Potent treatment ingredients", matchCount: 6 },
    { name: "Niacinamide", type: "ingredient", description: "Versatile vitamin B3", matchCount: 1 },
    { name: "Hyperpigmentation", type: "concern", description: "Dark spots and uneven tone", matchCount: 4 }
  ];

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

          {/* Search Bar */}
          <div className="mb-8">
            <IngredientSearchBar
              onSearch={handleSearch}
              onSuggestionSelect={handleSuggestionSelect}
              suggestions={searchSuggestions}
              className="max-w-2xl mx-auto"
            />
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
                <div className={`${
                  viewMode === 'grid' ?'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' :'space-y-4'
                }`}>
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