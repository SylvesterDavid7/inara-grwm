import React, { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import { Sling as Hamburger } from 'hamburger-react';
import useClickOutside from '../../utils/useClickOutside';
import AuthDetails from '../AuthDetails';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const location = useLocation();
  const menuRefs = useRef({});

  const navigationItems = [
    {
      label: 'Analyze',
      items: [
        { label: 'Routine Input', path: '/skincare-routine-input', icon: 'Plus' },
        { label: 'Skin Assessment', path: '/skin-assessment-questionnaire', icon: 'ClipboardList' },
        { label: 'Derma Scan', path: '/derma-scan', icon: 'Scan' }
      ]
    },
    {
      label: 'Results',
      items: [
        { label: 'Scorecard', path: '/skincare-scorecard-results', icon: 'LayoutDashboard' },
        { label: 'Recommendations', path: '/product-recommendations', icon: 'Star' }
      ]
    },
    {
      label: 'Track',
      items: [
        { label: 'Progress', path: '/progress-tracking-dashboard', icon: 'TrendingUp' }
      ]
    },
    {
      label: 'Learn',
      items: [
        { label: 'Ingredients', path: '/ingredient-education-hub', icon: 'BookOpen' },
        { label: 'Skincare 101', path: '/skincare-101', icon: 'Grid3X3' },
        { label: 'About Us', path: '/about', icon: 'Info' }
      ]
    }
  ];

  const handleMenuEnter = (label) => {
    setActiveMenu(label);
  };

  const handleMenuLeave = () => {
    setActiveMenu(null);
  };

  const isActiveSection = (section) => {
    return section?.items?.some(item => location?.pathname === item?.path);
  };

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const setMenuRef = (label) => (el) => {
    menuRefs.current[label] = el;
  };

  useClickOutside(menuRefs, () => setActiveMenu(null), activeMenu !== null);

  return (
    <>
      <header className="h-16 flex items-center w-full border-b border-slate-100 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 fixed top-0 z-40 shadow-sm">
        <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link to="/home" className="flex items-center space-x-2 md:space-x-3 hover:opacity-80 transition-clinical">
                  <img
                  src="/Inara_Logo.svg"
                  alt="Inara Logo"
                  className="h-6 md:h-8 object-contain"
                  onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/120x40/f1f5f9/334155?text=Logo'; }}
                  />
                  <span className="text-gray-800 text-base md:text-lg">X</span>
                  <div>
                  <h1 className="text-base md:text-lg font-sans font-extrabold">GRWM</h1>
                  <p className="text-[9px] md:text-[10px] -mt-1 md:-mt-1.5 tracking-wide text-slate-500">Get Results With Metrics</p>
                  </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
                {navigationItems?.map((section) => (
                  <div 
                    key={section?.label} 
                    className="relative group"
                    ref={setMenuRef(section.label)}
                    onMouseEnter={() => handleMenuEnter(section.label)}
                    onMouseLeave={handleMenuLeave}
                  >
                    <button
                      className={`flex items-center space-x-1 px-3 py-2 rounded-clinical-sm font-body font-body-medium text-sm transition-clinical ${
                        isActiveSection(section)
                          ? 'text-accent bg-secondary' : 'text-foreground hover:text-accent hover:bg-secondary/50'
                      }`}
                    >
                      <span>{section?.label}</span>
                      <Icon name="ChevronDown" size={16} className={`transition-transform ${activeMenu === section.label ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <div className={`absolute top-full left-0 mt-1 w-48 bg-popover border border-border rounded-clinical shadow-clinical-lg transition-all duration-300 z-[999] ${activeMenu === section.label ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                      <div className="py-2">
                        {section?.items?.map((item) => (
                          <Link
                            key={item?.path}
                            to={item?.path}
                            className={`flex items-center space-x-3 px-4 py-2 text-sm transition-clinical ${
                              isActivePath(item?.path)
                                ? 'text-accent bg-secondary font-body-medium' : 'text-popover-foreground hover:text-accent hover:bg-secondary/50'
                            }`}
                          >
                            <Icon name={item?.icon} size={16} />
                            <span>{item?.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                 <AuthDetails />
              </nav>

              {/* Mobile Menu Button */}
              <div className="md:hidden text-foreground">
                <Hamburger toggled={isMobileMenuOpen} toggle={toggleMobileMenu} size={24} />
              </div>
            </div>
        </div>
      </header>
      
      {/* Mobile Navigation - Side Drawer */}
      <div className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeMobileMenu} />

        {/* Menu Panel */}
        <div
          className={`absolute top-0 right-0 bottom-0 h-full w-full max-w-sm bg-background flex flex-col shadow-lg transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Menu Header */}
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 border-b border-border flex-shrink-0">
            <Link to="/home" onClick={closeMobileMenu} className="flex items-center space-x-2">
              <img src="/Inara_Logo.svg" alt="Inara Logo" className="h-6 object-contain" />
              <span className="text-gray-800 text-base">X</span>
              <div>
                <h1 className="text-base font-sans font-extrabold">GRWM</h1>
                <p className="text-[9px] -mt-1 tracking-wide text-slate-500">Get Results With Metrics</p>
              </div>
            </Link>
            <div className="text-foreground">
                <Hamburger toggled={isMobileMenuOpen} toggle={toggleMobileMenu} size={24} />
            </div>
          </div>
  
          {/* Menu Content */}
          <nav className="flex-1 overflow-y-auto p-4" onClick={closeMobileMenu}>
            <div className="space-y-4">
              {navigationItems.map((section) => (
                <div key={section.label}>
                  <h2 className="font-heading font-heading-medium text-sm text-muted-foreground uppercase tracking-wider px-3 mb-2">
                    {section.label}
                  </h2>
                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`group flex items-center space-x-3 p-3 rounded-clinical-md text-base transition-colors ${
                          isActivePath(item.path)
                            ? 'bg-secondary'
                            : 'hover:bg-secondary/60'
                        }`}
                      >
                        <Icon
                          name={item.icon}
                          size={20}
                          className={`transition-colors ${
                            isActivePath(item.path)
                              ? 'text-accent'
                              : 'text-muted-foreground group-hover:text-accent'
                          }`}
                        />
                        <span
                          className={`font-body font-body-medium transition-colors ${
                            isActivePath(item.path)
                              ? 'text-accent'
                              : 'text-foreground group-hover:text-accent'
                          }`}
                        >
                          {item.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
             <div className="mt-4">
                <AuthDetails layout="vertical" />
              </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;
