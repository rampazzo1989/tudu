import { useRecoilState, useRecoilValue } from 'recoil';
import { subscriptionState, userSessionState } from '../../state/atoms';
import { AuthService } from './auth-service';
import { useCallback, useState } from 'react';

export function useAuth() {
  const [session, setSession] = useRecoilState(userSessionState);
  const subscription = useRecoilValue(subscriptionState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await AuthService.signInWithGoogle();
      return user;
    } catch (err: any) {
      setError(err?.message || 'Falha ao autenticar com o Google.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signInWithApple = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await AuthService.signInWithApple();
      return user;
    } catch (err: any) {
      setError(err?.message || 'Falha ao autenticar com a Apple.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const devLogin = useCallback(async (email?: string, name?: string) => {
    setLoading(true);
    setError(null);
    try {
      return await AuthService.devLogin(email, name);
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      await AuthService.signOut();
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user: session.user,
    isAuthenticated: !!session.token,
    isPro: subscription.isPro,
    subscriptionStatus: subscription.status,
    loading,
    error,
    signInWithGoogle,
    signInWithApple,
    devLogin,
    signOut,
  };
}
