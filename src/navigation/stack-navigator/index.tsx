import React from 'react';
import {StackNavigatorParamList} from './types';
import {HomePage} from '../../scenes/home';
import 'react-native-gesture-handler';
import {createStackNavigator} from '@react-navigation/stack';
import {TransitionSpec} from '@react-navigation/stack/lib/typescript/src/types';
import {SplashScreen} from '../../scenes/splash-screen';
import {useTheme} from 'styled-components/native';
import {ListPage} from '../../scenes/list';

const Stack = createStackNavigator<StackNavigatorParamList>();

const StackNavigator = () => {
  const theme = useTheme();

  const config: TransitionSpec = {
    animation: 'timing',
    config: {
      duration: 0,
    },
  };

  const configSlow: TransitionSpec = {
    animation: 'timing',
    config: {
      duration: 100,
    },
  };

  return (
    <Stack.Navigator
      initialRouteName="SplashScreen"
      screenOptions={{headerShown: false, detachPreviousScreen: false}}>
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{
          transitionSpec: {
            open: config,
            close: configSlow,
          },
        }}
      />
      <Stack.Screen
        name="Home"
        component={HomePage}
        options={{
          cardStyle: {backgroundColor: theme.colors.primary},
          transitionSpec: {
            open: config,
            close: config,
          },
        }}
      />
      <Stack.Screen
        name="List"
        component={ListPage}
        options={{
          cardStyle: {backgroundColor: theme.colors.primary},
          transitionSpec: {
            open: config,
            close: config,
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
