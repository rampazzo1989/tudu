import React, {useCallback, useEffect, useRef} from 'react';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {View, Text, StatusBar} from 'react-native';
import {StackNavigatorParamList} from './types';
import {HomePage} from '../../scenes/home';
import {TuduIcon} from '../../components/animated-icons/tudu-icon';
import {LogoText} from '../../assets/static/logo_text';
import {AnimatedIconRef} from '../../components/animated-icons/animated-icon/types';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import 'react-native-gesture-handler';
import {createStackNavigator} from '@react-navigation/stack';
import {TransitionSpec} from '@react-navigation/stack/lib/typescript/src/types';
import {SafeAreaView} from 'react-native-safe-area-context';
import changeNavigationBarColor, {
  hideNavigationBar,
} from 'react-native-navigation-bar-color';
import {SplashScreen} from '../../scenes/splash-screen';
import {useTheme} from 'styled-components/native';

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
      initialRouteName="Details"
      screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="Details"
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
    </Stack.Navigator>
  );
};

export default StackNavigator;
