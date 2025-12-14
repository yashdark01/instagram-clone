'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { signupAsync } from '@/store/thunks/authThunks';
import { selectIsAuthenticated, selectAuthLoading, selectAuthError } from '@/store/selectors/authSelectors';
import { clearError } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/home');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(signupAsync({ username, email, password, fullName }));
    if (signupAsync.fulfilled.match(result)) {
      router.push('/home');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-8">
      <Card className="w-full max-w-[350px] border border-[#dbdbdb] bg-white">
        <CardContent className="p-8">
          <div className="mb-8 text-center">
            <h1 className="mb-6 text-4xl font-light">Instagram</h1>
            <p className="ig-text-secondary text-base font-semibold mb-4">
              Sign up to see photos and videos from your friends.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="text"
              placeholder="Mobile Number or Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-10 bg-[#fafafa] border-[#dbdbdb] text-sm"
              disabled={loading}
            />
            <Input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-10 bg-[#fafafa] border-[#dbdbdb] text-sm"
              disabled={loading}
            />
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              maxLength={30}
              className="h-10 bg-[#fafafa] border-[#dbdbdb] text-sm"
              disabled={loading}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="h-10 bg-[#fafafa] border-[#dbdbdb] text-sm"
              disabled={loading}
            />
            {error && (
              <div className="rounded-sm bg-red-50 p-3 text-sm text-[#ed4956] border border-red-200">
                {error}
              </div>
            )}
            <Button
              type="submit"
              className="w-full h-10 bg-[#0095f6] hover:bg-[#1877f2] text-white font-semibold rounded-md"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing up...
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="ig-text-secondary text-xs">
              Have an account?{' '}
              <Link href="/login" className="ig-text-link">
                Log in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
