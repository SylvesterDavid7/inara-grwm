import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserDataContext } from '../../contexts/UserDataContext.jsx';
import StepNavigation from './components/StepNavigation';
import RoutineStepContent from './components/RoutineStepContent';
import RoutinePreviewPanel from './components/RoutinePreviewPanel';
import Icon from '../../components/AppIcon';
import { fetchGeminiAnalysis } from '../../utils/gemini';
import { collection, addDoc, serverTimestamp, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAwardPoints } from '../../hooks/useAwardPoints.js';

const SkincareRoutineInput = () => {
  const navigate = useNavigate();
  const { user, userData, updateUserData } = useUserDataContext();
  const { awardPoints } = useAwardPoints();
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [morningProducts, setMorningProducts] = useState([]);
  const [eveningProducts, setEveningProducts] = useState([]);
  const [weeklyTreatments, setWeeklyTreatments] = useState([]);
  const [lastSaved, setLastSaved] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const loadRoutine = async () => {
      setIsLoading(true);
      if (userData && userData.routine) {
        const { AM, PM, Weekly } = userData.routine;
        setMorningProducts(AM || []);
        setEveningProducts(PM || []);
        setWeeklyTreatments(Weekly || []);
      }
      setIsLoading(false);
    };

    if (user) {
      loadRoutine();
    } else {
      setMorningProducts([]);
      setEveningProducts([]);
      setWeeklyTreatments([]);
      setLastSaved(null);
      setIsLoading(false);
    }
  }, [user, userData]);

  const handleAnalyze = async () => {
    const routine = { AM: morningProducts, PM: eveningProducts, Weekly: weeklyTreatments };
    
    if (morningProducts.length === 0 && eveningProducts.length === 0 && weeklyTreatments.length === 0) {
        alert('Please add at least one product before analyzing.');
        return;
    }

    setIsAnalyzing(true);
    
    try {
      const analysis = await fetchGeminiAnalysis({ morningProducts, eveningProducts, weeklyTreatments });
      
      if (!userData.routine) {
        awardPoints('routine_added');
      }
      await updateUserData({ 
        routine, 
        routineAnalysisCompleted: true 
      });

      if (user) {
        const analysisRef = await addDoc(collection(db, 'users', user.uid, 'analyses'), {
          analysis,
          routine,
          createdAt: serverTimestamp(),
        });
        navigate(`/skincare-scorecard-results/${analysisRef.id}`);
      } else {
        navigate('/skincare-scorecard-results', { state: { analysis, routine } });
      }

    } catch (error) {
      console.error("Error during analysis:", error);
      alert(`There was an error analyzing your routine: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!user) {
      alert("Please sign in to save your routine.");
      return;
    }
    
    const routine = {
        AM: morningProducts,
        PM: eveningProducts,
        Weekly: weeklyTreatments,
    };

    try {
      await updateUserData({ routine });
      setLastSaved(new Date());
      alert("Routine saved successfully!");
    } catch (error) {
      console.error("Error saving routine:", error);
      alert(`There was an error saving your routine: ${error.message}`);
    }
  };

  const handleClearAll = () => {
    setMorningProducts([]);
    setEveningProducts([]);
    setWeeklyTreatments([]);
  };

  const steps = [
    { title: 'Morning Routine', description: 'Products you use in the morning', icon: 'Sun' },
    { title: 'Evening Routine', description: 'Products you use at night', icon: 'Moon' },
    { title: 'Weekly Treatments', description: 'Special treatments and masks', icon: 'Sparkles' }
  ];

  const getCurrentStepProducts = () => {
    if (currentStep === 0) return morningProducts;
    if (currentStep === 1) return eveningProducts;
    return weeklyTreatments;
  };

  const updateCurrentStepProducts = (products) => {
    if (currentStep === 0) setMorningProducts(products);
    else if (currentStep === 1) setEveningProducts(products);
    else setWeeklyTreatments(products);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Icon name="Loader2" size={48} className="text-primary animate-spin mx-auto" />
          <h2 className="text-xl font-heading font-heading-semibold text-foreground">
            Loading Your Routine...
          </h2>
          <p className="text-muted-foreground font-body font-body-normal">
            Please wait...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <StepNavigation 
        currentStep={currentStep} 
        steps={steps} 
        onStepChange={setCurrentStep} 
        onComplete={handleAnalyze} 
      />
      <div className="lg:grid lg:grid-cols-4 lg:gap-6 lg:max-w-7xl lg:mx-auto lg:px-6">
        <div className="lg:col-span-3">
          <RoutineStepContent
            step={steps[currentStep]}
            products={getCurrentStepProducts()}
            onProductsChange={updateCurrentStepProducts}
            stepIndex={currentStep}
            selectedProduct={selectedProduct}
            onProductSelect={setSelectedProduct}
          />
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-32 p-6 lg:p-0">
            <RoutinePreviewPanel
              morningProducts={morningProducts}
              eveningProducts={eveningProducts}
              weeklyTreatments={weeklyTreatments}
              onAnalyze={handleAnalyze}
              onSave={handleSaveDraft}
              onClearAll={handleClearAll}
              isAnalyzing={isAnalyzing}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkincareRoutineInput;