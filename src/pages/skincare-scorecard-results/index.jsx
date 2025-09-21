
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
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

const SkincareScoreCardResults = () => {
  const location = useLocation();
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isGeneratingHtml2CanvasPDF, setIsGeneratingHtml2CanvasPDF] = useState(false);
  const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState(false);
  const [pdfPreviewData, setPdfPreviewData] = useState(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (location.state && location.state.analysis) {
      setTimeout(() => {
        const fullAnalysis = { ...location.state.analysis, routine: location.state.routine };
        setAnalysis(fullAnalysis);
      }, 250);
      if (location.state.focus === 'detailed-analysis') {
        setActiveTab('detailed-analysis');
      }
    } else {
      setError('No analysis data found. Please go back and analyze your routine again.');
    }
  }, [location.state]);

  const handleExportWithReactPdf = useCallback(async () => {
    if (!analysis) {
      alert("Analysis data is not available yet. Please wait a moment and try again.");
      return;
    }
    setIsGeneratingPDF(true);
    try {
      const dataUri = await generatePdfFromReact(analysis, false);
      setPdfPreviewData(dataUri);
      setIsPdfPreviewOpen(true);
    } catch (error) {
      console.error("Error generating PDF with @react-pdf/renderer:", error);
    }
    setIsGeneratingPDF(false);
  }, [analysis]);

  const handleExportWithHtml2Canvas = useCallback(async () => {
    if (!analysis) {
      alert("Analysis data is not available yet. Please wait a moment and try again.");
      return;
    }
    setIsGeneratingHtml2CanvasPDF(true);
    try {
      const dataUri = await generatePdfFromReact(analysis, true);
      setPdfPreviewData(dataUri);
      setIsPdfPreviewOpen(true);
    } catch (error) {
      console.error("Error generating PDF with html2canvas:", error);
    }
    setIsGeneratingHtml2CanvasPDF(false);
  }, [analysis]);

  if (error || !analysis) {
    return <div className="flex items-center justify-center h-screen bg-background text-foreground p-8 text-center">{error || 'Loading Analysis...'}</div>;
  }

  const { 
    overallScore,
    metrics,
    morningRoutine,
    eveningRoutine,
    ingredientCompatibility,
    productRecommendations,
    detailedIngredientAnalysis,
    routine
  } = analysis;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <OverallScoreCard 
              {...overallScore} 
              onGenerateCardClick={() => setIsModalOpen(true)} 
              onExportWithHtml2Canvas={handleExportWithHtml2Canvas}
              isGenerating={isGeneratingHtml2CanvasPDF}
            />
            <MetricsDashboard metrics={metrics} />
            <div className="space-y-4">
              <h2 className="text-xl font-heading font-heading-semibold text-foreground">Routine Breakdown</h2>
              <RoutineScoreSection 
                title="Morning Routine"
                timeOfDay="morning"
                isExpanded={true}
                score={morningRoutine.score}
                products={morningRoutine.products}
                insights={morningRoutine.insights}
              />
              <RoutineScoreSection 
                title="Evening Routine"
                timeOfDay="evening"
                score={eveningRoutine.score}
                products={eveningRoutine.products}
                insights={eveningRoutine.insights}
              />
            </div>
          </div>
        );
      case 'detailed-analysis':
        return <DetailedAnalysisTab 
          detailedIngredientAnalysis={detailedIngredientAnalysis} 
          ingredientCompatibility={ingredientCompatibility} 
        />;
      case 'recommendations':
        return <RecommendationCards recommendations={productRecommendations} />;
      case 'progress-tracking':
        return <BeforeAfterComparison 
            before={{ date: "2024-01-15", imageUrl: "/placeholder-before.jpg", notes: "Starting point. Redness and some breakouts." }}
            after={{ date: "2024-04-15", imageUrl: "/placeholder-after.jpg", notes: "After 3 months. Skin is clearer and less red." }}
        />;
      default:
        return null;
    }
  };
  
  const TabButton = ({ tabName, label }) => (
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

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-5"> 
          <div className="bg-card border-b border-border">
              <div className="max-w-7xl mx-auto px-2 sm:px-6 py-4">
                  <h1 className="text-3xl font-heading font-heading-semibold text-foreground">Your Skincare Scorecard</h1>
                  <p className="text-muted-foreground mt-1">An AI-powered analysis of your daily skincare routines.</p>
              </div>
          </div>
          <div className="bg-background border-b border-border sticky top-16 z-30">
              <div className="max-w-7xl mx-auto px-2 sm:px-6">
                <div className="py-2 flex items-center justify-between sm:justify-start sm:space-x-2">
                  <TabButton tabName="overview" label="Overview" />
                  <TabButton tabName="detailed-analysis" label="Detailed Analysis" />
                  <TabButton tabName="recommendations" label="Recommendations" />
                  <TabButton tabName="progress-tracking" label="Progress Tracking" />
                </div>
              </div>
          </div>

        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-8 space-y-8" ref={contentRef}>
                {renderTabContent()}
            </div>
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
          </div>
        </main>
      </div>
      <ScoreCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        analysis={analysis}
      />
      <PdfPreviewModal 
        isOpen={isPdfPreviewOpen} 
        onClose={() => setIsPdfPreviewOpen(false)} 
        pdfDataUri={pdfPreviewData} 
      />
    </div>
  );
};

export default SkincareScoreCardResults;
