'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTimer } from '@/contexts/TimerContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, Square, Clock, FolderOpen, CheckCircle } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  color: string;
}

interface Task {
  id: string;
  name: string;
}

export default function Timer() {
  const { currentUser } = useAuth();
  const { timerState, startTimer: startGlobalTimer, continueTimer: continueGlobalTimer, pauseTimer: pauseGlobalTimer, stopTimer: stopGlobalTimer, resetTimer: resetGlobalTimer, updateTimer } = useTimer();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showPostStopModal, setShowPostStopModal] = useState(false);

  useEffect(() => {
    if (currentUser) {
      fetchProjects();
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      fetchProjects();
    }
  }, [currentUser]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects', {
        headers: {
          'Authorization': `Bearer ${currentUser?.uid}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const fetchTasks = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/tasks`, {
        headers: {
          'Authorization': `Bearer ${currentUser?.uid}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks || []);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    if (!timerState.selectedProject) {
      setShowProjectModal(true);
      return;
    }
    
    startGlobalTimer(timerState.selectedProject, timerState.selectedTask, timerState.description, true);
  };

  const stopTimer = async () => {
    stopGlobalTimer();
    
    if (!timerState.selectedProject) {
      setShowPostStopModal(true);
      return;
    }
    
    await saveTimeEntry();
    resetGlobalTimer();
  };

  const pauseTimer = () => {
    pauseGlobalTimer();
  };

  const continueTimer = () => {
    continueGlobalTimer();
  };

  const resetTimer = () => {
    resetGlobalTimer();
  };

  const saveTimeEntry = async () => {
    if (!timerState.selectedProject) return;

    try {
      const endTime = new Date();
      // Use the accumulated time from the timer state instead of calculating from startTime
      const durationSeconds = timerState.time;

      const response = await fetch('/api/time-entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.uid}`
        },
        body: JSON.stringify({
          project_id: timerState.selectedProject,
          task_id: timerState.selectedTask === 'no-task' ? null : timerState.selectedTask || null,
          description: timerState.description || null,
          start_time: new Date(endTime.getTime() - (durationSeconds * 1000)).toISOString(),
          end_time: endTime.toISOString(),
          duration_seconds: durationSeconds
        })
      });

      if (response.ok) {
        console.log('Time entry saved successfully');
      }
    } catch (error) {
      console.error('Failed to save time entry:', error);
    }
  };

  const handleProjectChange = (projectId: string) => {
    updateTimer({ selectedProject: projectId, selectedTask: 'no-task' });
    if (projectId) {
      fetchTasks(projectId);
    } else {
      setTasks([]);
    }
  };

  const handleStartWithProject = (projectId: string) => {
    updateTimer({ selectedProject: projectId, selectedTask: 'no-task' });
    setShowProjectModal(false);
    startGlobalTimer(projectId, 'no-task', '');
  };

  const handlePostStopProjectSelect = async (projectId: string) => {
    updateTimer({ selectedProject: projectId });
    setShowPostStopModal(false);
    await saveTimeEntry();
    resetGlobalTimer();
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Timer Display */}
      <div className="text-center mb-12">
        <div className="text-8xl font-bold text-[#F4D03F] mb-6 font-mono">
          {formatTime(timerState.time)}
        </div>
        
        {/* Timer Controls */}
        <div className="flex justify-center space-x-4 mb-8">
          {!timerState.isRunning && timerState.time === 0 ? (
            <Button
              size="lg"
              onClick={startTimer}
              className="bg-[#F4D03F] text-black border-2 border-black hover:bg-black hover:text-[#F4D03F] hover:border-[#F4D03F] px-8 py-4 h-14 text-lg font-semibold transition-all duration-200"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Timer
            </Button>
          ) : !timerState.isRunning && timerState.time > 0 ? (
            <Button
              size="lg"
              onClick={continueTimer}
              className="bg-green-500 text-white border-2 border-black hover:bg-green-600 px-8 py-4 h-14 text-lg font-semibold"
            >
              <Play className="w-5 h-5 mr-2" />
              Continue
            </Button>
          ) : (
            <>
              <Button
                size="lg"
                onClick={pauseTimer}
                className="bg-yellow-500 text-black border-2 border-black hover:bg-yellow-600 px-8 py-4 h-14 text-lg font-semibold"
              >
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </Button>
              <Button
                size="lg"
                onClick={stopTimer}
                className="bg-red-500 text-white border-2 border-black hover:bg-red-600 px-8 py-4 h-14 text-lg font-semibold"
              >
                <Square className="w-5 h-5 mr-2" />
                Stop
              </Button>
            </>
          )}
          
          <Button
            variant="outline"
            size="lg"
            onClick={resetTimer}
            className="border-gray-500/50 text-white hover:bg-[rgba(255,255,255,0.1)] px-8 py-4 h-14 text-lg font-semibold"
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Current Session Info */}
      {timerState.isRunning && (
        <Card className="backdrop-blur-[16px] saturate-[180%] bg-[rgba(33,33,33,0.9)] border border-[rgba(189,189,189,0.4)] shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center">
              <Clock className="w-5 h-5 mr-2 text-[#F4D03F]" />
              Current Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Project</label>
                <div className="text-white font-medium">
                  {projects.find(p => p.id === timerState.selectedProject)?.name || 'No project selected'}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Task</label>
                <div className="text-white font-medium">
                  {timerState.selectedTask === 'no-task' ? 'No specific task' : tasks.find(t => t.id === timerState.selectedTask)?.name || 'No task selected'}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <div className="text-white font-medium">
                  {timerState.description || 'No description'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Project & Task Selection */}
      <Card className="backdrop-blur-[16px] saturate-[180%] bg-[rgba(33,33,33,0.9)] border border-[rgba(189,189,189,0.4)] shadow-lg mb-8">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center">
            <FolderOpen className="w-5 h-5 mr-2 text-[#F4D03F]" />
            Project & Task Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Project</label>
              <Select value={timerState.selectedProject} onValueChange={handleProjectChange}>
                <SelectTrigger className="bg-[rgba(255,255,255,0.1)] border-gray-500/50 text-white focus:ring-[#F4D03F] focus:border-[#F4D03F]">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent className="bg-[rgba(33,33,33,0.95)] border-[rgba(189,189,189,0.4)]">
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: project.color }}
                        />
                        {project.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Task (Optional)</label>
              <Select value={timerState.selectedTask} onValueChange={(value) => updateTimer({ selectedTask: value })} disabled={!timerState.selectedProject}>
                <SelectTrigger className="bg-[rgba(255,255,255,0.1)] border-gray-500/50 text-white focus:ring-[#F4D03F] focus:border-[#F4D03F]">
                  <SelectValue placeholder="Select a task" />
                </SelectTrigger>
                                 <SelectContent className="bg-[rgba(33,33,33,0.95)] border-[rgba(189,189,189,0.4)]">
                   <SelectItem value="no-task">No specific task</SelectItem>
                   {tasks.map((task) => (
                     <SelectItem key={task.id} value={task.id}>
                       {task.name}
                     </SelectItem>
                   ))}
                 </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                              <Input
                  type="text"
                  value={timerState.description}
                  onChange={(e) => updateTimer({ description: e.target.value })}
                  placeholder="What are you working on?"
                  className="bg-[rgba(255,255,255,0.1)] border-gray-500/50 text-white placeholder-gray-400 focus:ring-[#F4D03F] focus:border-[#F4D03F]"
                />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Selection Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="backdrop-blur-[16px] saturate-[180%] bg-[rgba(33,33,33,0.95)] border border-[rgba(189,189,189,0.4)] shadow-lg max-w-md w-full mx-4">
            <CardHeader>
              <CardTitle className="text-xl text-white">Select Project to Start Timer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {projects.map((project) => (
                  <Button
                    key={project.id}
                    onClick={() => handleStartWithProject(project.id)}
                    className="w-full justify-start bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] text-white border border-[rgba(189,189,189,0.3)]"
                  >
                    <div 
                      className="w-3 h-3 rounded-full mr-3" 
                      style={{ backgroundColor: project.color }}
                    />
                    {project.name}
                  </Button>
                ))}
              </div>
              <div className="flex space-x-2 pt-4">
                <Button
                  onClick={() => setShowProjectModal(false)}
                  variant="outline"
                  className="flex-1 border-gray-500/50 text-white hover:bg-[rgba(255,255,255,0.1)]"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Post-Stop Project Selection Modal */}
      {showPostStopModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="backdrop-blur-[16px] saturate-[180%] bg-[rgba(33,33,33,0.95)] border border-[rgba(189,189,189,0.4)] shadow-lg max-w-md w-full mx-4">
            <CardHeader>
              <CardTitle className="text-xl text-white">Select Project for Time Entry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 text-sm">Please select a project to save your time entry.</p>
              <div className="space-y-2">
                {projects.map((project) => (
                  <Button
                    key={project.id}
                    onClick={() => handlePostStopProjectSelect(project.id)}
                    className="w-full justify-start bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] text-white border border-[rgba(189,189,189,0.3)]"
                  >
                    <div 
                      className="w-3 h-3 rounded-full mr-3" 
                      style={{ backgroundColor: project.color }}
                    />
                    {project.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="backdrop-blur-[16px] saturate-[180%] bg-[rgba(33,33,33,0.9)] border border-[rgba(189,189,189,0.4)] shadow-lg text-center">
          <CardContent className="pt-6">
            <div className="text-4xl mb-3">⏱️</div>
            <h4 className="text-lg font-semibold text-white mb-2">Quick Start</h4>
            <p className="text-gray-400 text-sm">Start timing immediately</p>
          </CardContent>
        </Card>
        
        <Card className="backdrop-blur-[16px] saturate-[180%] bg-[rgba(33,33,33,0.9)] border border-[rgba(189,189,189,0.4)] shadow-lg text-center">
          <CardContent className="pt-6">
            <div className="text-4xl mb-3">📝</div>
            <h4 className="text-lg font-semibold text-white mb-2">Manual Entry</h4>
            <p className="text-gray-400 text-sm">Log time manually</p>
          </CardContent>
        </Card>
        
        <Card className="backdrop-blur-[16px] saturate-[180%] bg-[rgba(33,33,33,0.9)] border border-[rgba(189,189,189,0.4)] shadow-lg text-center">
          <CardContent className="pt-6">
            <div className="text-4xl mb-3">📊</div>
            <h4 className="text-lg font-semibold text-white mb-2">View History</h4>
            <p className="text-gray-400 text-sm">See your time logs</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
