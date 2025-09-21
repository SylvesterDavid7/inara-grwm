import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import MetricDetailModal from './MetricDetailModal';

const PdfMetricsDashboard = ({ metrics }) => {
  const getMetricHexColor = (value, thresholds) => {
    if (value >= thresholds.excellent) return '#2f855a';
    if (value >= thresholds.good) return '#3b82f6';
    if (value >= thresholds.fair) return '#f97316';
    return '#ef4444';
  };

  const metricConfigs = [
    { key: 'Effectiveness', title: 'Effectiveness', icon: 'TrendingUp', suffix: '%', thresholds: { excellent: 85, good: 70, fair: 50 } },
    { key: 'Safety', title: 'Ingredient Safety', icon: 'Shield', suffix: '%', thresholds: { excellent: 90, good: 80, fair: 60 } },
    { key: 'Goal Alignment', title: 'Goal Alignment', icon: 'Target', suffix: '%', thresholds: { excellent: 80, good: 65, fair: 45 } },
    { key: 'Routine Consistency', title: 'Consistency', icon: 'Repeat', suffix: '%', thresholds: { excellent: 90, good: 75, fair: 50 } },
  ];

  const styles = {
    grid: { width: '100%' },
    card: {
      display: 'inline-block',
      width: '48%',
      margin: '1%',
      verticalAlign: 'top',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '16px',
      boxSizing: 'border-box',
    },
    cardHeader: { display: 'table', width: '100%', marginBottom: '8px' },
    headerCellLeft: { display: 'table-cell', verticalAlign: 'middle', width: '24px' },
    headerCellRight: { display: 'table-cell', verticalAlign: 'middle', textAlign: 'right' },
    cardTitle: { fontSize: '14px', fontWeight: '600', color: '#374151', paddingTop: '8px' },
    score: { fontSize: '22px', fontWeight: 'bold' },
    progressBarContainer: { height: '6px', width: '100%', backgroundColor: '#e5e7eb', borderRadius: '3px', marginTop: '12px' },
    progressBar: { height: '100%', borderRadius: '3px' },
    rating: { fontSize: '12px', color: '#6b7280', marginTop: '4px' },
  };

  return (
    <div style={styles.grid}>
      {metricConfigs.map((config, index) => {
        const metricData = metrics?.[config.key];
        const value = metricData?.score || 0;
        const rating = metricData?.rating || 'N/A';
        const color = getMetricHexColor(value, config.thresholds);

        return (
          <div key={index} style={styles.card}>
            <div>
              <div style={styles.cardHeader}>
                <div style={styles.headerCellLeft}>
                  {/* ICON DISABLED FOR PDF-MODE */}
                </div>
                <div style={styles.headerCellRight}>
                  <div style={{ ...styles.score, color }}>{value}{config.suffix}</div>
                </div>
              </div>
              <h4 style={styles.cardTitle}>{config.title}</h4>
            </div>
            <div>
              <div style={styles.progressBarContainer}>
                <div style={{ ...styles.progressBar, width: `${value}%`, backgroundColor: color }}></div>
              </div>
              <div style={styles.rating}>{rating}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const MetricsDashboard = ({ metrics, isPdfMode = false }) => {
  const [modalMetric, setModalMetric] = useState(null);

  if (isPdfMode) {
    return <PdfMetricsDashboard metrics={metrics} />;
  }

  const getMetricColor = (value, thresholds) => {
    if (value >= thresholds?.excellent) return 'text-success';
    if (value >= thresholds?.good) return 'text-primary';
    if (value >= thresholds?.fair) return 'text-warning';
    return 'text-destructive';
  };

  const getMetricBackground = (value, thresholds) => {
    if (value >= thresholds?.excellent) return 'bg-success/10 border-success/20';
    if (value >= thresholds?.good) return 'bg-primary/10 border-primary/20';
    if (value >= thresholds?.fair) return 'bg-warning/10 border-warning/20';
    return 'bg-destructive/10 border-destructive/20';
  };

  const metricConfigs = [
    { key: 'Effectiveness', title: 'Routine Effectiveness', icon: 'TrendingUp', suffix: '%', thresholds: { excellent: 85, good: 70, fair: 50 } },
    { key: 'Safety', title: 'Ingredient Safety', icon: 'Shield', suffix: '%', thresholds: { excellent: 90, good: 80, fair: 60 } },
    { key: 'Goal Alignment', title: 'Skin Goal Alignment', icon: 'Target', suffix: '%', thresholds: { excellent: 80, good: 65, fair: 45 } },
    { key: 'Routine Consistency', title: 'Routine Consistency', icon: 'Repeat', suffix: '%', thresholds: { excellent: 90, good: 75, fair: 50 } },
  ];

  const handleMetricClick = (config) => {
    const metricData = metrics?.[config.key];
    if (metricData && metricData.explanation) {
      setModalMetric({ ...config, ...metricData, score: metricData.score, rating: metricData.rating });
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricConfigs.map((config) => {
          const metricData = metrics?.[config.key];
          const value = metricData?.score;
          const rating = metricData?.rating;
          // CORRECTED: Removed the stray dot before 'value'
          const colorClass = getMetricColor(value, config.thresholds);
          const backgroundClass = getMetricBackground(value, config.thresholds);

          return (
            <button
              key={config.key}
              onClick={() => handleMetricClick(config)}
              disabled={!metricData}
              className={`w-full text-left bg-card border rounded-clinical p-6 transition-clinical hover:shadow-clinical focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed ${backgroundClass}`}
            >
              <div className="flex items-center justify-between mb-4">
                <Icon name={config.icon} size={24} className={colorClass} />
                <div className={`text-2xl font-heading font-heading-bold ${colorClass}`}>
                  {value !== undefined ? `${value}${config.suffix}` : 'N/A'}
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-body font-body-medium text-sm text-foreground">
                  {config.title}
                </h4>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-clinical-slow ${
                      getMetricColor(value, { excellent: 100, good: config.thresholds.good, fair: config.thresholds.fair, destructive: 0 }).replace('text-', 'bg-')
                    }`}
                    style={{
                      width: `${value !== undefined ? value : 0}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-caption font-caption-normal text-muted-foreground">
                    {rating || 'Not available'}
                  </span>
                  {metricData?.explanation && <span className="text-xs text-primary font-semibold">Details</span>}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <MetricDetailModal 
        isOpen={!!modalMetric}
        onClose={() => setModalMetric(null)}
        metric={modalMetric}
      />
    </>
  );
};

export default MetricsDashboard;
