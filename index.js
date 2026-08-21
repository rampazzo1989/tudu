/**
 * @format
 */

import {AppRegistry} from 'react-native';
import notifee, {EventType} from '@notifee/react-native';
import App from './App';
import {name as appName} from './app.json';
import './src/i18n';

// Register Notifee background event handler
notifee.onBackgroundEvent(async ({type, detail}) => {
  // App automatically opens and triggers foreground/initial notification handler
});

AppRegistry.registerComponent(appName, () => App);

