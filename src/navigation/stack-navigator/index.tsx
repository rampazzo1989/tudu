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

const Stack = createStackNavigator<StackNavigatorParamList>();

const Test = React.memo(({navigation}: NativeStackScreenProps<{}>) => {
  const iconRef = useRef<AnimatedIconRef>(null);

  // StatusBar.setBackgroundColor('#6B49B7');
  // hideNavigationBar();
  // changeNavigationBarColor('#6B49B7');
  // setTimeout(() => changeNavigationBarColor('#6B49B7', true, false), 100);

  useEffect(() => {
    // changeNavigationBarColor('#6B49B7');

    iconRef.current?.play({
      animationLayer: 'toggleOff',
      onAnimationFinish: () =>
        iconRef.current?.play({
          animationLayer: 'toggleOn',
          onAnimationFinish: () => navigation.replace('Home'),
        }),
    });
  });

  return (
    // <SafeAreaView style={{flex: 1, backgroundColor: 'red'}}>
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#6B49B7',
      }}>
      <StatusBar
        backgroundColor={'#6B49B7'}
        barStyle="light-content"
        translucent={false}
        //hidden={true}
      />
      <View style={{height: 22 + StatusBar.length}} />
      <TuduIcon
        style={{height: 100, width: 100, marginTop: 5}}
        size={100}
        resizeMode="cover"
        speed={1.5}
        ref={iconRef}
      />
      <LogoText height={61} width={56} style={{marginRight: 2}} />
    </SafeAreaView>
    // </SafeAreaView>
  );
});

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
      duration: 100,
    },
  };
  return (
    <Stack.Navigator
      initialRouteName="Details"
      screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="Details"
        component={Test}
        options={{
          cardStyle: {backgroundColor: '#7956BF'},
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
          cardStyle: {backgroundColor: '#7956BF'},
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
