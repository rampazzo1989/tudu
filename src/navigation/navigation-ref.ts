import {createNavigationContainerRef} from '@react-navigation/native';
import {StackNavigatorParamList} from './stack-navigator/types';

export const navigationRef =
  createNavigationContainerRef<StackNavigatorParamList>();

export function navigateToToday() {
  const performNavigation = () => {
    if (!navigationRef.isReady()) {
      return false;
    }

    const currentRoute = navigationRef.getCurrentRoute()?.name;

    if (currentRoute === 'SplashScreen') {
      // Replace the splash stack with Home and ScheduledList on top
      navigationRef.reset({
        index: 1,
        routes: [
          {name: 'Home'},
          {
            name: 'ScheduledList',
            params: {
              date: new Date(),
            },
          },
        ],
      });
    } else {
      navigationRef.navigate('ScheduledList', {
        date: new Date(),
      });
    }
    return true;
  };

  if (!performNavigation()) {
    const interval = setInterval(() => {
      if (performNavigation()) {
        clearInterval(interval);
      }
    }, 100);

    setTimeout(() => clearInterval(interval), 4000);
  }
}

export function navigateToIncomingCall(params: {
  tuduId?: string;
  tuduTitle: string;
  listName?: string;
  listId?: string;
  isTest?: boolean;
  autoAnswer?: boolean;
}) {
  const performNavigation = () => {
    if (!navigationRef.isReady()) {
      return false;
    }

    const currentRoute = navigationRef.getCurrentRoute()?.name;

    if (currentRoute === 'SplashScreen') {
      navigationRef.reset({
        index: 1,
        routes: [
          {name: 'Home'},
          {
            name: 'IncomingCall',
            params,
          },
        ],
      });
    } else {
      navigationRef.navigate('IncomingCall', params);
    }
    return true;
  };

  if (!performNavigation()) {
    const interval = setInterval(() => {
      if (performNavigation()) {
        clearInterval(interval);
      }
    }, 100);

    setTimeout(() => clearInterval(interval), 4000);
  }
}

