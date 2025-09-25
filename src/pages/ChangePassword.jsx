import React, { useState } from 'react';
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';

const ChangePassword = () => {
  const auth = getAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (newPassword !== confirmNewPassword) {
      setErrorMessage("New passwords don't match.");
      return;
    }

    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setSuccessMessage('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      setErrorMessage('Failed to update password. Please check your current password and try again.');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Change Password</h2>
          <form onSubmit={handleUpdatePassword}>
            <div className="mb-4">
              <label htmlFor="currentPassword"
                     className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="newPassword"
                     className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="confirmNewPassword"
                     className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <input
                type="password"
                id="confirmNewPassword"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Update Password
            </button>
            {successMessage && <p className="text-green-600 mt-4">{successMessage}</p>}
            {errorMessage && <p className="text-red-600 mt-4">{errorMessage}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
