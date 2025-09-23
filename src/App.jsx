import React from "react";
import Routes from "./Routes";
import useUserData from "./hooks/useUserData";
import UserDataContext from "./contexts/UserDataContext";

function App() {
  const { user, userData, updateUserData } = useUserData();

  return (
    <UserDataContext.Provider value={{ user, userData, updateUserData }}>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white font-sans animate-fade-in">
        <Routes />
      </div>
    </UserDataContext.Provider>
  );
}

export default App;
