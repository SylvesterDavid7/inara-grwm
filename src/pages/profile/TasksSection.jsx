import React, { useState } from 'react';
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

const QuizItem = ({ title, path, completed }) => (
    <div className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 ${completed ? 'bg-green-50 border-green-200' : 'bg-card border-border hover:bg-muted'}`}>
        <div className="flex items-center">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-4 ${completed ? 'bg-green-500' : 'bg-primary/10'}`}>
                {completed ? <Icon name="Check" size={16} className="text-white" /> : <Icon name="HelpCircle" size={16} className="text-primary" />}
            </div>
            <span className={`font-medium ${completed ? 'text-gray-500 line-through' : 'text-foreground'}`}>{title}</span>
        </div>
        {!completed && (
            <Link to={path} className="text-sm font-semibold text-primary hover:underline">
                Start
            </Link>
        )}
    </div>
);

const TasksSection = ({ className }) => {
    const { userData } = useUserDataContext();
    const [activeTab, setActiveTab] = useState('tasks');

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
    
    const quizzes = [
        {
            id: 1,
            title: 'Skincare Basics Quiz',
            path: '/quizzes/skincare-basics',
            completed: userData?.completedQuizzes?.includes('skincare-basics'),
        },
        {
            id: 2,
            title: 'Ingredient Knowledge Quiz',
            path: '/quizzes/ingredient-knowledge',
            completed: userData?.completedQuizzes?.includes('ingredient-knowledge'),
        },
    ];

    return (
        <div className={`bg-card rounded-2xl shadow-lg ${className}`}>
             <div className="flex border-b border-border">
                <button
                    className={`flex-1 p-4 font-heading font-semibold text-center transition-colors ${activeTab === 'tasks' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:bg-muted'}`}
                    onClick={() => setActiveTab('tasks')}
                >
                    Your Tasks
                </button>
                <button
                    className={`flex-1 p-4 font-heading font-semibold text-center transition-colors ${activeTab === 'quizzes' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:bg-muted'}`}
                    onClick={() => setActiveTab('quizzes')}
                >
                    Quizzes
                </button>
            </div>
            <div className="p-6">
                {activeTab === 'tasks' && (
                    <div className="space-y-3">
                        {tasks.map(task => (
                            <TaskItem key={task.id} {...task} />
                        ))}
                    </div>
                )}
                {activeTab === 'quizzes' && (
                    <div className="space-y-3">
                        {quizzes.map(quiz => (
                            <QuizItem key={quiz.id} {...quiz} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TasksSection;
