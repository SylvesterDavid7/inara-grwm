import React, { useEffect } from 'react';

const ReportTemplate = ({ onRendered }) => {
  // Signal when the component has rendered for PDF capture
  useEffect(() => {
    if (onRendered) {
      setTimeout(onRendered, 50); // A short delay is all that's needed for this simple component
    }
  }, [onRendered]);

  const debugStyles = {
    width: '800px',
    height: '1120px', // Approx A4 height at this width
    backgroundColor: '#ff4d4d', // A bright red color
    color: 'white',
    textAlign: 'center',
    paddingTop: '200px',
    fontSize: '48px',
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
  };

  return (
    <div id="pdf-report" style={debugStyles}>
      <p>PDF Generation Test</p>
      <p>If you can see this red box, the rendering pipeline is working.</p>
    </div>
  );
};

export default ReportTemplate;
