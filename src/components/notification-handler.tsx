'use client';

import { useEffect, useCallback } from 'react';
import { useTasks } from '@/hooks/use-tasks';
import { useToast } from './ui/use-toast';
import * as Tone from 'tone';

export function NotificationHandler() {
  const { tasks, updateTask } = useTasks();
  const { toast } = useToast();

  const playSound = useCallback(async () => {
    try {
      await Tone.start();
      const synth = new Tone.Synth().toDestination();
      synth.triggerAttackRelease('C5', '8n');
    } catch (error) {
      console.error('Could not play sound:', error);
    }
  }, []);

  const showNotification = useCallback(
    (task: import('@/lib/types').Task) => {
      playSound();

      const notification = new Notification('TaskMaster Reminder', {
        body: task.detail,
        icon: '/favicon.ico', // A generic icon
        tag: task.id,
      });

      notification.onclick = () => {
        window.focus();
      };
      
      updateTask(task.id, { notified: true });
    },
    [playSound, updateTask]
  );

  useEffect(() => {
    const checkTasks = () => {
      const now = new Date();
      tasks.forEach(task => {
        if (!task.isCompleted && !task.notified) {
          const reminderDate = new Date(task.reminderDate);
          if (now >= reminderDate) {
            console.log(`Triggering notification for task: ${task.detail}`);
            showNotification(task);
          }
        }
      });
    };

    const intervalId = setInterval(checkTasks, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [tasks, showNotification]);

  return null; // This component does not render anything
}
