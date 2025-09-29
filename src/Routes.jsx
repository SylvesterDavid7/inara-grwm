import React from 'react';
import { BrowserRouter, Routes as RouterRoutes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import ProductRecommendations from './pages/product-recommendations';
import IngredientEducationHub from './pages/ingredient-education-hub';
import SkincareRoutineInput from './pages/skincare-routine-input';
import ProgressTrackingDashboard from './pages/progress-tracking-dashboard';
import SkinAssessmentQuestionnaire from './pages/skin-assessment-questionnaire';
import SkincareScoreCardResults from './pages/skincare-scorecard-results';
import AssessmentResults from './pages/assessment-results';
import SplashScreen from './pages/SplashScreen';
import HomePage from './pages/HomePage';
import OptimizeRoutine from './pages/optimize-routine';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import UserDashboard from './pages/UserDashboard';
import Gate from './pages/Gate';
import GetCode from './pages/GetCode';
import UserInfo from './pages/UserInfo';
import ChangePassword from './pages/ChangePassword';
import Skincare101 from './pages/skincare-101';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/AdminRoute';
import AdminUsers from './pages/AdminUsers'; // Import the new page
import AdminAnalytics from './pages/AdminAnalytics'; // Import the new page
import AdminSettings from './pages/AdminSettings'; // Import the new page
import AccessRestricted from './pages/AccessRestricted';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/gate" element={<Gate />} />
          <Route path="/get-code" element={<GetCode />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/access-restricted" element={<AccessRestricted />} />

          
          {/* Main App Layout */}
          <Route element={<Layout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/product-recommendations" element={<ProductRecommendations />} />
            <Route path="/ingredient-education-hub" element={<IngredientEducationHub />} />
            <Route path="/skincare-101" element={<Skincare101 />} />
            <Route path="/skincare-routine-input" element={<SkincareRoutineInput />} />
            <Route path="/progress-tracking-dashboard" element={<ProgressTrackingDashboard />} />
            <Route path="/skin-assessment-questionnaire" element={<SkinAssessmentQuestionnaire />} />
            <Route path="/skincare-scorecard-results" element={<SkincareScoreCardResults />} />
            <Route path="/assessment-results" element={<AssessmentResults />} />
            <Route path="/optimize-routine" element={<OptimizeRoutine />} />
            <Route element={<PrivateRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/user-info" element={<UserInfo />} />
              <Route path="/change-password" element={<ChangePassword />} />
            </Route>
          </Route>

          {/* Admin Section */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
