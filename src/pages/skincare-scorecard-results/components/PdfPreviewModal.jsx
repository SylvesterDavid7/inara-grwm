import React from 'react';

const PdfPreviewModal = ({ isOpen, onClose, pdfDataUri }) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfDataUri;
    link.download = 'skincare-report.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-full flex flex-col" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Report Preview</h2>
          <div className="space-x-3">
            <button 
              onClick={handleDownload}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-transform transform hover:scale-105"
            >
              Download PDF
            </button>
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow bg-gray-100 h-0"> {/* Added h-0 to allow flex-grow to work correctly in Chrome/Safari */}
          {pdfDataUri ? (
            <iframe 
              src={`${pdfDataUri}#view=FitH`} 
              width="100%" 
              height="100%" 
              title="PDF Preview" 
              className="border-none"
            ></iframe>
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-500">
              <p>Generating PDF preview...</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default PdfPreviewModal;
