'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { selectUser, selectAuthLoading, selectIsAuthenticated } from '@/store/selectors/authSelectors';
import TopNavbar from '@/components/layout/TopNavbar';
import LeftSidebar from '@/components/layout/LeftSidebar';
import RightSidebar from '@/components/layout/RightSidebar';
import BottomNavbar from '@/components/layout/BottomNavbar';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAppSelector(selectUser);
  const loading = useAppSelector(selectAuthLoading);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#0095f6] border-r-transparent"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <TopNavbar />
      <div className="mx-auto flex w-full max-w-full justify-center gap-8 px-4 pb-16 md:pb-0">
        {/* <LeftSidebar /> */}
        <main className="flex-1 max-w-[614px] min-w-0 w-full md:max-w-full xl:max-w-[614px]">
          {children}
        </main>
        <RightSidebar />
      </div>
      <BottomNavbar />
    </div>
  );
}
