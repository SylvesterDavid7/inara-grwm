import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import ComparisonView from './components/ComparisonView';
import Icon from '../../components/AppIcon';
import { useAuthState } from 'react-firebase-hooks/auth';

const CompareRoutines = () => {
  const location = useLocation();
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [previousAnalysis, setPreviousAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (location.state && location.state.analysis) {
      setCurrentAnalysis(location.state.analysis);
    } else {
      setError("No current routine analysis available to compare.");
      setLoading(false);
      return;
    }

    const fetchPreviousAnalysis = async () => {
      if (!user) {
        setError("You must be logged in to compare routines.");
        setLoading(false);
        return;
      }

      try {
        const analysesRef = collection(db, 'users', user.uid, 'analyses');
        // Query for the last 2 analyses to compare the current one with the one before it.
        const q = query(analysesRef, orderBy('createdAt', 'desc'), limit(2));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.docs.length > 1) {
          // The most recent is docs[0], the one before is docs[1]
          const previousDoc = querySnapshot.docs[1];
          setPreviousAnalysis(previousDoc.data());
        } else {
          // Not enough analyses to compare
          setPreviousAnalysis(null);
        }
      } catch (err) {
        console.error("Error fetching previous analysis:", err);
        setError("Could not load the previous routine analysis.");
      } finally {
        setLoading(false);
      }
    };

    fetchPreviousAnalysis();
  }, [location.state, user]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-background text-foreground">Loading comparison...</div>;
  }

  if (error) {
    return <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground text-center">
      <p>{error}</p>
      <Link to="/skincare-routine-input" className="mt-4 text-primary hover:underline">Analyze a new routine</Link>
    </div>;
  }
  
  if (!previousAnalysis) {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground text-center">
            <div className="max-w-md p-8 bg-card border border-border rounded-lg shadow-lg">
                <Icon name="GitCompare" size={48} className="mx-auto text-primary mb-4" />
                <h2 className="text-2xl font-heading font-heading-bold text-foreground mb-2">Not Enough Routines to Compare</h2>
                <p className="text-muted-foreground">
                    This feature requires at least two saved routine analyses. Once you have more than one, you'll be able to see a side-by-side comparison here.
                </p>
                <Link to="/skincare-routine-input" className="mt-6 inline-block px-6 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
                    Analyze a New Routine
                </Link>
            </div>
        </div>
    );
  }
  
  // Restructure the previous analysis to match the structure of the current analysis from route state
  const formattedPreviousAnalysis = { 
    ...previousAnalysis.analysis, 
    routine: previousAnalysis.routine 
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-heading font-heading-bold">Routine Comparison</h1>
                <p className="text-muted-foreground">A side-by-side look at your two most recent skincare routine analyses.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
                <ComparisonView analysis={formattedPreviousAnalysis} title="Previous Routine" />
                <ComparisonView analysis={currentAnalysis} title="Current Routine" />
            </div>
        </div>
    </div>
  );
};

export default CompareRoutines;