
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, collectionGroup } from 'firebase/firestore'; // Import collectionGroup
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import { Shield, User, Clock, ChevronRight, Inbox, FileText, CheckSquare, Microscope, Users, ArrowRight } from 'lucide-react';

const AdminAnalytics = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingReports, setLoadingReports] = useState(false);
  const [error, setError] = useState(null);

  // Effect to fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const usersCollection = collection(db, 'users');
        const userSnapshot = await getDocs(usersCollection);
        const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(userList);
      } catch (err) {
        setError('Failed to fetch users. Please check security rules and database connection.');
        console.error("Error fetching users:", err);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  // FINAL FIX: This query now uses 'author' instead of 'userId'
  useEffect(() => {
    if (!selectedUser) {
      setReports([]);
      return;
    }

    const fetchUserReports = async () => {
      setLoadingReports(true);
      setError(null);
      setReports([]);

      try {
        const collectionsToFetch = ['scanResults', 'routineAnalyses', 'userAssessments'];
        
        const promises = collectionsToFetch.map(async (collectionName) => {
          const reportsGroupRef = collectionGroup(db, collectionName);
          // THE FIX: Changed 'userId' to 'author' based on user feedback.
          const q = query(reportsGroupRef, where('author', '==', selectedUser.id));
          
          const snapshot = await getDocs(q);
          return snapshot.docs.map(doc => ({
            id: doc.id, 
            collection: collectionName,
            ...doc.data()
          }));
        });

        const results = await Promise.all(promises);
        const allReports = results.flat();
        
        allReports.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        
        setReports(allReports);

      } catch (err) {
        console.error("Error fetching user reports:", err);
        setError("Failed to fetch reports. If this persists, a composite index may be required. Check the browser console for a link to create it.");
      } finally {
        setLoadingReports(false);
      }
    };

    fetchUserReports();
  }, [selectedUser]);

  const getReportInfo = (report) => {
    let title = 'Unknown Report';
    let icon = FileText;
    let score = null;
    let rating = null;

    switch (report.collection) {
      case 'scanResults':
        title = 'Derma Scan Report';
        icon = Microscope;
        score = report.scanResult?.overallScore?.score ?? report.scanResult?.skinHealth ?? null;
        rating = report.scanResult?.overallScore?.rating ?? null;
        break;
      case 'routineAnalyses':
        title = 'Routine Analysis';
        icon = FileText;
        score = report.overallScore?.score ?? null;
        rating = report.overallScore?.rating ?? null;
        break;
      case 'userAssessments':
        title = 'Skin Assessment';
        icon = CheckSquare;
        score = report.score ?? null;
        break;
      default:
        break;
    }
    
    const scoreValue = typeof score === 'number' ? Math.round(score) : null;
    return { title, icon, score: scoreValue, rating };
  };

  const ScoreDisplay = ({ score, rating }) => {
    if (score === null) return <span className="text-sm text-gray-500">Score: N/A</span>;
    const getScoreColor = (value) => {
        if (value < 40) return 'bg-red-500';
        if (value < 70) return 'bg-yellow-500';
        return 'bg-green-500';
    };
    return (
      <div className="flex items-center space-x-3">
          <span className="font-semibold text-gray-800">{score}/100</span>
          <div className="w-24 bg-gray-200 rounded-full h-2.5">
              <div className={`${getScoreColor(score)} h-2.5 rounded-full`} style={{ width: `${score}%` }}></div>
          </div>
          {rating && <span className="text-sm font-medium text-gray-600 hidden sm:inline">{rating}</span>}
      </div>
    );
  };
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">User Reports</h1>
          <p className="mt-2 text-lg text-gray-600">
            Select a user to view their submitted analyses, scans, and assessments.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg my-4" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white shadow-lg rounded-xl border border-gray-200">
              <div className="p-4 border-b flex items-center">
                <Users className="h-5 w-5 mr-3 text-gray-500"/>
                <h2 className="text-lg font-semibold">All Users</h2>
              </div>
              {loadingUsers ? (
                <div className="p-4 text-center text-gray-500">Loading users...</div>
              ) : (
                <ul className="divide-y divide-gray-200 max-h-[70vh] overflow-y-auto">
                  {users.map(user => (
                    <li
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className={`p-4 flex justify-between items-center cursor-pointer transition duration-150 ease-in-out ${selectedUser?.id === user.id ? 'bg-indigo-100' : 'hover:bg-gray-50'}`}
                    >
                      <div>
                        <p className={`font-semibold ${selectedUser?.id === user.id ? 'text-indigo-800' : 'text-gray-900'}`}>{user.displayName || 'Anonymous'}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      {selectedUser?.id === user.id && <ArrowRight className="h-5 w-5 text-indigo-600" />}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            {!selectedUser ? (
              <div className="text-center py-20 bg-white rounded-lg border-dashed border-2 border-gray-300 h-full flex flex-col justify-center">
                <Users className="h-16 w-16 mx-auto text-gray-400" />
                <h3 className="mt-4 text-xl font-semibold text-gray-900">No User Selected</h3>
                <p className="mt-2 text-md text-gray-500">Please select a user from the list to see their reports.</p>
              </div>
            ) : loadingReports ? (
              <div className="text-center py-20 text-gray-500">Loading reports for {selectedUser.displayName}...</div>
            ) : reports.length === 0 ? (
               <div className="text-center py-20 bg-white rounded-lg border-dashed border-2 border-gray-300 h-full flex flex-col justify-center">
                <Inbox className="h-16 w-16 mx-auto text-gray-400" />
                <h3 className="mt-4 text-xl font-semibold text-gray-900">No Reports Found</h3>
                <p className="mt-2 text-md text-gray-500">{selectedUser.displayName} has not submitted any reports yet.</p>
              </div>
            ) : (
              <div className="bg-white shadow-lg rounded-xl border border-gray-200 divide-y divide-gray-200">
                {reports.map(report => {
                  const { title, icon: Icon, score, rating } = getReportInfo(report);
                  return (
                    <Link key={`${report.collection}-${report.id}`} to={`/admin/report/${report.collection}/${report.id}`} className="block p-6 hover:bg-gray-50 transition duration-150 ease-in-out">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <Icon className="h-5 w-5 mr-3 text-indigo-500" />
                            <p className="text-lg font-bold text-gray-800 truncate">{title}</p>
                          </div>
                          <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:space-x-6 text-sm text-gray-500 pl-8">
                             <div className="flex items-center mb-2 sm:mb-0">
                               <Clock className="h-4 w-4 mr-1.5" />
                               <span>{report.createdAt ? new Date(report.createdAt.seconds * 1000).toLocaleDateString() : 'No date'}</span>
                             </div>
                             <div className="flex items-center">
                               <Shield className="h-4 w-4 mr-1.5" />
                               <ScoreDisplay score={score} rating={rating} />
                             </div>
                          </div>
                        </div>
                        <ChevronRight className="h-6 w-6 text-gray-400 ml-4" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
