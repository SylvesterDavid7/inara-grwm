
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import ShareModal from './ShareModal'; // Make sure this path is correct

const ActionButtons = () => {
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const navigate = useNavigate();

  const handlePurchase = () => {
    window.open('https://inaragroups.com', '_blank', 'noopener,noreferrer');
  };

  const handleSamples = () => {
    navigate('/product-recommendations');
  };

  const handleTrack = () => {
    navigate('/progress-tracking-dashboard');
  };

  const handleShare = () => {
    setShareModalOpen(true);
  };

  const handleCloseModal = () => {
    setShareModalOpen(false);
  };

  return (
    <>
      <div className="my-12">
        <h2 className="text-2xl font-heading font-heading-semibold text-foreground mb-6 text-center">Ready to Start?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <Button onClick={handlePurchase} variant="default" size="lg" iconName="ShoppingCart" iconPosition="left">
            Purchase Routine
          </Button>
          <Button onClick={handleSamples} variant="secondary" size="lg" iconName="FlaskConical" iconPosition="left">
            Try Samples
          </Button>
          <Button onClick={handleTrack} variant="secondary" size="lg" iconName="Activity" iconPosition="left">
            Track My Routine
          </Button>
          <Button onClick={handleShare} variant="outline" size="lg" iconName="Share2" iconPosition="left" className="border border-border">
            Share My Plan
          </Button>
        </div>
      </div>
      <ShareModal isOpen={isShareModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default ActionButtons;
