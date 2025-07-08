'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, PlusCircle, Clock, BellRing } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTasks } from '@/hooks/use-tasks';
import { useToast } from '@/hooks/use-toast';
import type { Priority } from '@/lib/types';

const formSchema = z.object({
  detail: z.string().min(1, { message: 'Task detail is required.' }),
  eventDate: z.date({ required_error: 'An event date is required.' }),
  eventTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Invalid time format. Use HH:mm.' }),
  earlyReminderHours: z.coerce.number().min(0).default(0),
  priority: z.enum(['High', 'Medium', 'Low']),
});

export function TaskForm() {
  const { addTask } = useTasks();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      detail: '',
      eventTime: '09:00',
      earlyReminderHours: 0,
      priority: 'Medium',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const [hours, minutes] = values.eventTime.split(':').map(Number);
    const eventDateTime = new Date(values.eventDate);
    eventDateTime.setHours(hours, minutes, 0, 0);

    const reminderDateTime = new Date(eventDateTime.getTime());
    if (values.earlyReminderHours > 0) {
      reminderDateTime.setHours(reminderDateTime.getHours() - values.earlyReminderHours);
    }

    addTask(values.detail, eventDateTime, reminderDateTime, values.priority as Priority);

    toast({
      title: 'Task Added',
      description: 'Your new task has been saved.',
    });
    form.reset();
    form.setValue('eventDate', undefined as any, { shouldValidate: false });
    form.setValue('eventTime', '09:00');
    form.setValue('earlyReminderHours', 0);
    form.setValue('priority', 'Medium');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="detail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Task</FormLabel>
              <FormControl>
                <Textarea placeholder="What do you need to do?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <FormField
            control={form.control}
            name="eventDate"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-end">
                <FormLabel>Event Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                      >
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="eventTime"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-end">
                <FormLabel>Event Time</FormLabel>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <FormControl>
                    <Input type="time" className="pl-10" {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="earlyReminderHours"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-end">
                <FormLabel>Remind (Hours Prior)</FormLabel>
                 <div className="relative">
                  <BellRing className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <FormControl>
                    <Input type="number" min="0" className="pl-10" {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-end">
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-end">
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
