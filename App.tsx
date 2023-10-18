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

RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

function App(): JSX.Element {
  return (
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
  );
}

export default App;
