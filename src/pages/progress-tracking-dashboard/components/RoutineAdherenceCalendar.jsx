import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RoutineAdherenceCalendar = ({ adherenceData, currentMonth, onMonthChange, className = "" }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0)?.getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1)?.getDay();
  };

  const getAdherenceLevel = (date) => {
    const dateKey = `${currentMonth?.getFullYear()}-${String(currentMonth?.getMonth() + 1)?.padStart(2, '0')}-${String(date)?.padStart(2, '0')}`;
    const data = adherenceData?.[dateKey];
    if (!data) return 'none';
    
    if (data?.completion >= 90) return 'excellent';
    if (data?.completion >= 70) return 'good';
    if (data?.completion >= 50) return 'fair';
    if (data?.completion > 0) return 'poor';
    return 'none';
  };

  const getAdherenceColor = (level) => {
    switch (level) {
      case 'excellent': return 'bg-success';
      case 'good': return 'bg-accent';
      case 'fair': return 'bg-warning';
      case 'poor': return 'bg-destructive/60';
      default: return 'bg-muted';
    }
  };

  const getAdherenceDetails = (date) => {
    const dateKey = `${currentMonth?.getFullYear()}-${String(currentMonth?.getMonth() + 1)?.padStart(2, '0')}-${String(date)?.padStart(2, '0')}`;
    return adherenceData?.[dateKey];
  };

  const year = currentMonth?.getFullYear();
  const month = currentMonth?.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handlePrevMonth = () => {
    const newMonth = new Date(year, month - 1, 1);
    onMonthChange(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = new Date(year, month + 1, 1);
    onMonthChange(newMonth);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const selectedDetails = selectedDate ? getAdherenceDetails(selectedDate) : null;

  return (
    <div className={`bg-card border border-border rounded-clinical p-6 shadow-clinical ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading font-heading-semibold text-lg text-card-foreground">
          Routine Adherence
        </h3>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handlePrevMonth} iconName="ChevronLeft" iconSize={16}>
            <span className="sr-only">Previous month</span>
          </Button>
          <span className="font-body font-body-medium text-sm text-foreground px-4">
            {monthNames?.[month]} {year}
          </span>
          <Button variant="outline" size="sm" onClick={handleNextMonth} iconName="ChevronRight" iconSize={16}>
            <span className="sr-only">Next month</span>
          </Button>
        </div>
      </div>
      {/* Calendar Grid */}
      <div className="mb-6">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames?.map((day) => (
            <div key={day} className="text-center py-2">
              <span className="font-caption font-caption-normal text-xs text-muted-foreground uppercase tracking-wide">
                {day}
              </span>
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDay }, (_, index) => (
            <div key={`empty-${index}`} className="aspect-square" />
          ))}

          {/* Days of the month */}
          {Array.from({ length: daysInMonth }, (_, index) => {
            const date = index + 1;
            const adherenceLevel = getAdherenceLevel(date);
            const isSelected = selectedDate === date;
            const isToday = new Date()?.toDateString() === new Date(year, month, date)?.toDateString();

            return (
              <button
                key={date}
                onClick={() => handleDateClick(date)}
                className={`aspect-square flex items-center justify-center rounded-clinical text-sm font-data font-data-normal transition-clinical relative ${
                  isSelected
                    ? 'ring-2 ring-primary ring-offset-2' :'hover:ring-1 hover:ring-border'
                } ${getAdherenceColor(adherenceLevel)}`}
              >
                <span className={`${
                  adherenceLevel === 'none' ? 'text-muted-foreground' : 'text-white'
                }`}>
                  {date}
                </span>
                {isToday && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
      {/* Legend */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-muted rounded-clinical" />
            <span className="font-caption font-caption-normal text-xs text-muted-foreground">No data</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-destructive/60 rounded-clinical" />
            <span className="font-caption font-caption-normal text-xs text-muted-foreground">&lt;50%</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning rounded-clinical" />
            <span className="font-caption font-caption-normal text-xs text-muted-foreground">50-69%</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-accent rounded-clinical" />
            <span className="font-caption font-caption-normal text-xs text-muted-foreground">70-89%</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-clinical" />
            <span className="font-caption font-caption-normal text-xs text-muted-foreground">90%+</span>
          </div>
        </div>
      </div>
      {/* Selected Date Details */}
      {selectedDetails && (
        <div className="bg-muted rounded-clinical p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-body font-body-medium text-sm text-foreground">
              {monthNames?.[month]} {selectedDate}, {year}
            </h4>
            <span className="font-data font-data-normal text-sm text-primary">
              {selectedDetails?.completion}% Complete
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-caption font-caption-normal text-xs text-muted-foreground">Morning Routine</span>
              <Icon 
                name={selectedDetails?.morning ? "Check" : "X"} 
                size={14} 
                className={selectedDetails?.morning ? "text-success" : "text-destructive"} 
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-caption font-caption-normal text-xs text-muted-foreground">Evening Routine</span>
              <Icon 
                name={selectedDetails?.evening ? "Check" : "X"} 
                size={14} 
                className={selectedDetails?.evening ? "text-success" : "text-destructive"} 
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-caption font-caption-normal text-xs text-muted-foreground">Products Used</span>
              <span className="font-data font-data-normal text-xs text-foreground">
                {selectedDetails?.productsUsed}/{selectedDetails?.totalProducts}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutineAdherenceCalendar;