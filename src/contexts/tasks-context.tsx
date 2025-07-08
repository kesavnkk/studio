'use client';

import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Task, Priority, User } from '@/lib/types';

interface TasksContextType {
  tasks: Task[];
  addTask: (detail: string, reminderDate: Date, priority: Priority) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  setTasks: (tasks: Task[]) => void;
}

export const TasksContext = createContext<TasksContextType | null>(null);

export function TasksProvider({ children, user }: { children: ReactNode; user: User }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  const getStorageKey = useCallback(() => `taskmaster_tasks_${user.email}`, [user.email]);

  useEffect(() => {
    const storedTasks = localStorage.getItem(getStorageKey());
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    } else {
      setTasks([]);
    }
  }, [getStorageKey]);

  useEffect(() => {
    localStorage.setItem(getStorageKey(), JSON.stringify(tasks));
  }, [tasks, getStorageKey]);

  const addTask = (detail: string, reminderDate: Date, priority: Priority) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      detail,
      reminderDate: reminderDate.toISOString(),
      priority,
      isCompleted: false,
      notified: false,
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prevTasks =>
      prevTasks.map(task => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };
  
  const handleSetTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
  };

  return (
    <TasksContext.Provider value={{ tasks, addTask, updateTask, deleteTask, setTasks: handleSetTasks }}>
      {children}
    </TasksContext.Provider>
  );
}
