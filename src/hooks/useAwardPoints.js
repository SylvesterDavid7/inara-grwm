import { useUserDataContext } from '../contexts/UserDataContext';

export const useAwardPoints = () => {
  const { userData, updateUserData } = useUserDataContext();

  const awardPoints = (action) => {
    if (!userData) return;

    let pointsToAward = 0;
    switch (action) {
      case 'assessment_completed':
        pointsToAward = 50;
        break;
      case 'routine_added':
        pointsToAward = 75;
        break;
      case 'routine_tracked':
        pointsToAward = 10;
        break;
      case 'ingredient_viewed':
        pointsToAward = 5;
        break;
      case 'derma_scan_completed':
        pointsToAward = 100;
        break;
      default:
        break;
    }

    if (pointsToAward > 0) {
      updateUserData({ points: (userData.points || 0) + pointsToAward });
    }
  };

  return { awardPoints };
};
