import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { RecoilEnv, RecoilRoot } from 'recoil';
import { ThemeProvider } from 'styled-components/native';

import StackNavigator from './src/navigation/stack-navigator';

import RNBootSplash from 'react-native-bootsplash';
import { IdleProvider } from './src/contexts/idle-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ReactNativeRecoilPersist, {
  ReactNativeRecoilPersistGate,
} from 'react-native-recoil-persist';
import Toast from 'react-native-toast-message';
import { CurrentTheme } from './src/themes';
import { toastConfig } from './src/config/toast';
import RecoilNexus from 'recoil-nexus';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { I18nextProvider } from 'react-i18next';
import i18next from './src/i18n';
import { NotificationBootSync } from './src/service/notification';
import { navigationRef } from './src/navigation/navigation-ref';
import { AppLockGate } from './src/components/app-lock-gate';
import { IncomingTuduFileHandler } from './src/components/incoming-tudu-file-handler';
import notifee from '@notifee/react-native';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

function App(): React.JSX.Element {
  const [initialCallParams, setInitialCallParams] = useState<any>(() => {
    try {
      const rawPending = storage.getString('pending_incoming_call');
      if (rawPending) {
        const parsed = JSON.parse(rawPending);
        if (Date.now() - (parsed.timestamp || 0) < 60000) {
          storage.delete('pending_incoming_call');
          return parsed;
        }
        storage.delete('pending_incoming_call');
      }
    } catch {
      // Ignore
    }
    return null;
  });
  const [hasCheckedNotification, setHasCheckedNotification] = useState<boolean>(
    Boolean(initialCallParams),
  );

  useEffect(() => {
    if (initialCallParams) {
      setHasCheckedNotification(true);
      return;
    }

    const checkInitialCall = async () => {
      try {
        const rawPending = storage.getString('pending_incoming_call');
        if (rawPending) {
          const parsed = JSON.parse(rawPending);
          if (Date.now() - (parsed.timestamp || 0) < 60000) {
            storage.delete('pending_incoming_call');
            setInitialCallParams(parsed);
            setHasCheckedNotification(true);
            return;
          }
        }

        const initNotif = await notifee.getInitialNotification();
        if (initNotif?.notification) {
          const data = initNotif.notification.data;
          const isCall =
            data?.type === 'call_reminder' ||
            initNotif.notification.id?.startsWith('call_tudu_') ||
            initNotif.pressAction?.id === 'call' ||
            initNotif.pressAction?.id === 'call_answer';

          if (isCall) {
            setInitialCallParams({
              tuduId: data?.tuduId,
              tuduTitle: data?.taskTitle || initNotif.notification.body || 'Lembrete do Tudú',
              listName: data?.listName,
              listId: data?.listId,
              isTest: Boolean(data?.isTest),
              autoAnswer: initNotif.pressAction?.id === 'call_answer',
            });
          }
        }
      } catch (err) {
        console.warn('Error checking initial notification:', err);
      } finally {
        setHasCheckedNotification(true);
      }
    };

    checkInitialCall();
  }, [initialCallParams]);

  return (
    <I18nextProvider i18n={i18next}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ThemeProvider theme={CurrentTheme}>
            <RecoilRoot>
              <RecoilNexus />
              <ReactNativeRecoilPersistGate
                onInit={() => RNBootSplash.hide()}
                store={ReactNativeRecoilPersist}>
                <IdleProvider>
                  <AppLockGate>
                    <NotificationBootSync />
                    <IncomingTuduFileHandler />
                    {hasCheckedNotification && (
                      <NavigationContainer ref={navigationRef}>
                        <StackNavigator
                          initialRouteName={initialCallParams ? 'IncomingCall' : 'SplashScreen'}
                          initialParams={initialCallParams}
                        />
                        <Toast config={toastConfig} />
                      </NavigationContainer>
                    )}
                  </AppLockGate>
                </IdleProvider>
              </ReactNativeRecoilPersistGate>
            </RecoilRoot>
          </ThemeProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </I18nextProvider>
  );
}

export default App;
