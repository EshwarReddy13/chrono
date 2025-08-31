'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Timer() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setTime(0);
    setIsRunning(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Timer Display */}
      <div className="text-center mb-12">
        <div className="text-8xl font-bold text-[#FFFF00] mb-6 font-mono">
          {formatTime(time)}
        </div>
        
        {/* Timer Controls */}
        <div className="flex justify-center space-x-4 mb-8">
          {!isRunning ? (
            <Button
              size="lg"
              onClick={startTimer}
                              className="bg-[#F4D03F] text-black border-2 border-black hover:bg-black hover:text-[#F4D03F] hover:border-[#F4D03F] px-8 py-4 h-14 text-lg font-semibold transition-all duration-200"
            >
              Start Timer
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={pauseTimer}
              className="bg-red-500 text-white px-8 py-4 h-14 text-lg font-semibold hover:bg-red-600"
            >
              Pause Timer
            </Button>
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

      {/* Project Selection */}
      <Card className="backdrop-blur-[16px] saturate-[180%] bg-[rgba(33,33,33,0.9)] border border-[rgba(189,189,189,0.4)] shadow-lg mb-8">
        <CardHeader>
          <CardTitle className="text-xl text-white">Project & Task</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Project
              </label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="bg-[rgba(255,255,255,0.1)] border-gray-500/50 text-white focus:ring-[#FFFF00] focus:border-[#FFFF00]">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent className="bg-[rgba(33,33,33,0.95)] border-[rgba(189,189,189,0.4)]">
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="study">Study</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Task Description
              </label>
              <Input
                type="text"
                placeholder="What are you working on?"
                className="bg-[rgba(255,255,255,0.1)] border-gray-500/50 text-white placeholder-gray-400 focus:ring-[#FFFF00] focus:border-[#FFFF00]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

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
