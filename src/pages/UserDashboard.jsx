import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUserDataContext } from '../contexts/UserDataContext';

const UserDashboard = () => {
  const { user, userData } = useUserDataContext();

  const getWeekData = (startDate) => {
    const week = [];
    const today = new Date(startDate);
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // Start week on Monday

    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startOfWeek);
        currentDate.setDate(startOfWeek.getDate() + i);
        week.push(currentDate);
    }
    return week;
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  };

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [week, setWeek] = useState(getWeekData(new Date()));

  useEffect(() => {
    setWeek(getWeekData(selectedDate));
  }, [selectedDate]);

  const userName = user?.displayName || user?.email?.split('@')[0] || 'Guest';
  const avatarUrl = user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=f1f5f9&color=334155`;

  // This structure assumes routine is stored in userData.routine
  // with keys like 'AM' or 'PM' and contains a products array.
  const getRoutineForSelectedDate = () => {
    if (!userData || !userData.routine) return [];

    const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' }); // e.g., "Monday"
    const routineForDay = userData.routine[dayOfWeek];

    if (!routineForDay) return [];

    // Combine AM and PM products or just use what's available
    const products = [];
    if (routineForDay.AM) products.push(...routineForDay.AM.map(p => ({ ...p, time: 'AM' })));
    if (routineForDay.PM) products.push(...routineForDay.PM.map(p => ({ ...p, time: 'PM' })));
    
    return products;
  };

  const selectedDateRoutine = getRoutineForSelectedDate();

  const forYou = [
    {
      title: '5 advices for your skincare routine',
      duration: '3 min',
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=500&h=500&fit=crop'
    },
    {
      title: 'The best ingredients for your skin type',
      duration: '5 min',
      image: 'https://images.unsplash.com/photo-1552664730-d3077884b2de?w=500&h=500&fit=crop'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Hello, {userName}</h1>
              <p className="text-gray-500">Let's take care of your skin!</p>
            </div>
            <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-500">2648 points</span>
                <Link to="/profile">
                    <img src={avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full" />
                </Link>
            </div>
          </div>

          {/* Daily Routine */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Daily Routine</h2>
            </div>
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {week.map((date, index) => (
                <div 
                    key={index} 
                    onClick={() => setSelectedDate(date)}
                    className={`flex-shrink-0 w-20 text-center p-2 rounded-lg cursor-pointer ${formatDate(selectedDate) === formatDate(date) ? 'bg-indigo-600 text-white' : 'bg-white'}`}>
                  <p className="text-sm font-medium">{date.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                  <p className="text-lg font-bold">{date.getDate()}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Products for Selected Date */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
                Your Routine for: {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
            </h3>
            <div className="grid grid-cols-1 gap-4">
                {selectedDateRoutine.length > 0 ? (
                    selectedDateRoutine.map((product, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                                <img src={product.image || 'https://placehold.co/100x100/f1f5f9/334155?text=Product'} alt={product.name} className="w-16 h-16 object-contain" />
                            </div>
                            <div>
                                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${product.time === 'AM' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                                    {product.time}
                                </span>
                                <p className="font-bold text-gray-900 mt-1">{product.name}</p>
                                {product.step && <p className="text-gray-500 text-sm">Step {product.step}</p>}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                        <p className="text-gray-500">You have no products scheduled for this day.</p>
                        <Link to="/skincare-routine-input" className="mt-2 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500">
                            Build Your Routine
                        </Link>
                    </div>
                )}
            </div>
          </div>

          {/* For You */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Discover More</h2>
              <Link to="/ingredient-education-hub" className="text-sm font-medium text-indigo-600">View more</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {forYou.map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-32 object-cover" />
                    <div className="p-4">
                        <p className="font-bold text-gray-900">{item.title}</p>
                        <p className="text-gray-500 text-sm mb-1">{item.duration}</p>
                    </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
