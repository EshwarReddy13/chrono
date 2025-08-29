'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

export default function Settings() {
  const { currentUser, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [email] = useState(currentUser?.email || '');
  const [dailyGoal, setDailyGoal] = useState(8);
  const [timeFormat, setTimeFormat] = useState('12h');
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    reminders: true
  });

  const handleProfileUpdate = async () => {
    try {
      await updateUserProfile(displayName);
      // Show success message
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'preferences', name: 'Preferences', icon: '⚙️' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'export', name: 'Export Data', icon: '📤' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Display Name
                  </label>
                  <Input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="bg-[rgba(255,255,255,0.1)] border-gray-500/50 text-white placeholder-gray-400 focus:ring-[#FFFF00] focus:border-[#FFFF00]"
                    placeholder="Enter your display name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={email}
                    disabled
                    className="bg-[rgba(255,255,255,0.05)] border-gray-500/30 text-gray-400 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
              </div>
              
              <Button
                onClick={handleProfileUpdate}
                className="mt-4 bg-[#FFFF00] text-gray-900 hover:bg-[#F2EC9B]"
              >
                Update Profile
              </Button>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Time Tracking Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Daily Goal (hours)
                  </label>
                  <Input
                    type="number"
                    value={dailyGoal}
                    onChange={(e) => setDailyGoal(Number(e.target.value))}
                    min="1"
                    max="24"
                    className="bg-[rgba(255,255,255,0.1)] border-gray-500/50 text-white focus:ring-[#FFFF00] focus:border-[#FFFF00]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Time Format
                  </label>
                  <Select value={timeFormat} onValueChange={setTimeFormat}>
                    <SelectTrigger className="bg-[rgba(255,255,255,0.1)] border-gray-500/50 text-white focus:ring-[#FFFF00] focus:border-[#FFFF00]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[rgba(33,33,33,0.95)] border-[rgba(189,189,189,0.4)]">
                      <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                      <SelectItem value="24h">24-hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Appearance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Theme
                  </label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className="bg-[rgba(255,255,255,0.1)] border-gray-500/50 text-white focus:ring-[#FFFF00] focus:border-[#FFFF00]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[rgba(33,33,33,0.95)] border-[rgba(189,189,189,0.4)]">
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="auto">Auto (System)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Notification Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[rgba(255,255,255,0.05)] rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Email Notifications</h4>
                    <p className="text-gray-400 text-sm">Receive notifications via email</p>
                  </div>
                  <Checkbox
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({...notifications, email: checked as boolean})}
                    className="text-[#FFFF00] border-gray-500 data-[state=checked]:bg-[#FFFF00] data-[state=checked]:border-[#FFFF00]"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-[rgba(255,255,255,0.05)] rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Push Notifications</h4>
                    <p className="text-gray-400 text-sm">Receive push notifications in browser</p>
                  </div>
                  <Checkbox
                    checked={notifications.push}
                    onCheckedChange={(checked) => setNotifications({...notifications, push: checked as boolean})}
                    className="text-[#FFFF00] border-gray-500 data-[state=checked]:bg-[#FFFF00] data-[state=checked]:border-[#FFFF00]"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-[rgba(255,255,255,0.05)] rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Reminder Notifications</h4>
                    <p className="text-gray-400 text-sm">Get reminded to track time</p>
                  </div>
                  <Checkbox
                    checked={notifications.reminders}
                    onCheckedChange={(checked) => setNotifications({...notifications, reminders: checked as boolean})}
                    className="text-[#FFFF00] border-gray-500 data-[state=checked]:bg-[#FFFF00] data-[state=checked]:border-[#FFFF00]"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Security Settings</h3>
              <div className="space-y-4">
                <Button variant="ghost" className="w-full justify-start h-auto p-4 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-white border-0">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <h4 className="text-white font-medium">Change Password</h4>
                      <p className="text-gray-400 text-sm">Update your account password</p>
                    </div>
                    <span className="text-gray-400">→</span>
                  </div>
                </Button>

                <Button variant="ghost" className="w-full justify-start h-auto p-4 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-white border-0">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                      <p className="text-gray-400 text-sm">Add an extra layer of security</p>
                    </div>
                    <span className="text-gray-400">→</span>
                  </div>
                </Button>

                <Button variant="ghost" className="w-full justify-start h-auto p-4 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-white border-0">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <h4 className="text-white font-medium">Active Sessions</h4>
                      <p className="text-gray-400 text-sm">Manage your active sessions</p>
                    </div>
                    <span className="text-gray-400">→</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        );

      case 'export':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Export Your Data</h3>
              <div className="space-y-4">
                <div className="p-4 bg-[rgba(255,255,255,0.05)] rounded-lg">
                  <h4 className="text-white font-medium mb-2">Export Time Entries</h4>
                  <p className="text-gray-400 text-sm mb-4">Download all your time tracking data in CSV format</p>
                  <Button className="bg-[#FFFF00] text-gray-900 hover:bg-[#F2EC9B]">
                    Export CSV
                  </Button>
                </div>

                <div className="p-4 bg-[rgba(255,255,255,0.05)] rounded-lg">
                  <h4 className="text-white font-medium mb-2">Export Projects</h4>
                  <p className="text-gray-400 text-sm mb-4">Download your project data and configurations</p>
                  <Button className="bg-[#FFFF00] text-gray-900 hover:bg-[#F2EC9B]">
                    Export JSON
                  </Button>
                </div>

                <div className="p-4 bg-[rgba(255,255,255,0.05)] rounded-lg">
                  <h4 className="text-white font-medium mb-2">Full Data Export</h4>
                  <p className="text-gray-400 text-sm mb-4">Download all your data including settings and preferences</p>
                  <Button className="bg-[#FFFF00] text-gray-900 hover:bg-[#F2EC9B]">
                    Export All
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-300">Manage your account preferences and settings</p>
      </div>

      {/* Settings Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-64">
          <Card className="backdrop-blur-[16px] saturate-[180%] bg-[rgba(33,33,33,0.9)] border border-[rgba(189,189,189,0.4)] shadow-lg">
            <CardContent className="p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant="ghost"
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full justify-start ${
                      activeTab === tab.id
                        ? 'bg-[#FFFF00] text-gray-900'
                        : 'text-gray-300 hover:bg-[rgba(255,255,255,0.1)] hover:text-white'
                    }`}
                  >
                    <span className="mr-3">{tab.icon}</span>
                    {tab.name}
                  </Button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <Card className="backdrop-blur-[16px] saturate-[180%] bg-[rgba(33,33,33,0.9)] border border-[rgba(189,189,189,0.4)] shadow-lg">
            <CardContent className="p-6">
              {renderTabContent()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
