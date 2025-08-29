'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';


interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  totalTime: number;
  tasks: Task[];
}

interface Task {
  id: string;
  name: string;
  completed: boolean;
  estimatedTime: number;
  actualTime: number;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Work Project',
      description: 'Main work project for Q1',
      color: '#FFFF00',
      totalTime: 24.5,
      tasks: [
        { id: '1', name: 'Design Review', completed: true, estimatedTime: 2, actualTime: 2.5 },
        { id: '2', name: 'Code Implementation', completed: false, estimatedTime: 8, actualTime: 6 },
        { id: '3', name: 'Testing', completed: false, estimatedTime: 4, actualTime: 0 },
      ]
    },
    {
      id: '2',
      name: 'Personal Learning',
      description: 'Learning new technologies',
      color: '#34A853',
      totalTime: 12.0,
      tasks: [
        { id: '4', name: 'React Study', completed: true, estimatedTime: 6, actualTime: 8 },
        { id: '5', name: 'TypeScript Practice', completed: false, estimatedTime: 4, actualTime: 2 },
      ]
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    color: '#FFFF00'
  });

  const createProject = () => {
    if (newProject.name.trim()) {
      const project: Project = {
        id: Date.now().toString(),
        name: newProject.name,
        description: newProject.description,
        color: newProject.color,
        totalTime: 0,
        tasks: []
      };
      
      setProjects([...projects, project]);
      setNewProject({ name: '', description: '', color: '#FFFF00' });
      setShowCreateForm(false);
    }
  };

  const formatTime = (hours: number) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
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
          className="bg-[#FFFF00] text-gray-900 hover:bg-[#F2EC9B]"
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
                className="bg-[#FFFF00] text-gray-900 hover:bg-[#F2EC9B]"
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="backdrop-blur-[16px] saturate-[180%] bg-[rgba(33,33,33,0.9)] border border-[rgba(189,189,189,0.4)] shadow-lg"
          >
            <CardHeader>
              {/* Project Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  <div>
                    <CardTitle className="text-xl text-white">{project.name}</CardTitle>
                    <p className="text-gray-400 text-sm">{project.description}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#FFFF00]">
                    {formatTime(project.totalTime)}
                  </div>
                  <div className="text-gray-400 text-sm">Total Time</div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {/* Tasks */}
              <div className="space-y-3 mb-4">
                <h4 className="text-sm font-medium text-gray-300 uppercase tracking-wide">Tasks</h4>
                {project.tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-[rgba(255,255,255,0.05)] rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => {}}
                        className="text-[#FFFF00] border-gray-500 data-[state=checked]:bg-[#FFFF00] data-[state=checked]:border-[#FFFF00]"
                      />
                      <span className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                        {task.name}
                      </span>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xs text-gray-400">
                        Est: {formatTime(task.estimatedTime)}
                      </div>
                      <div className="text-xs text-[#FFFF00]">
                        Act: {formatTime(task.actualTime)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Project Actions */}
              <div className="flex space-x-2 pt-4 border-t border-[rgba(189,189,189,0.2)]">
                <Button variant="ghost" size="sm" className="flex-1 bg-[rgba(255,255,255,0.05)] text-white hover:bg-[rgba(255,255,255,0.1)]">
                  Add Task
                </Button>
                <Button variant="ghost" size="sm" className="flex-1 bg-[rgba(255,255,255,0.05)] text-white hover:bg-[rgba(255,255,255,0.1)]">
                  Start Timer
                </Button>
                <Button variant="ghost" size="sm" className="flex-1 bg-[rgba(255,255,255,0.05)] text-white hover:bg-[rgba(255,255,255,0.1)]">
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
