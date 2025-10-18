import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getAnalytics, logEvent } from "firebase/analytics";

const usePageTracking = () => {
  const location = useLocation();
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    setAnalytics(getAnalytics());
  }, []);

  useEffect(() => {
    if (analytics) {
      logEvent(analytics, 'page_view', {
        page_path: location.pathname + location.search,
        page_location: window.location.href,
        page_title: document.title,
      });
    }
  }, [analytics, location]);
};

export default usePageTracking;
