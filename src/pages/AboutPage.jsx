import React from 'react';
import AppIcon from '../components/AppIcon';

const AboutPage = () => {
  const features = [
    {
      icon: 'ClipboardList',
      title: 'Smart Routine Analysis',
      description: "Get a data-driven score on your current routine to identify gaps and opportunities for improvement."
    },
    {
      icon: 'Scan',
      title: 'Live Derma Scan',
      description: "Use your phone's camera to get a live analysis of your skin health metrics, instantly."
    },
    {
      icon: 'BookOpen',
      title: 'Ingredient Encyclopedia',
      description: 'Dive deep into our ingredient library to check compatibility and understand the science.'
    },
    {
      icon: 'TrendingUp',
      title: 'Visual Progress Tracking',
      description: "Log your journey with photos and see your skin's improvements over time with clear graphs."
    },
    {
      icon: 'Star',
      title: 'Gamified Experience',
      description: 'Stay motivated by watching your Skincare Score improve and earning badges for consistency.'
    },
    {
        icon: 'HelpCircle',
        title: 'Expert Support',
        description: 'Get answers to your questions and connect with our community of skincare enthusiasts.'
    }
  ];

  return (
    <div className="bg-white text-slate-800 font-light">
      {/* Hero Section */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xl text-primary font-extrabold font-heading tracking-wider uppercase">About Inara X GRWM</p>
            <h1 className="mt-2 text-4xl sm:text-5xl md:text-6xl font-bold font-heading tracking-tight">
              Skincare, backed by science.
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-slate-600">
              We believe skincare shouldn't be guesswork. Our mission is to empower you with data-driven, personalized, and accessible tools to put the power back in your hands.
            </p>
          </div>
        </div>
      </section>

      {/* Full-width Image */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-xl">
            <img
                className="absolute inset-0 h-full w-full object-cover"
                src="/lab2.webp"
                alt="A modern skincare laboratory"
            />
             <div className="absolute inset-0 bg-slate-900/20"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
             <h2 className="text-3xl sm:text-4xl font-bold font-heading tracking-tight">
               Your All-in-One Skincare Companion
             </h2>
             <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
               A truly holistic solution to help you understand your skin.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center p-8 border border-slate-300 rounded-2xl transition hover:shadow-lg hover:border-primary/50">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary">
                  <AppIcon name={feature.icon} className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-xl font-semibold font-heading">{feature.title}</h3>
                <p className="mt-2 text-base text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promise Section */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto text-center py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold font-heading sm:text-4xl">Our Promise</h2>
          <blockquote className="mt-6 text-xl text-slate-700 italic leading-relaxed">
            "Your skin is unique. Your skincare should be too. With Inara x GRWM, you're not just buying products; you're building intelligence. Stop guessing and start knowing."
          </blockquote>
          <p className="mt-8 text-xl font-semibold text-primary">
            Your journey to clear, confident, and radiant skin starts here.
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
