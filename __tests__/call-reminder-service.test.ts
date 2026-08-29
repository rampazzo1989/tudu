jest.mock('react-native-haptic-feedback', () => ({
  trigger: jest.fn(),
}));

jest.mock('../src/service/tts/ttsService', () => ({
  ttsService: {
    formatTaskMessage: jest.fn((title: string) => `Lembrete: ${title}`),
    speak: jest.fn().mockResolvedValue(undefined),
    stop: jest.fn(),
  },
}));

jest.mock('../src/service/notification/notificationService', () => ({
  notificationService: {
    scheduleTimedTudu: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('../src/navigation/navigation-ref', () => ({
  navigationRef: {
    isReady: jest.fn().mockReturnValue(true),
    navigate: jest.fn(),
  },
}));

import { Vibration } from 'react-native';
import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { callReminderService } from '../src/service/call-reminder/callReminderService';
import { ttsService } from '../src/service/tts/ttsService';
import { notificationService } from '../src/service/notification/notificationService';

describe('CallReminderService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Vibration, 'vibrate').mockImplementation(jest.fn());
    jest.spyOn(Vibration, 'cancel').mockImplementation(jest.fn());
  });

  it('should start ringing effect with haptic feedback and vibration', () => {
    callReminderService.startRingingEffect();
    expect(RNReactNativeHapticFeedback.trigger).toHaveBeenCalledWith('impactHeavy');
    expect(Vibration.vibrate).toHaveBeenCalled();
  });

  it('should answer call, stop ringing and speak task message', async () => {
    await callReminderService.answerCall('Reunião importante', 'Trabalho', false, 0.5);
    expect(Vibration.cancel).toHaveBeenCalled();
    expect(RNReactNativeHapticFeedback.trigger).toHaveBeenCalledWith('notificationSuccess');
    expect(ttsService.formatTaskMessage).toHaveBeenCalledWith('Reunião importante', 'Trabalho', false);
    expect(ttsService.speak).toHaveBeenCalledWith('Lembrete: Reunião importante', expect.objectContaining({ rate: 0.5 }));
  });

  it('should snooze a tudu and reschedule notification for +5 minutes', async () => {
    await callReminderService.snoozeTudu(
      {
        id: 'tudu-1',
        label: 'Comprar café',
        listId: 'list-1',
      },
      5,
    );

    expect(ttsService.stop).toHaveBeenCalled();
    expect(notificationService.scheduleTimedTudu).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'tudu-1',
        label: 'Comprar café',
        hasTime: true,
        done: false,
      }),
      true,
    );
  });

  it('should end call and clean up vibration and TTS', () => {
    callReminderService.endCall();
    expect(Vibration.cancel).toHaveBeenCalled();
    expect(ttsService.stop).toHaveBeenCalled();
  });
});
