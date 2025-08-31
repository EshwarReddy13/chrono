'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Task {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

interface TaskFormProps {
  projectId: string;
  task?: Task | null;
  onSubmit: (taskData: { name: string; description: string }) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

export default function TaskForm({ 
  task, 
  onSubmit, 
  onCancel, 
  isEditing = false 
}: TaskFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        name: task.name,
        description: task.description || ''
      });
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="backdrop-blur-[16px] saturate-[180%] bg-[rgba(33,33,33,0.9)] border border-[rgba(189,189,189,0.4)] shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-white">
          {isEditing ? 'Edit Task' : 'Create New Task'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
             <label className="block text-sm font-medium text-gray-300 mb-2">
               Task Name *
             </label>
             <Input
               type="text"
               value={formData.name}
               onChange={(e) => handleInputChange('name', e.target.value)}
               className="bg-[rgba(255,255,255,0.1)] border-gray-500/50 text-white placeholder-gray-400 focus:ring-[#FFFF00] focus:border-[#FFFF00]"
               placeholder="Enter task name"
               required
             />
           </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="bg-[rgba(255,255,255,0.1)] border-gray-500/50 text-white placeholder-gray-400 focus:ring-[#FFFF00] focus:border-[#FFFF00]"
              placeholder="Task description (optional)"
              rows={3}
            />
          </div>



          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || !formData.name.trim()}
              className="flex-1 bg-[#F4D03F] text-black border-2 border-black hover:bg-black hover:text-[#F4D03F] hover:border-[#F4D03F] transition-all duration-200"
            >
              {isSubmitting ? 'Saving...' : (isEditing ? 'Update Task' : 'Create Task')}
            </Button>
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="border-gray-500/50 text-white hover:bg-[rgba(255,255,255,0.1)]"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
