import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const logoUrl = "/Inara_Logo.png";
const watermarkUrl = "/Inara Smiley Black.png";
const brandColor = '#51b748';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.6,
    color: '#374151',
    backgroundColor: '#f9fafb'
  },
  watermark: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 250,
    height: 250,
    opacity: 0.03,
    transform: 'rotate(-15deg)',
  },
  brandingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: brandColor,
    paddingBottom: 10,
  },
  headerLogo: {
    width: 100,
    height: 30,
    marginRight: 10,
  },
  brandTitleContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  headerBrandText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    fontFamily: 'Helvetica-Bold',
    lineHeight: 1.1,
  },
  headerBrandSubtitle: {
    fontSize: 8,
    color: '#6b7280',
    marginTop: -2,
    letterSpacing: 0.5,
  },
  reportTitleSection: {
    textAlign: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 10,
    color: '#4b5563',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    color: brandColor,
    marginBottom: 10,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  card: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    padding: 15,
    marginBottom: 10,
  },
  overallScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreColumn: {
    alignItems: 'center',
    marginRight: 20,
    width: 80,
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: brandColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    color: 'white',
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    paddingBottom: 10,
  },
  scoreRating: {
    color: brandColor,
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginTop: 5,
  },
  insightsContainer: {
    flex: 1,
    flexShrink: 1,
  },
  insightTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
    color: '#111827',
  },
  keyImprovementText: {
    fontSize: 9,
    color: '#4b5563',
    marginBottom: 6,
    flexShrink: 1,
  },
  bulletPointItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 3,
    paddingRight: 10,
  },
  bulletPoint: {
    width: 10,
    fontSize: 10,
    color: brandColor,
    fontFamily: 'Helvetica-Bold',
    lineHeight: 1.6,
  },
  bulletPointText: {
    flex: 1,
    fontSize: 9,
    color: '#4b5563',
    flexShrink: 1,
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    padding: 10,
    width: '48%',
    marginBottom: 10,
  },
  metricTitle: {
    fontSize: 8,
    color: '#374151',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  metricScore: {
    fontSize: 20,
    color: brandColor,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    paddingBottom: 5,
  },
  metricRating: {
    fontSize: 8,
    color: '#6b7280',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  routineTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
    color: '#1f2937',
  },
  routineAnalysisText: {
    color: '#4b5563',
    fontSize: 9,
    marginBottom: 6,
  },
  routineInsightsTitle: {
    color: '#374151',
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    marginTop: 8,
    marginBottom: 4,
    fontSize: 9,
  },
  ingredientSection: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  ingredientName: {
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  ingredientDetailText: {
    fontSize: 9,
    marginBottom: 2,
    color: '#4b5563',
  },
  ingredientWarningText: {
    fontSize: 9,
    marginTop: 3,
    color: '#ef4444',
  },
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 8,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 7,
    color: '#9ca3af',
  },
});

