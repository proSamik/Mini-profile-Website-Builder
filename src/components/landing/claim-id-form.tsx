'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { SignupForm } from '@/components/auth/signup-form';
import { LoginForm } from '@/components/auth/login-form';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export function ClaimIdForm() {
  const [username, setUsername] = useState('');
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (username.length < 3) {
      setAvailable(null);
      setShowForm(false);
      return;
    }

    // Reset form visibility while checking new username
    setShowForm(false);

    const timeout = setTimeout(async () => {
      setChecking(true);
      try {
        const res = await fetch(
          `/api/profiles/check-username?username=${encodeURIComponent(username)}`
        );
        const data = await res.json();
        setAvailable(data.available);
        setShowForm(true);
      } catch (error) {
        console.error('Error checking username:', error);
      } finally {
        setChecking(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [username]);

  return (
    <div className="w-full space-y-6">
      <div className="relative">
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
          placeholder="yourname"
          className="pr-10"
        />
        <div className="absolute right-3 top-[12px]">
          {checking && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />}
          {!checking && available === true && <CheckCircle2 className="w-5 h-5 text-green-500" />}
          {!checking && available === false && <XCircle className="w-5 h-5 text-red-500" />}
        </div>
      </div>

      {showForm && available === true && <SignupForm username={username} />}
      {showForm && available === false && <LoginForm username={username} />}
    </div>
  );
}
