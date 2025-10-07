import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';
import Icon from '../AppIcon';

const Select = ({ 
  label, 
  options, 
  value, 
  onChange, 
  placeholder, 
  required, 
  description, 
  className 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectRef]);

  const handleSelect = (newValue) => {
    onChange(newValue);
    setIsOpen(false);
  }

  return (
    <div className={cn("w-full", className)} ref={selectRef}>
      {label && (
        <label className="block font-body font-body-medium text-sm text-foreground mb-2">
          {label}{required && <span className="text-destructive">*</span>}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-slate bg-transparent pl-3 pr-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-left",
            { "text-muted-foreground": !selectedOption }
          )}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
          <Icon name="ChevronDown" size={16} className={cn("transform transition-transform duration-200", { "rotate-180": isOpen })} />
        </button>

        {isOpen && (
          <div 
            className="absolute z-10 mt-1 w-full bg-popover rounded-md shadow-lg border border-input max-h-60 overflow-auto focus:outline-none transition-all duration-200 ease-in-out transform opacity-100 scale-100"
            role="listbox"
          >
            <ul className="py-1">
              {options.map((option) => (
                <li
                  key={option.value}
                  className={cn(
                    "cursor-pointer select-none relative py-2 pl-3 pr-9 text-sm text-popover-foreground hover:bg-secondary",
                    { "bg-secondary": value === option.value }
                  )}
                  onClick={() => handleSelect(option.value)}
                  role="option"
                  aria-selected={value === option.value}
                >
                  <span className={cn("font-normal block truncate", { "font-semibold": value === option.value })}>
                    {option.label}
                  </span>
                  {value === option.value && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-primary">
                      <Icon name="Check" size={16} />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {description && (
        <p className="font-caption font-caption-normal text-xs text-muted-foreground mt-2">{description}</p>
      )}
    </div>
  );
};

export default Select;
