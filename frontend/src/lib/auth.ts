import { useRouter } from 'next/navigation';
import { authAPI } from './api';

export const useAuth = () => {
  const router = useRouter();

  const redirectToLogin = () => {
    router.push('/login');
  };

  const redirectToHome = () => {
    router.push('/home');
  };

  return {
    redirectToLogin,
    redirectToHome,
  };
};

