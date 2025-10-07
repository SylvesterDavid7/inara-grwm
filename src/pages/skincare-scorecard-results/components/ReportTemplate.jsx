import React from 'react';
import ReportHeader from './ReportHeader';
import ReportFooter from './ReportFooter';
import MetricsDashboard from './MetricsDashboard';
import RoutineScoreSection from './RoutineScoreSection';

const ReportTemplate = ({ analysis }) => {
    const { metrics, morningRoutine, eveningRoutine, weeklyRoutine, overallScore } = analysis;

    const styles = {
        page: {
            width: '794px',
            padding: '40px',
            backgroundColor: 'white',
            color: 'black',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '1123px',
        },
        content: {
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
        },
        main: {
            flexGrow: 1,
        },
        routinesContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            gap: '16px',
        },
        routineWrapper: {
            flex: 1,
            minWidth: 0,
        },
    };

    return (
        <div style={styles.page}>
            <ReportHeader overallScore={overallScore} />
            <div style={styles.content}>
                <main style={styles.main}>
                    {metrics && (
                        <div style={{ marginBottom: '24px' }}>
                           <MetricsDashboard metrics={metrics} isPdfMode={true} />
                        </div>
                    )}

                    <div style={styles.routinesContainer}>
                        {morningRoutine && (
                            <div style={styles.routineWrapper}>
                                <RoutineScoreSection
                                    title="Morning Routine Analysis"
                                    score={morningRoutine.score}
                                    products={morningRoutine.products}
                                    insights={morningRoutine.insights}
                                    timeOfDay="morning"
                                    isPdfMode={true}
                                />
                            </div>
                        )}

                        {eveningRoutine && (
                            <div style={styles.routineWrapper}>
                                <RoutineScoreSection
                                    title="Evening Routine Analysis"
                                    score={eveningRoutine.score}
                                    products={eveningRoutine.products}
                                    insights={eveningRoutine.insights}
                                    timeOfDay="evening"
                                    isPdfMode={true}
                                />
                            </div>
                        )}
                    </div>

                    {weeklyRoutine && (
                        <div style={{ marginTop: '24px' }}>
                            <RoutineScoreSection
                                title="Weekly Routine Analysis"
                                score={weeklyRoutine.score}
                                products={weeklyRoutine.products}
                                insights={weeklyRoutine.insights}
                                timeOfDay="weekly"
                                isPdfMode={true}
                            />
                        </div>
                    )}
                </main>
            </div>
            <ReportFooter />
        </div>
    );
};

export default ReportTemplate;
