import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useUserDataContext } from '../../../contexts/UserDataContext.jsx';
import GoalModal from './GoalModal'; 

const GoalProgressWidget = ({ goals, className = "" }) => {
  const { updateUserData, userData } = useUserDataContext();
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const handleAddGoal = () => {
    setEditingGoal(null);
    setModalOpen(true);
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setModalOpen(true);
  };

  const handleSaveGoal = async (goal) => {
    const newGoals = [...(userData.goals || [])];
    if (goal.id) {
      const index = newGoals.findIndex(g => g.id === goal.id);
      newGoals[index] = goal;
    } else {
      newGoals.push({ ...goal, id: Date.now() });
    }
    await updateUserData({ goals: newGoals });
  };

  const getProgressColor = (progress) => {
    if (progress >= 90) return 'bg-success';
    if (progress >= 70) return 'bg-accent';
    if (progress >= 50) return 'bg-warning';
    return 'bg-destructive/60';
  };
  
  const getProgressTextColor = (progress) => {
    if (progress >= 90) return 'text-success';
    if (progress >= 70) return 'text-accent';
    if (progress >= 50) return 'text-warning';
    return 'text-destructive';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle2';
      case 'on-track': return 'TrendingUp';
      case 'behind': return 'AlertTriangle';
      case 'at-risk': return 'AlertCircle';
      default: return 'Circle';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'on-track': return 'text-accent';
      case 'behind': return 'text-warning';
      case 'at-risk': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <>
      <div className={`bg-card border border-border rounded-clinical p-4 sm:p-6 shadow-clinical ${className}`}>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="font-heading font-heading-semibold text-lg text-card-foreground">
            Goal Progress
          </h3>
          <Button variant="outline" size="sm" iconName="Plus" iconSize={16} onClick={handleAddGoal}>
            Add Goal
          </Button>
        </div>
        <div className="space-y-4 sm:space-y-6">
          {goals?.map((goal) => (
            <div key={goal?.id} className="space-y-3 cursor-pointer" onClick={() => handleEditGoal(goal)}>
              {/* Goal Header */}
              <div className="flex flex-col sm:flex-row items-start justify-between">
                <div className="flex-1 mb-2 sm:mb-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <Icon 
                      name={getStatusIcon(goal?.status)} 
                      size={16} 
                      className={getStatusColor(goal?.status)} 
                    />
                    <h4 className="font-body font-body-medium text-sm text-card-foreground">
                      {goal?.title}
                    </h4>
                  </div>
                  <p className="font-caption font-caption-normal text-xs text-muted-foreground">
                    Target: {goal?.target} | Deadline: {goal?.deadline}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <div className={`font-data font-data-normal text-sm ${getProgressTextColor(goal?.progress)}`}>
                    {goal?.progress}%
                  </div>
                  <div className="font-caption font-caption-normal text-xs text-muted-foreground capitalize">
                    {goal?.status?.replace('-', ' ')}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-clinical-slow ${getProgressColor(goal?.progress)}`}
                  style={{ width: `${goal?.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        {/* Summary Stats */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex flex-wrap items-center justify-around gap-4 text-center">
            <div>
              <div className="font-data font-data-normal text-lg text-success">
                {goals?.filter(g => g?.status === 'completed')?.length}
              </div>
              <div className="font-caption font-caption-normal text-xs text-muted-foreground">
                Completed
              </div>
            </div>
            <div>
              <div className="font-data font-data-normal text-lg text-accent">
                {goals?.filter(g => g?.status === 'on-track')?.length}
              </div>
              <div className="font-caption font-caption-normal text-xs text-muted-foreground">
                On Track
              </div>
            </div>
            <div>
              <div className="font-data font-data-normal text-lg text-warning">
                {goals?.filter(g => ['behind', 'at-risk']?.includes(g?.status))?.length}
              </div>
              <div className="font-caption font-caption-normal text-xs text-muted-foreground">
                Need Attention
              </div>
            </div>
          </div>
        </div>
      </div>
      <GoalModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveGoal}
        goal={editingGoal}
      />
    </>
  );
};

export default GoalProgressWidget;
