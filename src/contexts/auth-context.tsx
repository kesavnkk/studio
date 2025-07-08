'use client';

import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  register: (user: User) => boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('taskmaster_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = useCallback(
    (userData: User) => {
      const users = JSON.parse(localStorage.getItem('taskmaster_users') || '[]') as User[];
      const foundUser = users.find(u => u.email === userData.email && u.password === userData.password);
      if (foundUser) {
        localStorage.setItem('taskmaster_user', JSON.stringify(foundUser));
        setUser(foundUser);
        router.push('/');
      } else {
        throw new Error('Invalid email or password');
      }
    },
    [router]
  );

  const register = useCallback((userData: User) => {
    const users = JSON.parse(localStorage.getItem('taskmaster_users') || '[]') as User[];
    if (users.some(u => u.email === userData.email)) {
      return false; // User already exists
    }
    users.push(userData);
    localStorage.setItem('taskmaster_users', JSON.stringify(users));
    return true;
  }, []);


  const logout = useCallback(() => {
    localStorage.removeItem('taskmaster_user');
    setUser(null);
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
