import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import React from 'react';
import ReactDOM from 'react-dom/client';
import ReportTemplate from '../../pages/skincare-scorecard-results/components/ReportTemplate';

const generatePdfReport = (analysis) => {
  return new Promise((resolve, reject) => {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '800px';
    container.style.backgroundColor = 'white';
    container.style.zIndex = '10000';
    document.body.appendChild(container);

    const onRendered = () => {
      console.log("PDF generation: Component rendered, capturing with html2canvas...");
      const reportElement = container.querySelector('#pdf-report');

      if (!reportElement) {
        document.body.removeChild(container);
        return reject(new Error('#pdf-report element not found'));
      }

      setTimeout(() => {
        html2canvas(reportElement, { scale: 2, useCORS: true, logging: true })
          .then(canvas => {
            document.body.removeChild(container);
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgHeightInPdf = canvas.height * pdfWidth / canvas.width;
            let heightLeft = imgHeightInPdf;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeightInPdf);
            heightLeft -= pdfHeight;

            while (heightLeft > 0) {
              position -= pdfHeight;
              pdf.addPage();
              pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeightInPdf);
              heightLeft -= pdfHeight;
            }
            resolve(pdf.output('datauristring'));
          })
          .catch(error => {
            document.body.removeChild(container);
            reject(error);
          });
      }, 200);
    };

    try {
      const root = ReactDOM.createRoot(container);
      // REMOVED React.StrictMode to see if it resolves the html2canvas issue
      root.render(
          <ReportTemplate 
            analysis={analysis} 
            onRendered={onRendered} 
          />
      );
    } catch (error) {
      document.body.removeChild(container);
      reject(error);
    }
  });
};

export default generatePdfReport;
