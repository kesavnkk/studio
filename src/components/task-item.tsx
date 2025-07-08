'use client';

import { Task } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTasks } from '@/hooks/use-tasks';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Flame, AlertTriangle, ArrowDown, Trash2, Check, RotateCcw } from 'lucide-react';

const priorityConfig = {
  High: { icon: Flame, color: 'text-red-500', badgeVariant: 'destructive' as const },
  Medium: { icon: AlertTriangle, color: 'text-yellow-500', badgeVariant: 'secondary' as const },
  Low: { icon: ArrowDown, color: 'text-blue-500', badgeVariant: 'outline' as const },
};

export function TaskItem({ task }: { task: Task }) {
  const { updateTask, deleteTask } = useTasks();
  const { icon: Icon, color, badgeVariant } = priorityConfig[task.priority];
  
  const handleToggleComplete = () => {
    updateTask(task.id, { isCompleted: !task.isCompleted });
  };

  const handleDelete = () => {
    deleteTask(task.id);
  };
  
  const isOverdue = new Date(task.reminderDate) < new Date() && !task.isCompleted;

  return (
    <Card className={cn('transition-all duration-300', task.isCompleted ? 'bg-muted/50 opacity-60' : 'bg-card')}>
      <CardContent className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Button onClick={handleToggleComplete} variant="ghost" size="icon" className="shrink-0">
            {task.isCompleted ? <RotateCcw className="h-5 w-5 text-muted-foreground" /> : <Check className="h-5 w-5 text-primary" />}
          </Button>
          <div className="flex-1 min-w-0">
            <p className={cn('font-medium break-words', task.isCompleted && 'line-through')}>{task.detail}</p>
            <p className={cn('text-sm text-muted-foreground', isOverdue && 'text-destructive font-semibold')}>
              {format(new Date(task.reminderDate), 'PP')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant={badgeVariant} className="flex items-center gap-1">
            <Icon className={cn('h-3 w-3', color)} />
            <span>{task.priority}</span>
          </Badge>
          <Button onClick={handleDelete} variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
