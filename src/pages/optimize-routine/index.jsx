import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getOptimizedRoutine } from '../../utils/gemini';
import Icon from '../../components/AppIcon';

const OptimizeRoutine = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [optimization, setOptimization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let analysisData = location.state?.analysis;

    if (!analysisData) {
      const savedAnalysis = sessionStorage.getItem('skincareAnalysis');
      if (savedAnalysis) {
        analysisData = JSON.parse(savedAnalysis);
      }
    }

    if (analysisData) {
      setAnalysis(analysisData);
      sessionStorage.setItem('skincareAnalysis', JSON.stringify(analysisData));
    } else {
      setError("No analysis data found. Please go back and analyze your routine again.");
      setLoading(false);
    }
  }, [location.state]);

  useEffect(() => {
    if (analysis) {
      const fetchOptimization = async () => {
        try {
          setLoading(true);
          const results = await getOptimizedRoutine(analysis);
          setOptimization(results);
          setError(null);
        } catch (err) {
          setError("Failed to fetch optimization suggestions. Please try again later.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchOptimization();
    }
  }, [analysis]);

  const handleGoBack = () => {
    navigate('/skincare-scorecard-results');
  };

  const renderLoadingState = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-black border border-green-900/50 rounded-xl p-6 animate-pulse">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-900/50 mr-4"></div>
            <div className="w-3/4 h-6 rounded bg-green-900/50"></div>
          </div>
          <div className="space-y-2 mt-4">
            <div className="h-4 rounded bg-green-900/50"></div>
            <div className="h-4 rounded bg-green-900/50"></div>
            <div className="h-4 rounded bg-green-900/50 w-5/6"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderOptimizationSuggestions = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {optimization.suggestions.map((suggestion, index) => (
        <div 
          key={index} 
          className="bg-gradient-to-br from-gray-800 via-slate-900 to-black border border-green-900/50 rounded-xl shadow-lg p-6 flex flex-col transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl"
          >
          <div className="flex items-start mb-4">
            <div className="bg-green-600/10 p-3 rounded-lg mr-4 border border-green-800/50">
                <Icon name={suggestion.icon || 'Zap'} className="text-green-400" size={24} />
            </div>
            <div>
                <h3 className="text-lg font-bold text-white mb-1">{suggestion.title}</h3>
                <span className="text-xs font-semibold uppercase text-green-400 tracking-wider bg-green-900/50 px-2 py-1 rounded-md">{suggestion.category}</span>
            </div>
          </div>
          
          <p className="text-gray-400 text-sm mb-4 flex-grow">{suggestion.description}</p>
          
          <div className="mt-auto pt-4 border-t border-green-900/50">
            <h4 className="font-semibold text-green-400 mb-2 text-sm">How to Implement:</h4>
            <p className="text-sm text-gray-400 whitespace-pre-wrap font-light">{suggestion.details}</p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-heading font-heading-semibold text-gray-800">Optimize Your Routine</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">AI-powered suggestions to elevate your skincare results.</p>
            </div>
            <button 
              onClick={handleGoBack}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm sm:text-base whitespace-nowrap"
            >
              Back to Scorecard
          </button>
        </div>
      </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {loading && renderLoadingState()}

          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative text-center" role="alert">{error}</div>}

          {optimization && !loading && renderOptimizationSuggestions()}

          {!loading && !error && !optimization && (
            <div className="text-center text-gray-600">
              <p>No optimization suggestions available at the moment.</p>
            </div>
          )}
        </main>
    </div>
  );
};

export default OptimizeRoutine;
