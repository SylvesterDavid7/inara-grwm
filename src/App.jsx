import React from "react";
import Routes from "./Routes";
import { UserDataProvider } from "./contexts/UserDataContext.jsx";

function App() {
  return (
    // Force a reload by adding a comment
    <UserDataProvider>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white font-sans animate-fade-in">
        <Routes />
      </div>
    </UserDataProvider>
  );
}

export default App;
