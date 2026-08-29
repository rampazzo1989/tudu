import React from 'react';
import {StackNavigatorParamList} from './types';
import {HomePage} from '../../scenes/home';
import 'react-native-gesture-handler';
import {createStackNavigator} from '@react-navigation/stack';
import {TransitionSpec} from '@react-navigation/stack/lib/typescript/src/types';
import {SplashScreen} from '../../scenes/splash-screen';
import {useTheme} from 'styled-components/native';
import {ListPage} from '../../scenes/list';
import {ArchivedPage} from '../../scenes/archived';
import {ScheduledListPage} from '../../scenes/scheduled-list';
import {UpcomingTudusPage} from '../../scenes/upcoming-tudus';
import {AllTudusPage} from '../../scenes/all-tudus';
import {StarredTudusPage} from '../../scenes/starred-tudus';
import {SearchPage} from '../../scenes/search';
import {SettingsPage} from '../../scenes/settings';
import {AISettingsPage} from '../../scenes/settings/ai-settings';
import {AIUsagePage} from '../../scenes/settings/ai-usage';
import {NotificationSettingsPage} from '../../scenes/settings/notification-settings';
import {BackupSettingsPage} from '../../scenes/settings/backup-settings';
import {SecuritySettingsPage} from '../../scenes/settings/security-settings';
import {IncomingCallPage} from '../../scenes/incoming-call';


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
      duration: 200,
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
          cardStyle: {backgroundColor: theme.colors.primary},
          transitionSpec: {
            open: config,
            close: config,
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
      <Stack.Screen
        name="ScheduledList"
        component={ScheduledListPage}
        options={{
          cardStyle: {backgroundColor: theme.colors.primary},
          transitionSpec: {
            open: config,
            close: config,
          },
        }}
      />
      <Stack.Screen
        name="UpcomingTudus"
        component={UpcomingTudusPage}
        options={{
          cardStyle: {backgroundColor: theme.colors.primary},
          transitionSpec: {
            open: config,
            close: config,
          },
        }}
      />
      <Stack.Screen
        name="AllTudus"
        component={AllTudusPage}
        options={{
          cardStyle: {backgroundColor: theme.colors.primary},
          transitionSpec: {
            open: config,
            close: config,
          },
        }}
      />
      <Stack.Screen
        name="StarredTudus"
        component={StarredTudusPage}
        options={{
          cardStyle: {backgroundColor: theme.colors.primary},
          transitionSpec: {
            open: config,
            close: config,
          },
        }}
      />
      <Stack.Screen
        name="Search"
        component={SearchPage}
        options={{
          cardStyle: {backgroundColor: theme.colors.primary},
          transitionSpec: {
            open: config,
            close: config,
          },
        }}
      />
      <Stack.Screen
        name="Archived"
        component={ArchivedPage}
        options={{
          cardStyle: {backgroundColor: theme.colors.primary},
          transitionSpec: {
            open: config,
            close: config,
          },
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsPage}
        options={{
          cardStyle: {backgroundColor: theme.colors.primary},
          transitionSpec: {
            open: configSlow,
            close: configSlow,
          },
        }}
      />
      <Stack.Screen
        name="AISettings"
        component={AISettingsPage}
        options={{
          cardStyle: {backgroundColor: theme.colors.primary},
          transitionSpec: {
            open: configSlow,
            close: configSlow,
          },
        }}
      />
      <Stack.Screen
        name="AIUsage"
        component={AIUsagePage}
        options={{
          cardStyle: {backgroundColor: theme.colors.primary},
          transitionSpec: {
            open: configSlow,
            close: configSlow,
          },
        }}
      />
      <Stack.Screen
        name="NotificationSettings"

        component={NotificationSettingsPage}
        options={{
          cardStyle: {backgroundColor: theme.colors.primary},
          transitionSpec: {
            open: configSlow,
            close: configSlow,
          },
        }}
      />
      <Stack.Screen
        name="BackupSettings"
        component={BackupSettingsPage}
        options={{
          cardStyle: {backgroundColor: theme.colors.primary},
          transitionSpec: {
            open: configSlow,
            close: configSlow,
          },
        }}
      />
      <Stack.Screen
        name="SecuritySettings"
        component={SecuritySettingsPage}
        options={{
          cardStyle: {backgroundColor: theme.colors.primary},
          transitionSpec: {
            open: configSlow,
            close: configSlow,
          },
        }}
      />
      <Stack.Screen
        name="IncomingCall"
        component={IncomingCallPage}
        options={{
          cardStyle: {backgroundColor: '#121620'},
          gestureEnabled: false,
          transitionSpec: {
            open: configSlow,
            close: configSlow,
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
