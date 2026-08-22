import React from 'react';
import { View } from 'react-native';
import { useAppLockLifecycle } from '../../service/security';
import { LockScreen } from '../lock-screen';

export interface AppLockGateProps {
  children: React.ReactNode;
}

export const AppLockGate: React.FC<AppLockGateProps> = ({ children }) => {
  const { isAppLocked } = useAppLockLifecycle();

  return (
    <View style={{ flex: 1 }}>
      {children}
      {isAppLocked && (
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
