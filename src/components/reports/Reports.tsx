'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedView, setSelectedView] = useState('overview');

  const timeData = {
    week: { total: 42.5, average: 8.5, projects: 3, tasks: 15 },
    month: { total: 168.0, average: 8.4, projects: 5, tasks: 45 },
    quarter: { total: 504.0, average: 8.4, projects: 8, tasks: 120 }
  };

  const projectData = [
    { name: 'Work Project', time: 24.5, percentage: 58, color: '#F4D03F' },
    { name: 'Personal Learning', time: 12.0, percentage: 28, color: '#34A853' },
    { name: 'Side Project', time: 6.0, percentage: 14, color: '#4285F4' }
  ];

  const dailyData = [
    { day: 'Mon', time: 8.5, goal: 8.0 },
    { day: 'Tue', time: 9.2, goal: 8.0 },
    { day: 'Wed', time: 7.8, goal: 8.0 },
    { day: 'Thu', time: 8.9, goal: 8.0 },
    { day: 'Fri', time: 8.1, goal: 8.0 },
    { day: 'Sat', time: 4.0, goal: 4.0 },
    { day: 'Sun', time: 2.0, goal: 4.0 }
  ];

  const currentData = timeData[selectedPeriod as keyof typeof timeData];

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Reports & Analytics</h1>
          <p className="text-gray-300">Track your productivity and time management insights</p>
        </div>
        
        <div className="flex space-x-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40 bg-[rgba(255,255,255,0.1)] border-gray-500/50 text-white focus:ring-[#FFFF00] focus:border-[#FFFF00]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[rgba(33,33,33,0.95)] border-[rgba(189,189,189,0.4)]">
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedView} onValueChange={setSelectedView}>
            <SelectTrigger className="w-40 bg-[rgba(255,255,255,0.1)] border-gray-500/50 text-white focus:ring-[#FFFF00] focus:border-[#FFFF00]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[rgba(33,33,33,0.95)] border-[rgba(189,189,189,0.4)]">
              <SelectItem value="overview">Overview</SelectItem>
              <SelectItem value="detailed">Detailed</SelectItem>
              <SelectItem value="comparison">Comparison</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="backdrop-blur-[16px] saturate-[180%] bg-[rgba(33,33,33,0.9)] border border-[rgba(189,189,189,0.4)] shadow-lg text-center">
          <CardContent className="pt-6">
            <div className="text-3xl mb-2">⏱️</div>
            <div className="text-2xl font-bold text-[#FFFF00]">{currentData.total}h</div>
            <div className="text-gray-400 text-sm">Total Time</div>
          </CardContent>
        </Card>
        
        <Card className="backdrop-blur-[16px] saturate-[180%] bg-[rgba(33,33,33,0.9)] border border-[rgba(189,189,189,0.4)] shadow-lg text-center">
          <CardContent className="pt-6">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold text-[#FFFF00]">{currentData.average}h</div>
            <div className="text-gray-400 text-sm">Daily Average</div>
          </CardContent>
        </Card>
        
        <Card className="backdrop-blur-[16px] saturate-[180%] bg-[rgba(33,33,33,0.9)] border border-[rgba(189,189,189,0.4)] shadow-lg text-center">
          <CardContent className="pt-6">
            <div className="text-3xl mb-2">📁</div>
            <div className="text-2xl font-bold text-[#FFFF00]">{currentData.projects}</div>
            <div className="text-gray-400 text-sm">Active Projects</div>
          </CardContent>
        </Card>
        
        <Card className="backdrop-blur-[16px] saturate-[180%] bg-[rgba(33,33,33,0.9)] border border-[rgba(189,189,189,0.4)] shadow-lg text-center">
          <CardContent className="pt-6">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-[#FFFF00]">{currentData.tasks}</div>
            <div className="text-gray-400 text-sm">Tasks Completed</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Project Distribution */}
        <Card className="backdrop-blur-[16px] saturate-[180%] bg-[rgba(33,33,33,0.9)] border border-[rgba(189,189,189,0.4)] shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-white">Project Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {projectData.map((project, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  <span className="text-white font-medium">{project.name}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-[rgba(255,255,255,0.1)] rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{ 
                        width: `${project.percentage}%`,
                        backgroundColor: project.color
                      }}
                    />
                  </div>
                  <span className="text-[#FFFF00] font-semibold w-16 text-right">
                    {project.time}h
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Daily Progress */}
        <Card className="backdrop-blur-[16px] saturate-[180%] bg-[rgba(33,33,33,0.9)] border border-[rgba(189,189,189,0.4)] shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-white">Daily Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {dailyData.map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-300 w-12">{day.day}</span>
                
                <div className="flex-1 mx-4">
                  <div className="w-full bg-[rgba(255,255,255,0.1)] rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        day.time >= day.goal ? 'bg-[#34A853]' : 'bg-[#F4D03F]'
                      }`}
                      style={{ width: `${Math.min((day.time / day.goal) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-white font-medium">{day.time}h</div>
                  <div className="text-gray-400 text-xs">Goal: {day.goal}h</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Productivity Insights */}
      <Card className="backdrop-blur-[16px] saturate-[180%] bg-[rgba(33,33,33,0.9)] border border-[rgba(189,189,189,0.4)] shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-white">Productivity Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🎯</div>
              <h4 className="text-lg font-semibold text-white mb-2">Goal Achievement</h4>
              <Badge variant="secondary" className="text-[#FFFF00] text-2xl font-bold bg-[rgba(255,255,255,0.1)] border-[rgba(189,189,189,0.4)] px-4 py-2">
                85%
              </Badge>
              <p className="text-gray-400 text-sm mt-2">of daily goals met</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-2">📈</div>
              <h4 className="text-lg font-semibold text-white mb-2">Productivity Trend</h4>
              <Badge variant="secondary" className="text-[#34A853] text-2xl font-bold bg-[rgba(255,255,255,0.1)] border-[rgba(189,189,189,0.4)] px-4 py-2">
                +12%
              </Badge>
              <p className="text-gray-400 text-sm mt-2">vs last period</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-2">⏰</div>
              <h4 className="text-lg font-semibold text-white mb-2">Peak Hours</h4>
              <Badge variant="secondary" className="text-[#FFFF00] text-2xl font-bold bg-[rgba(255,255,255,0.1)] border-[rgba(189,189,189,0.4)] px-4 py-2">
                9AM-11AM
              </Badge>
              <p className="text-gray-400 text-sm mt-2">most productive time</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
