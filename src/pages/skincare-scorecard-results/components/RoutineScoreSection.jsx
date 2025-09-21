import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

// PDF-specific renderer for Routine Sections
const PdfRoutineSection = ({ title, score, products, insights, timeOfDay }) => {
  // Reverting to a simpler flexbox-based layout for readability, as it wasn't the root cause.
  const styles = {
    container: {
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      overflow: 'hidden',
      marginBottom: '24px',
      width: '100%',
      boxSizing: 'border-box',
    },
    header: {
      padding: '16px',
      borderBottom: '1px solid #e2e8f0',
      backgroundColor: '#f8fafc',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: { fontSize: '18px', fontWeight: '600', color: '#2d3748' },
    score: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: score >= 80 ? '#2f855a' : score >= 60 ? '#dd6b20' : '#c53030',
    },
    content: { padding: '16px' },
    productItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px',
      backgroundColor: '#f7fafc',
      borderRadius: '8px',
      marginBottom: '12px',
    },
    productIcon: {
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#e2e8f0',
      borderRadius: '8px',
      marginRight: '12px',
      flexShrink: 0,
    },
    productDetails: { flex: 1, minWidth: 0 },
    productName: { fontSize: '14px', fontWeight: '500', color: '#1a202c', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    productCategory: { fontSize: '12px', color: '#718096' },
    insightsContainer: { backgroundColor: '#f8fafc', borderRadius: '8px', padding: '16px', marginTop: '16px' },
    insightsTitle: { fontSize: '14px', fontWeight: '600', color: '#2d3748', marginBottom: '8px' },
    insightItem: { display: 'flex', alignItems: 'flex-start', marginBottom: '8px' },
    insightText: { fontSize: '14px', color: '#4a5568', marginLeft: '8px' },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>{title}</h3>
        <div style={styles.score}>{score}/100</div>
      </div>
      <div style={styles.content}>
        {products?.map((product, index) => (
          <div key={index} style={styles.productItem}>
            {/* ICON DISABLED FOR TESTING */}
            {/* <div style={styles.productIcon}>
              <Icon name="Package" size={20} />
            </div> */}
            <div style={{...styles.productIcon, marginRight: '12px'}}></div> {/* Keep spacing */}
            <div style={styles.productDetails}>
              <h4 style={styles.productName}>{product?.name}</h4>
              <p style={styles.productCategory}>{product?.category} • Step {product?.step}</p>
            </div>
          </div>
        ))}
        {insights && insights.length > 0 && (
          <div style={styles.insightsContainer}>
            <h4 style={styles.insightsTitle}>Routine Insights</h4>
            <div>
              {insights.map((insight, index) => (
                <div key={index} style={styles.insightItem}>
                  {/* ICON DISABLED FOR TESTING */}
                  {/* <Icon name={insight.icon || 'Info'} size={16} style={{ flexShrink: 0, marginTop: '3px' }} /> */}
                  <span style={styles.insightText}>{insight.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Original component using Tailwind CSS for the web UI
const RoutineScoreSection = ({ title, score, products, timeOfDay, insights, isExpanded: initialExpanded = false, isPdfMode = false }) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  if (isPdfMode) {
    return <PdfRoutineSection {...{ title, score, products, insights, timeOfDay }} />;
  }

  const getScoreBadgeColor = (s) => {
    if (s >= 80) return 'bg-success text-success-foreground';
    if (s >= 60) return 'bg-warning text-warning-foreground';
    return 'bg-destructive text-destructive-foreground';
  };

  const getProductRatingIcon = (rating) => {
    switch (rating) {
      case 'Excellent': return 'Star';
      case 'Good': return 'ThumbsUp';
      case 'Fair': return 'Minus';
      default: return 'AlertTriangle';
    }
  };

  const getProductRatingColor = (rating) => {
    switch (rating) {
      case 'Excellent': return 'text-success';
      case 'Good': return 'text-primary';
      case 'Fair': return 'text-warning';
      default: return 'text-destructive';
    }
  };

  const scoreValue = score || 0;

  return (
    <div className="bg-card border border-border rounded-clinical overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 sm:p-6 hover:bg-secondary/50 transition-clinical"
      >
        <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
          <Icon
            name={timeOfDay === 'morning' ? 'Sun' : 'Moon'}
            size={24}
            className="text-primary flex-shrink-0"
          />
          <div className="text-left min-w-0">
            <h3 className="text-lg font-heading font-heading-semibold text-foreground truncate">
              {title}
            </h3>
            <p className="text-sm font-caption font-caption-normal text-muted-foreground">
              {products?.length} products analyzed
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3 pl-3">
          <div className={`px-3 py-1 rounded-clinical-sm font-data font-data-normal text-sm ${getScoreBadgeColor(scoreValue)}`}>
            {scoreValue}/100
          </div>
          <Icon
            name={isExpanded ? 'ChevronUp' : 'ChevronDown'}
            size={20}
            className="text-muted-foreground flex-shrink-0"
          />
        </div>
      </button>
      {isExpanded && (
        <div className="border-t border-border p-4 sm:p-6 space-y-4">
          <div className="space-y-3">
            {products?.map((product, index) => {
                const productRatingValue = product?.rating;
                const productScoreValue = product?.score;
                return (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-clinical">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <div className="w-12 h-12 bg-secondary rounded-clinical flex items-center justify-center flex-shrink-0">
                                <Icon name="Package" size={20} className="text-secondary-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-body font-body-medium text-sm text-foreground">
                                {product?.name}
                                </h4>
                                <p className="text-xs font-caption font-caption-normal text-muted-foreground">
                                {product?.category} • {product?.step}
                                </p>
                                {product?.issues && product?.issues?.length > 0 && (
                                <div className="flex items-center space-x-1 mt-1">
                                    <Icon name="AlertTriangle" size={12} className="text-warning" />
                                    <span className="text-xs text-warning">
                                    {product?.issues?.length} issue{product?.issues?.length > 1 ? 's' : ''}
                                    </span>
                                </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 pl-2">
                            <Icon
                                name={getProductRatingIcon(productRatingValue)}
                                size={16}
                                className={`${getProductRatingColor(productRatingValue)} flex-shrink-0`}
                            />
                            <span className={`text-sm font-data font-data-normal ${getProductRatingColor(productRatingValue)}`}>
                                {productScoreValue}/10
                            </span>
                        </div>
                    </div>
                )}
            )}
          </div>
          {insights && insights.length > 0 && (
            <div className="bg-secondary/50 rounded-clinical p-4">
              <h4 className="font-heading font-heading-medium text-sm text-foreground mb-2">
                Routine Insights
              </h4>
              <div className="space-y-2">
                {insights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Icon name={insight.icon || 'Info'} size={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm font-body font-body-normal text-foreground">
                      {insight.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RoutineScoreSection;
