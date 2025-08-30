import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    {
      label: 'Analyze',
      items: [
        { label: 'Routine Input', path: '/skincare-routine-input', icon: 'Plus' },
        { label: 'Skin Assessment', path: '/skin-assessment-questionnaire', icon: 'ClipboardList' }
      ]
    },
    {
      label: 'Results',
      items: [
        { label: 'Scorecard', path: '/skincare-scorecard-results', icon: 'BarChart3' },
        { label: 'Recommendations', path: '/product-recommendations', icon: 'Star' }
      ]
    },
    {
      label: 'Track',
      items: [
        { label: 'Dashboard', path: '/progress-tracking-dashboard', icon: 'TrendingUp' }
      ]
    },
    {
      label: 'Learn',
      items: [
        { label: 'Ingredients', path: '/ingredient-education-hub', icon: 'BookOpen' }
      ]
    }
  ];

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

  return (
    <header className="fixed top-0 left-0 right-0 z-navigation bg-background border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-clinical">
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-clinical">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-primary-foreground"
            >
              <path
                d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5V9M15 11.5C15.8 11.5 16.5 12.2 16.5 13S15.8 14.5 15 14.5 13.5 13.8 13.5 13 14.2 11.5 15 11.5M9 13.5C9.8 13.5 10.5 14.2 10.5 15S9.8 16.5 9 16.5 7.5 15.8 7.5 15 8.2 13.5 9 13.5M12 18C12.8 18 13.5 18.7 13.5 19.5S12.8 21 12 21 10.5 20.3 10.5 19.5 11.2 18 12 18Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-heading-semibold text-lg text-foreground">
              SkinScore
            </span>
            <span className="font-caption font-caption-normal text-xs text-muted-foreground -mt-1">
              Analyzer
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navigationItems?.map((section) => (
            <div key={section?.label} className="relative group">
              <button
                className={`flex items-center space-x-1 px-3 py-2 rounded-clinical-sm font-body font-body-medium text-sm transition-clinical ${
                  isActiveSection(section)
                    ? 'text-primary bg-secondary' :'text-foreground hover:text-primary hover:bg-secondary/50'
                }`}
              >
                <span>{section?.label}</span>
                <Icon name="ChevronDown" size={16} className="transition-transform group-hover:rotate-180" />
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 mt-1 w-48 bg-popover border border-border rounded-clinical shadow-clinical-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-clinical z-50">
                <div className="py-2">
                  {section?.items?.map((item) => (
                    <Link
                      key={item?.path}
                      to={item?.path}
                      className={`flex items-center space-x-3 px-4 py-2 text-sm transition-clinical ${
                        isActivePath(item?.path)
                          ? 'text-primary bg-secondary font-body-medium' :'text-popover-foreground hover:text-primary hover:bg-secondary/50'
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
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleMobileMenu}
          iconName={isMobileMenuOpen ? "X" : "Menu"}
          iconSize={20}
        >
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <nav className="px-6 py-4 space-y-4">
            {navigationItems?.map((section) => (
              <div key={section?.label} className="space-y-2">
                <div className="font-heading font-heading-medium text-sm text-muted-foreground uppercase tracking-wide">
                  {section?.label}
                </div>
                <div className="space-y-1 pl-4">
                  {section?.items?.map((item) => (
                    <Link
                      key={item?.path}
                      to={item?.path}
                      onClick={closeMobileMenu}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-clinical-sm text-sm transition-clinical ${
                        isActivePath(item?.path)
                          ? 'text-primary bg-secondary font-body-medium' :'text-foreground hover:text-primary hover:bg-secondary/50'
                      }`}
                    >
                      <Icon name={item?.icon} size={16} />
                      <span>{item?.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;