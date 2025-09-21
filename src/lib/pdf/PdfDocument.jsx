
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const logoUrl = "/Inara_Logo.png"; // Use absolute URL for the logo
const brandColor = '#51b748';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.5,
    color: '#333',
    backgroundColor: '#ffffff'
  },
  brandingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: brandColor,
    paddingBottom: 15,
  },
  headerLogo: {
    width: 100,
    height : 30,
    marginRight: 15,
  },
  brandTitleContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  headerBrandText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    fontFamily: 'Helvetica-Bold',
    lineHeight: 1.1,
  },
  headerBrandSubtitle: {
    fontSize: 8,
    color: '#666',
    marginTop: -2,
    letterSpacing: 0.5,
  },
  reportTitleSection: {
    textAlign: 'center',
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    color: '#1a1a1a',
    marginBottom: 25,
  },
  subtitle: {
    fontSize: 12,
    color: '#555',
    marginBottom: 2,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    color: brandColor,
    marginBottom: 12,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  card: {
    backgroundColor: '#2d2d2d',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 6,
    padding: 18,
    marginBottom: 15,
  },
  overallScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreColumn: {
    alignItems: 'center',
    marginRight: 20,
  },
  scoreCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: brandColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    color: 'white',
    fontSize: 32,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    paddingBottom: 20,
  },
  scoreRating: {
    color: brandColor,
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginTop: 6,
  },
  insightsContainer: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
    color: '#f0f0f0',
  },
  keyImprovementText: {
    fontSize: 10,
    color: '#bdbdbd',
    marginBottom: 4,
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    backgroundColor: '#2d2d2d',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 6,
    padding: 10,
    width: '24%',
    height: 75,
    justifyContent: 'center',
    textAlign: 'center',
  },
  metricTitle: {
    fontSize: 10,
    color: '#f0f0f0',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  metricScore: {
    fontSize: 22,
    color: brandColor,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 15,
  },
  metricRating: {
    fontSize: 8,
    color: '#bdbdbd',
    textTransform: 'uppercase',
  },
  routineTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 10,
    color: '#f0f0f0'
  },
  routineAnalysisText: {
    color: '#bdbdbd',
    marginBottom: 8,
  },
  routineInsightsTitle: {
    color: '#f0f0f0',
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    marginTop: 8,
    marginBottom: 4,
  },
  ingredientSection: {
    backgroundColor: '#2d2d2d',
    borderWidth: 1,
    borderColor: '#444',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  ingredientName: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    color: '#f0f0f0',
    marginBottom: 5,
  },
  ingredientDetailText: {
    fontSize: 10,
    marginBottom: 2,
    color: '#bdbdbd',
  },
  ingredientWarningText: {
    fontSize: 10,
    marginTop: 4,
    color: '#d9534f',
  },
  bulletPointItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  bulletPoint: {
    width: 10,
    fontSize: 10,
    color: brandColor,
    fontFamily: 'Helvetica-Bold',
    lineHeight: 1.5,
  },
  bulletPointText: {
    flex: 1,
    fontSize: 10,
    color: '#bdbdbd',
  },
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 8,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 8,
    color: '#888',
  },
});

const PdfDocument = ({ analysis }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View>
        <View style={styles.brandingHeader}>
          <Image style={styles.headerLogo} src={logoUrl} />
          <View style={styles.brandTitleContainer}>
            <Text style={styles.headerBrandText}>GRWM</Text>
            <Text style={styles.headerBrandSubtitle}>Get Results With Metrics</Text>
          </View>
        </View>
        <View style={styles.reportTitleSection}>
          <Text style={styles.title}>Skincare Analysis Report</Text>
          <Text style={styles.subtitle}>Prepared for: {analysis?.routine?.name || 'User'}</Text>
          <Text style={styles.subtitle}>Date: {new Date().toLocaleDateString()}</Text>
        </View>
      </View>

      {/* Overall Score */}
      <View style={styles.section} wrap={false}>
        <Text style={styles.sectionTitle}>Overall Score</Text>
        <View style={[styles.card, styles.overallScoreContainer]}>
          <View style={styles.scoreColumn}>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreText}>{analysis?.overallScore?.score || 'N/A'}</Text>
            </View>
            <Text style={styles.scoreRating}>{analysis?.overallScore?.rating || ''}</Text>
          </View>
          <View style={styles.insightsContainer}>
            <Text style={styles.insightTitle}>Key Improvement Area:</Text>
            <Text style={styles.keyImprovementText}>{analysis?.overallScore?.improvement || 'N/A'}</Text>
            <Text style={[styles.insightTitle, { marginTop: 8 }]}>Summary Insights:</Text>
            {analysis?.overallScore?.insights?.map((item, i) => (
              <View key={i} style={styles.bulletPointItem}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.bulletPointText}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Key Metrics */}
      <View style={styles.section} wrap={false}>
        <Text style={styles.sectionTitle}>Key Metrics</Text>
        <View style={styles.metricsContainer}>
          {analysis?.metrics && Object.entries(analysis.metrics).map(([name, metric], i) => (
            <View key={i} style={styles.metricCard}>
              <Text style={styles.metricTitle}>{name.replace(/([A-Z])/g, ' $1').trim()}</Text>
              <Text style={styles.metricScore}>{metric.score}</Text>
              <Text style={styles.metricRating}>{metric.rating}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Routine Breakdown */}
      <View style={styles.section} wrap={false}>
        <Text style={styles.sectionTitle}>Routine Breakdown</Text>
        <View style={styles.card}>
          <Text style={styles.routineTitle}>Morning Routine (Score: {analysis?.morningRoutine?.score})</Text>
          <Text style={styles.routineAnalysisText}>{analysis?.morningRoutine?.analysis}</Text>
          <Text style={styles.routineInsightsTitle}>Actionable Insights:</Text>
          {analysis?.morningRoutine?.insights?.map((item, i) => (
            <View key={i} style={styles.bulletPointItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletPointText}>{item.text}</Text>
            </View>
          ))}
        </View>
        <View style={styles.card}>
          <Text style={styles.routineTitle}>Evening Routine (Score: {analysis?.eveningRoutine?.score})</Text>
          <Text style={styles.routineAnalysisText}>{analysis?.eveningRoutine?.analysis}</Text>
          <Text style={styles.routineInsightsTitle}>Actionable Insights:</Text>
          {analysis?.eveningRoutine?.insights?.map((item, i) => (
            <View key={i} style={styles.bulletPointItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletPointText}>{item.text}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Ingredient Deep Dive */}
      <View style={styles.section} break>
        <Text style={styles.sectionTitle}>Ingredient Deep Dive</Text>
        {analysis?.detailedIngredientAnalysis?.map((ing, i) => (
          <View key={i} style={styles.ingredientSection} wrap={false}>
            <Text style={styles.ingredientName}>{ing.name}</Text>
            <Text style={styles.ingredientDetailText}>Purpose: {ing.purpose}</Text>
            <Text style={styles.ingredientDetailText}>Strength: {ing.strength}</Text>
            <Text style={styles.ingredientDetailText}>Found In: {ing.products.join(', ')}</Text>
            {ing.warnings?.length > 0 && <Text style={styles.ingredientWarningText}>Warnings: {ing.warnings.join(', ')}</Text>}
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
            © {new Date().getFullYear()} GRWM · Built for evidence-based skincare. This is not medical advice.
        </Text>
      </View>
    </Page>
  </Document>
);

export default PdfDocument;
