import React from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/ui/HeroSection';
import AppIcon from '../components/AppIcon';
import '../styles/glass-card.css';
import '../styles/HeroSection.css'; // Import hero section styles for the arrow

const HomePage = () => {
  const featuresSectionRef = React.useRef(null);

  const handleScroll = () => {
    featuresSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    {
      title: 'Routine Analyser',
      description: 'Not sure if your skincare routine is doing its job? We’ll break it down and tell you what actually works!',
      link: '/skincare-routine-input',
      cta: 'Analyze Now',
      cardImage: '/HP1.svg'
    },
    {
      title: 'For Beginners',
      description: 'New to skincare? We’ll help you build a simple, effective routine from the ground up.',
      link: '/skin-assessment-questionnaire',
      cta: 'Start Assessment',
      cardImage: '/HP2.svg'
    },
    {
      title: 'My Dashboard',
      description: 'Track your progress, view your routine, and see personalized insights.',
      link: '/progress-tracking-dashboard',
      cta: 'View Dashboard',
      cardImage: '/HP3.svg'
    },
    {
      title: 'Product Recommendations',
      description: 'Discover products tailored to your skin goals and routine analysis.',
      link: '/product-recommendations',
      cta: 'Browse Products',
      cardImage: '/HP4.svg'
    },
    {
        title: 'Ingredient Hub',
        description: 'Learn about skincare ingredients and check for compatibility.',
        link: '/ingredient-education-hub',
        cta: 'Explore Ingredients',
        cardImage: '/HP5.svg'
    },
    {
        title: 'Skincare 101',
        description: 'The ABCs of Skincare. What You Need to Know',
        link: '/skincare-101',
        cta: 'Learn the Basics',
        cardImage: '/HP6.svg'
    }
  ];

  const aboutFeatures = [
      {
        icon: 'ClipboardList',
        title: 'Get a data-driven score on your routine'
      },
      {
        icon: 'Scan',
        title: 'Live analysis of your skin health'
      },
      {
        icon: 'BookOpen',
        title: 'Check ingredient compatibility'
      },
      {
        icon: 'TrendingUp',
        title: 'Visually track your skin improvements'
      }
  ]

  return (
    <div>
      <HeroSection />
        <section className="py-20 bg-slate-50 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="">
                        <h2 className="text-3xl sm:text-4xl font-bold font-heading tracking-tight text-slate-800">A smarter way to care for your skin.</h2>
                        <p className="mt-4 text-lg text-slate-600">Inara is a personalized skincare platform that combines cutting-edge technology with expert-level knowledge to provide a truly holistic skincare solution.</p>
                        <ul className="mt-8 space-y-4">
                            {aboutFeatures.map(feature => (
                                <li key={feature.title} className="flex items-center space-x-3">
                                    <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary">
                                        <AppIcon name={feature.icon} className="h-5 w-5" />
                                    </div>
                                    <span className="text-slate-700 font-medium">{feature.title}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-10">
                            <Link to="/about" className="text-primary font-semibold hover:underline">
                                Learn more about us &rarr;
                            </Link>
                        </div>
                    </div>
                    <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-xl">
                         <img
                            className="absolute inset-0 h-full w-full object-cover"
                            src="/lab2.webp"
                            alt="A modern skincare laboratory"
                        />
                         <div className="absolute inset-0 bg-slate-900/20"></div>
                    </div>
                </div>
            </div>
            <div className="arrow-container" onClick={handleScroll} style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
              <div className="arrow"></div>
            </div>
        </section>


      <div className="text-foreground flex flex-col" ref={featuresSectionRef}>
          <main className="flex-grow pt-10 pb-12 sm:pt-20 sm:pb-16 bg-white relative z-10">
              <div className="text-center max-w-4xl mx-auto px-4 sm:px-6">
                  <h2 className="text-3xl sm:text-5xl lg:text-5xl font-heading font-bold text-slate-800">Your Personal Skincare OS</h2>
                  <p className="mt-4 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
                      Achieve your skin goals with Science-backed Routine Analysis, Personalized Recommendations, and Progress Tracking.
                  </p>
              </div>

              <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-12 sm:mt-16">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                      {features.map((feature) => (
                          <Link to={feature.link} key={feature.title} className="glass-card-container no-underline flex">
                              <div className="glass-card relative flex flex-col w-full">
                                  <img
                                      src={feature.cardImage}
                                      alt=""
                                      className="absolute w-[200px] h-[200px] object-contain rotate-[-15deg] right-[-20px] bottom-[-30px] opacity-5 invert"
                                  />
                                  <div className="relative z-10 flex flex-col flex-grow justify-between">
                                      <div>
                                          <h3 className="text-xl sm:text-2xl font-heading font-semibold text-white">{feature.title}</h3>
                                          <p className="mt-2 text-sm sm:text-base text-slate-300">{feature.description}</p>
                                      </div>
                                      <div className="mt-6">
                                          <span className="text-slate-50 font-semibold text-sm sm:text-base">
                                              {feature.cta} &rarr;
                                          </span>
                                      </div>
                                  </div>
                              </div>
                          </Link>
                      ))}
                  </div>
              </div>
          </main>
      </div>
    </div>
  );
};

export default HomePage;
