import {AppRegistry} from 'react-native';
import notifee, {EventType} from '@notifee/react-native';
import {MMKV} from 'react-native-mmkv';
import App from './App';
import {name as appName} from './app.json';
import './src/i18n';

const storage = new MMKV();

// Register Notifee background event handler
notifee.onBackgroundEvent(async ({type, detail}) => {
  const data = detail.notification?.data;
  const isCall =
    data?.type === 'call_reminder' ||
    detail.notification?.id?.startsWith('call_tudu_') ||
    detail.pressAction?.id === 'call' ||
    detail.pressAction?.id === 'call_answer' ||
    detail.pressAction?.id === 'call_decline';

  if (detail.pressAction?.id === 'call_decline') {
    if (detail.notification?.id) {
      await notifee.cancelNotification(detail.notification.id);
    }
    storage.delete('pending_incoming_call');
    return;
  }

  if (
    isCall &&
    (type === EventType.DELIVERED ||
      type === EventType.PRESS ||
      type === EventType.ACTION_PRESS)
  ) {
    const activeCall = {
      tuduId: data?.tuduId,
      tuduTitle: data?.taskTitle || detail.notification?.body || 'Lembrete do Tudú',
      listName: data?.listName,
      listId: data?.listId,
      isTest: Boolean(data?.isTest),
      autoAnswer: detail.pressAction?.id === 'call_answer',
      timestamp: Date.now(),
    };
    storage.set('pending_incoming_call', JSON.stringify(activeCall));
  }
});

AppRegistry.registerComponent(appName, () => App);

