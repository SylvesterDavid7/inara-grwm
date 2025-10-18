import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import ReportTemplate from '../components/ReportTemplate';
import SkincareScoreCardResults from './skincare-scorecard-results';
import AssessmentResults from './assessment-results';
import { ArrowLeft, Server, AlertTriangle, FileWarning } from 'lucide-react';

// A Map to get the right component and data structure for each report type
const reportTypeConfig = {
  scanResults: {
    component: ReportTemplate,
    dataKey: 'analysis', // The prop name the component expects
    getData: (data) => data.scanResult, // How to extract the data for the component
  },
  routineAnalyses: {
    component: SkincareScoreCardResults,
    dataKey: 'routineAnalysis', // SkincareScoreCardResults expects this prop
    getData: (data) => data, // Pass the whole document data
  },
  userAssessments: {
    component: AssessmentResults,
    dataKey: 'assessmentData', // AssessmentResults expects this prop
    getData: (data) => data,
  },
};

const AdminReportView = () => {
  const { collection, reportId } = useParams();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get the correct component and data mapping based on the URL parameter
  const config = reportTypeConfig[collection];

  useEffect(() => {
    const fetchReport = async () => {
      if (!reportId || !collection) return;
      try {
        setLoading(true);
        const reportDocRef = doc(db, collection, reportId);
        const docSnap = await getDoc(reportDocRef);

        if (docSnap.exists()) {
          setReportData(docSnap.data());
        } else {
          setError(`No report found in '${collection}' with this ID.`);
        }
      } catch (err) {
        console.error("Error fetching report document:", err);
        setError('Failed to fetch the report. Check console for details.');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId, collection]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
            <Server className="h-12 w-12 mx-auto text-gray-400 animate-pulse" />
            <p className="mt-4 text-lg text-gray-600">Fetching report details...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center bg-red-50 p-8 rounded-lg border border-red-200 m-8">
            <AlertTriangle className="h-12 w-12 mx-auto text-red-500" />
            <p className="mt-4 text-lg text-red-700 font-semibold">{error}</p>
        </div>
      );
    }
    
    if (!config) {
        return (
             <div className="text-center bg-yellow-50 p-8 rounded-lg border border-yellow-200 m-8">
                <FileWarning className="h-12 w-12 mx-auto text-yellow-500" />
                <p className="mt-4 text-lg text-yellow-700 font-semibold">Cannot display this report type.</p>
                <p className="text-yellow-600">The report type "{collection}" is not supported by the admin viewer.</p>
            </div>
        )
    }

    if (reportData) {
      const ReportComponent = config.component;
      const componentData = config.getData(reportData);
      
      // Create the props object dynamically
      const componentProps = { [config.dataKey]: componentData, isAdminView: true };
      
      // Special case for SkincareScoreCardResults which needs the ID
      if(collection === 'routineAnalyses') {
        componentProps.analysisId = reportId;
      }

      return <ReportComponent {...componentProps} />;
    }

    return <p>No report data available to display.</p>;
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <Link 
            to="/admin/analytics"
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Reports
          </Link>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
           {renderContent()}
        </div>

      </div>
    </div>
  );
};

export default AdminReportView;
