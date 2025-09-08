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

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

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
    <div className={`bg-card border border-border rounded-clinical p-4 sm:p-6 shadow-clinical ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6">
        <h3 className="font-heading font-heading-semibold text-base sm:text-lg text-card-foreground mb-2 sm:mb-0">
          Routine Adherence
        </h3>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Button variant="outline" size="icon-sm" onClick={handlePrevMonth} iconName="ChevronLeft" iconSize={14} />
          <span className="font-body font-body-medium text-sm text-foreground w-28 text-center">
            {monthNames?.[month]} {year}
          </span>
          <Button variant="outline" size="icon-sm" onClick={handleNextMonth} iconName="ChevronRight" iconSize={14} />
        </div>
      </div>
      {/* Calendar Grid */}
      <div className="mb-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames?.map((day, index) => (
            <div key={index} className="text-center py-1">
              <span className="font-caption font-caption-normal text-xs text-muted-foreground uppercase">
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
                className={`aspect-square flex items-center justify-center rounded-full text-xs font-data font-data-normal transition-clinical relative ${
                  isSelected
                    ? 'ring-2 ring-primary ring-offset-1' :'hover:ring-1 hover:ring-border'
                } ${getAdherenceColor(adherenceLevel)}`}
              >
                <span className={`${
                  adherenceLevel === 'none' ? 'text-muted-foreground' : 'text-white'
                }`}>
                  {date}
                </span>
                {isToday && (
                  <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mb-4">
          <div className="flex items-center space-x-1.5">
            <div className="w-2.5 h-2.5 bg-muted rounded-full" />
            <span className="font-caption font-caption-normal text-xs text-muted-foreground">No data</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-2.5 h-2.5 bg-destructive/60 rounded-full" />
            <span className="font-caption font-caption-normal text-xs text-muted-foreground">&lt;50%</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-2.5 h-2.5 bg-warning rounded-full" />
            <span className="font-caption font-caption-normal text-xs text-muted-foreground">50-69%</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-2.5 h-2.5 bg-accent rounded-full" />
            <span className="font-caption font-caption-normal text-xs text-muted-foreground">70-89%</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-2.5 h-2.5 bg-success rounded-full" />
            <span className="font-caption font-caption-normal text-xs text-muted-foreground">90%+</span>
          </div>
      </div>
      {/* Selected Date Details */}
      {selectedDetails && (
        <div className="bg-muted rounded-clinical p-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-body font-body-medium text-sm text-foreground">
              {monthNames?.[month]} {selectedDate}, {year}
            </h4>
            <span className="font-data font-data-normal text-sm text-primary">
              {selectedDetails?.completion}% Complete
            </span>
          </div>
          
          <div className="space-y-1.5">
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
