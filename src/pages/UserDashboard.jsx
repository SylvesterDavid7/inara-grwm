import React from 'react';
import { Link } from 'react-router-dom';
import { useUserData } from '../contexts/UserDataContext';

const UserDashboard = () => {
    const { userData } = useUserData();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Welcome to your Dashboard</h1>
            {userData && (
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <h2 className="text-2xl font-semibold mb-4">Your Details</h2>
                    <p><strong>Email:</strong> {userData.email}</p>
                    {/* Add more user details here as needed */}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Quick Access to Skin Assessment */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Skin Assessment</h3>
                    <p className="mb-4">Take our skin assessment to get personalized recommendations.</p>
                    <Link to="/skin-assessment" className="text-indigo-600 hover:text-indigo-800 font-semibold">Start Assessment &rarr;</Link>
                </div>

                {/* Display Past Assessments */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Past Assessments</h3>
                    {userData?.assessments && userData.assessments.length > 0 ? (
                        <ul>
                            {userData.assessments.map((assessment, index) => (
                                <li key={index} className="mb-2">
                                    <Link to={`/assessment-results/${index}`} className="text-indigo-600 hover:text-indigo-800">Assessment on {new Date(assessment.date).toLocaleDateString()}</Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>You have no past assessments.</p>
                    )}
                </div>

                {/* Placeholder for future features */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Your Routine</h3>
                    <p>Your personalized skincare routine will appear here.</p>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
