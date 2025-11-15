import React, { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const GoalModal = ({ isOpen, onClose, onSave, goal }) => {
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [progress, setProgress] = useState(0);
  const [deadline, setDeadline] = useState(new Date());

  useEffect(() => {
    if (goal) {
      setTitle(goal.title);
      setTarget(goal.target);
      setProgress(goal.progress);
      setDeadline(new Date(goal.deadline));
    } else {
      setTitle('');
      setTarget('');
      setProgress(0);
      setDeadline(new Date());
    }
  }, [goal, isOpen]);

  const handleSave = () => {
    onSave({ id: goal?.id, title, target, progress, deadline: deadline.toISOString().split('T')[0] });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={goal ? 'Edit Goal' : 'Add New Goal'}>
      <div className="space-y-4">
        <Input
          label="Goal Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Reduce Acne Breakouts"
        />
        <Input
          label="Target"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="e.g., 90% reduction"
        />
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Progress</label>
            <div className="flex items-center space-x-4">
                <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={progress} 
                    onChange={(e) => setProgress(Number(e.target.value))} 
                    className="w-full"
                />
                <span className="font-bold">{progress}%</span>
            </div>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
            <DatePicker selected={deadline} onChange={(date) => setDeadline(date)} className="w-full p-2 border rounded-md" />
        </div>
        <div className="flex justify-end space-x-4">
          <Button onClick={onClose} variant="outline">Cancel</Button>
          <Button onClick={handleSave}>Save Goal</Button>
        </div>
      </div>
    </Modal>
  );
};

export default GoalModal;
