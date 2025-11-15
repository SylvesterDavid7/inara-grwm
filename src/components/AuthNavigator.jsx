import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserDataContext } from '../contexts/UserDataContext.jsx';

const AuthNavigator = () => {
  const { user, loading } = useUserDataContext();
  const navigate = useNavigate();

  useEffect(() => {
    // If loading is finished and the user is logged in, navigate to the profile.
    if (!loading && user) {
      navigate('/profile', { replace: true });
    }
  }, [user, loading, navigate]);

  // This component does not render anything itself.
  return null;
};

export default AuthNavigator;
