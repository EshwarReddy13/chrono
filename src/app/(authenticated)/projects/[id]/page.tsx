'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2, Play, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import TaskList from '@/components/tasks/TaskList';

interface Project {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  color: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  total_time_seconds?: number;
  total_entries?: number;
}

interface TimeEntry {
  id: string;
  project_id: string;
  start_time: string;
  end_time?: string;
  duration_seconds?: number;
  description?: string;
  created_at: string;
}

export default function ProjectDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { currentUser } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showTasks, setShowTasks] = useState(false);

  useEffect(() => {
    if (id && currentUser) {
      fetchProjectDetails();
      fetchTimeEntries();
    }
  }, [id, currentUser]);

  const fetchProjectDetails = async () => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        headers: {
          'Authorization': `Bearer ${currentUser?.uid}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        setProject(result.project);
      } else {
        console.error('Failed to fetch project:', result.error);
        router.push('/projects');
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      router.push('/projects');
    }
  };

  const fetchTimeEntries = async () => {
    try {
      const response = await fetch(`/api/projects/${id}/time-entries`, {
        headers: {
          'Authorization': `Bearer ${currentUser?.uid}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        setTimeEntries(result.timeEntries);
      }
    } catch (error) {
      console.error('Error fetching time entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = seconds / 3600;
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const handleStartTimer = () => {
    // TODO: Implement start timer functionality
    console.log('Start timer for project:', project?.id);
  };

  const handleAddTask = () => {
    setShowTasks(true);
  };

  const handleEditProject = () => {
    setEditing(true);
  };

  const handleDeleteProject = async () => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${currentUser?.uid}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        router.push('/projects');
      } else {
        console.error('Failed to delete project:', result.error);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400">Loading project details...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400">Project not found</div>
        <Button 
          onClick={() => router.push('/projects')}
          className="mt-4 bg-[#F4D03F] text-black border-2 border-black hover:bg-black hover:text-[#F4D03F] hover:border-[#F4D03F] transition-all duration-200"
        >
          Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/projects')}
            className="p-2 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center space-x-3">
            <div
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: project.color }}
            />
            <div>
              <h1 className="text-3xl font-bold text-white">{project.name}</h1>
              {project.description && (
                <p className="text-gray-300">{project.description}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button
            onClick={handleStartTimer}
            className="bg-[#F4D03F] text-black border-2 border-black hover:bg-black hover:text-[#F4D03F] hover:border-[#F4D03F] transition-all duration-200"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Timer
          </Button>
          <Button
            onClick={handleAddTask}
            variant="outline"
            className="border-gray-500/50 text-white hover:bg-[rgba(255,255,255,0.1)]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
          <Button
            onClick={handleEditProject}
            variant="outline"
            className="border-gray-500/50 text-white hover:bg-[rgba(255,255,255,0.1)]"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            onClick={handleDeleteProject}
            variant="outline"
            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="backdrop-blur-[16px] saturate-[180%] bg-[rgba(33,33,33,0.9)] border border-[rgba(189,189,189,0.4)] shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-[#F4D03F]">
              {project.total_time_seconds ? formatTime(project.total_time_seconds) : '0h 0m'}
            </div>
            <div className="text-gray-400 text-sm">Total Time</div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-[16px] saturate-[180%] bg-[rgba(33,33,33,0.9)] border border-[rgba(189,189,189,0.4)] shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-white">
              {project.total_entries || 0}
            </div>
            <div className="text-gray-400 text-sm">Time Entries</div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-[16px] saturate-[180%] bg-[rgba(33,33,33,0.9)] border border-[rgba(189,189,189,0.4)] shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-white">
              {new Date(project.created_at).toLocaleDateString()}
            </div>
            <div className="text-gray-400 text-sm">Created</div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-[16px] saturate-[180%] bg-[rgba(33,33,33,0.9)] border border-[rgba(189,189,189,0.4)] shadow-lg">
          <CardContent className="p-6 text-center">
            <Badge 
              variant={project.is_active ? "default" : "secondary"}
              className={`text-sm ${project.is_active ? "bg-green-600" : "bg-gray-600"}`}
            >
              {project.is_active ? "Active" : "Inactive"}
            </Badge>
            <div className="text-gray-400 text-sm mt-2">Status</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Time Entries */}
      <Card className="backdrop-blur-[16px] saturate-[180%] bg-[rgba(33,33,33,0.9)] border border-[rgba(189,189,189,0.4)] shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-white">Recent Time Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {timeEntries.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No time entries yet. Start the timer to begin tracking time for this project.
            </div>
          ) : (
            <div className="space-y-3">
              {timeEntries.slice(0, 10).map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3 bg-[rgba(255,255,255,0.05)] rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-[#F4D03F]">
                      {entry.end_time ? '⏹️' : '⏱️'}
                    </div>
                    <div>
                      <div className="text-white font-medium">
                        {entry.description || 'No description'}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {new Date(entry.start_time).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {entry.duration_seconds ? (
                      <div className="text-[#F4D03F] font-medium">
                        {formatDuration(entry.duration_seconds)}
                      </div>
                    ) : (
                      <div className="text-green-400 text-sm">Running...</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tasks Section */}
      <Card className="backdrop-blur-[16px] saturate-[180%] bg-[rgba(33,33,33,0.9)] border border-[rgba(189,189,189,0.4)] shadow-lg mt-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-white">Tasks</CardTitle>
            <Button
              variant="ghost"
              onClick={() => setShowTasks(!showTasks)}
              className="p-2 text-gray-400 hover:text-white"
            >
              {showTasks ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showTasks ? (
            <div className="space-y-4">
              <TaskList 
                projectId={project.id} 
                currentUserId={currentUser.uid} 
              />
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              Click the arrow to view and manage tasks for this project
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
