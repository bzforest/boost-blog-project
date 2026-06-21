"use client";

import React, { useState, useEffect } from 'react';
import { signIn, signOut, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/shared/Logo';

export default function BoostStudioLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [session, setSession] = useState<any>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    getSession().then((sess) => {
      setSession(sess);
      setLoadingSession(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError('Invalid credentials. Access denied.');
      } else if (res?.ok) {
        router.push('/admin');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    await signOut({ callbackUrl: '/' });
  };

  if (loadingSession) {
    return (
      <div className="min-h-screen bg-bg-main flex justify-center items-center">
        <div className="text-primary font-medium tracking-widest animate-pulse">LOADING SYSTEM...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-surface border border-white/5 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
        
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center mb-8">
          <Logo interactive={false} textSize="text-4xl" className="mb-2" />
          <h1 className="text-xl font-medium text-text-main/80 mt-4 tracking-wider">
            RESTRICTED ACCESS
          </h1>
        </div>

        {session ? (
          <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="text-center p-4 w-full border-b border-white/80 pb-8">
              <p className="text-green-500 font-medium mb-1 tracking-widest text-sm">SYSTEM AUTHENTICATED</p>
              <p className="text-text-muted text-sm">Logged in as {session.user?.email || 'Admin'}</p>
            </div>
            
            <div className="flex flex-col gap-3 w-full">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full"
                onClick={() => router.push('/admin')}
                disabled={isLoading}
              >
                GO TO DASHBOARD
              </Button>
              <Button 
                variant="ghost" 
                size="lg" 
                className="w-full text-red-400 hover:text-red-500 hover:bg-red-500/10"
                onClick={handleLogout}
                disabled={isLoading}
              >
                {isLoading ? 'LOGGING OUT...' : 'LOGOUT'}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-6">
            <Input 
              label="Admin Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
              required
              disabled={isLoading}
            />
            <Input 
              label="Passcode"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter secure passcode"
              required
              disabled={isLoading}
            />

            {error && (
              <div className="text-red-500 text-sm text-center bg-red-500/10 p-3 rounded-md border border-red-500/20">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              variant="primary" 
              size="lg" 
              className="w-full mt-2"
              disabled={isLoading}
            >
              {isLoading ? 'AUTHENTICATING...' : 'ENTER SYSTEM'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
