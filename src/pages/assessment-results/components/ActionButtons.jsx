
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, collection } from 'firebase/firestore';
import { db } from '../../../firebase';
import Button from '../../../components/ui/Button';
import ShareModal from './ShareModal';
import { useUserDataContext } from '../../../contexts/UserDataContext.jsx';

const ActionButtons = ({ analysis, assessment }) => {
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [shareableLink, setShareableLink] = useState('');
  const navigate = useNavigate();
  const { updateUserData } = useUserDataContext();

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
        const weeklyDays = ['Wednesday', 'Sunday'];
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

  const handleSaveAndNavigate = async () => {
    if (analysis) {
      try {
        const transformedRoutine = transformRoutine(analysis);
        await updateUserData({ routine: transformedRoutine, assessmentCompleted: true });
        navigate('/dashboard');
      } catch (error) {
        console.error("Error saving routine:", error);
      }
    }
  };

  const handleShare = async () => {
    if (!analysis || !assessment) return;
    try {
      const docRef = doc(collection(db, 'sharedAnalyses'));
      await setDoc(docRef, {
        analysis,
        assessment,
        createdAt: new Date(),
      });
      const link = `${window.location.origin}/assessment-results?sharedId=${docRef.id}`;
      setShareableLink(link);
      setShareModalOpen(true);
    } catch (error) {
      console.error("Error creating shareable link:", error);
      alert("There was an error creating the shareable link. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setShareModalOpen(false);
    setShareableLink('');
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
          <Button onClick={handleSaveAndNavigate} variant="secondary" size="lg" iconName="Activity" iconPosition="left">
            Save & View Dashboard
          </Button>
          <Button onClick={handleShare} variant="outline" size="lg" iconName="Share2" iconPosition="left" className="border border-border">
            Share My Plan
          </Button>
        </div>
      </div>
      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={handleCloseModal} 
        shareableLink={shareableLink} 
      />
    </>
  );
};

export default ActionButtons;
