'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';

interface Task {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

interface TaskListProps {
  projectId: string;
  currentUserId: string;
}

export default function TaskList({ projectId, currentUserId }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/tasks`, {
        headers: {
          'Authorization': `Bearer ${currentUserId}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks || []);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: any) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUserId}`
        },
        body: JSON.stringify({
          ...taskData,
          project_id: projectId
        })
      });

      if (response.ok) {
        await fetchTasks();
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const updateTask = async (taskData: any) => {
    if (!editingTask) return;

    try {
      const response = await fetch(`/api/tasks/${editingTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUserId}`
        },
        body: JSON.stringify(taskData)
      });

      if (response.ok) {
        await fetchTasks();
        setEditingTask(null);
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${currentUserId}`
        }
      });

      if (response.ok) {
        await fetchTasks();
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const toggleTaskComplete = async (taskId: string, isCompleted: boolean) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUserId}`
        },
        body: JSON.stringify({ is_completed: isCompleted })
      });

      if (response.ok) {
        await fetchTasks();
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleStartTimer = (task: Task) => {
    // TODO: Implement timer functionality
    console.log('Starting timer for task:', task.name);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold text-white">Project Tasks</div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-[#F4D03F] text-black border-2 border-black hover:bg-black hover:text-[#F4D03F] hover:border-[#F4D03F] transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Create Task Form */}
      {showCreateForm && (
        <TaskForm
          projectId={projectId}
          onSubmit={createTask}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {/* Edit Task Form */}
      {editingTask && (
        <TaskForm
          projectId={projectId}
          task={editingTask}
          onSubmit={updateTask}
          onCancel={() => setEditingTask(null)}
          isEditing={true}
        />
      )}

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">No tasks yet</div>
          <p className="text-gray-500 text-sm">
            Create your first task to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={setEditingTask}
              onDelete={deleteTask}
              onStartTimer={handleStartTimer}
              onToggleComplete={toggleTaskComplete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
