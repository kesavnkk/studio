import { LoginForm } from '@/components/login-form';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
       <div className="w-full max-w-md">
         <h1 className="text-4xl font-headline font-bold text-primary text-center mb-2">TaskMaster</h1>
         <p className="text-muted-foreground text-center mb-8">Welcome back! Please sign in.</p>
         <LoginForm />
       </div>
    </main>
  );
}
