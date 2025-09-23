import React from 'react';
import { Link } from 'react-router-dom';
import { useUserDataContext } from '../contexts/UserDataContext';

const UserDashboard = () => {
  const { userData } = useUserDataContext();

  // Placeholder data for routine and recommendations
  const dailyRoutine = [
    { day: 'Mon', date: 5, products: [
      { name: 'Mineral UV Filters SPF', step: 2, image: 'https://placehold.co/100x100/f1f5f9/334155?text=Product' },
      { name: '100% Organic Fruit Oil', step: 1, image: 'https://placehold.co/100x100/f1f5f9/334155?text=Product' },
      { name: 'Niacinamide 10% + Zinc 1%', step: 3, image: 'https://placehold.co/100x100/f1f5f9/334155?text=Product' },
    ]},
    { day: 'Tue', date: 6, products: [
        { name: 'Mineral UV Filters SPF', step: 2, image: 'https://placehold.co/100x100/f1f5f9/334155?text=Product' },
        { name: '100% Organic Fruit Oil', step: 1, image: 'https://placehold.co/100x100/f1f5f9/334155?text=Product' },
        { name: 'Niacinamide 10% + Zinc 1%', step: 3, image: 'https://placehold.co/100x100/f1f5f9/334155?text=Product' },
      ]},
    { day: 'Wed', date: 7, products: [] },
    { day: 'Thu', date: 8, products: [] },
    { day: 'Fri', date: 9, products: [] },
  ];

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
    {
      title: 'How to properly layer your skincare products',
      duration: '4 min',
      image: 'https://images.unsplash.com/photo-1600171542252-9d7c793551b3?w=500&h=500&fit=crop'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Hello, {userData ? userData.email.split('@')[0] : 'Guest'}</h1>
              <p className="text-gray-500">Let's take care of your skin!</p>
            </div>
            <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-500">2648 points</span>
                <img src="https://placehold.co/40x40/f1f5f9/334155?text=Avatar" alt="Avatar" className="w-10 h-10 rounded-full" />
            </div>
          </div>

          {/* Daily Routine */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Daily Routine</h2>
                <div className="w-24 h-4 bg-gray-200 rounded-full">
                    <div className="w-[70%] h-full bg-indigo-600 rounded-full"></div>
                </div>
            </div>
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {dailyRoutine.map((item, index) => (
                <div key={index} className={`flex-shrink-0 w-20 text-center p-2 rounded-lg ${index === 1 ? 'bg-indigo-600 text-white' : 'bg-white'}`}>
                  <p className="text-sm font-medium">{item.day}</p>
                  <p className="text-lg font-bold">{item.date}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Products */}
          <div className="grid grid-cols-1 gap-4 mb-8">
            {dailyRoutine[1].products.map((product, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                        <img src={product.image} alt={product.name} className="w-16 h-16 object-contain" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Step {product.step}</p>
                        <p className="font-bold text-gray-900">{product.name}</p>
                    </div>
                </div>
            ))}
          </div>

          {/* For You */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">For you</h2>
              <Link to="#" className="text-sm font-medium text-indigo-600">View more</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {forYou.map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-32 object-cover" />
                    <div className="p-4">
                        <p className="text-gray-500 text-sm mb-1">{item.duration}</p>
                        <p className="font-bold text-gray-900">{item.title}</p>
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
