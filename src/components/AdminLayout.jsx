import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Home, Users, BarChart, Settings, ChevronsLeft, ChevronsRight } from 'lucide-react';
import Header from './ui/Header';
import Footer from './ui/Footer';

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* Added pt-20 to offset the fixed header */}
      <div className="flex flex-1 pt-20">
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6 md:p-8 bg-gray-50 overflow-y-auto">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => (
  <aside className={`relative bg-white text-gray-800 shadow-xl transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
    <div className="h-full flex flex-col">
      <div className={`flex items-center border-b border-gray-200 h-20 px-4 ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
        {isSidebarOpen && <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>}
        <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-100">
          {isSidebarOpen ? <ChevronsLeft size={20} /> : <ChevronsRight size={20} />}
        </button>
      </div>
      <nav className="flex-1 px-2 py-6 space-y-2">
        <SidebarLink icon={<Home size={20} />} to="/admin" text="Dashboard" isSidebarOpen={isSidebarOpen} />
        <SidebarLink icon={<Users size={20} />} to="/admin/users" text="Users" isSidebarOpen={isSidebarOpen} />
        <SidebarLink icon={<BarChart size={20} />} to="/admin/analytics" text="Analytics" isSidebarOpen={isSidebarOpen} />
        <SidebarLink icon={<Settings size={20} />} to="/admin/settings" text="Settings" isSidebarOpen={isSidebarOpen} />
      </nav>
    </div>
  </aside>
);

const SidebarLink = ({ icon, to, text, isSidebarOpen }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `flex items-center py-2 px-4 rounded-md transition-all duration-200 ${isActive ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'} ${!isSidebarOpen && 'justify-center'}`
    }
  >
    {icon}
    {isSidebarOpen && <span className="font-medium ml-3">{text}</span>}
  </NavLink>
);

export default AdminLayout;
