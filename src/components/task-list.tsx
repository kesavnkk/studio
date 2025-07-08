'use client';

import { useTasks } from '@/hooks/use-tasks';
import { TaskItem } from './task-item';
import { useMemo, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type SortOption = 'priority' | 'date-asc' | 'date-desc' | 'status';

export function TaskList() {
  const { tasks } = useTasks();
  const [sortOption, setSortOption] = useState<SortOption>('priority');

  const sortedTasks = useMemo(() => {
    const tasksCopy = [...tasks];
    switch (sortOption) {
      case 'priority':
        const priorityOrder = { High: 0, Medium: 1, Low: 2 };
        return tasksCopy.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
      case 'date-asc':
        return tasksCopy.sort((a, b) => new Date(a.reminderDate).getTime() - new Date(b.reminderDate).getTime());
      case 'date-desc':
        return tasksCopy.sort((a, b) => new Date(b.reminderDate).getTime() - new Date(a.reminderDate).getTime());
      case 'status':
        return tasksCopy.sort((a, b) => (a.isCompleted ? 1 : 0) - (b.isCompleted ? 1 : 0));
      default:
        return tasksCopy;
    }
  }, [tasks, sortOption]);
  
  if (tasks.length === 0) {
    return (
        <div className="text-center py-10">
            <h2 className="text-2xl font-semibold">All Clear!</h2>
            <p className="text-muted-foreground mt-2">You have no tasks. Add one above to get started.</p>
        </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold font-headline">Your Tasks</h2>
        <Select onValueChange={(value: SortOption) => setSortOption(value)} defaultValue={sortOption}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="date-asc">Date (Oldest)</SelectItem>
            <SelectItem value="date-desc">Date (Newest)</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-3">
        {sortedTasks.map(task => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
