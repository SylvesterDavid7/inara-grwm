import React from 'react';
import { BrowserRouter, Routes as RouterRoutes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';
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
import GateRoute from './components/GateRoute';
import GetCode from './pages/GetCode';
import UserInfo from './pages/UserInfo';
import ChangePassword from './pages/ChangePassword';

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
          <Route element={<GateRoute />}>
            <Route element={<Layout />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/product-recommendations" element={<ProductRecommendations />} />
              <Route path="/ingredient-education-hub" element={<IngredientEducationHub />} />
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
          </Route>
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
