import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React from 'react';
import ReactDOM from 'react-dom/client';
import ReportTemplate from '../../pages/skincare-scorecard-results/components/ReportTemplate';

const generatePdfWithHtml2Canvas = async (analysis) => {
    const A4_WIDTH_PX = 794;
    const A4_HEIGHT_PX = 1123;

    const reportRoot = document.createElement('div');
    reportRoot.id = 'report-root-html2canvas';
    document.body.appendChild(reportRoot);

    // Using the proven, stable method for the off-screen container.
    Object.assign(reportRoot.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: `${A4_WIDTH_PX}px`,
        height: 'auto', // Auto height to allow content to determine the size
        minHeight: `${A4_HEIGHT_PX}px`,
        backgroundColor: 'white',
        color: 'black',
        opacity: '0', 
        zIndex: '-1',   
        pointerEvents: 'none', 
    });

    const reactRoot = ReactDOM.createRoot(reportRoot);

    try {
        // Re-introducing the full ReportTemplate component.
        reactRoot.render(<ReportTemplate analysis={analysis} />);

        // Increasing the delay to allow the complex component to fully render.
        await new Promise(resolve => setTimeout(resolve, 3000));

        const canvas = await html2canvas(reportRoot, {
            scale: 2,
            useCORS: true,
            logging: true,
            width: A4_WIDTH_PX,
            height: reportRoot.scrollHeight, // Capture the full height of the rendered content
            windowWidth: A4_WIDTH_PX,
            windowHeight: reportRoot.scrollHeight,
        });
        
        const pdf = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        // Maintain aspect ratio
        const canvasAspectRatio = canvas.width / canvas.height;
        let finalPdfHeight = pdfWidth / canvasAspectRatio;

        // Handle cases where content is longer than one page
        if (finalPdfHeight > pdfHeight) {
            finalPdfHeight = pdfHeight; // For now, cap at one page, but this could be extended to multi-page
        }

        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, finalPdfHeight);

        return pdf.output('datauristring');

    } catch (error) {
        console.error("Error generating PDF from ReportTemplate:", error);
        alert("There was an error generating the PDF report. Please check the console for details.");
        return null;
    } finally {
        if (reactRoot) {
            reactRoot.unmount();
        }
        if (reportRoot.parentNode) {
            reportRoot.parentNode.removeChild(reportRoot);
        }
    }
};

export default generatePdfWithHtml2Canvas;
