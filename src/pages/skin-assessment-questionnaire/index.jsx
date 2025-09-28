import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../../contexts/UserDataContext';
import SkinConcerns from './SkinConcerns';
import SkinType from './SkinType';
import LifestyleFactors from './LifestyleFactors';

const SkinAssessmentQuestionnaire = () => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();
  const { updateUserData } = useUserData();

  const handleNext = (data) => {
    setAnswers({ ...answers, ...data });
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (data) => {
    const finalAnswers = { ...answers, ...data };
    try {
      await updateUserData({ skinAssessment: finalAnswers });
      navigate('/assessment-results');
    } catch (error) {
      console.error("Error saving assessment: ", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {step === 1 && <SkinType onNext={handleNext} />}
      {step === 2 && <SkinConcerns onNext={handleNext} onPrevious={handlePrevious} />}
      {step === 3 && <LifestyleFactors onSubmit={handleSubmit} onPrevious={handlePrevious} />}
    </div>
  );
};

export default SkinAssessmentQuestionnaire;
