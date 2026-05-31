import React, { createContext, useContext, useState, useEffect } from 'react';
import { Habit, HabitLog, HabitMode } from '@/src/types';
import { formatDate } from '@/src/lib/utils';
import { useAuth } from '@/src/lib/AuthContext';

interface HabitContextType {
  habits: Habit[];
  logs: Record<string, HabitLog>;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'userId'>) => void;
  updateLog: (habitId: string, date: string, value: number) => void;
  removeHabit: (habitId: string) => void;
  isLoading: boolean;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export function HabitProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<Record<string, HabitLog>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from LocalStorage keyed by userId
  useEffect(() => {
    if (!user) {
      setHabits([]);
      setLogs({});
      return;
    }

    const savedHabits = localStorage.getItem(`habits_${user.uid}`);
    const savedLogs = localStorage.getItem(`logs_${user.uid}`);
    
    if (savedHabits) setHabits(JSON.parse(savedHabits));
    else setHabits([]);

    if (savedLogs) setLogs(JSON.parse(savedLogs));
    else setLogs({});
    
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    if (!isLoading && user) {
      localStorage.setItem(`habits_${user.uid}`, JSON.stringify(habits));
    }
  }, [habits, isLoading, user]);

  useEffect(() => {
    if (!isLoading && user) {
      localStorage.setItem(`logs_${user.uid}`, JSON.stringify(logs));
    }
  }, [logs, isLoading, user]);

  const addHabit = (data: Omit<Habit, 'id' | 'createdAt' | 'userId'>) => {
    if (!user) return;
    const newHabit: Habit = {
      ...data,
      id: Math.random().toString(36).substring(7),
      userId: user.uid,
      createdAt: new Date().toISOString(),
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const removeHabit = (habitId: string) => {
    if (!user) return;
    setHabits(prev => prev.filter(h => h.id !== habitId));
  };

  const updateLog = (habitId: string, date: string, value: number) => {
    if (!user) return;
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const logId = `${habitId}_${user.uid}_${date}`;
    const isCompleted = value >= habit.goal;

    const newLog: HabitLog = {
      id: logId,
      habitId,
      userId: user.uid,
      date,
      value,
      completed: isCompleted,
      updatedAt: new Date().toISOString(),
    };

    setLogs(prev => ({
      ...prev,
      [logId]: newLog
    }));
  };

  return (
    <HabitContext.Provider value={{ habits, logs, addHabit, updateLog, removeHabit, isLoading }}>
      {children}
    </HabitContext.Provider>
  );
}

export function useHabits() {
  const context = useContext(HabitContext);
  if (!context) throw new Error('useHabits must be used within HabitProvider');
  return context;
}
