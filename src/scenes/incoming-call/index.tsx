import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BackHandler, StatusBar } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';

import { StackNavigatorParamList } from '../../navigation/stack-navigator/types';
import { notificationSettingsState } from '../../state/atoms';
import { useListService } from '../../service/list-service-hook/useListService';
import { callReminderService } from '../../service/call-reminder/callReminderService';
import { ttsService } from '../../service/tts/ttsService';
import { TuduViewModel } from '../../scenes/home/types';
import { UNLISTED_LIST_ID } from '../../scenes/home/state';
import {
  ActionButtonLabel,
  ActionButtonWrapper,
  AvatarCircle,
  AvatarContainer,
  AvatarEmoji,
  BottomControls,
  CallingSubtitle,
  CenterContent,
  CircleButtonIcon,
  CircleCallButton,
  Container,
  EndCallButton,
  EndCallText,
  InCallActionsGrid,
  InCallCardButton,
  InCallCardIcon,
  InCallCardText,
  ListBadge,
  ListBadgeText,
  PulseCircle,
  RingingActionsRow,
  SnoozePillButton,
  SnoozePillIcon,
  SnoozePillText,
  SpeechBubble,
  SpeechBubbleText,
  StatusPill,
  StatusPillDot,
  StatusPillText,
  TaskTitle,
  TimerText,
  TopBar,
  WaveBar,
  WaveformContainer,
} from './styles';

type IncomingCallRouteProp = RouteProp<StackNavigatorParamList, 'IncomingCall'>;
type NavigationProp = StackNavigationProp<StackNavigatorParamList, 'IncomingCall'>;

