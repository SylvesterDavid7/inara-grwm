import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import ProductRecommendations from './pages/product-recommendations';
import IngredientEducationHub from './pages/ingredient-education-hub';
import SkincareRoutineInput from './pages/skincare-routine-input';
import ProgressTrackingDashboard from './pages/progress-tracking-dashboard';
import SkinAssessmentQuestionnaire from './pages/skin-assessment-questionnaire';
import SkincareScoreCardResults from './pages/skincare-scorecard-results';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<IngredientEducationHub />} />
        <Route path="/product-recommendations" element={<ProductRecommendations />} />
        <Route path="/ingredient-education-hub" element={<IngredientEducationHub />} />
        <Route path="/skincare-routine-input" element={<SkincareRoutineInput />} />
        <Route path="/progress-tracking-dashboard" element={<ProgressTrackingDashboard />} />
        <Route path="/skin-assessment-questionnaire" element={<SkinAssessmentQuestionnaire />} />
        <Route path="/skincare-scorecard-results" element={<SkincareScoreCardResults />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
