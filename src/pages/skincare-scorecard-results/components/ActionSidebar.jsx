import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ActionSidebar = ({ 
  analysis, 
  routine, 
  className = "", 
  onExportPDF, 
  isGeneratingPDF 
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareOptions, setShareOptions] = useState({
    includePhotos: true,
    includeRecommendations: true,
    includeScores: true,
    privacy: 'private'
  });

  const handleSaveScorecard = async () => {
    setIsSaving(true);
    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
  };

  const handleShareScorecard = async () => {
    setIsSharing(true);
    // Simulate share operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSharing(false);
  };

  const handleOptimizeRoutine = () => {
    // Navigate to routine optimization wizard
    console.log('Starting routine optimization...');
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
      description: 'Share with friends or skincare professional'
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
      action: () => console.log('Modify routine'),
      description: 'Edit your current skincare routine'
    },
    {
      id: 'compare',
      label: 'Compare Routines',
      icon: 'GitCompare',
      action: () => console.log('Compare routines'),
      description: 'Compare with previous assessments'
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
    <div className={`bg-card border border-border rounded-clinical p-6 space-y-6 ${className}`}>
        {/* Quick Actions */}
      <div>
        <h3 className="font-heading font-heading-semibold text-sm text-foreground mb-4">
          Quick Actions
        </h3>
        <div className="space-y-3">
          {quickActions?.map((action) => (
            <button
              key={action?.id}
              onClick={action?.action}
              disabled={action?.loading}
              className={`w-full flex items-center space-x-3 p-3 rounded-clinical transition-clinical text-left group ${
                action?.variant === 'primary' ?'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              <Icon 
                name={action?.loading ? "Loader2" : action?.icon} 
                size={18} 
                className={action?.loading ? "animate-spin" : "group-hover:scale-110 transition-transform"} 
              />
              <div className="flex-1 min-w-0">
                <div className="font-body font-body-medium text-sm">
                  {action?.loading ? 'Generating...' : action?.label}
                </div>
                <div className="text-xs opacity-80 mt-0.5">
                  {action?.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Routine Management */}
      <div>
        <h3 className="font-heading font-heading-semibold text-sm text-foreground mb-4">
          Routine Management
        </h3>
        <div className="space-y-2">
          {routineActions?.map((action) => (
            <button
              key={action?.id}
              onClick={action?.action}
              className="w-full flex items-center space-x-3 p-3 rounded-clinical bg-muted text-muted-foreground hover:bg-secondary hover:text-secondary-foreground transition-clinical text-left group"
            >
              <Icon 
                name={action?.icon} 
                size={16} 
                className="group-hover:scale-110 transition-transform" 
              />
              <div className="flex-1 min-w-0">
                <div className="font-body font-body-medium text-sm">
                  {action?.label}
                </div>
                <div className="text-xs opacity-70 mt-0.5">
                  {action?.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Share Settings */}
      <div className="border-t border-border pt-6">
        <h3 className="font-heading font-heading-semibold text-sm text-foreground mb-4">
          Share Settings
        </h3>
        <div className="space-y-3">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={shareOptions?.includePhotos}
              onChange={(e) => setShareOptions(prev => ({ ...prev, includePhotos: e?.target?.checked }))}
              className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-ring focus:ring-2"
            />
            <span className="text-sm font-body font-body-normal text-foreground">
              Include progress photos
            </span>
          </label>
          
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={shareOptions?.includeRecommendations}
              onChange={(e) => setShareOptions(prev => ({ ...prev, includeRecommendations: e?.target?.checked }))}
              className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-ring focus:ring-2"
            />
            <span className="text-sm font-body font-body-normal text-foreground">
              Include product recommendations
            </span>
          </label>
          
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={shareOptions?.includeScores}
              onChange={(e) => setShareOptions(prev => ({ ...prev, includeScores: e?.target?.checked }))}
              className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-ring focus:ring-2"
            />
            <span className="text-sm font-body font-body-normal text-foreground">
              Include detailed scores
            </span>
          </label>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-body font-body-medium text-foreground mb-2">
            Privacy Level
          </label>
          <select
            value={shareOptions?.privacy}
            onChange={(e) => setShareOptions(prev => ({ ...prev, privacy: e?.target?.value }))}
            className="w-full px-3 py-2 bg-background border border-border rounded-clinical text-sm font-body font-body-normal focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="private">Private (Link only)</option>
            <option value="friends">Friends only</option>
            <option value="public">Public</option>
          </select>
        </div>
      </div>
      {/* Help & Support */}
      <div className="border-t border-border pt-6">
        <h3 className="font-heading font-heading-semibold text-sm text-foreground mb-4">
          Need Help?
        </h3>
        <div className="space-y-2">
          <button className="w-full flex items-center space-x-3 p-2 rounded-clinical text-left hover:bg-secondary/50 transition-clinical">
            <Icon name="HelpCircle" size={16} className="text-primary" />
            <span className="text-sm font-body font-body-normal text-foreground">
              Understanding Your Score
            </span>
          </button>
          <button className="w-full flex items-center space-x-3 p-2 rounded-clinical text-left hover:bg-secondary/50 transition-clinical">
            <Icon name="MessageCircle" size={16} className="text-primary" />
            <span className="text-sm font-body font-body-normal text-foreground">
              Contact Support
            </span>
          </button>
          <button className="w-full flex items-center space-x-3 p-2 rounded-clinical text-left hover:bg-secondary/50 transition-clinical">
            <Icon name="BookOpen" size={16} className="text-primary" />
            <span className="text-sm font-body font-body-normal text-foreground">
              Skincare Guide
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionSidebar;
