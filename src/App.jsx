import React from "react";
import { BrowserRouter } from "react-router-dom";
import Routes from "./Routes";
import { UserDataProvider } from "./contexts/UserDataContext.jsx";
import usePageTracking from "./hooks/usePageTracking";

// The main App component now sets up the Router
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

// AppContent is a new component that lives inside the Router's context
function AppContent() {
  // Now, this hook can safely use useLocation()
  usePageTracking();

  return (
    <UserDataProvider>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white font-sans animate-fade-in">
        <Routes />
      </div>
    </UserDataProvider>
  );
}

export default App;