export const IncomingCallPage: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<IncomingCallRouteProp>();

  const { tuduId, tuduTitle, listName, listId, isTest, autoAnswer } = route.params || {
    tuduTitle: 'Lembrete do Tudú',
  };

  const notificationSettings = useRecoilValue(notificationSettingsState);
  const { getAllTudus, saveTudu } = useListService();

  const [callStatus, setCallStatus] = useState<'ringing' | 'connected' | 'ended'>(
    'ringing',
  );
  const [durationSeconds, setDurationSeconds] = useState(0);

  // Animated shared values for pulsating ripples
  const pulseScale1 = useSharedValue(1);
  const pulseOpacity1 = useSharedValue(0.7);
  const pulseScale2 = useSharedValue(1);
  const pulseOpacity2 = useSharedValue(0.5);

  // Animated shared values for waveform bars
  const wave1 = useSharedValue(8);
  const wave2 = useSharedValue(16);
  const wave3 = useSharedValue(24);
  const wave4 = useSharedValue(12);
  const wave5 = useSharedValue(20);
  const wave6 = useSharedValue(14);
  const wave7 = useSharedValue(10);

  // Find tudu model safely if ID is present
  const currentTudu = useMemo(() => {
    if (!tuduId) return null;
    try {
      const all = getAllTudus();
      return all.find(t => t.id === tuduId) || null;
    } catch {
      return null;
    }
  }, [getAllTudus, tuduId]);

  // Spoken transcription message
  const speechMessage = useMemo(() => {
    return ttsService.formatTaskMessage(tuduTitle, listName, isTest);
  }, [tuduTitle, listName, isTest]);

  // Start ringing animations & effects
  useEffect(() => {
    callReminderService.startRingingEffect();

    // Pulse animation 1
    pulseScale1.value = withRepeat(
      withTiming(1.6, { duration: 1500, easing: Easing.out(Easing.ease) }),
      -1,
      false,
    );
    pulseOpacity1.value = withRepeat(
      withTiming(0, { duration: 1500, easing: Easing.out(Easing.ease) }),
      -1,
      false,
    );

    // Pulse animation 2 (delayed offset)
    pulseScale2.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 400 }),
        withTiming(1.7, { duration: 1500, easing: Easing.out(Easing.ease) }),
      ),
      -1,
      false,
    );
    pulseOpacity2.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 400 }),
        withTiming(0, { duration: 1500, easing: Easing.out(Easing.ease) }),
      ),
      -1,
      false,
    );

    // Prevent Android hardware back button from dismissing accidentally without ending call
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        handleEndCall();
        return true;
      },
    );

    return () => {
      callReminderService.endCall();
      backHandler.remove();
    };
  }, []);

  // Timer for connected call
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setDurationSeconds(prev => prev + 1);
      }, 1000);

      // Start waveform animations
      const createWaveAnimation = (sv: any, min: number, max: number, dur: number) => {
        sv.value = withRepeat(
          withSequence(
            withTiming(max, { duration: dur, easing: Easing.inOut(Easing.sin) }),
            withTiming(min, { duration: dur, easing: Easing.inOut(Easing.sin) }),
          ),
          -1,
          true,
        );
      };

      createWaveAnimation(wave1, 6, 28, 400);
      createWaveAnimation(wave2, 10, 36, 350);
      createWaveAnimation(wave3, 8, 44, 480);
      createWaveAnimation(wave4, 12, 38, 300);
      createWaveAnimation(wave5, 8, 42, 420);
      createWaveAnimation(wave6, 6, 30, 370);
      createWaveAnimation(wave7, 4, 22, 450);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callStatus]);

  // Pulse animated styles
  const pulseStyle1 = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale1.value }],
    opacity: pulseOpacity1.value,
  }));

  const pulseStyle2 = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale2.value }],
    opacity: pulseOpacity2.value,
  }));

  // Waveform animated styles
  const waveStyle1 = useAnimatedStyle(() => ({ height: wave1.value }));
  const waveStyle2 = useAnimatedStyle(() => ({ height: wave2.value }));
  const waveStyle3 = useAnimatedStyle(() => ({ height: wave3.value }));
  const waveStyle4 = useAnimatedStyle(() => ({ height: wave4.value }));
  const waveStyle5 = useAnimatedStyle(() => ({ height: wave5.value }));
  const waveStyle6 = useAnimatedStyle(() => ({ height: wave6.value }));
  const waveStyle7 = useAnimatedStyle(() => ({ height: wave7.value }));

  const formatTimer = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleAnswer = useCallback(async () => {
    setCallStatus('connected');
    const rate = notificationSettings.ttsVoiceRate || 0.5;
    await callReminderService.answerCall(tuduTitle, listName, isTest, rate);
  }, [isTest, listName, notificationSettings.ttsVoiceRate, tuduTitle]);

  useEffect(() => {
    if (autoAnswer) {
      handleAnswer();
    }
  }, [autoAnswer, handleAnswer]);

  const handleEndCall = useCallback(() => {
    setCallStatus('ended');
    callReminderService.endCall();
    RNReactNativeHapticFeedback.trigger('impactLight');

    const routes = navigation.getState()?.routes;
    const prevRoute =
      routes && routes.length > 1 ? routes[routes.length - 2]?.name : null;

    if (navigation.canGoBack() && prevRoute && prevRoute !== 'SplashScreen') {
      navigation.goBack();
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    }
  }, [navigation]);

  const handleSnooze = useCallback(async () => {
    RNReactNativeHapticFeedback.trigger('impactMedium');
    if (currentTudu) {
      await callReminderService.snoozeTudu(currentTudu, 5);
    } else {
      await callReminderService.snoozeTudu(
        {
          id: tuduId || 'temp_snooze',
          label: tuduTitle,
          listId: listId || '',
          listName,
        },
        5,
      );
    }
    handleEndCall();
  }, [currentTudu, handleEndCall, listId, listName, tuduId, tuduTitle]);

  const handleCompleteTask = useCallback(() => {
    RNReactNativeHapticFeedback.trigger('notificationSuccess');
    if (currentTudu) {
      const updatedTudu = currentTudu.clone();
      updatedTudu.done = true;
      saveTudu(updatedTudu);
    } else if (tuduId) {
      const updatedTudu = new TuduViewModel(
        {
          id: tuduId,
          label: tuduTitle,
          done: true,
        },
        listId || UNLISTED_LIST_ID,
        listId ? 'default' : 'unlisted',
        listName,
      );
      saveTudu(updatedTudu);
    }
    handleEndCall();
  }, [currentTudu, handleEndCall, listId, listName, saveTudu, tuduId, tuduTitle]);

  const handleViewTask = useCallback(() => {
    setCallStatus('ended');
    callReminderService.endCall();
    RNReactNativeHapticFeedback.trigger('impactLight');

    navigation.reset({
      index: 1,
      routes: [
        { name: 'Home' },
        {
          name: 'ScheduledList',
          params: {
            date: new Date(),
          },
        },
      ],
    });
  }, [navigation]);

  const isRinging = callStatus === 'ringing';
  const isConnected = callStatus === 'connected';

  return (
    <Container>
      <StatusBar barStyle="light-content" backgroundColor="#121620" />

      {/* Top Status Header */}
      <TopBar>
        <StatusPill isConnected={isConnected}>
          <StatusPillDot isConnected={isConnected} />
          <StatusPillText>
            {isConnected
              ? t('incomingCall.connected', { defaultValue: 'Em chamada' })
              : t('incomingCall.title', { defaultValue: 'Lembrete do Tudú' })}
          </StatusPillText>
        </StatusPill>
      </TopBar>

      {/* Center Info & Avatar */}
      <CenterContent>
        <AvatarContainer>
          {isRinging && (
            <>
              <PulseCircle size={180} style={pulseStyle1} />
              <PulseCircle size={210} style={pulseStyle2} />
            </>
          )}
          <AvatarCircle>
            <AvatarEmoji>{isConnected ? '🎙️' : '🔔'}</AvatarEmoji>
          </AvatarCircle>
        </AvatarContainer>

        {Boolean(listName && listName.trim().length > 0) && (
          <ListBadge>
            <ListBadgeText>🏷️ {listName}</ListBadgeText>
          </ListBadge>
        )}

        <TaskTitle numberOfLines={3}>{tuduTitle}</TaskTitle>

        {isRinging ? (
          <CallingSubtitle>
            {t('incomingCall.calling', { defaultValue: 'Chamada de Lembrete...' })}
          </CallingSubtitle>
        ) : (
          <>
            <TimerText>{formatTimer(durationSeconds)}</TimerText>

            <WaveformContainer>
              <WaveBar style={waveStyle1} />
              <WaveBar style={waveStyle2} />
              <WaveBar style={waveStyle3} />
              <WaveBar style={waveStyle4} />
              <WaveBar style={waveStyle5} />
              <WaveBar style={waveStyle6} />
              <WaveBar style={waveStyle7} />
            </WaveformContainer>

            <SpeechBubble>
              <SpeechBubbleText>"{speechMessage}"</SpeechBubbleText>
            </SpeechBubble>
          </>
        )}
      </CenterContent>

      {/* Bottom Controls */}
      <BottomControls>
        {isRinging ? (
          <>
            <RingingActionsRow>
              <ActionButtonWrapper>
                <CircleCallButton
                  color="#FF3B30"
                  activeOpacity={0.8}
                  onPress={handleEndCall}>
                  <CircleButtonIcon>🔴</CircleButtonIcon>
                </CircleCallButton>
                <ActionButtonLabel>
                  {t('incomingCall.actions.decline', { defaultValue: 'Recusar' })}
                </ActionButtonLabel>
              </ActionButtonWrapper>

              <ActionButtonWrapper>
                <CircleCallButton
                  color="#34C759"
                  activeOpacity={0.8}
                  onPress={handleAnswer}>
                  <CircleButtonIcon>📞</CircleButtonIcon>
                </CircleCallButton>
                <ActionButtonLabel>
                  {t('incomingCall.actions.answer', { defaultValue: 'Atender' })}
                </ActionButtonLabel>
              </ActionButtonWrapper>
            </RingingActionsRow>

            <SnoozePillButton activeOpacity={0.8} onPress={handleSnooze}>
              <SnoozePillIcon>⏰</SnoozePillIcon>
              <SnoozePillText>
                {t('incomingCall.actions.snooze', { defaultValue: 'Lembrar em 5 min' })}
              </SnoozePillText>
            </SnoozePillButton>
          </>
        ) : (
          <>
            <InCallActionsGrid>
              <InCallCardButton
                bg="rgba(52, 199, 89, 0.2)"
                activeOpacity={0.8}
                onPress={handleCompleteTask}>
                <InCallCardIcon>✅</InCallCardIcon>
                <InCallCardText>
                  {t('incomingCall.actions.complete', { defaultValue: 'Concluir' })}
                </InCallCardText>
              </InCallCardButton>

              <InCallCardButton
                bg="rgba(255, 149, 0, 0.2)"
                activeOpacity={0.8}
                onPress={handleSnooze}>
                <InCallCardIcon>⏰</InCallCardIcon>
                <InCallCardText>
                  {t('incomingCall.actions.snoozeShort', { defaultValue: '+5 min' })}
                </InCallCardText>
              </InCallCardButton>

              <InCallCardButton
                bg="rgba(121, 86, 191, 0.2)"
                activeOpacity={0.8}
                onPress={handleViewTask}>
                <InCallCardIcon>📋</InCallCardIcon>
                <InCallCardText>
                  {t('incomingCall.actions.view', { defaultValue: 'Ver Tarefa' })}
                </InCallCardText>
              </InCallCardButton>
            </InCallActionsGrid>

            <EndCallButton activeOpacity={0.85} onPress={handleEndCall}>
              <CircleButtonIcon>🔴</CircleButtonIcon>
              <EndCallText>
                {t('incomingCall.actions.endCall', { defaultValue: 'Encerrar Ligação' })}
              </EndCallText>
            </EndCallButton>
          </>
        )}
      </BottomControls>
    </Container>
  );
};
