import React from 'react';
import Icon from '../../../components/AppIcon';

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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-heading font-heading-semibold text-lg text-foreground">PDF Preview</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="X" size={20} />
          </button>
        </div>
        <div className="flex-1 p-4 overflow-hidden">
          {pdfDataUri ? (
            <object data={pdfDataUri} type="application/pdf" width="100%" height="100%">
              <p className="text-center text-muted-foreground">
                Your browser does not support PDF previews. 
                <button onClick={handleDownload} className="text-primary underline ml-1">Download it here</button> instead.
              </p>
            </object>
          ) : (
            <div className="flex items-center justify-center h-full">
                <Icon name="Loader2" size={32} className="animate-spin text-primary" />
            </div>
          )}
        </div>
        <div className="flex justify-end p-4 border-t border-border bg-muted/50 rounded-b-lg">
          <button 
            onClick={handleDownload} 
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-clinical hover:bg-primary/90 transition-clinical"
          >
            <Icon name="Download" size={16} />
            <span className="font-body font-body-medium text-sm">Download PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PdfPreviewModal;
