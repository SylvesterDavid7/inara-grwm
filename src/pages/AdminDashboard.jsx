
import React, { useState, useEffect } from 'react';
import { User, DollarSign, BarChart2, CheckSquare } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { db } from '../firebase';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';

// Main Dashboard Component
const AdminDashboard = () => {
  const [userStats, setUserStats] = useState({ totalUsers: 0, activeUsers: 0 });
  const [userGrowth, setUserGrowth] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const usersCollectionRef = collection(db, 'users');
        
        // 1. Fetch total user count
        const allUsersSnapshot = await getDocs(usersCollectionRef);
        const totalUsers = allUsersSnapshot.size;

        // 2. Fetch active users (e.g., created in the last 30 days - adjust as needed)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const activeUsersQuery = query(usersCollectionRef, where('createdAt', '>=', Timestamp.fromDate(thirtyDaysAgo)));
        const activeUsersSnapshot = await getDocs(activeUsersQuery);
        const activeUsers = activeUsersSnapshot.size;

        setUserStats({ totalUsers, activeUsers });

        // 3. Prepare data for the growth chart (users in the last 7 days)
        const weeklyGrowthData = Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return { date: d.toISOString().split('T')[0], users: 0 };
        }).reverse();

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const weeklyGrowthQuery = query(usersCollectionRef, where('createdAt', '>=', Timestamp.fromDate(sevenDaysAgo)));
        const weeklyGrowthSnapshot = await getDocs(weeklyGrowthQuery);

        weeklyGrowthSnapshot.forEach(doc => {
          const userData = doc.data();
          if (userData.createdAt) {
            const joinDate = userData.createdAt.toDate().toISOString().split('T')[0];
            const dayData = weeklyGrowthData.find(d => d.date === joinDate);
            if (dayData) {
              dayData.users += 1;
            }
          }
        });
        
        // Format for chart
        const formattedGrowthData = weeklyGrowthData.map(d => ({
            name: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
            users: d.users,
        }));

        setUserGrowth(formattedGrowthData);

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to fetch dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gray-50 text-gray-800">
      <main className="flex-1 p-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mb-8">Welcome back, Admin! Here's what's happening.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={<User className="text-blue-500" />} title="Total Users" value={userStats.totalUsers} />
          <StatCard icon={<DollarSign className="text-green-500" />} title="Revenue" value="$12,845" change="+12% this month" />
          <StatCard icon={<BarChart2 className="text-yellow-500" />} title="Active Users (30d)" value={userStats.activeUsers} />
          <StatCard icon={<CheckSquare className="text-red-500" />} title="Pending Approvals" value="12" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">New Users (Last 7 Days)</h2>
            <UserGrowthChart data={userGrowth} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <QuickActions />
          </div>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ icon, title, value, change }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {change && <p className="text-xs text-gray-400">{change}</p>}
    </div>
    <div className="bg-gray-100 p-3 rounded-full">
      {icon}
    </div>
  </div>
);

const UserGrowthChart = ({ data }) => (
  <div style={{ width: '100%', height: 300 }}>
    <ResponsiveContainer>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="users" stroke="#8884d8" name="New Users" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const QuickActions = () => (
  <div className="space-y-3">
    <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-md text-blue-700">Manage Users</button>
    <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-md text-green-700">View Reports</button>
    <button className="w-full text-left p-3 bg-yellow-50 hover:bg-yellow-100 rounded-md text-yellow-700">App Settings</button>
    <button className="w-full text-left p-3 bg-red-50 hover:bg-red-100 rounded-md text-red-700">Content Moderation</button>
  </div>
);

export default AdminDashboard;
