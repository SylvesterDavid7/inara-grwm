
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import Header from '../../components/ui/Header';
import SummaryCard from './components/SummaryCard';
import RoutineDisplay from './components/RoutineDisplay';
import WeeklyRoutine from './components/WeeklyRoutine';
import ActionButtons from './components/ActionButtons';

const AssessmentResults = () => {
  const location = useLocation();
  const [analysis, setAnalysis] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSharedView, setIsSharedView] = useState(false);

  useEffect(() => {
    const fetchSharedData = async (id) => {
      try {
        const docRef = doc(db, 'sharedAnalyses', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setAnalysis(data.analysis);
          setAssessment(data.assessment);
        } else {
          setError('Invalid or expired share link.');
        }
      } catch (err) {
        setError('Could not retrieve the shared analysis.');
        console.error(err);
      }
      setLoading(false);
    };

    const params = new URLSearchParams(location.search);
    const sharedId = params.get('sharedId');

    if (sharedId) {
      setIsSharedView(true);
      fetchSharedData(sharedId);
    } else if (location.state && location.state.analysis) {
      setAnalysis(location.state.analysis);
      setAssessment({
        questions: location.state.questions,
        answers: location.state.answers,
      });
      setLoading(false);
    } else {
      setError('No analysis data found. Please complete the assessment first.');
      setLoading(false);
    }
  }, [location]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-white p-8 text-center">
        Loading Your Personalized Plan...
      </div>
    );
  }
  
  if (error || !analysis || !assessment) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-white p-8 text-center">
        {error || 'Could not load analysis.'}
      </div>
    );
  }

  const getAnswerDisplay = (questionId) => {
    const question = assessment.questions.find(q => q.id === questionId);
    if (!question) return 'N/A';
  
    const questionIndex = assessment.questions.findIndex(q => q.id === questionId);
    const answer = assessment.answers[questionIndex];
  
    if (answer === undefined) return 'N/A';
  
    if (question.type === 'single-select' || question.type === 'image-select') {
      const option = question.options.find(o => o.value === answer);
      return option ? option.label : answer;
    }
    if (question.type === 'multi-select') {
      return answer.map(val => {
        const option = question.options.find(opt => opt.value === val);
        return option ? option.label : val;
      }).join(', ');
    }
    return answer;
  };

  const skinType = getAnswerDisplay('skin-type');
  const skinTypeImages = {
    'Dry': '/Dry Skin.webp',
    'Oily': '/Oily Skin.webp',
    'Combination': '/Combination Skin.webp',
    'Sensitive': '/Sensitive Skin.webp',
    'Normal': '/Normal Skin.webp'
  };
  const skinTypeImage = skinTypeImages[skinType];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-heading-semibold text-black">Your Personalized Skincare Plan</h1>
          <p className="mt-2 text-lg text-foreground/70">Generated based on your assessment.</p>
        </div>

        <div className="mb-12">
            <h2 className="text-2xl font-heading font-heading-semibold text-foreground mb-6">Your Skin Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SummaryCard 
                  icon="Smile" 
                  title="Skin Type" 
                  value={getAnswerDisplay('skin-type')} 
                  image={skinTypeImage} 
              />
              <SummaryCard icon="AlertCircle" title="Main Concerns" value={getAnswerDisplay('skin-concerns')} />
              <SummaryCard icon="Thermometer" title="Sensitivity" value={`${getAnswerDisplay('sensitivity-level')} / 10`} />
              <SummaryCard icon="Cloud" title="Climate" value={getAnswerDisplay('climate')} />
              <SummaryCard icon="IndianRupee" title="Budget" value={getAnswerDisplay('budget')} />
              <SummaryCard icon="Box" title="Routine Style" value={getAnswerDisplay('current-routine')} />
            </div>
        </div>

        <div className="mb-12">
            <h2 className="text-2xl font-heading font-heading-semibold text-foreground mb-6">Your Recommended Routine</h2>
            <div className="space-y-8">
                <RoutineDisplay timeOfDay="Morning" icon="Sun" routine={analysis.morningRoutine} />
                <RoutineDisplay timeOfDay="Evening" icon="Moon" routine={analysis.eveningRoutine} />
                <WeeklyRoutine routine={analysis.weeklyRoutine} />
            </div>
        </div>

        {!isSharedView && <ActionButtons analysis={analysis} assessment={assessment} />}
      </div>
    </div>
  );
};

export default AssessmentResults;
