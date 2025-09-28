import React, { useState, useEffect } from 'react';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollectionRef = collection(db, 'users');
        const querySnapshot = await getDocs(usersCollectionRef);
        const usersList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersList);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Users</h1>
        <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
          <PlusCircle size={20} />
          <span>Add User</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left table-auto">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 font-semibold text-gray-600">Name</th>
              <th className="p-4 font-semibold text-gray-600">Email</th>
              <th className="p-4 font-semibold text-gray-600">Role</th>
              <th className="p-4 font-semibold text-gray-600">Joined</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0">
                    {user.photoURL && <img src={user.photoURL} alt={user.displayName} className="w-full h-full rounded-full" />}
                  </div>
                  <span className="font-medium text-gray-800">{user.displayName || user.name || 'N/A'}</span>
                </td>
                <td className="p-4 text-gray-600">{user.email}</td>
                <td className="p-4 text-gray-600">{user.role || 'User'}</td>
                <td className="p-4 text-gray-600">
                  {user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.status === 'Inactive' ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-700'}`}>
                    {user.status || 'Active'}
                  </span>
                </td>
                <td className="p-4">
                  <button className="p-2 text-gray-500 hover:text-gray-800">
                    <MoreHorizontal size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
