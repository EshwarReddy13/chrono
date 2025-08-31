'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Dashboard() {
  return (
    <div>
      {/* Welcome section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-gray-300">
          Ready to track your time and boost productivity?
        </p>
      </div>

      {/* Quick Start Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Timer Widget */}
        <Card className="lg:col-span-2 backdrop-blur-[16px] saturate-[180%] bg-[rgba(33,33,33,0.9)] border border-[rgba(189,189,189,0.4)] shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-white">Quick Start Timer</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
                         <div className="text-6xl font-bold text-[#F4D03F] mb-4 font-mono">00:00:00</div>
            <div className="space-y-3">
              <Button 
                size="lg" 
                className="w-full bg-[#F4D03F] text-black border-2 border-black hover:bg-black hover:text-[#F4D03F] hover:border-[#F4D03F] h-12 text-base transition-all duration-200"
              >
                Start Timer
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full border-gray-500/50 text-white hover:bg-[rgba(255,255,255,0.1)] h-12 text-base"
              >
                Select Project
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Today's Summary */}
        <Card className="backdrop-blur-[16px] saturate-[180%] bg-[rgba(33,33,33,0.9)] border border-[rgba(189,189,189,0.4)] shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-white">Today&apos;s Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Hours Tracked</span>
                              <span className="text-2xl font-bold text-[#F4D03F]">0h 0m</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Tasks Completed</span>
                              <span className="text-2xl font-bold text-[#F4D03F]">0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Productivity Score</span>
                              <Badge variant="secondary" className="text-[#F4D03F] bg-[rgba(255,255,255,0.1)] border-[rgba(189,189,189,0.4)]">
                --
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Time Entries */}
        <Card className="backdrop-blur-[16px] saturate-[180%] bg-[rgba(33,33,33,0.9)] border border-[rgba(189,189,189,0.4)] shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-white">Recent Time Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-gray-400 text-6xl mb-2">📝</div>
              <p className="text-gray-400">No time entries yet</p>
              <p className="text-gray-500 text-sm">Start tracking time to see your history here</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="backdrop-blur-[16px] saturate-[180%] bg-[rgba(33,33,33,0.9)] border border-[rgba(189,189,189,0.4)] shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="ghost" 
              className="w-full justify-start h-auto p-4 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-white border-0"
            >
              <div className="flex items-center w-full">
                <span className="text-2xl mr-3">➕</span>
                <div className="text-left">
                  <div className="font-medium">Add Time Entry</div>
                  <div className="text-sm text-gray-400">Manually log your time</div>
                </div>
              </div>
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start h-auto p-4 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-white border-0"
            >
              <div className="flex items-center w-full">
                <span className="text-2xl mr-3">📁</span>
                <div className="text-left">
                  <div className="font-medium">Create Project</div>
                  <div className="text-sm text-gray-400">Set up a new project</div>
                </div>
              </div>
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start h-auto p-4 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-white border-0"
            >
              <div className="flex items-center w-full">
                <span className="text-2xl mr-3">📊</span>
                <div className="text-left">
                  <div className="font-medium">View Reports</div>
                  <div className="text-sm text-gray-400">See your productivity insights</div>
                </div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
