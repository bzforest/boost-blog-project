"use client";

import React, { useState, useEffect } from 'react';
import { signIn, signOut, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
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

  // Easter Egg States
  const [clickCount, setClickCount] = useState(0);
  const [showSecretModal, setShowSecretModal] = useState(false);
  const [secretCode, setSecretCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    getSession().then((sess) => {
      setSession(sess);
      setLoadingSession(false);
    });
  }, []);

  useEffect(() => {
    if (clickCount > 0) {
      const timer = setTimeout(() => setClickCount(0), 1000);
      return () => clearTimeout(timer);
    }
  }, [clickCount]);

  const handleSecretClick = () => {
    if (clickCount + 1 >= 3) {
      setShowSecretModal(true);
      setClickCount(0);
    } else {
      setClickCount((prev) => prev + 1);
    }
  };

  const handleSecretSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}/easter-egg`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secretCode }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setEmail(data.email);
        setPassword(data.passcode);
        setShowSecretModal(false);
        setSecretCode('');
        toast.success('Access Granted: Coordinates Loaded');
      } else {
        toast.error('Access Denied: Invalid Override Code');
        setSecretCode('');
      }
    } catch (error) {
      toast.error('System Malfunction');
    } finally {
      setIsVerifying(false);
    }
  };

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
          <h1 
            className="text-xl font-medium text-text-main/80 mt-4 tracking-wider cursor-default select-none"
            onClick={handleSecretClick}
          >
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

      {/* Secret Modal */}
      {showSecretModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111111] border border-primary/30 p-6 rounded-2xl w-full max-w-sm shadow-2xl shadow-primary/10">
            <h3 className="text-primary font-medium tracking-widest text-center mb-4">SYSTEM OVERRIDE</h3>
            <form onSubmit={handleSecretSubmit} className="flex flex-col gap-4">
              <Input
                type="password"
                placeholder="Enter Override Code"
                value={secretCode}
                onChange={(e) => setSecretCode(e.target.value)}
                autoFocus
                disabled={isVerifying}
              />
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-1/3 text-text-muted hover:text-white"
                  onClick={() => setShowSecretModal(false)}
                  disabled={isVerifying}
                >
                  ABORT
                </Button>
                <Button 
                  type="submit" 
                  className="w-2/3"
                  disabled={isVerifying}
                >
                  {isVerifying ? 'VERIFYING...' : 'EXECUTE'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
