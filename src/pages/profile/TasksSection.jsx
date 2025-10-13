import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import { useUserDataContext } from '../../contexts/UserDataContext';

const TaskItem = ({ title, completed, path }) => (
    <div className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 ${completed ? 'bg-green-50 border-green-200' : 'bg-card border-border hover:bg-muted'}`}>
        <div className="flex items-center">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-4 ${completed ? 'bg-green-500' : 'border-2 border-gray-400'}`}>
                {completed && <Icon name="Check" size={16} className="text-white" />}
            </div>
            <span className={`font-medium ${completed ? 'text-gray-500 line-through' : 'text-foreground'}`}>{title}</span>
        </div>
        {!completed && path && (
            <Link to={path} className="text-sm font-semibold text-primary hover:underline">
                Go
            </Link>
        )}
    </div>
);

const TasksSection = ({ className }) => {
    const { userData } = useUserDataContext();

    const tasks = [
        {
            id: 1,
            title: 'Update Your User Details',
            path: '/user-info',
            completed: !!(userData?.address && userData?.phone),
        },
        {
            id: 2,
            title: 'Analyze Your Skincare Routine',
            path: '/skincare-routine-input',
            completed: !!(userData?.routine && Object.values(userData.routine).some(day => day.AM?.length > 0 || day.PM?.length > 0)),
        },
        {
            id: 3,
            title: 'Complete the Skin Assessment',
            path: '/skin-assessment-questionnaire',
            completed: !!userData?.assessmentCompleted,
        },
        {
            id: 4,
            title: 'Perform a Derma Scan',
            path: '/derma-scan',
            completed: !!userData?.dermaScanCompleted,
        },
        {
            id: 5,
            title: 'Log Your First Progress',
            path: '/progress-tracking-dashboard',
            completed: !!(userData?.progressHistory && userData.progressHistory.length > 0),
        },
        {
            id: 6,
            title: 'Explore 5+ Ingredients',
            path: '/ingredient-education-hub',
            completed: !!(userData?.viewedIngredients && userData.viewedIngredients.length >= 5),
        }
    ];

    return (
        <div className={`bg-card rounded-2xl shadow-lg p-6 ${className}`}>
            <h3 className="font-heading text-xl font-bold text-foreground mb-4">Your Tasks</h3>
            <div className="space-y-3">
                {tasks.map(task => (
                    <TaskItem key={task.id} {...task} />
                ))}
            </div>
        </div>
    );
};

export default TasksSection;
