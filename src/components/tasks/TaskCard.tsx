'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Play, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Task {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStartTimer: (task: Task) => void;
  onToggleComplete: (taskId: string, isCompleted: boolean) => void;
}

export default function TaskCard({ 
  task, 
  onEdit, 
  onDelete, 
  onStartTimer, 
  onToggleComplete 
}: TaskCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const getCompletionStatus = (isCompleted: boolean) => {
    return isCompleted ? 'Completed' : 'Pending';
  };

  const getCompletionColor = (isCompleted: boolean) => {
    return isCompleted ? 'bg-green-600' : 'bg-yellow-600';
  };

  const getCompletionIcon = (isCompleted: boolean) => {
    return isCompleted ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleToggleComplete = async () => {
    setIsUpdating(true);
    try {
      await onToggleComplete(task.id, !task.is_completed);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="backdrop-blur-[16px] saturate-[180%] bg-[rgba(33,33,33,0.9)] border border-[rgba(189,189,189,0.4)] shadow-lg hover:shadow-xl transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg text-white mb-2">{task.name}</CardTitle>
            {task.description && (
              <p className="text-gray-400 text-sm mb-3">{task.description}</p>
          )}
            
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className={getCompletionColor(task.is_completed)}>
                <span className="mr-1">{getCompletionIcon(task.is_completed)}</span>
                {getCompletionStatus(task.is_completed)}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
          <span>Created: {formatDate(task.created_at)}</span>
          <span>Updated: {formatDate(task.updated_at)}</span>
        </div>

        <div className="flex space-x-2">
          {!task.is_completed && (
            <Button
              onClick={() => onStartTimer(task)}
              size="sm"
              className="flex-1 bg-[#F4D03F] text-black border-2 border-black hover:bg-black hover:text-[#F4D03F] hover:border-[#F4D03F] transition-all duration-200"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Timer
            </Button>
          )}
          
          <Button
            onClick={() => onEdit(task)}
            variant="outline"
            size="sm"
            className="border-gray-500/50 text-white hover:bg-[rgba(255,255,255,0.1)]"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          
          <Button
            onClick={() => onDelete(task.id)}
            variant="outline"
            size="sm"
            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>

        <div className="mt-3 pt-3 border-t border-[rgba(189,189,189,0.2)]">
          <Button
            onClick={() => onToggleComplete(task.id, !task.is_completed)}
            size="sm"
            variant="outline"
            disabled={isUpdating}
            className={`w-full text-sm ${
              task.is_completed 
                ? 'bg-green-600 text-white border-green-600' 
                : 'border-gray-500/50 text-gray-300 hover:bg-[rgba(255,255,255,0.1)]'
            }`}
          >
            {task.is_completed ? 'Mark as Pending' : 'Mark as Completed'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
