import React, { useState, useRef, useEffect } from 'react';
import { useUserDataContext } from '../contexts/UserDataContext';
import { getAuth, signOut, updateProfile } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import Icon from '../components/AppIcon';
import ScoreSection from './profile/ScoreSection';
import BadgesSection from './profile/BadgesSection';
import StatsSection from './profile/StatsSection';

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

  const CLOUDINARY_CLOUD_NAME = 'dg8nuyybc';
  const CLOUDINARY_UPLOAD_PRESET = 'user_profile_pictures';

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
      setTimeout(() => setSuccessMessage(''), 5000);

    } catch (error) {
      console.error('Upload failed:', error);
      setIsUploading(false);
      setErrorMessage('Failed to update profile picture. Please try again.');
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };
  
  const mockScore = { score: 85, level: 'Pro', progress: 85 };
  const mockBadges = [
    { icon: 'Star', title: 'Skincare Starter', description: 'Completed your first skin assessment.', earned: true },
    { icon: 'ShieldCheck', title: 'Routine Builder', description: 'Added your first full skincare routine.', earned: true },
    { icon: 'Zap', title: 'Consistency King', description: 'Tracked your routine for 7 days straight.', earned: false },
    { icon: 'BookOpen', title: 'Ingredient Guru', description: 'Viewed 10 ingredient details.', earned: true },
  ];
  const mockStats = {
    highestScore: 1250,
    winStreak: 5,
    quizzesTaken: 23,
    correctAnswers: 189
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="relative w-32 h-32 mx-auto">
                    <img
                        className="h-full w-full rounded-full object-cover ring-4 ring-white"
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
                        className="absolute bottom-1 right-1 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full p-2 shadow-md hover:from-blue-600 hover:to-cyan-500 transition-all"
                        aria-label="Change profile picture"
                        disabled={isUploading}
                    >
                        <Icon name="Camera" size={18} className="text-white"/>
                    </button>
                </div>
              <div className="mt-4">
                <h2 className="font-heading text-2xl font-bold text-gray-800">{user?.displayName}</h2>
                <p className="text-sm text-gray-600">{user?.email}</p>
                {isUploading && <p className='text-sm text-gray-500 mt-2'>Uploading...</p>}
                {successMessage && (
                    <div className="mt-2 rounded-md bg-green-100 p-3">
                        <p className="text-xs font-medium text-green-800">{successMessage}</p>
                    </div>
                )}
                {errorMessage && (
                    <div className="mt-2 rounded-md bg-red-100 p-3">
                        <p className="text-xs font-medium text-red-800">{errorMessage}</p>
                    </div>
                )}
              </div>
              <div className="mt-6">
                <button
                    onClick={handleLogout}
                    className="w-full flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                    <Icon name="LogOut" size={16} className="mr-2" />
                    Logout
                </button>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <ScoreSection {...mockScore} />
            <StatsSection stats={mockStats} />
            <BadgesSection badges={mockBadges} />
          </div>
        </div>

        <div className="mt-12">
            <h3 className="font-heading text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {profileLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="group bg-white rounded-xl p-5 shadow-md hover:shadow-lg hover:border-green-300 hover:-translate-y-1 transition-all duration-300 border"
                  >
                  <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                    <Icon name={link.icon} size={24} className="text-green-600" />
                  </div>
                  <h3 className="font-heading text-md font-semibold text-gray-700">{link.title}</h3>
                  <p className="text-xs text-gray-500">Go to {link.title}</p>
                </Link>
              ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
