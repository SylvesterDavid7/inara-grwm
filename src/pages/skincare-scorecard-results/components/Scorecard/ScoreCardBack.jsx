import React from 'react';

function ScoreCardBack({ result }) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-black text-white flex flex-col rounded-2xl p-6">
      {/* Header */}
      <h3 className="text-xl font-bold mb-4 text-slate-200 text-center flex-shrink-0">Analysis Details</h3>
      
      {/* Content Area */}
      <div className="w-full flex-grow overflow-y-auto">
        {result.issues?.length > 0 ? (
          <div className="space-y-3">
            {result.issues.map((issue, index) => (
              <div key={index} className="p-3 rounded-lg border border-slate-600 bg-slate-700/50">
                <div className="flex justify-between items-center gap-2">
                  <p className="font-semibold text-sm">{issue.title}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold whitespace-nowrap ${
                    issue.risk === 'high' ? 'bg-red-200 text-red-800' :
                    issue.risk === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-blue-200 text-blue-800'
                  }`}>{issue.risk} risk</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">{issue.details}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center h-full flex flex-col items-center justify-center">
            <img src="/Inara Smiley.svg" alt="Smiley Face" className="w-24 h-24 mb-4" />
            <h4 className="font-bold text-lg text-slate-100">Your Routine is Glowing!</h4>
            <p className="text-slate-300 mt-2 text-sm max-w-xs">We analyzed your routine and found no conflicts or major issues. Keep up the fantastic work!</p>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <p className="flex-shrink-0 pt-4 text-xs text-slate-400 text-center">Click card to flip</p>
    </div>
  );
}

export default ScoreCardBack;
