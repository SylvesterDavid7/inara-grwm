import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const BeforeAfterComparison = ({ progressData, isSharedView }) => {
  const navigate = useNavigate();
  
  if (isSharedView) return null;

  if (!progressData) {
    return (
        <div className="bg-card border border-border rounded-clinical p-6 text-center">
            <p className="text-sm text-muted-foreground">Loading progress data...</p>
        </div>
    );
  }

  const hasMultipleScans = progressData.length > 1;
  const latestScan = progressData[progressData.length - 1];
  const firstScan = progressData[0];

  const handleNavigation = () => {
    navigate('/progress-tracking-dashboard');
  };

  return (
    <div className="bg-card border border-border rounded-clinical p-6">
        <div className="flex items-center justify-between mb-4">
            <div>
                <h3 className="text-lg font-heading font-heading-semibold text-foreground">
                Progress Tracking
                </h3>
                <p className="text-sm text-muted-foreground">
                {hasMultipleScans ? "See your full improvement journey." : "Start tracking your progress."}
                </p>
            </div>
            <Icon name="LineChart" size={24} className="text-muted-foreground" />
        </div>

        {hasMultipleScans ? (
            <div className="my-4 flex space-x-4 items-start">
                <figure className="flex-1">
                    <Image src={firstScan?.afterImage} alt="First scan" className="aspect-square w-full rounded-clinical object-cover bg-secondary" />
                    <figcaption className="mt-2 text-center text-xs font-caption text-muted-foreground">First Scan</figcaption>
                </figure>
                <div className="flex items-center pt-12"> 
                    <Icon name="ArrowRight" size={20} className="text-muted-foreground" />
                </div>
                <figure className="flex-1">
                    <Image src={latestScan?.afterImage} alt="Latest scan" className="aspect-square w-full rounded-clinical object-cover bg-secondary" />
                    <figcaption className="mt-2 text-center text-xs font-caption text-muted-foreground">Latest Scan</figcaption>
                </figure>
            </div>
        ) : (
            <div className="my-6 text-center bg-secondary/30 p-6 rounded-clinical">
                 <Icon name="Info" size={24} className="text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    This is your first scorecard. Get another scan in the future to compare results and track your progress.
                </p>
            </div>
        )}

        <button 
            onClick={handleNavigation}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-clinical hover:bg-primary/90 transition-clinical focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
        >
            <Icon name="LayoutDashboard" size={16} />
            <span className="font-body font-body-medium text-sm">View Progress Dashboard</span>
        </button>
    </div>
  );
};

export default BeforeAfterComparison;
