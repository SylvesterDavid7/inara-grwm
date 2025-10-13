import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { useNavigate } from 'react-router-dom';
import { db } from '../../../firebase'; // Ensure you have this import
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const ActionSidebar = ({ 
  analysis, 
  routine, 
  className = "", 
  onExportPDF, 
  isGeneratingPDF,
  setIsShareModalOpen,
  setShareableLink,
  scorecardCount
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const [shareOptions, setShareOptions] = useState({
    includePhotos: true,
    includeRecommendations: true,
    includeScores: true,
    privacy: 'private' // 'private', 'public'
  });
  const navigate = useNavigate();

  const handleSaveScorecard = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Scorecard saved (simulated).');
    setIsSaving(false);
  };

  const handleShareScorecard = async () => {
    setIsSharing(true);
    try {
      const docRef = await addDoc(collection(db, "sharedAnalyses"), {
        analysis: { ...analysis, routine }, // Combine analysis and routine
        shareOptions,
        createdAt: serverTimestamp(),
      });
      const link = `${window.location.origin}/skincare-scorecard-results?sharedId=${docRef.id}`;
      setShareableLink(link);
      setIsShareModalOpen(true);
    } catch (error) {
      console.error("Error creating shareable link: ", error);
    }
    setIsSharing(false);
  };

  const handleOptimizeRoutine = () => {
    console.log('Starting routine optimization...');
    navigate('/optimize-routine', { state: { analysis } });
  };

  const quickActions = [
    {
      id: 'save',
      label: 'Save Scorecard',
      icon: 'Bookmark',
      action: handleSaveScorecard,
      loading: isSaving,
      description: 'Save to your profile for future reference'
    },
    {
      id: 'export',
      label: 'Export PDF',
      icon: 'Download',
      action: onExportPDF,
      loading: isGeneratingPDF,
      description: 'Download detailed report as PDF'
    },
    {
      id: 'share',
      label: 'Share Results',
      icon: 'Share2',
      action: handleShareScorecard,
      loading: isSharing,
      description: 'Generate a shareable link for your results'
    },
    {
      id: 'optimize',
      label: 'Optimize Routine',
      icon: 'Zap',
      action: handleOptimizeRoutine,
      variant: 'primary',
      description: 'Get personalized improvement suggestions'
    }
  ];

  const routineActions = [
    {
      id: 'modify',
      label: 'Modify Routine',
      icon: 'Edit3',
      action: () => navigate('/skincare-routine-input', { state: { routine: routine, source: 'scorecard' } }),
      description: 'Edit your current skincare routine'
    },
    {
      id: 'compare',
      label: 'Compare Routines',
      icon: 'GitCompare',
      action: () => navigate('/compare-routines', { state: { analysis: { ...analysis, routine } } }),
      description: 'Compare with previous assessments',
      disabled: scorecardCount <= 1
    },
    {
      id: 'schedule',
      label: 'Set Reminders',
      icon: 'Calendar',
      action: () => console.log('Set reminders'),
      description: 'Schedule routine reminders'
    }
  ];

  return (
    <>
      <div className={`bg-card border border-border rounded-clinical p-6 space-y-6 ${className}`}>
        <div>
          <h3 className="font-heading font-heading-semibold text-sm text-foreground mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {quickActions?.map((action) => (
              <button
                key={action?.id}
                onClick={action?.action}
                disabled={action?.loading}
                className={`w-full flex items-center space-x-3 p-3 rounded-clinical transition-clinical text-left group ${
                  action?.variant === 'primary' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                <Icon 
                  name={action?.loading ? "Loader2" : action?.icon} 
                  size={18} 
                  className={action?.loading ? "animate-spin" : "group-hover:scale-110 transition-transform"} 
                />
                <div className="flex-1 min-w-0">
                  <div className="font-body font-body-medium text-sm">
                    {action?.loading ? (action.id === 'share' ? 'Generating Link...' : 'Saving...') : action?.label}
                  </div>
                  <div className="text-xs opacity-80 mt-0.5">
                    {action?.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-heading font-heading-semibold text-sm text-foreground mb-4">Routine Management</h3>
          <div className="space-y-2">
            {routineActions?.map((action) => {
              const isButtonDisabled = action.disabled;
              const ButtonWrapper = isButtonDisabled ? ({ children }) => <div title="You need at least two scorecards to compare routines.">{children}</div> : ({ children }) => <>{children}</>;
              return (
                <ButtonWrapper key={action?.id}>
                  <button
                    onClick={action?.action}
                    disabled={isButtonDisabled}
                    className={`w-full flex items-center space-x-3 p-3 rounded-clinical bg-muted text-muted-foreground transition-clinical text-left group ${
                      isButtonDisabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-secondary hover:text-secondary-foreground'
                    }`}
                  >
                    <Icon name={action?.icon} size={16} className={isButtonDisabled ? '' : 'group-hover:scale-110 transition-transform'} />
                    <div className="flex-1 min-w-0">
                      <div className="font-body font-body-medium text-sm">{action?.label}</div>
                      <div className="text-xs opacity-70 mt-0.5">{action?.description}</div>
                    </div>
                  </button>
                </ButtonWrapper>
              );
            })}
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <h3 className="font-heading font-heading-semibold text-sm text-foreground mb-4">Share Settings</h3>
          <p className="text-xs text-muted-foreground mb-4">These options configure what will be included when you click 'Share Results'.</p>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={shareOptions?.includeScores}
                onChange={(e) => setShareOptions(prev => ({ ...prev, includeScores: e.target.checked }))}
                className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-ring focus:ring-2"
              />
              <span className="text-sm font-body font-body-normal text-foreground">Include detailed scores & analysis</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={shareOptions?.includeRecommendations}
                onChange={(e) => setShareOptions(prev => ({ ...prev, includeRecommendations: e.target.checked }))}
                className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-ring focus:ring-2"
              />
              <span className="text-sm font-body font-body-normal text-foreground">Include product recommendations</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={shareOptions?.includePhotos}
                onChange={(e) => setShareOptions(prev => ({ ...prev, includePhotos: e.target.checked }))}
                className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-ring focus:ring-2"
              />
              <span className="text-sm font-body font-body-normal text-foreground">Include progress photos</span>
            </label>
          </div>
          <div className="mt-4">
            <label htmlFor="privacy-level" className="block text-sm font-body font-body-medium text-foreground mb-2">Privacy Level</label>
            <select
              id="privacy-level"
              value={shareOptions?.privacy}
              onChange={(e) => setShareOptions(prev => ({ ...prev, privacy: e.target.value }))}
              className="w-full px-3 py-2 bg-background border border-border rounded-clinical text-sm font-body font-body-normal focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="private">Private (only with link)</option>
              <option value="public">Public (discoverable)</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
};

export default ActionSidebar;
