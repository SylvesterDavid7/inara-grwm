import React from 'react';
import HeroSection from '../components/ui/HeroSection';
import FeatureCard from '../components/FeatureCard'; // Import the new component
import '../styles/glass-card.css';

const HomePage = () => {
  const features = [
    {
      title: 'Routine Analyser',
      description: 'Get an AI-powered analysis of your current skincare routine.',
      link: '/skincare-routine-input',
      cta: 'Analyze Now',
      cardImage: '/HP1.svg',
      requiresAuth: true, // Requires login
    },
    {
      title: 'For Beginners',
      description: 'New to skincare? Start here to build a foundational routine.',
      link: '/skin-assessment-questionnaire',
      cta: 'Start Assessment',
      cardImage: '/HP2.svg',
      requiresAuth: true, // Requires login
    },
    {
      title: 'My Dashboard',
      description: 'Track your progress, view your routine, and see personalized insights.',
      link: '/dashboard',
      cta: 'View Dashboard',
      cardImage: '/HP3.svg',
      requiresAuth: true, // Requires login
    },
    {
      title: 'Product Recommendations',
      description: 'Discover products tailored to your skin goals and routine analysis.',
      link: '/product-recommendations',
      cta: 'Browse Products',
      cardImage: '/HP4.svg',
      requiresAuth: true, // Requires login
    },
    {
        title: 'Ingredient Hub',
        description: 'Learn about skincare ingredients and check for compatibility.',
        link: '/ingredient-education-hub',
        cta: 'Explore Ingredients',
        cardImage: '/HP5.svg',
        requiresAuth: false, // Does not require login
    },
    {
        title: 'Skincare 101',
        description: 'Your guide to the fundamentals of skincare.',
        link: '/skincare-101',
        cta: 'Learn the Basics',
        cardImage: '/HP6.svg',
        requiresAuth: false, // Does not require login
    }
  ];

  return (
    <div>
      <HeroSection />
      <div className="text-foreground flex flex-col">
          <main className="flex-grow pt-10 pb-12 sm:pt-20 sm:pb-16 bg-white relative z-10">
              <div className="text-center max-w-4xl mx-auto px-4 sm:px-6">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-slate-800">Your Personal Skincare OS</h1>
                  <p className="mt-4 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
                      Achieve your skin goals with AI-powered analysis, personalized recommendations, and progress tracking.
                  </p>
              </div>

              <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-12 sm:mt-16">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                      {features.map((feature) => (
                          <FeatureCard key={feature.title} feature={feature} requiresAuth={feature.requiresAuth} />
                      ))}
                  </div>
              </div>
          </main>
      </div>
    </div>
  );
};

export default HomePage;
