import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './ui/Header';
import Footer from './ui/Footer';

const Layout = () => {
  return (
    <div className="flex flex-col w-full min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
