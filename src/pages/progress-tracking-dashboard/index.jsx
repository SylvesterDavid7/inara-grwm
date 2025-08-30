import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';

import Select from '../../components/ui/Select';
import Header from '../../components/ui/Header';
import QuickAccessToolbar from '../../components/ui/QuickAccessToolbar';
import SectionContextMenu from '../../components/ui/SectionContextMenu';
import ProgressMetricsCard from './components/ProgressMetricsCard';
import ProgressChart from './components/ProgressChart';
import PhotoComparison from './components/PhotoComparison';
import RoutineAdherenceCalendar from './components/RoutineAdherenceCalendar';
import GoalProgressWidget from './components/GoalProgressWidget';
import SmartInsights from './components/SmartInsights';
import QuickActions from './components/QuickActions';

const ProgressTrackingDashboard = () => {
  const [dateRange, setDateRange] = useState('30days');
  const [viewMode, setViewMode] = useState('overview');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Mock data for progress metrics
  const progressMetrics = [
    {
      title: 'Overall Routine Score',
      value: '8.4/10',
      change: '+0.6',
      changeType: 'positive',
      icon: 'TrendingUp',
      description: 'Your routine effectiveness has improved significantly'
    },
    {
      title: 'Routine Consistency',
      value: '87%',
      change: '+12%',
      changeType: 'positive',
      icon: 'Calendar',
      description: 'Great improvement in daily routine adherence'
    },
    {
      title: 'Skin Improvement',
      value: '76%',
      change: '+8%',
      changeType: 'positive',
      icon: 'Sparkles',
      description: 'Visible improvements in skin texture and clarity'
    },
    {
      title: 'Product Effectiveness',
      value: '9.1/10',
      change: '+0.3',
      changeType: 'positive',
      icon: 'Star',
      description: 'Current products are working well for your skin'
    }
  ];

  // Mock data for progress charts
  const routineScoreData = [
    { date: 'Jan 1', value: 7.2 },
    { date: 'Jan 8', value: 7.5 },
    { date: 'Jan 15', value: 7.8 },
    { date: 'Jan 22', value: 8.1 },
    { date: 'Jan 29', value: 8.4 },
    { date: 'Feb 5', value: 8.2 },
    { date: 'Feb 12', value: 8.6 },
    { date: 'Feb 19', value: 8.4 },
    { date: 'Feb 26', value: 8.7 },
    { date: 'Mar 5', value: 8.9 }
  ];

  const skinConcernData = [
    { date: 'Jan 1', value: 65 },
    { date: 'Jan 8', value: 62 },
    { date: 'Jan 15', value: 58 },
    { date: 'Jan 22', value: 55 },
    { date: 'Jan 29', value: 52 },
    { date: 'Feb 5', value: 48 },
    { date: 'Feb 12', value: 45 },
    { date: 'Feb 19', value: 42 },
    { date: 'Feb 26', value: 38 },
    { date: 'Mar 5', value: 35 }
  ];

  // Mock adherence data
  const adherenceData = {
    '2025-01-01': { completion: 95, morning: true, evening: true, productsUsed: 6, totalProducts: 6 },
    '2025-01-02': { completion: 80, morning: true, evening: false, productsUsed: 4, totalProducts: 6 },
    '2025-01-03': { completion: 100, morning: true, evening: true, productsUsed: 6, totalProducts: 6 },
    '2025-01-04': { completion: 75, morning: false, evening: true, productsUsed: 4, totalProducts: 6 },
    '2025-01-05': { completion: 90, morning: true, evening: true, productsUsed: 5, totalProducts: 6 },
    '2025-01-06': { completion: 85, morning: true, evening: true, productsUsed: 5, totalProducts: 6 },
    '2025-01-07': { completion: 100, morning: true, evening: true, productsUsed: 6, totalProducts: 6 },
    '2025-01-08': { completion: 70, morning: true, evening: false, productsUsed: 4, totalProducts: 6 },
    '2025-01-09': { completion: 95, morning: true, evening: true, productsUsed: 6, totalProducts: 6 },
    '2025-01-10': { completion: 80, morning: false, evening: true, productsUsed: 4, totalProducts: 6 }
  };

  // Mock goals data
  const goalsData = [
    {
      id: 1,
      title: 'Reduce Acne Breakouts',
      target: '90% reduction',
      current: '65% reduction',
      remaining: '25% to go',
      progress: 72,
      status: 'on-track',
      deadline: 'Mar 30, 2025',
      milestones: [
        { title: 'First improvement noticed', date: 'Jan 15' },
        { title: 'Significant reduction achieved', date: 'Feb 20' }
      ]
    },
    {
      id: 2,
      title: 'Improve Skin Hydration',
      target: 'Optimal hydration levels',
      current: '85% improved',
      remaining: '15% to go',
      progress: 85,
      status: 'on-track',
      deadline: 'Feb 28, 2025',
      milestones: [
        { title: 'Baseline hydration measured', date: 'Jan 1' },
        { title: 'Noticeable improvement', date: 'Jan 20' }
      ]
    },
    {
      id: 3,
      title: 'Establish Consistent Routine',
      target: '95% adherence',
      current: '87% adherence',
      remaining: '8% to go',
      progress: 92,
      status: 'completed',
      deadline: 'Jan 31, 2025',
      milestones: [
        { title: 'Daily routine established', date: 'Jan 5' },
        { title: 'Target consistency achieved', date: 'Jan 25' }
      ]
    }
  ];

  // Mock insights data
  const insightsData = [
    {
      id: 1,
      type: 'improvement',
      title: 'Significant Skin Texture Improvement',
      description: `Your skin texture has improved by 35% over the past month. The combination of retinol and hyaluronic acid in your evening routine is showing excellent results.`,
      date: '2 days ago',
      priority: 'high',
      metrics: [
        { label: 'Texture Score', value: '8.7/10' },
        { label: 'Improvement', value: '+35%' }
      ],
      actions: [
        'Continue current evening routine',
        'Consider adding vitamin C serum',
        'Schedule progress photo next week'
      ],
      actionButtons: [
        { label: 'View Details', variant: 'outline', icon: 'Eye', action: () => console.log('View details') },
        { label: 'Share Progress', variant: 'outline', icon: 'Share2', action: () => console.log('Share') }
      ]
    },
    {
      id: 2,
      type: 'recommendation',
      title: 'Optimize Morning Routine Timing',
      description: `Analysis shows your skin responds better when you apply sunscreen 15 minutes after moisturizer. Consider adjusting your morning routine timing.`,
      date: '1 week ago',
      priority: 'medium',
      actions: [
        'Wait 15 minutes between moisturizer and sunscreen',
        'Set a timer reminder',
        'Track effectiveness over next 2 weeks'
      ],
      actionButtons: [
        { label: 'Set Reminder', variant: 'default', icon: 'Bell', action: () => console.log('Set reminder') }
      ]
    },
    {
      id: 3,
      type: 'achievement',
      title: 'Consistency Milestone Reached',
      description: `Congratulations! You've maintained 90%+ routine adherence for 4 consecutive weeks. This consistency is key to achieving your skincare goals.`,
      date: '3 days ago',priority: 'low',
      metrics: [
        { label: 'Streak', value: '28 days' },
        { label: 'Adherence', value: '94%' }
      ],
      actionButtons: [
        { label: 'Celebrate', variant: 'default', icon: 'Award', action: () => console.log('Celebrate') }
      ]
    }
  ];

  const dateRangeOptions = [
    { value: '7days', label: 'Last 7 days' },
    { value: '30days', label: 'Last 30 days' },
    { value: '90days', label: 'Last 3 months' },
    { value: '6months', label: 'Last 6 months' },
    { value: '1year', label: 'Last year' }
  ];

  const viewModeOptions = [
    { value: 'overview', label: 'Overview' },
    { value: 'detailed', label: 'Detailed View' },
    { value: 'comparison', label: 'Comparison' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <QuickAccessToolbar />
      <main className="pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="font-heading font-heading-bold text-3xl text-foreground mb-2">
                Progress Dashboard
              </h1>
              <p className="font-body font-body-normal text-muted-foreground">
                Track your skincare journey and monitor routine effectiveness over time
              </p>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Select
                options={dateRangeOptions}
                value={dateRange}
                onChange={setDateRange}
                className="w-40"
              />
              <Select
                options={viewModeOptions}
                value={viewMode}
                onChange={setViewMode}
                className="w-40"
              />
              <SectionContextMenu />
            </div>
          </div>

          {/* Progress Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {progressMetrics?.map((metric, index) => (
              <ProgressMetricsCard
                key={index}
                title={metric?.title}
                value={metric?.value}
                change={metric?.change}
                changeType={metric?.changeType}
                icon={metric?.icon}
                description={metric?.description}
              />
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ProgressChart
              data={routineScoreData}
              title="Routine Score Trend"
              type="line"
              color="#2D5A87"
            />
            <ProgressChart
              data={skinConcernData}
              title="Skin Concern Improvement"
              type="area"
              color="#7BA098"
            />
          </div>

          {/* Photo Comparison and Calendar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <PhotoComparison
                beforePhoto="https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=400&h=300&fit=crop"
                afterPhoto="https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=400&h=300&fit=crop&brightness=1.1&contrast=1.1"
                date="March 5, 2025"
                notes="Significant improvement in skin texture and reduced redness. The new retinol serum is showing excellent results after 8 weeks of consistent use."
              />
            </div>
            <div>
              <RoutineAdherenceCalendar
                adherenceData={adherenceData}
                currentMonth={currentMonth}
                onMonthChange={setCurrentMonth}
              />
            </div>
          </div>

          {/* Goals and Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <GoalProgressWidget goals={goalsData} />
            <SmartInsights insights={insightsData} />
          </div>

          {/* Quick Actions */}
          <QuickActions />

          {/* Navigation Links */}
          <div className="mt-12 pt-8 border-t border-border">
            <h3 className="font-heading font-heading-semibold text-lg text-foreground mb-6">
              Continue Your Skincare Journey
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                to="/skincare-routine-input"
                className="group flex items-center space-x-4 p-4 bg-card border border-border rounded-clinical hover:border-primary/20 hover:shadow-clinical transition-clinical"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-clinical group-hover:bg-primary/20 transition-clinical">
                  <Icon name="Plus" size={20} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-body font-body-medium text-sm text-card-foreground group-hover:text-primary transition-clinical">
                    Update Routine
                  </h4>
                  <p className="font-caption font-caption-normal text-xs text-muted-foreground">
                    Add or modify your skincare products
                  </p>
                </div>
              </Link>

              <Link
                to="/skin-assessment-questionnaire"
                className="group flex items-center space-x-4 p-4 bg-card border border-border rounded-clinical hover:border-primary/20 hover:shadow-clinical transition-clinical"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-clinical group-hover:bg-accent/20 transition-clinical">
                  <Icon name="ClipboardList" size={20} className="text-accent" />
                </div>
                <div>
                  <h4 className="font-body font-body-medium text-sm text-card-foreground group-hover:text-primary transition-clinical">
                    Reassess Skin
                  </h4>
                  <p className="font-caption font-caption-normal text-xs text-muted-foreground">
                    Update your skin type and concerns
                  </p>
                </div>
              </Link>

              <Link
                to="/ingredient-education-hub"
                className="group flex items-center space-x-4 p-4 bg-card border border-border rounded-clinical hover:border-primary/20 hover:shadow-clinical transition-clinical"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-success/10 rounded-clinical group-hover:bg-success/20 transition-clinical">
                  <Icon name="BookOpen" size={20} className="text-success" />
                </div>
                <div>
                  <h4 className="font-body font-body-medium text-sm text-card-foreground group-hover:text-primary transition-clinical">
                    Learn More
                  </h4>
                  <p className="font-caption font-caption-normal text-xs text-muted-foreground">
                    Explore ingredient education
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProgressTrackingDashboard;