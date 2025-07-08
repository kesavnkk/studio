import { RegisterForm } from '@/components/register-form';

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-headline font-bold text-primary text-center mb-2">Create an Account</h1>
        <p className="text-muted-foreground text-center mb-8">Join TaskMaster to manage your to-dos.</p>
        <RegisterForm />
      </div>
    </main>
  );
}
