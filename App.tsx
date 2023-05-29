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

RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

function App(): JSX.Element {
  return (
    <RecoilRoot>
      <ThemeProvider theme={darkTheme}>
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </RecoilRoot>
  );
}

export default App;
