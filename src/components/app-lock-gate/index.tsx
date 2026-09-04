import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { useAppLockLifecycle } from '../../service/security';
import { LockScreen } from '../lock-screen';
import { navigationRef } from '../../navigation/navigation-ref';
import { setShowWhenLocked } from '../../service/device-lock/deviceLock';

export interface AppLockGateProps {
  children: React.ReactNode;
}

export const AppLockGate: React.FC<AppLockGateProps> = ({ children }) => {
  const { isAppLocked } = useAppLockLifecycle();
  const [currentRoute, setCurrentRoute] = useState<string | undefined>(undefined);

  useEffect(() => {
    const updateRoute = () => {
      if (navigationRef.isReady()) {
        const routeName = navigationRef.getCurrentRoute()?.name;
        setCurrentRoute(routeName);
        if (routeName && routeName !== 'IncomingCall') {
          setShowWhenLocked(false);
        }
      }
    };
    updateRoute();
    const unsubscribe = navigationRef.addListener('state', updateRoute);
    return () => {
      unsubscribe();
    };
  }, []);

  const isIncomingCall = currentRoute === 'IncomingCall';

  return (
    <View style={{ flex: 1 }}>
      {children}
      {isAppLocked && !isIncomingCall && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999999,
          }}>
          <LockScreen />
        </View>
      )}
    </View>
  );
};
