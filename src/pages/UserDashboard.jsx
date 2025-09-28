import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useUserDataContext } from '../contexts/UserDataContext.jsx';
import { Bell, Clock, CheckCircle, XCircle } from 'lucide-react';

const UserDashboard = () => {
  const { user, userData, updateUserData, loading } = useUserDataContext();
  const [reminders, setReminders] = useState({ AM: false, PM: false });
  const [progress, setProgress] = useState({});
  const weekContainerRef = useRef(null);

  useEffect(() => {
    if (userData) {
      setReminders(userData.reminders || { AM: false, PM: false });
      setProgress(userData.progress || {});
    }
  }, [userData]);

  const handleReminderToggle = async (time) => {
    const newReminders = { ...reminders, [time]: !reminders[time] };
    setReminders(newReminders);
    await updateUserData({ reminders: newReminders });

    if (newReminders[time] && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  };

  const handleProgressUpdate = async (productName, time, status) => {
    const dateKey = formatDate(selectedDate);
    const newProgress = { ...progress };
    if (!newProgress[dateKey]) newProgress[dateKey] = {};
    if (!newProgress[dateKey][time]) newProgress[dateKey][time] = {};

    if (newProgress[dateKey][time][productName] === status) {
      delete newProgress[dateKey][time][productName];
    } else {
      newProgress[dateKey][time][productName] = status;
    }

    setProgress(newProgress);
    await updateUserData({ progress: newProgress });
  };

  const getWeekData = (startDate) => {
    const week = [];
    const dayOfWeek = new Date(startDate).getDay();
    const startOfWeek = new Date(startDate);
    startOfWeek.setDate(startDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
      week.push(currentDate);
    }
    return week;
  };

  const formatDate = (date) => date.toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [week, setWeek] = useState(() => getWeekData(new Date()));

  useEffect(() => {
    setWeek(getWeekData(selectedDate));
  }, [selectedDate]);

  useEffect(() => {
    if (weekContainerRef.current) {
      const selectedDateIndex = week.findIndex(date => formatDate(date) === formatDate(selectedDate));
      if (selectedDateIndex > -1) {
        const selectedEl = weekContainerRef.current.children[selectedDateIndex];
        if (selectedEl) {
            selectedEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
      }
    }
  }, [selectedDate, week]);

  if (loading || !user || !userData) {
    return (
        <div className="w-full h-screen flex justify-center items-center">
            <p className="font-heading text-lg text-gray-600">Loading dashboard...</p>
        </div>
    );
  }
  
  const userName = user.displayName || user.email?.split('@')[0] || 'Guest';
  const avatarUrl = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=f1f5f9&color=334155`;

  const getRoutineForSelectedDate = () => {
    if (!userData.routine) return { AM: [], PM: [] };
    const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
    const routineForDay = userData.routine[dayOfWeek];
    return {
      AM: routineForDay?.AM?.sort((a, b) => a.step - b.step) || [],
      PM: routineForDay?.PM?.sort((a, b) => a.step - b.step) || [],
    };
  };

  const { AM: morningRoutine, PM: eveningRoutine } = getRoutineForSelectedDate();
  const assessmentCompleted = userData.assessmentCompleted;

  const renderRoutineSection = (title, time, routine) => {
    const dateKey = formatDate(selectedDate);
    const dayProgress = progress[dateKey]?.[time] || {};

    return (
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="flex items-baseline mb-2 sm:mb-0">
                <h3 className="font-heading text-lg font-bold text-gray-800 mr-2">{title}</h3>
                <span className={`font-heading px-2 py-0.5 text-xs font-semibold rounded-full ${time === 'AM' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>{time}</span>
            </div>
            <div className="flex items-center justify-between w-full sm:w-auto">
                <div className="flex items-center space-x-2">
                    <Clock size={18} className='text-gray-500' />
                    <span className="font-heading text-sm text-gray-500">{time === 'AM' ? '8:00-9:00 AM' : '9:00-10:00 PM'}</span>
                </div>
                <button onClick={() => handleReminderToggle(time)} className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${reminders[time] ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}>
                    <Bell size={22} />
                    <span className="hidden sm:inline text-sm font-medium">Set Reminder</span>
                </button>
            </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {routine.length > 0 ? routine.map((product, index) => {
              const status = dayProgress[product.name];
              return (
                <div key={index} className={`bg-white p-4 rounded-lg shadow-sm flex items-start space-x-4 transition-opacity ${status ? 'opacity-50' : 'opacity-100'}`}>
                  <div className="font-heading text-2xl font-bold text-gray-300 w-12 text-center pt-1">{index + 1}</div>
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                    <img src={product.image || 'https://placehold.co/100x100/f1f5f9/334155?text=Product'} alt={product.name} className="w-16 h-16 object-contain" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-bold text-gray-900">{product.name}</p>
                    <p className="text-gray-500 text-sm">{product.category}</p>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <button onClick={() => handleProgressUpdate(product.name, time, 'completed')} className={`p-1 rounded-full ${status === 'completed' ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:text-green-500'}`}><CheckCircle size={20} /></button>
                    <button onClick={() => handleProgressUpdate(product.name, time, 'skipped')} className={`p-1 rounded-full ${status === 'skipped' ? 'bg-yellow-100 text-yellow-600' : 'text-gray-400 hover:text-yellow-500'}`}><XCircle size={20} /></button>
                  </div>
                </div>
              );
            }) : (
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <p className="font-heading text-gray-500">No products for this time.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-3xl font-bold text-gray-900">Hello, {userName}</h1>
              <p className="font-heading text-gray-500">Let's take care of your skin!</p>
            </div>
            <Link to="/profile">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                </div>
            </Link>
          </div>

          {assessmentCompleted ? (
            <>
              <div className="mb-8">
                <div ref={weekContainerRef} className="flex space-x-4 overflow-x-auto pb-4">
                  {week.map((date, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedDate(date)}
                      className={`flex-shrink-0 w-20 text-center p-2 rounded-lg cursor-pointer ${formatDate(selectedDate) === formatDate(date) ? 'bg-green-600 text-white' : 'bg-white'}`}>
                      <p className="font-heading text-sm font-medium">{date.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                      <p className="font-heading text-lg font-bold">{date.getDate()}</p>
                    </div>
                  ))}
                </div>
              </div>
              {renderRoutineSection('Morning Routine', 'AM', morningRoutine)}
              {renderRoutineSection('Evening Routine', 'PM', eveningRoutine)}
              <div className="mt-8">
                <Link to="/progress-tracking-dashboard" className="font-heading w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">View My Progress</Link>
              </div>
            </>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <h2 className="font-heading text-xl font-bold text-gray-900 mb-2">Welcome to your personalized dashboard!</h2>
              <p className="font-heading text-gray-600 mb-4">To get started, please take our skin assessment. This will help us create a tailored skincare routine just for you.</p>
              <Link to="/skin-assessment-questionnaire" className="font-heading inline-block bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">Take Assessment</Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
