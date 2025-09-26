import React, { useState, useRef, useEffect } from 'react';
import { useUserDataContext } from '../contexts/UserDataContext';
import { getAuth, signOut, updateProfile } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import Icon from '../components/AppIcon';

const Profile = () => {
  const { user } = useUserDataContext();
  const auth = getAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [profileLinks, setProfileLinks] = useState([]);

  useEffect(() => {
    const baseLinks = [
      { title: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
      { title: 'Track Your Progress', path: '/progress-tracking-dashboard', icon: 'TrendingUp' },
      { title: 'Update Routine', path: '/skincare-routine-input', icon: 'Plus' },
      { title: 'Reassess Skin', path: '/skin-assessment-questionnaire', icon: 'ClipboardList' },
      { title: 'Learn More', path: '/ingredient-education-hub', icon: 'BookOpen' },
      { title: 'User Info', path: '/user-info', icon: 'User' },
    ];

    if (user && user.providerData.some(provider => provider.providerId === 'password')) {
      setProfileLinks([...baseLinks, { title: 'Change Password', path: '/change-password', icon: 'Lock' }]);
    } else {
      setProfileLinks(baseLinks);
    }
  }, [user]);

  // --- Cloudinary Configuration ---
  const CLOUDINARY_CLOUD_NAME = 'dg8nuyybc'; // Your actual cloud name
  const CLOUDINARY_UPLOAD_PRESET = 'user_profile_pictures'; // Your actual upload preset
  // --------------------------------

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleUpload = async (file) => {
    if (!user) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    setIsUploading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Image upload failed');
      }

      const data = await response.json();
      const downloadURL = data.secure_url;

      await updateProfile(auth.currentUser, { photoURL: downloadURL });

      setIsUploading(false);
      setSuccessMessage('Profile picture updated successfully!');
      setTimeout(() => setSuccessMessage(''), 5000); // Auto-hide after 5 seconds

    } catch (error) {
      console.error('Upload failed:', error);
      setIsUploading(false);
      setErrorMessage('Failed to update profile picture. Please try again.');
      setTimeout(() => setErrorMessage(''), 5000); // Auto-hide after 5 seconds
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
                <div className="relative">
                    <img
                        className="h-20 w-20 rounded-full object-cover"
                        src={user?.photoURL || '/placeholder-user.png'}
                        alt="User"
                    />
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*"
                        className="hidden" 
                    />
                    <button 
                        onClick={() => fileInputRef.current.click()}
                        className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
                        aria-label="Change profile picture"
                        disabled={isUploading}
                    >
                        <Icon name="Camera" size={16} className="text-gray-600"/>
                    </button>
                </div>
              <div className="ml-5">
                <h2 className="font-heading text-xl font-semibold text-gray-800">{user?.displayName}</h2>
                <p className="text-sm text-gray-600">{user?.email}</p>
                {isUploading && <p className='text-sm text-gray-500 mt-2'>Uploading...</p>}
                {successMessage && (
                    <div className="mt-2 rounded-md bg-green-50 p-3">
                        <p className="text-xs font-medium text-green-800">{successMessage}</p>
                    </div>
                )}
                {errorMessage && (
                    <div className="mt-2 rounded-md bg-red-50 p-3">
                        <p className="text-xs font-medium text-red-800">{errorMessage}</p>
                    </div>
                )}
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {profileLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="group bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-400 transition-colors duration-300"
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full mb-4">
                    <Icon name={link.icon} size={20} className="text-gray-500" />
                  </div>
                  <h3 className="font-heading text-md font-semibold text-gray-700">{link.title}</h3>
                  <p className="text-xs text-gray-500">Navigate to {link.title}</p>
                </Link>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <button
                onClick={handleLogout}
                className="w-full max-w-xs mx-auto flex justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
