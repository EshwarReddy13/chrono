'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

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

export default function Projects() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    color: '#F4D03F'
  });

  const createProject = async () => {
    if (!currentUser || !newProject.name.trim()) return;
    
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.uid}`
        },
        body: JSON.stringify({
          name: newProject.name,
          description: newProject.description,
          color: newProject.color
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        // Refresh projects list
        fetchProjects();
        setNewProject({ name: '', description: '', color: '#F4D03F' });
        setShowCreateForm(false);
      } else {
        console.error('Failed to create project:', result.error);
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const fetchProjects = async () => {
    if (!currentUser) return;
    
    try {
      const response = await fetch('/api/projects', {
        headers: {
          'Authorization': `Bearer ${currentUser.uid}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        setProjects(result.projects);
      } else {
        console.error('Failed to fetch projects:', result.error);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [currentUser]);

  const formatTime = (seconds: number) => {
    const hours = seconds / 3600;
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };

  const handleProjectClick = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
          <p className="text-gray-300">Manage your projects and track progress</p>
        </div>
        
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-[#F4D03F] text-black border-2 border-black hover:bg-black hover:text-[#F4D03F] hover:border-[#F4D03F] transition-all duration-200"
        >
          + New Project
        </Button>
      </div>

      {/* Create Project Form */}
      {showCreateForm && (
        <Card className="backdrop-blur-[16px] saturate-[180%] bg-[rgba(33,33,33,0.9)] border border-[rgba(189,189,189,0.4)] shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-white">Create New Project</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Project Name</label>
                <Input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  className="bg-[rgba(255,255,255,0.1)] border-gray-500/50 text-white placeholder-gray-400 focus:ring-[#FFFF00] focus:border-[#FFFF00]"
                  placeholder="Enter project name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <Input
                  type="text"
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  className="bg-[rgba(255,255,255,0.1)] border-gray-500/50 text-white placeholder-gray-400 focus:ring-[#FFFF00] focus:border-[#FFFF00]"
                  placeholder="Project description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Color</label>
                <Input
                  type="color"
                  value={newProject.color}
                  onChange={(e) => setNewProject({...newProject, color: e.target.value})}
                  className="h-12 bg-[rgba(255,255,255,0.1)] border-gray-500/50 cursor-pointer"
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                onClick={createProject}
                className="bg-[#F4D03F] text-black border-2 border-black hover:bg-black hover:text-[#F4D03F] hover:border-[#F4D03F] transition-all duration-200"
              >
                Create Project
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateForm(false)}
                className="border-gray-500/50 text-white hover:bg-[rgba(255,255,255,0.1)]"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Projects Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="text-gray-400">Loading projects...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Project Cards */}
          {projects.map((project) => (
            <Card
              key={project.id}
              className="backdrop-blur-[16px] saturate-[180%] bg-[rgba(33,33,33,0.9)] border border-[rgba(189,189,189,0.4)] shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group"
              onClick={() => handleProjectClick(project.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    <div>
                      <CardTitle className="text-xl text-white group-hover:text-[#F4D03F] transition-colors">
                        {project.name}
                      </CardTitle>
                      {project.description && (
                        <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Project Stats */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#F4D03F]">
                        {project.total_time_seconds ? formatTime(project.total_time_seconds) : '0h 0m'}
                      </div>
                      <div className="text-gray-400 text-xs">Total Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-white">
                        {project.total_entries || 0}
                      </div>
                      <div className="text-gray-400 text-xs">Entries</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
                    <Badge 
                      variant={project.is_active ? "default" : "secondary"}
                      className={project.is_active ? "bg-green-600" : "bg-gray-600"}
                    >
                      {project.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex space-x-2 pt-3 border-t border-[rgba(189,189,189,0.2)]">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex-1 bg-[rgba(255,255,255,0.05)] text-white hover:bg-[rgba(255,255,255,0.1)] text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Start timer for this project
                    }}
                  >
                    ⏱️ Start Timer
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex-1 bg-[rgba(255,255,255,0.05)] text-white hover:bg-[rgba(255,255,255,0.1)] text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Add task to this project
                    }}
                  >
                    ➕ Add Task
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add New Project Card */}
          <Card
            className="backdrop-blur-[16px] saturate-[180%] bg-[rgba(33,33,33,0.9)] border-2 border-dashed border-[rgba(189,189,189,0.4)] shadow-lg hover:border-[#F4D03F] hover:shadow-xl transition-all duration-200 cursor-pointer group"
            onClick={() => setShowCreateForm(true)}
          >
            <CardContent className="flex flex-col items-center justify-center h-48 p-6">
              <div className="text-4xl text-gray-400 group-hover:text-[#F4D03F] transition-colors mb-3">
                ➕
              </div>
              <CardTitle className="text-xl text-white group-hover:text-[#F4D03F] transition-colors text-center">
                Add New Project
              </CardTitle>
              <p className="text-gray-400 text-sm text-center mt-2">
                Create a new project to start tracking your time
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
