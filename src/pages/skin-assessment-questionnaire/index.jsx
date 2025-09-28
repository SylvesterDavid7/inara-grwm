import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ProgressIndicator from './components/ProgressIndicator';
import QuestionCard from './components/QuestionCard';
import QuestionNavigation from './components/QuestionNavigation';
import AssessmentSummary from './components/AssessmentSummary';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { fetchGeminiAnalysisFromAssessment } from '../../utils/gemini';
import { useUserDataContext } from '../../contexts/UserDataContext.jsx';

const SkinAssessmentQuestionnaire = () => {
  const navigate = useNavigate();
  const { updateUserData } = useUserDataContext();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showSummary, setShowSummary] = useState(false);
  const [showNavigation, setShowNavigation] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock questionnaire data
  const questions = [ 
    { 
      id: 'skin-type',
      title: "What's your primary skin type?",
      description: "Choose the option that best describes your skin's natural characteristics.",
      type: 'single-select',
      required: true,
      options: [ 
        { 
          value: 'normal',
          label: 'Normal',
          description: 'Balanced, not too oily or dry',
          icon: 'Smile' 
        },
        {
          value: 'oily',
          label: 'Oily',
          description: 'Shiny, enlarged pores, prone to breakouts',
          icon: 'Droplets'
        },
        {
          value: 'dry',
          label: 'Dry',
          description: 'Tight, flaky, sometimes rough texture',
          icon: 'Sun'
        },
        {
          value: 'combination',
          label: 'Combination',
          description: 'Oily T-zone, normal to dry cheeks',
          icon: 'Zap'
        },
        {
          value: 'sensitive',
          label: 'Sensitive',
          description: 'Easily irritated, reactive to products',
          icon: 'AlertTriangle'
        }
      ]
    },
    {
      id: 'skin-concerns',
      title: "What are your main skin concerns?",
      description: "Select all that apply. This helps us understand your skincare priorities.",
      type: 'multi-select',
      required: true,
      options: [
        {
          value: 'acne',
          label: 'Acne & Breakouts',
          description: 'Pimples, blackheads, whiteheads',
          icon: 'AlertCircle'
        },
        {
          value: 'aging',
          label: 'Signs of Aging',
          description: 'Fine lines, wrinkles, loss of firmness',
          icon: 'Clock'
        },
        {
          value: 'hyperpigmentation',
          label: 'Dark Spots',
          description: 'Age spots, melasma, post-acne marks',
          icon: 'Circle'
        },
        {
          value: 'dullness',
          label: 'Dull Complexion',
          description: 'Lack of radiance, uneven texture',
          icon: 'Moon'
        },
        {
          value: 'redness',
          label: 'Redness & Irritation',
          description: 'Rosacea, sensitivity, inflammation',
          icon: 'Flame'
        },
        {
          value: 'pores',
          label: 'Large Pores',
          description: 'Visible, enlarged pores',
          icon: 'Grid'
        }
      ]
    },
    {
      id: 'sensitivity-level',
      title: "How sensitive is your skin?",
      description: "Rate your skin's sensitivity to new products and environmental factors.",
      type: 'slider',
      required: true,
      min: 1,
      max: 10,
      step: 1,
      minLabel: 'Not Sensitive',
      maxLabel: 'Very Sensitive',
      scaleLabels: ['Low', 'Moderate', 'High']
    },
    {
      id: 'skin-tone',
      title: "What's your skin tone?",
      description: "This helps us recommend products suitable for your complexion.",
      type: 'image-select',
      required: true,
      options: [
        { 
          value: 'fair', 
          label: 'Fair', 
          image: 'https://images.unsplash.com/photo-1494790108755-2616c0763c65?w=150&h=150&fit=crop&crop=face'
        },
        { 
          value: 'light', 
          label: 'Light', 
          image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
        },
        { 
          value: 'medium', 
          label: 'Medium', 
          image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face'
        },
        { 
          value: 'olive', 
          label: 'Olive', 
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
        },
        { 
          value: 'tan', 
          label: 'Tan', 
          image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
        },
        { 
          value: 'deep', 
          label: 'Deep', 
          image: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=150&h=150&fit=crop&crop=face'
        }
      ]
    },
    {
      id: 'climate',
      title: "What's your climate like?",
      description: "Environmental factors affect your skin's needs.",
      type: 'single-select',
      required: true,
      options: [
        { 
          value: 'humid', 
          label: 'Humid', 
          description: 'High moisture, sticky weather', 
          icon: 'Cloud' 
        },
        { 
          value: 'dry', 
          label: 'Dry', 
          description: 'Low humidity, arid conditions', 
          icon: 'Sun' 
        },
        { 
          value: 'temperate', 
          label: 'Temperate', 
          description: 'Moderate humidity, seasonal changes', 
          icon: 'CloudRain' 
        },
        { 
          value: 'cold', 
          label: 'Cold', 
          description: 'Low temperatures, harsh winters', 
          icon: 'Snowflake' 
        }
      ]
    },
    {
      id: 'lifestyle',
      title: "Which lifestyle factors apply to you?",
      description: "These factors can impact your skin's condition and needs.",
      type: 'multi-select',
      required: false,
      options: [
        { 
          value: 'stress', 
          label: 'High Stress Levels', 
          description: 'Work pressure, life changes', 
          icon: 'Zap' 
        },
        { 
          value: 'exercise', 
          label: 'Regular Exercise', 
          description: 'Frequent workouts, sweating', 
          icon: 'Activity' 
        },
        { 
          value: 'travel', 
          label: 'Frequent Travel', 
          description: 'Different climates, air travel', 
          icon: 'Plane' 
        },
        { 
          value: 'makeup', 
          label: 'Daily Makeup Use', 
          description: 'Foundation, concealer, etc.', 
          icon: 'Palette' 
        },
        { 
          value: 'smoking', 
          label: 'Smoking', 
          description: 'Tobacco use', 
          icon: 'Cigarette' 
        },
        { 
          value: 'sleep', 
          label: 'Poor Sleep', 
          description: 'Less than 7 hours nightly', 
          icon: 'Moon' 
        }
      ]
    },
    {
      id: 'current-routine',
      title: "How would you describe your current skincare routine?",
      description: "This helps us understand your experience level.",
      type: 'single-select',
      required: true,
      options: [
        { 
          value: 'minimal', 
          label: 'Minimal', 
          description: 'Basic cleansing and moisturizing', 
          icon: 'Minus' 
        },
        { 
          value: 'moderate', 
          label: 'Moderate', 
          description: '3-5 products, some actives', 
          icon: 'Equal' 
        },
        { 
          value: 'extensive', 
          label: 'Extensive', 
          description: '6+ products, multi-step routine', 
          icon: 'Plus' 
        },
        { 
          value: 'inconsistent', 
          label: 'Inconsistent', 
          description: 'Varies day to day', 
          icon: 'Shuffle' 
        }
      ]
    },
    {
      id: 'budget',
      title: "What's your monthly skincare budget?",
      description: "This helps us recommend products within your price range.",
      type: 'single-select',
      required: false,
      options: [
        { 
          value: 'under-50', 
          label: 'Under $50', 
          description: 'Budget-friendly options', 
          icon: 'DollarSign' 
        },
        { 
          value: '50-100', 
          label: '$50 - $100', 
          description: 'Mid-range products', 
          icon: 'DollarSign' 
        },
        { 
          value: '100-200', 
          label: '$100 - $200', 
          description: 'Premium products', 
          icon: 'DollarSign' 
        },
        { 
          value: 'over-200', 
          label: 'Over $200', 
          description: 'Luxury skincare', 
          icon: 'DollarSign' 
        }
      ]
    }
  ];

  // Auto-save functionality
  useEffect(() => {
    const savedAnswers = localStorage.getItem('skinAssessmentAnswers');
    if (savedAnswers) {
      try {
        setAnswers(JSON.parse(savedAnswers));
      } catch (error) {
        console.error('Error loading saved answers:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('skinAssessmentAnswers', JSON.stringify(answers));
  }, [answers]);

  const handleAnswerChange = (answer) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleQuestionSelect = (questionIndex) => {
    setCurrentQuestion(questionIndex);
    setShowSummary(false);
    setShowNavigation(false);
  };

  const handleEditFromSummary = (questionIndex) => {
    setCurrentQuestion(questionIndex);
    setShowSummary(false);
  };

  const handleCompleteAssessment = async () => {
    setIsAnalyzing(true);
    try {
      const analysis = await fetchGeminiAnalysisFromAssessment(answers, questions);
      
      await updateUserData({ assessmentCompleted: true });

      const assessmentData = {
        answers,
        questions,
        completedAt: new Date().toISOString(),
        completionRate: Math.round((Object.keys(answers).length / questions.length) * 100)
      };
      localStorage.setItem('skinAssessmentResults', JSON.stringify(assessmentData));

      navigate('/assessment-results', { state: { analysis, questions, answers } });
    } catch (error) {
      console.error("Error during assessment completion:", error);
      alert(`There was an error generating your assessment: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const completedSteps = Object.keys(answers).map(Number);

  return (
    <div className="min-h-screen bg-background">
       <Header />
      <ProgressIndicator
        currentStep={currentQuestion}
        totalSteps={questions.length}
        completedSteps={completedSteps}
        className="sticky top-16"
      />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {showSummary ? (
              <AssessmentSummary
                answers={answers}
                questions={questions}
                onEdit={handleEditFromSummary}
                onComplete={handleCompleteAssessment}
                isAnalyzing={isAnalyzing}
              />
            ) : (
              <div className="space-y-6">
                {/* Mobile Navigation Toggle */}
                <div className="lg:hidden">
                  <Button
                    variant="outline"
                    onClick={() => setShowNavigation(!showNavigation)}
                    iconName={showNavigation ? "X" : "Menu"}
                    iconPosition="left"
                    iconSize={16}
                    className="mb-4"
                  >
                    {showNavigation ? "Close Navigation" : "Question Navigation"}
                  </Button>
                </div>

                <QuestionCard
                  question={questions[currentQuestion]}
                  currentAnswer={answers[currentQuestion]}
                  onAnswerChange={handleAnswerChange}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                  isFirst={currentQuestion === 0}
                  isLast={currentQuestion === questions.length - 1}
                />

                {/* Quick Actions */}
                <div className="flex items-center justify-between p-3 sm:p-4 bg-muted/30 rounded-clinical">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSummary(true)}
                      iconName="Eye"
                      iconPosition="left"
                      iconSize={14}
                    >
                      <span className="hidden sm:inline">Preview</span>
                      <span className="sm:hidden">Preview</span>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        localStorage.removeItem('skinAssessmentAnswers');
                        setAnswers({});
                        setCurrentQuestion(0);
                      }}
                      iconName="RotateCcw"
                      iconPosition="left"
                      iconSize={14}
                    >
                      Reset
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Icon name="Save" size={14} />
                    <span className="font-caption font-caption-normal text-xs sm:text-sm">Auto-saved</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Navigation */}
          <div className={`lg:col-span-1 ${showNavigation ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-32">
              <QuestionNavigation
                questions={questions}
                currentQuestion={currentQuestion}
                answers={answers}
                onQuestionSelect={handleQuestionSelect}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SkinAssessmentQuestionnaire;
