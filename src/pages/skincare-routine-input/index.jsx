import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from '../../firebase.js';
import StepNavigation from './components/StepNavigation';
import RoutineStepContent from './components/RoutineStepContent';
import RoutinePreviewPanel from './components/RoutinePreviewPanel';
import Icon from '../../components/AppIcon';
import { fetchGeminiAnalysis } from '../../utils/gemini.js';

const SkincareRoutineInput = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [morningProducts, setMorningProducts] = useState([]);
  const [eveningProducts, setEveningProducts] = useState([]);
  const [weeklyTreatments, setWeeklyTreatments] = useState([]);
  const [lastSaved, setLastSaved] = useState(null);
  
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- Dummy Data for Testing ---
  const dummyMorningProducts = [
    { id: 'm1', name: 'Gentle Hydrating Cleanser', category: 'cleanser', ingredients: ['Ceramides', 'Glycerin', 'Hyaluronic Acid'] },
    { id: 'm2', name: 'Vitamin C Brightening Serum', category: 'serum', ingredients: ['Vitamin C', 'Hyaluronic Acid'] },
    { id: 'm3', name: 'Daily Moisturizing Lotion', category: 'moisturizer', ingredients: ['Glycerin', 'Niacinamide', 'Ceramides'] },
    { id: 'm4', name: 'Mineral Sunscreen SPF 30', category: 'sunscreen', ingredients: ['Zinc Oxide', 'Titanium Dioxide'] },
  ];
  const dummyEveningProducts = [
    { id: 'e1', name: 'Gentle Hydrating Cleanser', category: 'cleanser', ingredients: ['Ceramides', 'Glycerin', 'Hyaluronic Acid'] },
    { id: 'e2', name: 'Retinol Renewal Serum', category: 'serum', ingredients: ['Retinol', 'Niacinamide'] },
    { id: 'e3', name: 'Night Cream', category: 'moisturizer', ingredients: ['Shea Butter', 'Ceramides', 'Hyaluronic Acid'] },
  ];
  const dummyWeeklyTreatments = [
      { id: 'w1', name: 'AHA/BHA Exfoliating Peel', category: 'treatment', ingredients: ['Glycolic Acid', 'Salicylic Acid'] }
  ];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      setUser(currentUser);
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadRoutine = async () => {
      if (!authChecked) return;

      if (user) {
        setIsLoading(true);
        const docRef = doc(db, "routines", user.uid);
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().morningProducts?.length > 0) {
            const data = docSnap.data();
            setMorningProducts(data.morningProducts || []);
            setEveningProducts(data.eveningProducts || []);
            setWeeklyTreatments(data.weeklyTreatments || []);
            setLastSaved(data.timestamp ? new Date(data.timestamp) : null);
          } else {
            // No routine in Firestore, pre-fill with dummy data
            setMorningProducts(dummyMorningProducts);
            setEveningProducts(dummyEveningProducts);
            setWeeklyTreatments(dummyWeeklyTreatments);
          }
        } catch (error) {
          console.error("Error loading routine from Firestore:", error);
          // Fallback to dummy data on error
          setMorningProducts(dummyMorningProducts);
          setEveningProducts(dummyEveningProducts);
          setWeeklyTreatments(dummyWeeklyTreatments);
        }
        setIsLoading(false);
      } else {
        // No user, pre-fill with dummy data
        setMorningProducts(dummyMorningProducts);
        setEveningProducts(dummyEveningProducts);
        setWeeklyTreatments(dummyWeeklyTreatments);
        setLastSaved(null);
        setIsLoading(false);
      }
    };
    loadRoutine();
  }, [user, authChecked]);

  const handleAnalyze = async () => {
    const routine = { morningProducts, eveningProducts, weeklyTreatments };
    
    if (routine.morningProducts.length === 0 && routine.eveningProducts.length === 0 && routine.weeklyTreatments.length === 0) {
        alert('Please add at least one product before analyzing.');
        return;
    }

    setIsAnalyzing(true);
    
    try {
      const analysis = await fetchGeminiAnalysis(routine);
      navigate('/skincare-scorecard-results', { state: { analysis, routine } });
    } catch (error) {
      console.error("Error fetching Gemini analysis:", error);
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
    const routineData = { morningProducts, eveningProducts, weeklyTreatments, timestamp: new Date().toISOString() };
    try {
      await setDoc(doc(db, "routines", user.uid), routineData);
      setLastSaved(new Date());
    } catch (error) {
      console.error("Error saving routine to Firestore:", error);
    }
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

  if (isLoading || !authChecked) {
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
              isAnalyzing={isAnalyzing}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkincareRoutineInput;