/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {RecoilEnv, RecoilRoot} from 'recoil';
import {ThemeProvider} from 'styled-components/native';

import StackNavigator from './src/navigation/stack-navigator';
import {darkTheme} from './src/themes/dark';

import RNBootSplash from 'react-native-bootsplash';
import {IdleProvider} from './src/contexts/idle-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import ReactNativeRecoilPersist, {
  ReactNativeRecoilPersistGate,
} from 'react-native-recoil-persist';

RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

function App(): JSX.Element {
  useEffect(() => {
    RNBootSplash.hide();
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <RecoilRoot>
        <ReactNativeRecoilPersistGate store={ReactNativeRecoilPersist}>
          <ThemeProvider theme={darkTheme}>
            <IdleProvider>
              <NavigationContainer>
                <StackNavigator />
              </NavigationContainer>
            </IdleProvider>
          </ThemeProvider>
        </ReactNativeRecoilPersistGate>
      </RecoilRoot>
    </GestureHandlerRootView>
  );
}

export default App;
