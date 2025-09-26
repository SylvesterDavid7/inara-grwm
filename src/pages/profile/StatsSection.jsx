import React from 'react';
import Icon from '../../components/AppIcon';

const StatItem = ({ icon, label, value }) => {
  return (
    <div className="bg-gray-100/60 border border-gray-200/80 rounded-xl p-4 flex items-center space-x-4 hover:bg-gray-200/60 transition-colors">
      <div className="bg-white p-2 rounded-full shadow-sm">
        <Icon name={icon} size={20} className="text-green-600" />
      </div>
      <div>
        <p className="text-sm font-heading font-extrabold text-gray-500">{label}</p>
        <p className="text-xl font-heading font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

const StatsSection = ({ stats }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-lg font-bold text-gray-800">Key Stats</h3>
        <Icon name="Activity" size={24} className="text-green-600" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatItem icon="Award" label="Highest Score" value={stats.highestScore} />
        <StatItem icon="Zap" label="Win Streak" value={stats.winStreak} />
        <StatItem icon="HelpCircle" label="Quizzes Taken" value={stats.quizzesTaken} />
        <StatItem icon="CheckCircle" label="Correct Answers" value={stats.correctAnswers} />
      </div>
    </div>
  );
};

export default StatsSection;
