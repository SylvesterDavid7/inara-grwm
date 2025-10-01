import React, { useState, useRef, useEffect } from 'react';
import { useUserDataContext } from '../contexts/UserDataContext.jsx';
import { getAuth, signOut, updateProfile } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import Icon from '../components/AppIcon';
import ScoreSection from './profile/ScoreSection';
import BadgesSection from './profile/BadgesSection';
import StatsSection from './profile/StatsSection';
import TasksSection from './profile/TasksSection';

const Profile = () => {
  const { user, userData, updateUserData } = useUserDataContext();
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
      await updateUserData({ photoURL: downloadURL });

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

  const calculateBadges = (userData) => {
    if (!userData) return [];

    const allBadges = [
      { id: 'starter', icon: 'Star', title: 'Skincare Starter', description: 'Completed your first skin assessment.', earned: false },
      { id: 'builder', icon: 'ShieldCheck', title: 'Routine Builder', description: 'Added your first full skincare routine.', earned: false },
      { id: 'consistency', icon: 'Zap', title: 'Consistency King', description: 'Tracked your routine for 7 days straight.', earned: false },
      { id: 'guru', icon: 'BookOpen', title: 'Ingredient Guru', description: 'Viewed 10 ingredient details.', earned: false },
    ];

    const earnedBadges = allBadges.map(badge => {
      let earned = false;
      switch (badge.id) {
        case 'starter':
          if (userData.assessmentCompleted) {
            earned = true;
          }
          break;
        case 'builder':
          if (userData.routine) {
            const hasProducts = Object.values(userData.routine).some(day => {
                const amProducts = day.AM || [];
                const pmProducts = day.PM || [];
                return amProducts.length > 0 || pmProducts.length > 0;
            });
            if (hasProducts) {
                earned = true;
            }
          }
          break;
        case 'consistency':
          if (userData.progress) {
            const today = new Date();
            let consecutiveDays = 0;
            for (let i = 0; i < 7; i++) {
              const date = new Date(today);
              date.setDate(today.getDate() - i);
              const dateKey = date.toISOString().split('T')[0];
              if (userData.progress[dateKey] && Object.keys(userData.progress[dateKey]).length > 0) {
                consecutiveDays++;
              } else {
                break; // Streak broken
              }
            }
            if (consecutiveDays >= 7) {
              earned = true;
            }
          }
          break;
        case 'guru':
          if (userData.viewedIngredients && userData.viewedIngredients.length >= 10) {
            earned = true;
          }
          break;
        default:
          break;
      }
      return { ...badge, earned };
    });

    return earnedBadges;
  };

  const userBadges = calculateBadges(userData);
  
  const mockScore = { score: 85, level: 'Pro', progress: 85 };
  const mockStats = {
    highestScore: 1250,
    winStreak: 5,
    quizzesTaken: 23,
    correctAnswers: 189
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="md:col-span-1 space-y-8 order-1">
            <div className="bg-card rounded-2xl shadow-lg p-6 text-center">
                <div className="relative w-32 h-32 mx-auto">
                    <img
                        className="h-full w-full rounded-full object-cover ring-4 ring-card"
                        src={userData?.photoURL || '/placeholder-user.png'}
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
                        className="absolute bottom-1 right-1 bg-primary text-white rounded-full p-2 shadow-md hover:bg-primary/90 transition-all"
                        aria-label="Change profile picture"
                        disabled={isUploading}
                    >
                        <Icon name="Camera" size={18} />
                    </button>
                </div>
              <div className="mt-4">
                <h2 className="font-heading text-2xl font-bold text-foreground">{userData?.displayName}</h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                {isUploading && <p className='text-sm text-muted-foreground mt-2'>Uploading...</p>}
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
                    className="w-full flex justify-center items-center py-2.5 px-4 border border-border rounded-lg shadow-sm text-sm font-medium text-foreground bg-card hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
                >
                    <Icon name="LogOut" size={16} className="mr-2" />
                    Logout
                </button>
              </div>
            </div>
            {/* Tasks for Desktop */}
            <div className="hidden md:block">
              <TasksSection />
            </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-2 space-y-8 order-2">
            <ScoreSection {...mockScore} />
            <StatsSection stats={mockStats} />
            <BadgesSection badges={userBadges} />
          </div>

          {/* Tasks for Mobile */}
          <div className="md:hidden order-3">
            <TasksSection />
          </div>

        </div>

        <div className="mt-12">
            <h3 className="font-heading text-xl font-bold text-foreground mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {profileLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="group bg-card rounded-xl p-5 shadow-md hover:shadow-lg hover:border-green-300 hover:-translate-y-1 transition-all duration-300 border border-border"
                  >
                  <div className="flex items-center justify-center w-12 h-12 bg-muted rounded-full mb-4">
                    <Icon name={link.icon} size={24} className="text-green-600" />
                  </div>
                  <h3 className="font-heading text-md font-semibold text-foreground">{link.title}</h3>
                  <p className="text-xs text-muted-foreground">Go to {link.title}</p>
                </Link>
              ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
