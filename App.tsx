/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
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
import Toast, {BaseToast} from 'react-native-toast-message';

RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

const toastConfig = {
  tuduWarning: props => (
    <BaseToast
      {...props}
      style={{borderLeftColor: '#7956BF', backgroundColor: '#444B56'}}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
        color: 'white',
      }}
    />
  ),
};

function App(): JSX.Element {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <ThemeProvider theme={darkTheme}>
        <RecoilRoot>
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
