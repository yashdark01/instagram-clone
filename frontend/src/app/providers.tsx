'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { checkAuthAsync } from '@/store/thunks/authThunks';

function AuthChecker({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuthAsync());
  }, [dispatch]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthChecker>{children}</AuthChecker>
    </Provider>
  );
}

