import React, { useState } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const TasksSection = ({ className }) => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Complete your profile information', completed: true, assignedBy: 'Admin' },
    { id: 2, title: 'Take the initial skin assessment quiz', completed: true, assignedBy: 'Founder' },
    { id: 3, title: 'Add your first skincare routine', completed: false, assignedBy: 'Admin' },
    { id: 4, title: 'Track your routine for 3 consecutive days', completed: false, assignedBy: 'System' },
    { id: 5, title: 'Read the article on "Understanding Acids"', completed: false, assignedBy: 'Founder' },
  ]);

  const handleToggleComplete = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className={`bg-card border border-border rounded-clinical p-4 sm:p-6 shadow-clinical ${className}`}>
      {/* Header and Progress */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-heading font-heading-semibold text-lg text-card-foreground">
            Your Tasks
          </h3>
          <span className="font-data font-data-medium text-sm text-success">
            {progressPercentage}%
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-success h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
         <p className="font-caption font-caption-normal text-xs text-muted-foreground mt-1.5">{`${completedTasks} of ${totalTasks} tasks completed`}</p>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {tasks.slice(0, 3).map((task) => (
          <div key={task.id} className="flex items-start">
            <button
              onClick={() => handleToggleComplete(task.id)}
              className={`w-5 h-5 mt-0.5 rounded-full flex-shrink-0 flex items-center justify-center border-2 transition-all
                ${task.completed
                  ? 'bg-success border-success'
                  : 'border-muted-foreground/50 hover:border-primary'
                }`}
            >
              {task.completed && <Icon name="Check" size={12} className="text-white" />}
            </button>
            <div className="ml-3">
              <p className={`font-body font-body-medium text-sm leading-tight ${task.completed ? 'text-muted-foreground line-through' : 'text-card-foreground'}`}>
                {task.title}
              </p>
              <p className="font-caption font-caption-normal text-xs text-muted-foreground mt-0.5">
                Assigned by {task.assignedBy}
              </p>
            </div>
          </div>
        ))}
      </div>

       {/* Footer */}
      <div className="mt-6 flex items-center justify-between">
         <div className="flex -space-x-2 overflow-hidden">
            <img className="inline-block h-6 w-6 rounded-full ring-2 ring-card" src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""/>
            <img className="inline-block h-6 w-6 rounded-full ring-2 ring-card" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""/>
            <img className="inline-block h-6 w-6 rounded-full ring-2 ring-card" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80" alt=""/>
        </div>
        <Button variant="ghost" size="sm" className="text-primary">
            View All
        </Button>
      </div>
    </div>
  );
};

export default TasksSection;
