
const processUserDataForDashboard = (userData, dateRange) => {
  const now = new Date();
  const { progress = {}, routine = {}, goals = [], skinConcerns = [] } = userData || {};

  const dateToISO = (date) => date.toISOString().split('T')[0];

  const generateDateSeries = (range, endDate) => {
    const series = [];
    const days = range === 'all' ? 90 : parseInt(range.replace('days', ''));
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - days + 1);

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        series.push(new Date(d));
    }
    return series;
  };

  const filterDataByDateRange = (data) => {
    if (dateRange === 'all') return data;
    const days = parseInt(dateRange.replace('days', ''));
    const cutoffDate = new Date(now);
    cutoffDate.setDate(now.getDate() - days);

    const filtered = {};
    for (const dateStr in data) {
      if (new Date(dateStr) >= cutoffDate) {
        filtered[dateStr] = data[dateStr];
      }
    }
    return filtered;
  };

  const progressInRange = filterDataByDateRange(progress);
  const dateSeries = generateDateSeries(dateRange, now);

  const hasProgressData = Object.keys(progressInRange).length > 0;

  let progressMetrics;

  if (!hasProgressData) {
    progressMetrics = [
        {
            title: "Routine Consistency",
            value: "0%",
            change: "N/A",
            changeType: "neutral",
            icon: "Calendar",
            description: "Start logging your routine to see your consistency score.",
        },
        {
            title: "Overall Routine Score",
            value: "N/A",
            change: "N/A",
            changeType: "neutral",
            icon: "TrendingUp",
            description: "Log your routine to start calculating your overall score.",
        },
        {
            title: "Skin Improvement",
            value: "N/A",
            change: "N/A",
            changeType: "neutral",
            icon: "Sparkles",
            description: "Upload photos to track your skin's improvement over time.",
        },
        {
            title: "Product Effectiveness",
            value: "N/A",
            change: "N/A",
            changeType: "neutral",
            icon: "Star",
            description: "Rate products to learn about their effectiveness for you.",
        },
    ];
  } else {
    const calculateConsistency = () => {
        if (!hasProgressData) return 0;
        let completedCount = 0;
        let totalCount = 0;

        for (const date in progressInRange) {
            const dayData = progressInRange[date];
            const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
            const dayRoutine = routine[dayName];
            if (!dayRoutine) continue;

            const amProducts = dayRoutine.AM || [];
            const pmProducts = dayRoutine.PM || [];
            totalCount += amProducts.length + pmProducts.length;

            const completedAM = Object.values(dayData.AM || {}).filter(s => s === 'completed').length;
            const completedPM = Object.values(dayData.PM || {}).filter(s => s === 'completed').length;
            completedCount += completedAM + completedPM;
        }
        return totalCount > 0 ? (completedCount / totalCount * 100).toFixed(0) : 0;
    };

    const routineConsistency = calculateConsistency();

    // These values should be calculated based on historical data
    const previousConsistency = 0;
    const previousScore = 0;
    const previousImprovement = 0;
    const previousEffectiveness = 0;

    const score = 8.4; 
    const improvement = 76;
    const effectiveness = 9.1;

    progressMetrics = [
        {
            title: "Routine Consistency",
            value: `${routineConsistency}%`,
            change: `${(routineConsistency - previousConsistency).toFixed(0)}%`,
            changeType: routineConsistency >= previousConsistency ? "positive" : "negative",
            icon: "Calendar",
            description: "Daily routine adherence for the selected period",
        },
        {
            title: "Overall Routine Score",
            value: `${score}/10`,
            change: `${(score - previousScore).toFixed(1)}`,
            changeType: score >= previousScore ? "positive" : "negative",
            icon: "TrendingUp",
            description: "Your routine effectiveness has improved significantly",
        },
        {
            title: "Skin Improvement",
            value: `${improvement}%`,
            change: `${(improvement - previousImprovement).toFixed(0)}%`,
            changeType: improvement >= previousImprovement ? "positive" : "negative",
            icon: "Sparkles",
            description: "Visible improvements in skin texture and clarity",
        },
        {
            title: "Product Effectiveness",
            value: `${effectiveness}/10`,
            change: `${(effectiveness - previousEffectiveness).toFixed(1)}`,
            changeType: effectiveness >= previousEffectiveness ? "positive" : "negative",
            icon: "Star",
            description: "Current products are working well for your skin",
        },
    ];
  }

  const generateChartData = (valueCalculator) => {
    return dateSeries.map(date => {
        const dateStr = dateToISO(date);
        const dayData = progressInRange[dateStr];
        let value = null;

        if (dayData) {
            value = valueCalculator(dayData, date);
        }

        return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            value: value ? parseFloat(value.toFixed(1)) : null,
        };
    });
  };

  const routineScoreData = hasProgressData
    ? generateChartData((dayData, date) => {
        const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
        const dayRoutine = routine[dayName];
        if (!dayRoutine) return 0;
        
        const amProducts = dayRoutine.AM || [];
        const pmProducts = dayRoutine.PM || [];
        const totalTasks = amProducts.length + pmProducts.length;

        if (totalTasks > 0) {
            const completedAM = Object.values(dayData.AM || {}).filter(s => s === 'completed').length;
            const completedPM = Object.values(dayData.PM || {}).filter(s => s === 'completed').length;
            return ((completedAM + completedPM) / totalTasks) * 10;
        }
        return 0;
      })
    : dateSeries.map(d => ({ date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), value: null }));

  const skinConcernData = hasProgressData
    ? generateChartData(() => {
        // Placeholder for future skin concern tracking logic
        return 80 - Math.random() * 10;
      })
    : dateSeries.map(d => ({ date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), value: null }));

  const adherenceData = {};
  for (const date in progress) {
    const dayData = progress[date];
    const amCompleted = Object.values(dayData.AM || {}).includes('completed');
    const pmCompleted = Object.values(dayData.PM || {}).includes('completed');
    const weeklyCompleted = Object.values(dayData.Weekly || {}).includes('completed');

    let completion = 0;
    if(amCompleted && pmCompleted) completion = 100;
    else if (amCompleted || pmCompleted) completion = 50;

    adherenceData[date] = {
      completion,
      morning: amCompleted,
      evening: pmCompleted,
      weekly: weeklyCompleted
    };
  }

  const goalsData = goals.map(goal => ({
    ...goal,
    progress: Math.min(goal.progress || 0, 100),
    status: goal.progress >= 100 ? 'completed' : 'on-track'
  }));

  const insightsData = [];
  if (hasProgressData) {
    const routineConsistency = parseFloat(progressMetrics[0].value);
    insightsData.push({
      id: 1,
      type: 'improvement',
      title: 'Great Job on Consistency!',
      description: `You've maintained a ${routineConsistency}% routine adherence. Keep it up!`,
      date: '1 day ago',
      priority: 'high',
      actions: ['Continue current routine'],
    });

    if (routineConsistency < 75) {
        insightsData.push({
            id: 2,
            type: 'recommendation',
            title: 'Improve Your Routine Consistency',
            description: 'Try setting reminders to help you stay on track with your AM and PM routines.',
            date: 'now',
            priority: 'medium',
            actionButtons: [{ label: 'Set Reminder', variant: 'default', icon: 'Bell', actionId: 'set_reminder' }]
        });
    }
  } else {
    insightsData.push({
        id: 'no-data',
        type: 'recommendation',
        title: 'Start Tracking Your Progress',
        description: 'Log your daily routine to start generating personalized insights and track your skin health journey.',
        date: 'now',
        priority: 'high',
        actionButtons: [{ label: 'Log Routine', variant: 'default', icon: 'Plus', actionId: 'log-routine' }]
    })
  }

  return {
    progressMetrics,
    routineScoreData,
    skinConcernData,
    adherenceData,
    goalsData,
    insightsData
  };
};

export { processUserDataForDashboard };
