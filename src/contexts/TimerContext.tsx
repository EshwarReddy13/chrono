'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface TimerState {
  isRunning: boolean;
  time: number;
  selectedProject: string;
  selectedTask: string;
  description: string;
  startTime: Date | null;
}

interface TimerContextType {
  timerState: TimerState;
  startTimer: (projectId: string, taskId?: string, description?: string, resetTime?: boolean) => void;
  continueTimer: () => void;
  pauseTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  updateTimer: (updates: Partial<TimerState>) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function useTimer() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}

interface TimerProviderProps {
  children: React.ReactNode;
}

export function TimerProvider({ children }: TimerProviderProps) {
  const [timerState, setTimerState] = useState<TimerState>({
    isRunning: false,
    time: 0,
    selectedProject: '',
    selectedTask: 'no-task',
    description: '',
    startTime: null
  });

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerState.isRunning) {
      interval = setInterval(() => {
        setTimerState(prev => ({
          ...prev,
          time: prev.time + 1
        }));
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timerState.isRunning]);

  const startTimer = (projectId: string, taskId: string = 'no-task', description: string = '', resetTime: boolean = true) => {
    setTimerState({
      isRunning: true,
      time: resetTime ? 0 : timerState.time,
      selectedProject: projectId,
      selectedTask: taskId,
      description,
      startTime: resetTime ? new Date() : timerState.startTime
    });
  };

  const continueTimer = () => {
    setTimerState(prev => ({
      ...prev,
      isRunning: true
    }));
  };

  const pauseTimer = () => {
    setTimerState(prev => ({
      ...prev,
      isRunning: false
    }));
  };

  const stopTimer = () => {
    setTimerState(prev => ({
      ...prev,
      isRunning: false
    }));
  };

  const resetTimer = () => {
    setTimerState({
      isRunning: false,
      time: 0,
      selectedProject: '',
      selectedTask: 'no-task',
      description: '',
      startTime: null
    });
  };

  const updateTimer = (updates: Partial<TimerState>) => {
    setTimerState(prev => ({
      ...prev,
      ...updates
    }));
  };

  const value: TimerContextType = {
    timerState,
    startTimer,
    continueTimer,
    pauseTimer,
    stopTimer,
    resetTimer,
    updateTimer
  };

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
}
