
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { doc, getDoc, setDoc, collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useUserDataContext } from '../../contexts/UserDataContext.jsx';
import html2canvas from 'html2canvas';
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
import ShareModal from '../assessment-results/components/ShareModal';

const SkincareScoreCardResults = () => {
  const { analysisId: urlAnalysisId } = useParams();
  const { user, userData } = useUserDataContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sharedId = searchParams.get('sharedId');

  const [analysis, setAnalysis] = useState(null);
  const [allAnalyses, setAllAnalyses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState(false);
  const [pdfPreviewData, setPdfPreviewData] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareableLink, setShareableLink] = useState('');
  const [shareOptions, setShareOptions] = useState({ includePhotos: true, includeRecommendations: true, includeScores: true });

  const [isSharedView, setIsSharedView] = useState(!!sharedId);
  const [viewOptions, setViewOptions] = useState({ includePhotos: true, includeRecommendations: true, includeScores: true });

  const contentRef = useRef(null);
  const overallScoreCardRef = useRef(null);
  const analysisId = sharedId || urlAnalysisId;

  useEffect(() => {
    const fetchAnalysis = async () => {
      setIsLoading(true);
      setError(null);

      if (isSharedView && sharedId) {
        try {
          const docRef = doc(db, 'sharedAnalyses', sharedId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const sharedData = docSnap.data();
            setAnalysis(sharedData.analysis);
            setViewOptions(sharedData.shareOptions);
            if (sharedData.analysis && !sharedData.analysis.routine) {
                 setAnalysis(prev => ({...prev, routine: sharedData.analysis.routine}));
            }
          } else {
            setError("Shared analysis not found or has been deleted.");
          }
        } catch (e) {
          console.error("Error fetching shared analysis:", e);
          setError("Could not load the shared analysis.");
        } finally {
          setIsLoading(false);
        }
        return;
      }
      
      if (location.state && location.state.analysis) {
        setAnalysis({ ...location.state.analysis, routine: location.state.routine });
        if (location.state.focus === 'detailed-analysis') setActiveTab('detailed-analysis');
        setIsLoading(false);
        return;
      }

      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const analysesQuery = query(
          collection(db, 'users', user.uid, 'analyses'),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(analysesQuery);
        const analyses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllAnalyses(analyses);

        if (analyses.length === 0) {
          setError("No analyses found for your account.");
          setIsLoading(false);
          return;
        }

        let finalAnalysisId = urlAnalysisId;
        if (!finalAnalysisId) {
          finalAnalysisId = analyses[0].id;
          navigate(`/skincare-scorecard-results/${finalAnalysisId}`, { replace: true });
          return;
        }

        const currentAnalysis = analyses.find(a => a.id === finalAnalysisId);

        if (currentAnalysis) {
          setAnalysis(currentAnalysis);
        } else {
          setError("Sorry, we couldn't find the analysis you're looking for.");
        }

      } catch (e) {
        console.error("Error fetching analysis documents: ", e);
        setError("An error occurred while trying to load the analyses.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();

  }, [analysisId, user, navigate, location.state, isSharedView, sharedId, urlAnalysisId]);

  const handleExportWithReactPdf = useCallback(async () => {
    if (!analysis) return;
    setIsGeneratingPDF(true);
    try {
      const analysisDataForPdf = isSharedView ? analysis : analysis.analysis;
      const dataUri = await generatePdfFromReact({ analysis: analysisDataForPdf, routine: analysis.routine, user: userData }, false);
      setPdfPreviewData(dataUri);
      setIsPdfPreviewOpen(true);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
    setIsGeneratingPDF(false);
  }, [analysis, isSharedView, userData]);

  const handleExportWithHtml2Canvas = useCallback(async () => {
    if (!overallScoreCardRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(overallScoreCardRef.current, { backgroundColor: null });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = 'skincare-scorecard.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting scorecard:', error);
    }
    setIsExporting(false);
  }, []);

  const handleShare = useCallback(async () => {
    if (!analysis) return;
    try {
      const analysisToShare = { 
        ...(analysis.analysis || {}), 
        routine: analysis.routine 
      };
  
      const docRef = doc(collection(db, 'sharedAnalyses'));
      await setDoc(docRef, {
        analysis: analysisToShare,
        shareOptions,
        createdAt: new Date(),
      });
      const link = `${window.location.origin}/skincare-scorecard-results?sharedId=${docRef.id}`;
      setShareableLink(link);
      setIsShareModalOpen(true);
    } catch (error) {
      console.error("Error creating shareable link:", error);
    }
  }, [analysis, shareOptions]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen bg-background text-foreground p-8 text-center">Loading Scorecard...</div>;
  }
  
  if (error) {
    if (error === "No analyses found for your account.") {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] bg-background text-foreground p-8 text-center">
                <Icon name="ScanFace" size={48} className="text-muted-foreground mb-4" />
                <h3 className="text-xl font-heading font-heading-semibold text-foreground mb-2">Track Your Progress</h3>
                <p className="text-muted-foreground mb-6 max-w-sm">
                    You don't have any skin scans yet. Use the Derma Scan feature to get your first AI-powered analysis and start tracking your skin's health over time.
                </p>
                <button onClick={() => navigate('/derma-scan')} className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-body-medium">
                    Go to Derma Scan
                </button>
            </div>
        );
    }
    return <div className="flex items-center justify-center h-screen bg-background text-foreground p-8 text-center">{error}</div>;
  }
  
  if (!analysis) {
    if (!user && !isSharedView) {
      return (
          <div className="flex items-center justify-center h-screen bg-background text-foreground p-8 text-center">
              <div>
                  <p className="mb-4">Please log in to view your analyses.</p>
                  <button onClick={() => navigate('/login')} className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
                      Go to Login
                  </button>
              </div>
          </div>
      );
    }
    return <div className="flex items-center justify-center h-screen bg-background text-foreground p-8 text-center">No analysis found.</div>;
  }

  const analysisData = isSharedView ? analysis : analysis.analysis;
  const routine = isSharedView ? analysis.routine : analysis.routine;
  
  const { 
    overallScore,
    metrics,
    morningRoutine,
    eveningRoutine,
    weeklyRoutine,
    ingredientCompatibility,
    productRecommendations,
    detailedIngredientAnalysis
  } = analysisData;

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
        <RoutineScoreSection title="Morning Routine" {...morningRoutine} routine={routine} icon="Sun" isExpanded={true} />
      )}
      
      {eveningRoutine && eveningRoutine.products && eveningRoutine.products.length > 0 && (
        <RoutineScoreSection title="Evening Routine" {...eveningRoutine} routine={routine} icon="Moon" />
      )}
      
      {weeklyRoutine && weeklyRoutine.products && weeklyRoutine.products.length > 0 && (
         <RoutineScoreSection title="Weekly Routine" {...weeklyRoutine} routine={routine} icon="Calendar" />
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
            <div className={`${isSharedView ? 'lg:col-span-12' : 'lg:col-span-8'} space-y-8`} ref={contentRef}>
                {activeTab === 'overview' && viewOptions.includeScores && (
                  <div className="space-y-8">
                    <div ref={overallScoreCardRef}>
                      <OverallScoreCard 
                        {...overallScore} 
                        onGenerateCardClick={() => !isSharedView && setIsModalOpen(true)} 
                        onExportPDF={handleExportWithReactPdf}
                        onShare={handleShare}
                        isGeneratingPDF={isGeneratingPDF}
                        isSharedView={isSharedView} />
                    </div>
                    <MetricsDashboard metrics={metrics} />
                    {renderRoutineAnalysis()}
                  </div>
                )}
                {activeTab === 'detailed-analysis' && viewOptions.includeScores && <DetailedAnalysisTab detailedIngredientAnalysis={detailedIngredientAnalysis} ingredientCompatibility={ingredientCompatibility} />}
                {activeTab === 'recommendations' && viewOptions.includeRecommendations && (
                    <div className="bg-card border border-border rounded-clinical p-6 text-center">
                        <Icon name="WandSparkles" size={48} className="text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-heading font-heading-semibold text-foreground">Coming Soon!</h3>
                        <p className="text-sm text-muted-foreground mt-2">
                            Personalized product recommendations are being curated and will be available shortly.
                        </p>
                    </div>
                )}
                {activeTab === 'progress-tracking' && viewOptions.includePhotos && (
                    <div className="bg-card border border-border rounded-clinical p-6 text-center">
                        <Icon name="History" size={48} className="text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-heading font-heading-semibold text-foreground">Coming Soon!</h3>
                        <p className="text-sm text-muted-foreground mt-2">
                            The full Progress Tracking dashboard is currently unavailable, but you will have access to it shortly.
                        </p>
                    </div>
                )}
            </div>
            {!isSharedView && (
              <div className="hidden lg:block lg:col-span-4">
                <div className="sticky top-32 space-y-8">
                  <ActionSidebar 
                      analysis={analysisData} 
                      routine={routine}
                      scorecardCount={allAnalyses.length} 
                      onExportPDF={handleExportWithReactPdf}
                      isGeneratingPDF={isGeneratingPDF}
                      setIsShareModalOpen={setIsShareModalOpen}
                      setShareableLink={setShareableLink}
                      setActiveTab={setActiveTab}
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
          analysis={analysisData}
        />
      )}
      <PdfPreviewModal 
        isOpen={isPdfPreviewOpen} 
        onClose={() => setIsPdfPreviewOpen(false)} 
        pdfDataUri={pdfPreviewData} 
      />
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareableLink={shareableLink}
        onCopy={() => { /* Add copy logic if needed */ }}
        shareOptions={shareOptions}
        onOptionChange={(newOptions) => setShareOptions(newOptions)}
        isSharedView={isSharedView}
      />
    </div>
  );
};

export default SkincareScoreCardResults;
