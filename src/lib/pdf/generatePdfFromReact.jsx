
import { pdf } from '@react-pdf/renderer';
import PdfDocument from './PdfDocument';
import generatePdfWithHtml2Canvas from './generatePdfWithHtml2Canvas';
import ReportTemplate from '../../pages/skincare-scorecard-results/components/ReportTemplate';

const generatePdfFromReact = async (data, useHtml2Canvas = false) => {
  if (useHtml2Canvas) {
    return generatePdfWithHtml2Canvas(ReportTemplate, data);
  }

  console.log("Starting PDF generation with @react-pdf/renderer...");

  try {
    // Render the React component to a PDF blob
    const blob = await pdf(<PdfDocument analysis={data} />).toBlob();

    // Convert the blob to a data URI for the preview
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        console.log("Successfully generated PDF data URI from blob.");
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        console.error("Error converting blob to data URI:", error);
        reject(new Error("Failed to convert PDF blob to data URI."));
      };
      reader.readAsDataURL(blob);
    });

  } catch (error) {
    console.error("Failed to generate PDF with @react-pdf/renderer:", error);
    // Fallback or alert the user
    alert("A critical error occurred while generating the PDF. The new method failed.");
    return Promise.reject(error);
  }
};

export default generatePdfFromReact;
