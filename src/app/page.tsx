'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { TasksProvider } from '@/contexts/tasks-context';
import { TaskForm } from '@/components/task-form';
import { TaskList } from '@/components/task-list';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { LogOut, Bell, BellOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { NotificationHandler } from '@/components/notification-handler';

export default function Home() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      setLoading(false);
      if (typeof window !== 'undefined' && 'Notification' in window) {
        setNotificationsEnabled(Notification.permission === 'granted');
      }
    }
  }, [user, router]);
  
  const handleEnableNotifications = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
        toast({ title: "Error", description: "Notifications not supported in this browser.", variant: "destructive" });
        return;
    }
    
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            setNotificationsEnabled(true);
            toast({ title: "Success", description: "Notifications have been enabled." });
        } else {
            setNotificationsEnabled(false);
            toast({ title: "Info", description: "Notifications permission was not granted." });
        }
    } catch (error) {
        console.error("Error requesting notification permission:", error);
        toast({ title: "Error", description: "Could not enable notifications.", variant: "destructive" });
    }
  };

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <TasksProvider user={user}>
      <div className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-2xl">
          <header className="flex items-center justify-between pb-6">
            <h1 className="text-4xl font-headline font-bold text-primary">TaskMaster</h1>
            <div className="flex items-center gap-2">
              <Button onClick={handleEnableNotifications} variant="ghost" size="icon" aria-label="Enable Notifications">
                {notificationsEnabled ? <Bell className="text-green-500" /> : <BellOff className="text-muted-foreground" />}
              </Button>
              <Button onClick={logout} variant="ghost" size="icon" aria-label="Log out">
                <LogOut />
              </Button>
            </div>
          </header>
          <main>
            <TaskForm />
            <Separator className="my-6" />
            <TaskList />
          </main>
        </div>
      </div>
      {notificationsEnabled && <NotificationHandler />}
    </TasksProvider>
  );
}
