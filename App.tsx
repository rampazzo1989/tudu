import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {RecoilEnv, RecoilRoot} from 'recoil';
import {ThemeProvider} from 'styled-components/native';

import StackNavigator from './src/navigation/stack-navigator';

import RNBootSplash from 'react-native-bootsplash';
import {IdleProvider} from './src/contexts/idle-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import ReactNativeRecoilPersist, {
  ReactNativeRecoilPersistGate,
} from 'react-native-recoil-persist';
import Toast from 'react-native-toast-message';
import {CurrentTheme} from './src/themes';
import {toastConfig} from './src/config/toast';
import RecoilNexus from 'recoil-nexus';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { I18nextProvider } from 'react-i18next';
import i18next from './src/i18n';

RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

function App(): React.JSX.Element {
  return (
    <I18nextProvider i18n={i18next}>
    <SafeAreaProvider>
      <GestureHandlerRootView style={{flex: 1}}>
        <ThemeProvider theme={CurrentTheme}>
          <RecoilRoot>
            <RecoilNexus />
            <ReactNativeRecoilPersistGate
              onInit={() => RNBootSplash.hide()}
              store={ReactNativeRecoilPersist}>
              <IdleProvider>
                <NavigationContainer>
                  <StackNavigator />
                  <Toast config={toastConfig} />
                </NavigationContainer>
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
