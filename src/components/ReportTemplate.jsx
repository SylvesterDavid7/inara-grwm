import React from 'react';

const ReportTemplate = ({ reportData }) => {
  if (!reportData) {
    return (
      <div className="p-4 border rounded mb-4">
        <p>No report data available.</p>
      </div>
    );
  }

  // A generic way to display report data
  const renderData = (data) => {
    return Object.entries(data).map(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        // Handle nested objects (like Firestore Timestamps)
        if (value.seconds) {
             return <li key={key} className="flex flex-wrap justify-between py-2 border-b"><span className="font-semibold capitalize mr-2">{key.replace(/_/g, ' ')}:</span> <span>{new Date(value.seconds * 1000).toLocaleString()}</span></li>
        }
        return (
          <li key={key} className="py-2 border-b">
            <span className="font-semibold capitalize">{key.replace(/_/g, ' ')}</span>
            <ul className="pl-4 mt-2">
              {renderData(value)}
            </ul>
          </li>
        );
      }
      return (
        <li key={key} className="flex flex-wrap justify-between py-2 border-b">
            <span className="font-semibold capitalize mr-2">{key.replace(/_/g, ' ')}:</span> 
            <span className="text-right">{String(value)}</span>
        </li>
      );
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mb-4">
      <h3 className="text-2xl font-bold mb-4">Routine Output Report</h3>
      <ul className="divide-y divide-gray-200">
        {renderData(reportData)}
      </ul>
    </div>
  );
};

export default ReportTemplate;
