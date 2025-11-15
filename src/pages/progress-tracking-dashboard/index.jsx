import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Select from '../../components/ui/Select';
import SectionContextMenu from '../../components/ui/SectionContextMenu';
import ProgressMetricsCard from './components/ProgressMetricsCard';
import ProgressChart from './components/ProgressChart';
import PhotoComparison from './components/PhotoComparison';
import RoutineAdherenceCalendar from './components/RoutineAdherenceCalendar';
import GoalProgressWidget from './components/GoalProgressWidget';
import SmartInsights from './components/SmartInsights';
import QuickActions from './components/QuickActions';
import { useAwardPoints } from '../../hooks/useAwardPoints';
import { useUserDataContext } from '../../contexts/UserDataContext.jsx';
import { processUserDataForDashboard } from '../../utils/progressUtils';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '../../config';

const ProgressTrackingDashboard = () => {
  const { userData, loading, updateUserData } = useUserDataContext();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('30days');
  const [viewMode, setViewMode] = useState('overview');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { awardPoints } = useAwardPoints();
  const photoComparisonRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const defaultPhotos = {
    before: '/Normal Skin.webp',
    after: '/Sensitive Skin.webp',
  };

  const [photos, setPhotos] = useState(defaultPhotos);

  useEffect(() => {
    if (userData?.photos) {
      setPhotos(userData.photos);
    }
  }, [userData]);

  const dashboardData = useMemo(() => {
    if (!userData) {
      return {
        progressMetrics: [],
        routineScoreData: [],
        skinConcernData: [],
        adherenceData: {},
        goalsData: [],
        insightsData: []
      };
    }
    return processUserDataForDashboard(userData, dateRange);
  }, [userData, dateRange]);

  const {
    progressMetrics,
    routineScoreData,
    skinConcernData,
    adherenceData,
    goalsData,
    insightsData
  } = dashboardData;

  const handlePhotoUpload = async (file) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'progress-photos');

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      if (!response.ok) throw new Error('Cloudinary image upload failed');
      const cloudinaryData = await response.json();
      const downloadURL = cloudinaryData.secure_url;

      const updatedPhotos = {
        before: photos.after,
        after: downloadURL,
      };

      setPhotos(updatedPhotos);
      await updateUserData({ photos: updatedPhotos });
      awardPoints('photo_uploaded');
    } catch (error) {
      console.error("Error uploading photo: ", error);
      alert("Failed to upload photo. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handlePhotoRemove = async (photoType) => {
    const updatedPhotos = {
      ...photos,
      [photoType]: defaultPhotos[photoType],
    };
    setPhotos(updatedPhotos);
    await updateUserData({ photos: updatedPhotos });
  };

  const handleInsightAction = useCallback((actionId, insightId) => {
    switch (actionId) {
      case 'set_reminder':
        alert('Reminder functionality to be implemented!');
        break;
      case 'celebrate_achievement':
        awardPoints('milestone_achieved');
        alert('Achievement celebrated! You earned points!');
        break;
      case 'view_details':
        navigate(`/insights/${insightId}`);
        break;
      default:
        console.warn(`Unknown insight action: ${actionId}`);
    }
  }, [awardPoints, navigate]);

  const refreshInsights = useCallback(() => {
    alert('Insights refreshed!');
  }, []);

  const handleQuickAction = useCallback((actionId) => {
    switch (actionId) {
      case 'log-routine':
        navigate('/dashboard');
        break;
      case 'upload-photo':
        photoComparisonRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'update-assessment':
        navigate('/skin-assessment-questionnaire');
        break;
      case 'schedule-review':
        alert('Scheduling functionality to be implemented');
        break;
      case 'get-support':
        navigate('/support');
        break;
      default:
        console.warn(`Unknown quick action: ${actionId}`);
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p className="font-heading text-lg text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  const dateRangeOptions = [
    { value: '7days', label: 'Last 7 days' },
    { value: '30days', label: 'Last 30 days' },
    { value: '90days', label: 'Last 3 months' },
    { value: 'all', label: 'All Time' }
  ];

  const viewModeOptions = [
    { value: 'overview', label: 'Overview' },
    { value: 'detailed', label: 'Detailed View' },
    { value: 'comparison', label: 'Comparison' }
  ];
  
  return (
    <div className="min-h-screen bg-background">
      <main className="py-6 sm:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 sm:mb-8">
            <div className="mb-4 md:mb-0">
              <h1 className="font-heading font-heading-bold text-2xl sm:text-3xl text-foreground mb-2">
                Progress Dashboard
              </h1>
              <p className="font-body font-body-normal text-base sm:text-lg text-muted-foreground">
                Track your skincare journey and monitor routine effectiveness over time
              </p>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Select
                options={dateRangeOptions}
                value={dateRange}
                onChange={setDateRange}
                className="w-32 sm:w-40"
              />
              <Select
                options={viewModeOptions}
                value={viewMode}
                onChange={setViewMode}
                className="w-32 sm:w-40"
              />
              <SectionContextMenu />
            </div>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {/* Progress Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProgressChart
                data={routineScoreData}
                title="Routine Score Trend"
                type="line"
                color="#2D5A87"
                yDomain={[0, 10]} // Set y-axis domain for score
              />
              <ProgressChart
                data={skinConcernData}
                title="Skin Concern Improvement"
                type="area"
                color="#7BA098"
                yDomain={[0, 100]} // Set y-axis domain for percentage
              />
            </div>

            {/* Photo Comparison and Calendar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" ref={photoComparisonRef}>
              <div className="lg:col-span-2">
                <PhotoComparison
                  beforePhoto={photos.before}
                  afterPhoto={photos.after}
                  date={new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  notes="Compare your progress over time. New photos are compared with your last upload."
                  onPhotoUpload={handlePhotoUpload}
                  onPhotoRemove={handlePhotoRemove}
                  isUploading={isUploading}
                  defaultPhotos={defaultPhotos}
                />
              </div>
              <div>
                <RoutineAdherenceCalendar
                  adherenceData={adherenceData}
                  currentMonth={currentMonth}
                  onMonthChange={setCurrentMonth}
                  onDayTrack={() => awardPoints('routine_tracked')}
                />
              </div>
            </div>

            {/* Goals and Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GoalProgressWidget goals={goalsData} />
              <SmartInsights insights={insightsData} onAction={handleInsightAction} onRefresh={refreshInsights} />
            </div>

            {/* Quick Actions */}
            <QuickActions onAction={handleQuickAction} />

            {/* Navigation Links */}
            <div className="pt-8 sm:pt-12 border-t border-border">
              <h3 className="font-heading font-heading-semibold text-lg sm:text-xl text-foreground mb-4 sm:mb-6">
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
        </div>
      </main>
    </div>
  );
};

export default ProgressTrackingDashboard;
