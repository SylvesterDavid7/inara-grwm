import { createContext, useContext } from 'react';

const UserDataContext = createContext();

export const useUserDataContext = () => {
  return useContext(UserDataContext);
};

export default UserDataContext;
