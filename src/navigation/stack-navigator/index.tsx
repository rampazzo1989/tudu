import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {View, Text} from 'react-native';
import {StackNavigatorParamList} from './types';
import {HomePage} from '../../scenes/home';

const Stack = createNativeStackNavigator<StackNavigatorParamList>();

function Test() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Test Screen</Text>
    </View>
  );
}

const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={HomePage} />
      <Stack.Screen name="Details" component={Test} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
