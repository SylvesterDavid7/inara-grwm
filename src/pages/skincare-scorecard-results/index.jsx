import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Header from '../../components/ui/Header';
import SectionContextMenu from '../../components/ui/SectionContextMenu';
import OverallScoreCard from './components/OverallScoreCard';
import RoutineScoreSection from './components/RoutineScoreSection';
import IngredientCompatibilityCard from './components/IngredientCompatibilityCard';
import MetricsDashboard from './components/MetricsDashboard';
import RecommendationCards from './components/RecommendationCards';
import BeforeAfterComparison from './components/BeforeAfterComparison';
import ActionSidebar from './components/ActionSidebar';

const SkincareScoreCardResults = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Mock data for overall score
  const overallScore = {
    score: 78,
    rating: "Good",
    improvement: "Consider adding vitamin C serum for enhanced antioxidant protection."
  };

  // Mock data for routine scores
  const morningRoutineData = {
    title: "Morning Routine",
    score: 82,
    timeOfDay: "morning",
    products: [
      {
        name: "CeraVe Foaming Facial Cleanser",
        category: "Cleanser",
        step: "Step 1",
        rating: "Excellent",
        score: 9,
        issues: []
      },
      {
        name: "The Ordinary Hyaluronic Acid 2% + B5",
        category: "Serum",
        step: "Step 2",
        rating: "Good",
        score: 8,
        issues: []
      },
      {
        name: "Neutrogena Ultra Sheer Dry-Touch SPF 55",
        category: "Sunscreen",
        step: "Step 3",
        rating: "Good",
        score: 7,
        issues: ["High chemical filter concentration"]
      }
    ]
  };

  const eveningRoutineData = {
    title: "Evening Routine",
    score: 74,
    timeOfDay: "evening",
    products: [
      {
        name: "CeraVe Foaming Facial Cleanser",
        category: "Cleanser",
        step: "Step 1",
        rating: "Excellent",
        score: 9,
        issues: []
      },
      {
        name: "Paula\'s Choice 2% BHA Liquid Exfoliant",
        category: "Treatment",
        step: "Step 2",
        rating: "Excellent",
        score: 9,
        issues: []
      },
      {
        name: "Olay Regenerist Micro-Sculpting Cream",
        category: "Moisturizer",
        step: "Step 3",
        rating: "Fair",
        score: 6,
        issues: ["Contains potential irritants", "Heavy for oily skin"]
      }
    ]
  };

  // Mock data for ingredient compatibility
  const compatibilityData = {
    safetyScore: 85,
    safeIngredients: 12,
    cautionIngredients: 3,
    conflictIngredients: 1,
    conflicts: [
      {
        ingredient1: "Salicylic Acid",
        ingredient2: "Retinol",
        severity: "medium",
        description: "May cause increased skin sensitivity when used together",
        detailedDescription: "Both salicylic acid and retinol are active ingredients that can increase skin cell turnover. Using them simultaneously may lead to excessive dryness, irritation, and increased photosensitivity.",
        explanation: "These ingredients work by accelerating skin cell renewal, but combining them can overwhelm the skin's natural barrier function, especially for sensitive skin types.",
        products: ["Paula\'s Choice BHA", "Olay Regenerist Cream"],
        recommendations: [
          "Use salicylic acid in the morning and retinol at night",
          "Start with lower concentrations and gradually increase",
          "Always use sunscreen during the day when using these actives",
          "Consider alternating days if irritation occurs"
        ]
      }
    ]
  };

  // Mock data for metrics
  const metricsData = {
    effectiveness: 78,
    safety: 85,
    goalAlignment: 72,
    costEfficiency: 6.5
  };

  // Mock data for recommendations
  const recommendationsData = [
    {
      id: 1,
      name: "Mad Hippie Vitamin C Serum",
      brand: "Mad Hippie",
      category: "Serum",
      priority: "high",
      reason: "Your routine lacks vitamin C for antioxidant protection and brightening",
      benefits: ["Antioxidant Protection", "Brightening", "Anti-aging", "Collagen Support"],
      image: "https://images.pexels.com/photos/7755467/pexels-photo-7755467.jpeg",
      rating: 4.3,
      reviews: 1247,
      price: 33.99,
      originalPrice: 39.99,
      discount: 15,
      inStock: true,
      fastShipping: true
    },
    {
      id: 2,
      name: "La Roche-Posay Toleriane Double Repair Face Moisturizer",
      brand: "La Roche-Posay",
      category: "Moisturizer",
      priority: "medium",
      reason: "Better suited for your oily skin type than current heavy moisturizer",
      benefits: ["Lightweight", "Non-comedogenic", "Ceramides", "Niacinamide"],
      image: "https://images.pexels.com/photos/7755468/pexels-photo-7755468.jpeg",
      rating: 4.5,
      reviews: 2156,
      price: 19.99,
      inStock: true,
      fastShipping: false
    },
    {
      id: 3,
      name: "EltaMD UV Clear Broad-Spectrum SPF 46",
      brand: "EltaMD",
      category: "Sunscreen",
      priority: "low",
      reason: "Mineral sunscreen alternative with niacinamide for sensitive skin",
      benefits: ["Mineral Protection", "Niacinamide", "Non-comedogenic", "Sensitive Skin"],
      image: "https://images.pexels.com/photos/7755469/pexels-photo-7755469.jpeg",
      rating: 4.7,
      reviews: 892,
      price: 37.00,
      inStock: false,
      fastShipping: false
    }
  ];

  // Mock data for progress tracking
  const progressData = [
    {
      timeframe: '1week',
      beforeImage: 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg',
      afterImage: 'https://images.pexels.com/photos/3762880/pexels-photo-3762880.jpeg',
      metrics: [
        { label: 'Hydration', change: 5 },
        { label: 'Texture', change: 2 },
        { label: 'Brightness', change: 1 },
        { label: 'Clarity', change: 3 }
      ],
      beforeAnnotations: [
        { x: 30, y: 40, label: 'Dry Patch', description: 'Noticeable dry area on cheek' },
        { x: 60, y: 25, label: 'Fine Lines', description: 'Expression lines around eyes' }
      ],
      afterAnnotations: [
        { x: 30, y: 40, label: 'Improved Hydration', description: 'Dry patch showing improvement', improvement: 15 },
        { x: 60, y: 25, label: 'Smoother Texture', description: 'Lines appear softer', improvement: 8 }
      ]
    },
    {
      timeframe: '1month',
      beforeImage: 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg',
      afterImage: 'https://images.pexels.com/photos/3762881/pexels-photo-3762881.jpeg',
      metrics: [
        { label: 'Hydration', change: 15 },
        { label: 'Texture', change: 12 },
        { label: 'Brightness', change: 8 },
        { label: 'Clarity', change: 18 }
      ],
      beforeAnnotations: [
        { x: 30, y: 40, label: 'Dry Patch', description: 'Noticeable dry area on cheek' },
        { x: 60, y: 25, label: 'Fine Lines', description: 'Expression lines around eyes' },
        { x: 45, y: 60, label: 'Uneven Tone', description: 'Slight discoloration' }
      ],
      afterAnnotations: [
        { x: 30, y: 40, label: 'Hydrated Skin', description: 'Significant improvement in moisture', improvement: 45 },
        { x: 60, y: 25, label: 'Reduced Lines', description: 'Noticeable reduction in fine lines', improvement: 25 },
        { x: 45, y: 60, label: 'Even Tone', description: 'More uniform skin tone', improvement: 30 }
      ]
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'analysis', label: 'Detailed Analysis', icon: 'Search' },
    { id: 'recommendations', label: 'Recommendations', icon: 'Star' },
    { id: 'progress', label: 'Progress Tracking', icon: 'TrendingUp' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center space-y-4">
            <Icon name="Loader2" size={48} className="text-primary animate-spin mx-auto" />
            <div className="space-y-2">
              <h2 className="text-xl font-heading font-heading-semibold text-foreground">
                Analyzing Your Routine
              </h2>
              <p className="text-muted-foreground font-body font-body-normal">
                Processing ingredients and generating your personalized scorecard...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        {/* Page Header */}
        <div className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Link
                    to="/skin-assessment-questionnaire"
                    className="text-muted-foreground hover:text-foreground transition-clinical"
                  >
                    <Icon name="ArrowLeft" size={20} />
                  </Link>
                  <h1 className="text-2xl font-heading font-heading-bold text-foreground">
                    Your Skincare Scorecard
                  </h1>
                </div>
                <p className="text-muted-foreground font-body font-body-normal">
                  Comprehensive analysis of your routine with personalized recommendations
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <SectionContextMenu />
                <Link
                  to="/product-recommendations"
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-clinical hover:bg-primary/90 transition-clinical"
                >
                  <Icon name="ArrowRight" size={16} />
                  <span className="font-body font-body-medium text-sm">View Recommendations</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-background border-b border-border sticky top-16 z-secondary-nav">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex space-x-1 overflow-x-auto">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-clinical whitespace-nowrap ${
                    activeTab === tab?.id
                      ? 'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span className="font-body font-body-medium text-sm">{tab?.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-8 space-y-8">
              {activeTab === 'overview' && (
                <>
                  {/* Overall Score */}
                  <OverallScoreCard {...overallScore} />
                  
                  {/* Metrics Dashboard */}
                  <MetricsDashboard metrics={metricsData} />
                  
                  {/* Routine Scores */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-heading font-heading-semibold text-foreground">
                      Routine Breakdown
                    </h2>
                    <RoutineScoreSection {...morningRoutineData} isExpanded={true} />
                    <RoutineScoreSection {...eveningRoutineData} />
                  </div>
                </>
              )}

              {activeTab === 'analysis' && (
                <>
                  {/* Ingredient Compatibility */}
                  <IngredientCompatibilityCard compatibilityData={compatibilityData} />
                  
                  {/* Detailed Routine Analysis */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-heading font-heading-semibold text-foreground">
                      Detailed Analysis
                    </h2>
                    <RoutineScoreSection {...morningRoutineData} isExpanded={true} />
                    <RoutineScoreSection {...eveningRoutineData} isExpanded={true} />
                  </div>
                </>
              )}

              {activeTab === 'recommendations' && (
                <RecommendationCards recommendations={recommendationsData} />
              )}

              {activeTab === 'progress' && (
                <BeforeAfterComparison progressData={progressData} />
              )}
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block lg:col-span-4">
              <div className="sticky top-32">
                <ActionSidebar />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Action Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-secondary-nav">
          <div className="flex space-x-3">
            <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-primary text-primary-foreground rounded-clinical hover:bg-primary/90 transition-clinical">
              <Icon name="Download" size={16} />
              <span className="font-body font-body-medium text-sm">Export</span>
            </button>
            <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-secondary text-secondary-foreground rounded-clinical hover:bg-secondary/80 transition-clinical">
              <Icon name="Share2" size={16} />
              <span className="font-body font-body-medium text-sm">Share</span>
            </button>
            <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-accent text-accent-foreground rounded-clinical hover:bg-accent/90 transition-clinical">
              <Icon name="Zap" size={16} />
              <span className="font-body font-body-medium text-sm">Optimize</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkincareScoreCardResults;