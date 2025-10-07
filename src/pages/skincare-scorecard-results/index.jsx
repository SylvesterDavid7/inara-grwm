
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Make sure this path is correct

import Icon from '../../components/AppIcon';
import Header from '../../components/ui/Header';
import OverallScoreCard from './components/OverallScoreCard';
import RoutineScoreSection from './components/RoutineScoreSection';
import MetricsDashboard from './components/MetricsDashboard';
import DetailedAnalysisTab from './components/DetailedAnalysisTab';
import RecommendationCards from './components/RecommendationCards';
import BeforeAfterComparison from './components/BeforeAfterComparison';
import ActionSidebar from './components/ActionSidebar';
import ScoreCardModal from './components/Scorecard/ScoreCardModal';
import generatePdfFromReact from '../../lib/pdf/generatePdfFromReact.jsx';
import PdfPreviewModal from './components/PdfPreviewModal';

// Data is now embedded directly to ensure it is available.
const DUMMY_PROGRESS_DATA = [
    {
      id: 1, date: '2024-01-15', overallScore: 7.8, routineConsistency: 85,
      afterImage: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=400&h=400&fit=crop',
    },
    {
      id: 2, date: '2024-02-15', overallScore: 8.2, routineConsistency: 90,
      afterImage: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=400&h=400&fit=crop&brightness=1.05&contrast=1.05',
    },
    {
      id: 3, date: '2024-03-15', overallScore: 8.5, routineConsistency: 92,
      afterImage: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=400&h=400&fit=crop&brightness=1.1&contrast=1.1',
    },
];

const SkincareScoreCardResults = () => {
  const location = useLocation();
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState(false);
  const [pdfPreviewData, setPdfPreviewData] = useState(null);
  const [isSharedView, setIsSharedView] = useState(false);
  const [viewOptions, setViewOptions] = useState({
    includePhotos: true,
    includeRecommendations: true,
    includeScores: true,
  });
  const contentRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sharedId = params.get('id');

    const fetchSharedAnalysis = async (id) => {
      try {
        const docRef = doc(db, "sharedAnalyses", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setAnalysis(data.analysis);
          setViewOptions(data.shareOptions);
          setIsSharedView(true);

          if (!data.shareOptions.includeScores) {
            if (data.shareOptions.includeRecommendations) {
              setActiveTab('recommendations');
            } else if (data.shareOptions.includePhotos) {
              setActiveTab('progress-tracking');
            }
          }
        } else {
          setError("Sorry, the shared scorecard could not be found. It may have been deleted.");
        }
      } catch (e) {
        console.error("Error fetching shared document: ", e);
        setError("An error occurred while trying to load the scorecard.");
      }
    };

    if (sharedId) {
      fetchSharedAnalysis(sharedId);
    } else if (location.state && location.state.analysis) {
      setAnalysis({ ...location.state.analysis, routine: location.state.routine });
      if (location.state.focus === 'detailed-analysis') {
        setActiveTab('detailed-analysis');
      }
    } else {
        if (process.env.NODE_ENV === 'development') {
          setAnalysis({ 
              overallScore: { score: 85, feedback: "A very good score!" },
              metrics: [],
              morningRoutine: { products: [] },
              eveningRoutine: { products: [] },
              weeklyRoutine: { products: [] },
              ingredientCompatibility: { compatible: [], incompatible: [] },
              productRecommendations: [],
              detailedIngredientAnalysis: [],
              routine: []
          });
      } else {
          setError("No analysis data found. Please go back and analyze your routine again.");
        }
    }
  }, [location]);

  const handleExportWithReactPdf = useCallback(async () => {
    if (!analysis) return;
    setIsGeneratingPDF(true);
    try {
      const dataUri = await generatePdfFromReact(analysis, false);
      setPdfPreviewData(dataUri);
      setIsPdfPreviewOpen(true);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
    setIsGeneratingPDF(false);
  }, [analysis]);

  if (error) {
    return <div className="flex items-center justify-center h-screen bg-background text-foreground p-8 text-center">{error}</div>;
  }
  
  if (!analysis) {
    return <div className="flex items-center justify-center h-screen bg-background text-foreground p-8 text-center">Loading Scorecard...</div>;
  }

  const { 
    overallScore,
    metrics,
    morningRoutine,
    eveningRoutine,
    weeklyRoutine,
    ingredientCompatibility,
    productRecommendations,
    detailedIngredientAnalysis,
    routine
  } = analysis;

  const TabButton = ({ tabName, label, isVisible }) => {
    if (!isVisible) return null;
    return (
      <button 
        className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium leading-5 rounded-md transition-colors duration-150 whitespace-nowrap ${
          activeTab === tabName 
          ? 'bg-primary text-primary-foreground focus:outline-none' 
          : 'text-muted-foreground hover:bg-muted focus:outline-none focus:bg-muted'
        }`}
        onClick={() => setActiveTab(tabName)}
      >
        {label}
      </button>
    );
  }

  const renderRoutineAnalysis = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-heading font-heading-semibold text-foreground">Routine Breakdown</h2>
      
      {morningRoutine && morningRoutine.products && morningRoutine.products.length > 0 && (
        <RoutineScoreSection title="Morning Routine" {...morningRoutine} icon="Sun" isExpanded={true} />
      )}
      
      {eveningRoutine && eveningRoutine.products && eveningRoutine.products.length > 0 && (
        <RoutineScoreSection title="Evening Routine" {...eveningRoutine} icon="Moon" />
      )}
      
      {weeklyRoutine && weeklyRoutine.products && weeklyRoutine.products.length > 0 && (
         <RoutineScoreSection title="Weekly Routine" {...weeklyRoutine} icon="Calendar" />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-5"> 
          <div className="bg-card border-b border-border">
              <div className="max-w-7xl mx-auto px-2 sm:px-6 py-4">
                  <h1 className="text-3xl font-heading font-heading-semibold text-foreground">
                    {isSharedView ? 'Shared Skincare Scorecard' : 'Your Skincare Scorecard'}
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    {isSharedView ? 'This is a shared, AI-powered analysis.' : 'An AI-powered analysis of your daily skincare routines.'}
                  </p>
              </div>
          </div>
          <div className="bg-background border-b border-border sticky top-16 z-10">
              <div className="max-w-7xl mx-auto px-2 sm:px-6">
                <div className="py-2 flex items-center justify-between sm:justify-start sm:space-x-2">
                  <TabButton tabName="overview" label="Overview" isVisible={viewOptions.includeScores} />
                  <TabButton tabName="detailed-analysis" label="Detailed Analysis" isVisible={viewOptions.includeScores} />
                  <TabButton tabName="recommendations" label="Recommendations" isVisible={viewOptions.includeRecommendations} />
                  <TabButton tabName="progress-tracking" label="Progress Tracking" isVisible={viewOptions.includePhotos} />
                </div>
              </div>
          </div>

        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-8 space-y-8" ref={contentRef}>
                {activeTab === 'overview' && viewOptions.includeScores && (
                  <div className="space-y-8">
                    <OverallScoreCard {...overallScore} onGenerateCardClick={() => !isSharedView && setIsModalOpen(true)} isSharedView={isSharedView} />
                    <MetricsDashboard metrics={metrics} />
                    {renderRoutineAnalysis()}
                  </div>
                )}
                {activeTab === 'detailed-analysis' && viewOptions.includeScores && <DetailedAnalysisTab detailedIngredientAnalysis={detailedIngredientAnalysis} ingredientCompatibility={ingredientCompatibility} />}
                {activeTab === 'recommendations' && viewOptions.includeRecommendations && <RecommendationCards recommendations={productRecommendations} />}
                {activeTab === 'progress-tracking' && viewOptions.includePhotos && <BeforeAfterComparison progressData={DUMMY_PROGRESS_DATA} isSharedView={isSharedView} />}
            </div>
            {!isSharedView && (
              <div className="hidden lg:block lg:col-span-4">
                <div className="sticky top-32 space-y-8">
                  <ActionSidebar 
                      analysis={analysis} 
                      routine={routine} 
                      onExportPDF={handleExportWithReactPdf}
                      isGeneratingPDF={isGeneratingPDF}
                  />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      {!isSharedView && (
        <ScoreCardModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          analysis={analysis}
        />
      )}
      <PdfPreviewModal 
        isOpen={isPdfPreviewOpen} 
        onClose={() => setIsPdfPreviewOpen(false)} 
        pdfDataUri={pdfPreviewData} 
      />
    </div>
  );
};

export default SkincareScoreCardResults;
