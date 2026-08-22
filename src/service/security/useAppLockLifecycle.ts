import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useRecoilState, useRecoilValue } from 'recoil';
import { appLockSessionState, LockTimeoutOption, securitySettingsState } from '../../state/atoms';

const TIMEOUT_MS_MAP: Record<LockTimeoutOption, number> = {
  immediate: 500, // small threshold to ignore quick orientation or permission flashes
  '1m': 60 * 1000,
  '5m': 5 * 60 * 1000,
  '15m': 15 * 60 * 1000,
};

export function useAppLockLifecycle() {
  const securitySettings = useRecoilValue(securitySettingsState);
  const [session, setSession] = useRecoilState(appLockSessionState);
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const backgroundTimestampRef = useRef<number | null>(null);

  // Initial cold start check: lock app if lock is enabled
  useEffect(() => {
    if (securitySettings.isLockEnabled) {
      setSession(prev => ({
        ...prev,
        isAppLocked: true,
      }));
    }
  }, [securitySettings.isLockEnabled, setSession]);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        const prevAppState = appState.current;
        appState.current = nextAppState;

        if (!securitySettings.isLockEnabled) {
          return;
        }

        if (
          prevAppState === 'active' &&
          (nextAppState === 'background' || nextAppState === 'inactive')
        ) {
          backgroundTimestampRef.current = Date.now();
          setSession(prev => ({
            ...prev,
            lastBackgroundAt: Date.now(),
          }));
        } else if (
          (prevAppState === 'background' || prevAppState === 'inactive') &&
          nextAppState === 'active'
        ) {
          const bgTime = backgroundTimestampRef.current;
          if (bgTime) {
            const elapsed = Date.now() - bgTime;
            const threshold = TIMEOUT_MS_MAP[securitySettings.lockTimeout] || 0;

            if (elapsed >= threshold) {
              setSession(prev => ({
                ...prev,
                isAppLocked: true,
              }));
            }
          }
          backgroundTimestampRef.current = null;
        }
      },
    );

    return () => {
      subscription.remove();
    };
  }, [securitySettings.isLockEnabled, securitySettings.lockTimeout, setSession]);

  return {
    isAppLocked: securitySettings.isLockEnabled && session.isAppLocked,
  };
}
