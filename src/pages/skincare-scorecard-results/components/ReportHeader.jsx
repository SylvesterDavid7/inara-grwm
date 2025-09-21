import React from 'react';

const ReportHeader = ({ overallScore }) => {
  const styles = {
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: '24px',
      borderBottom: '1px solid #e2e8f0',
      marginBottom: '24px',
    },
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    logo: {
      height: '32px',
      marginRight: '12px',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1a202c',
    },
    scoreCard: {
      textAlign: 'right',
    },
    scoreLabel: {
      fontSize: '14px',
      color: '#718096',
    },
    score: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#2d3748',
    },
  };

  return (
    <div style={styles.header}>
      <div style={styles.logoContainer}>
        {/* Using a placeholder for the logo as the path might differ in PDF context */}
        <img src="/Inara_Logo.svg" alt="Inara Logo" style={styles.logo} />
        <h1 style={styles.title}>Skincare Scorecard</h1>
      </div>
      <div style={styles.scoreCard}>
        <div style={styles.scoreLabel}>Overall Score</div>
        <div style={styles.score}>{overallScore}/100</div>
      </div>
    </div>
  );
};

export default ReportHeader;
