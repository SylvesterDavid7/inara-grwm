import React from 'react';
import Icon from '../../components/AppIcon';

const SupportPage = () => {
  const faqs = [
    {
      question: 'How do I track my progress?',
      answer:
        'You can track your progress by regularly uploading photos in the Progress Comparison section and logging your daily routine. The dashboard will automatically update to show your progress over time.',
    },
    {
      question: 'How do I update my skincare routine?',
      answer:
        'Navigate to the "Update Routine" section from the dashboard to add or remove products from your current skincare routine.',
    },
    {
      question: 'How often should I reassess my skin?',
      answer:
        'We recommend reassessing your skin every 3-4 months, or whenever you notice significant changes in your skin\'s condition. You can do this through the "Reassess Skin" questionnaire.',
    },
    {
        question: 'What do the points and rewards mean?',
        answer:
          'You earn points for consistently tracking your routine, uploading photos, and reaching milestones. These points can be redeemed for rewards in the future (rewards program coming soon!).',
    },
    {
        question: 'How do I learn more about skincare ingredients?',
        answer:
          'Visit the Ingredient Education Hub to learn more about the ingredients in your skincare products and how they benefit your skin.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="py-6 sm:py-8 lg:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="font-heading font-heading-bold text-3xl sm:text-4xl text-foreground mb-2">
              Support & FAQ
            </h1>
            <p className="font-body font-body-normal text-base sm:text-lg text-muted-foreground">
              Have questions? We're here to help.
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-card border border-border rounded-clinical p-6">
                <h3 className="font-heading font-heading-semibold text-lg text-card-foreground mb-2">
                  {faq.question}
                </h3>
                <p className="font-body font-body-normal text-sm text-muted-foreground">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <h3 className="font-heading font-heading-semibold text-xl text-foreground mb-4">
              Still need help?
            </h3>
            <p className="font-body font-body-normal text-base text-muted-foreground mb-6">
              Contact our support team for personalized assistance.
            </p>
            <a
              href="mailto:support@inaragroups.com"
              className="inline-flex items-center justify-center h-10 px-6 bg-primary text-primary-foreground rounded-md text-sm font-body-medium hover:bg-primary/90 transition-colors"
            >
              <Icon name="Mail" size={18} className="mr-2" />
              Contact Support
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SupportPage;
