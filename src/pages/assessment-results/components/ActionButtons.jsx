
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import ShareModal from './ShareModal'; // Make sure this path is correct
import { useUserDataContext } from '../../../contexts/UserDataContext'; // Import the hook

const ActionButtons = ({ analysis }) => { // Accept analysis as a prop
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const navigate = useNavigate();
  const { updateUserData } = useUserDataContext(); // Get the update function

  const handlePurchase = () => {
    window.open('https://inaragroups.com', '_blank', 'noopener,noreferrer');
  };

  const handleSamples = () => {
    navigate('/product-recommendations');
  };

  const transformRoutine = (analysis) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const routine = {};

    const amProducts = analysis.morningRoutine.products.map((p, index) => ({ ...p, step: index + 1 }));
    const pmProducts = analysis.eveningRoutine.products.map((p, index) => ({ ...p, step: index + 1 }));

    days.forEach(day => {
        routine[day] = {
            AM: [...amProducts],
            PM: [...pmProducts]
        };
    });

    if (analysis.weeklyRoutine && analysis.weeklyRoutine.products) {
        const weeklyDays = ['Wednesday', 'Sunday']; // Default days for weekly treatments
        analysis.weeklyRoutine.products.forEach(product => {
            weeklyDays.forEach(day => {
                if (routine[day] && routine[day].PM) {
                    const nextStep = routine[day].PM.length > 0 ? Math.max(...routine[day].PM.map(p => p.step)) + 1 : 1;
                    routine[day].PM.push({ ...product, step: nextStep });
                }
            });
        });
    }

    return routine;
  };


  const handleTrack = async () => {
    if (analysis) {
      try {
        const transformedRoutine = transformRoutine(analysis);
        await updateUserData({ routine: transformedRoutine, assessmentCompleted: true }); // Save the transformed routine
        navigate('/progress-tracking-dashboard');
      } catch (error) {
        console.error("Error saving routine:", error);
        // Optionally, show an error message to the user
      }
    }
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
