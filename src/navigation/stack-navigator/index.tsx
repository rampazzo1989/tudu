import React, {useEffect, useRef} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import 'react-native-gesture-handler';
import {createStackNavigator} from '@react-navigation/stack';
import {TransitionSpec} from '@react-navigation/stack/lib/typescript/src/types';

const Stack = createStackNavigator<StackNavigatorParamList>();

function Test({navigation}: NativeStackScreenProps<{}>) {
  const iconRef = useRef<AnimatedIconRef>(null);

  useEffect(() => {
    iconRef.current?.play({
      animationLayer: 'toggleOff',
      onAnimationFinish: () =>
        iconRef.current?.play({
          animationLayer: 'toggleOn',
          onAnimationFinish: () => navigation.navigate('Home'),
        }),
    });
  });

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#6B49B7',
      }}>
      <StatusBar backgroundColor={'#6B49B7'} />
      <View style={{height: 22}} />
      <TuduIcon
        style={{height: 100, width: 100, marginTop: 5}}
        size={100}
        resizeMode="cover"
        ref={iconRef}
      />
      <LogoText height={61} width={56} />
    </View>
  );
}

const StackNavigator = () => {
  const config: TransitionSpec = {
    animation: 'timing',
    config: {
      duration: 0,
    },
  };

  const configSlow: TransitionSpec = {
    animation: 'timing',
    config: {
      duration: 0,
    },
  };
  return (
    <Stack.Navigator
      initialRouteName="Details"
      screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="Home"
        component={HomePage}
        options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }}
      />
      <Stack.Screen
        name="Details"
        component={Test}
        options={{
          transitionSpec: {
            open: config,
            close: configSlow,
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
