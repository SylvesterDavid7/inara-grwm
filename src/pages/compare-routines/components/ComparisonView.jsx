import React from 'react';
import OverallScoreCard from '../../skincare-scorecard-results/components/OverallScoreCard';
import RoutineScoreSection from '../../skincare-scorecard-results/components/RoutineScoreSection';
import MetricsDashboard from '../../skincare-scorecard-results/components/MetricsDashboard';

const ComparisonView = ({ analysis, title }) => {
  if (!analysis) {
    return (
      <div className="w-full lg:w-1/2 p-4 border-dashed border-2 border-border rounded-lg flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">No routine to display.</p>
          <p className="text-sm text-muted-foreground">
            You need to have at least two analyzed routines to use the comparison feature.
          </p>
        </div>
      </div>
    );
  }

  const {
    overallScore,
    metrics,
    morningRoutine,
    eveningRoutine,
    weeklyRoutine,
    routine, // Added routine to destructure
    createdAt
  } = analysis;

  return (
    <div className="w-full p-4">
      <div className="bg-card border border-border rounded-clinical p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-heading font-heading-semibold text-foreground">{title}</h2>
          {createdAt && (
            <p className="text-sm text-muted-foreground">
              Analyzed on: {new Date(createdAt.seconds * 1000).toLocaleDateString()}
            </p>
          )}
        </div>
        <OverallScoreCard {...overallScore} isSharedView={true} />
        <MetricsDashboard metrics={metrics} />
        {morningRoutine && morningRoutine.products.length > 0 && (
          <RoutineScoreSection title="Morning Routine" {...morningRoutine} routine={routine} icon="Sun" isExpanded={true} />
        )}
        {eveningRoutine && eveningRoutine.products.length > 0 && (
          <RoutineScoreSection title="Evening Routine" {...eveningRoutine} routine={routine} icon="Moon" />
        )}
        {weeklyRoutine && weeklyRoutine.products.length > 0 && (
          <RoutineScoreSection title="Weekly Routine" {...weeklyRoutine} routine={routine} icon="Calendar" />
        )}
      </div>
    </div>
  );
};

export default ComparisonView;
