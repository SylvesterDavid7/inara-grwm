import React from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { useUserData } from '../../../contexts/UserDataContext';

const ActionButtons = ({ results }) => {
    const navigate = useNavigate();
    const { updateUserData, userData } = useUserData();

    const saveResults = async () => {
        try {
            // Create a copy of the existing assessments array and add the new one
            const newAssessments = [...(userData.assessments || []), { ...results, date: new Date().toISOString() }];
            await updateUserData({ assessments: newAssessments });
            alert('Results saved successfully!');
        } catch (error) {
            console.error('Error saving results: ', error);
            alert('Failed to save results.');
        }
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Skincare Assessment Results", 20, 20);
        let y = 30;
        Object.entries(results).forEach(([key, value]) => {
            doc.text(`${key}: ${Array.isArray(value) ? value.join(', ') : value}`, 20, y);
            y += 10;
        });
        doc.save("skincare-assessment-results.pdf");
    };

    const startNewAssessment = () => {
        navigate('/skin-assessment');
    };

    return (
        <div className="flex justify-center mt-8 space-x-4">
            <button onClick={saveResults} className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Save Results
            </button>
            <button onClick={downloadPDF} className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Download as PDF
            </button>
            <button onClick={startNewAssessment} className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                Start New Assessment
            </button>
        </div>
    );
};

export default ActionButtons;