const PdfDocument = ({ analysis: rawAnalysis }) => {
  const { analysis, routine, user } = rawAnalysis || {};

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image style={styles.watermark} src={watermarkUrl} fixed />

        {/* Header */}
        <View style={styles.brandingHeader}>
          <Image style={styles.headerLogo} src={logoUrl} />
          <Text style={{ ...styles.headerBrandText, marginRight: 10 }}>X</Text>
          <View style={styles.brandTitleContainer}>
            <Text style={styles.headerBrandText}>GRWM</Text>
            <Text style={styles.headerBrandSubtitle}>Get Results With Metrics</Text>
          </View>
        </View>

        {/* Report Info */}
        <View style={styles.reportTitleSection}>
          <Text style={styles.title}>Skincare Analysis Report</Text>
          <Text style={styles.subtitle}>Prepared for: {user?.displayName || 'User'}</Text>
          <Text style={styles.subtitle}>Date: {new Date().toLocaleDateString()}</Text>
        </View>

        {/* Overall Score */}
        {analysis?.overallScore && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overall Score</Text>
            <View style={[styles.card, styles.overallScoreContainer]}>
              <View style={styles.scoreColumn}>
                <View style={styles.scoreCircle}>
                  <Text style={styles.scoreText}>{analysis.overallScore.score || 'N/A'}</Text>
                </View>
                <Text style={styles.scoreRating}>{analysis.overallScore.rating || ''}</Text>
              </View>
              <View style={styles.insightsContainer}>
                <Text style={styles.insightTitle}>Key Improvement Area:</Text>
                <Text style={styles.keyImprovementText}>
                  {analysis.overallScore.improvement || 'N/A'}
                </Text>
                <Text style={styles.insightTitle}>Summary Insights:</Text>
                {analysis.overallScore.insights?.map((item, i) => (
                  <View key={i} style={styles.bulletPointItem}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.bulletPointText}>{item.text}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Key Metrics */}
        {analysis?.metrics && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Metrics</Text>
            <View style={styles.metricsContainer}>
              {Object.entries(analysis.metrics).map(([name, metric], i) => (
                <View key={i} style={styles.metricCard}>
                  <Text style={styles.metricTitle}>
                    {name.replace(/([A-Z])/g, ' $1').trim()}
                  </Text>
                  <Text style={styles.metricScore}>{metric.score}</Text>
                  <Text style={styles.metricRating}>{metric.rating}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Routine Breakdown */}
        {(analysis?.morningRoutine || analysis?.eveningRoutine || analysis?.weeklyRoutine) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Routine Breakdown</Text>

            {analysis.morningRoutine && (
              <View style={styles.card}>
                <Text style={styles.routineTitle}>
                  Morning Routine (Score: {analysis.morningRoutine.score})
                </Text>
                <Text style={styles.routineAnalysisText}>{analysis.morningRoutine.analysis}</Text>
                <Text style={styles.routineInsightsTitle}>Actionable Insights:</Text>
                {analysis.morningRoutine.insights?.map((item, i) => (
                  <View key={i} style={styles.bulletPointItem}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.bulletPointText}>{item.text}</Text>
                  </View>
                ))}
              </View>
            )}

            {analysis.eveningRoutine && (
              <View style={styles.card}>
                <Text style={styles.routineTitle}>
                  Evening Routine (Score: {analysis.eveningRoutine.score})
                </Text>
                <Text style={styles.routineAnalysisText}>{analysis.eveningRoutine.analysis}</Text>
                <Text style={styles.routineInsightsTitle}>Actionable Insights:</Text>
                {analysis.eveningRoutine.insights?.map((item, i) => (
                  <View key={i} style={styles.bulletPointItem}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.bulletPointText}>{item.text}</Text>
                  </View>
                ))}
              </View>
            )}

            {analysis.weeklyRoutine && (
              <View style={styles.card}>
                <Text style={styles.routineTitle}>
                  Weekly Routine (Score: {analysis.weeklyRoutine.score})
                </Text>
                <Text style={styles.routineAnalysisText}>{analysis.weeklyRoutine.analysis}</Text>
                <Text style={styles.routineInsightsTitle}>Actionable Insights:</Text>
                {analysis.weeklyRoutine.insights?.map((item, i) => (
                  <View key={i} style={styles.bulletPointItem}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.bulletPointText}>{item.text}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Ingredient Deep Dive */}
        {analysis?.detailedIngredientAnalysis && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Ingredient Deep Dive</Text>
            {analysis.detailedIngredientAnalysis.map((ing, i) => (
              <View key={i} style={styles.ingredientSection}>
                <Text style={styles.ingredientName}>{ing.name}</Text>
                <Text style={styles.ingredientDetailText}>Purpose: {ing.purpose}</Text>
                <Text style={styles.ingredientDetailText}>Strength: {ing.strength}</Text>
                <Text style={styles.ingredientDetailText}>
                  Found In: {ing.products.join(', ')}
                </Text>
                {ing.warnings?.length > 0 && (
                  <Text style={styles.ingredientWarningText}>
                    Warnings: {ing.warnings.join(', ')}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            © {new Date().getFullYear()} GRWM · Built for evidence-based skincare.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default PdfDocument;

