'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface LoginFormProps {
  username: string;
}

export function LoginForm({ username }: LoginFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (result?.ok) {
        router.push('/editor');
      } else {
        throw new Error('Invalid username or password');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Username" value={username} disabled className="opacity-75" />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        required
      />
      {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
      <Button
        type="submit"
        disabled={loading}
        className="w-full"
        variant="primary"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
}
