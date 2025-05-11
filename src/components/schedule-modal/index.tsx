import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { PopupModal } from '../popup-modal';
import { getDaytimeIcon } from '../../utils/general-utils';
import { CalendarIcon, OpenCalendarIcon } from '../animated-icons/calendar';
import { ScheduleModalProps, ScheduleOptionsProps } from './types';
import { OptionsContainer } from './styles';
import { t, use } from 'i18next';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';
import { IconedOptionTile } from '../iconed-option-tile';
import { ScrollView, Text, View } from 'react-native';
import { OptionTile } from '../option-tile';
import { BackButton } from '../back-button';

const EnteringAnimation = FadeIn.duration(600);

const DayCalendarIcon: React.FC<{ day: number }> = ({ day }) => {
  return (
    <View style={{ width: 35, height: 34, borderRadius: 8, borderWidth: 1, borderColor: 'white' }}>
      <View style={{ width: 34, height: 7, borderTopLeftRadius: 8, borderTopRightRadius: 8, backgroundColor: 'white' }} />
      <Text style={{ textAlign: 'center', fontSize: 17, color: 'white' }}>{day ?? 'XX'}</Text>
    </View>
  );
}

const NextDays: React.FC<{ onScheduleToDay: (date: Date) => void }> = ({ onScheduleToDay }) => {
  const daysOfWeek = [
    t('scheduleDays.sunday'),
    t('scheduleDays.monday'),
    t('scheduleDays.tuesday'),
    t('scheduleDays.wednesday'),
    t('scheduleDays.thursday'),
    t('scheduleDays.friday'),
    t('scheduleDays.saturday'),
  ];

  const next7Days = useMemo(() => {

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    return Array.from({ length: 7 }, (_, i) => {
      const nextDate = new Date(tomorrow);
      nextDate.setDate(tomorrow.getDate() + i + 1);
      return {
        dayOfWeek: daysOfWeek[nextDate.getDay()],
        dayOfMonth: nextDate.getDate(),
        date: nextDate,
      };
    });
  }, [daysOfWeek]);

  return (
    <Animated.View entering={EnteringAnimation} style={{ height: 124 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}>
        {next7Days.map((dayInfo, index) => (
          <View key={index} style={{ marginRight: 10 }}>
            <OptionTile
              TopComponent={<DayCalendarIcon day={dayInfo.dayOfMonth} />}
              label={dayInfo.dayOfWeek}
              onPress={() => {
                onScheduleToDay(dayInfo.date);
              }}
            />
          </View>
        ))}
      </ScrollView>
    </Animated.View>
  );
};

const ScheduleOptions: React.FC<ScheduleOptionsProps> = memo(({ onSchedule, onPressDate, onPressNextDays }) => {

  const handleScheduleToday = useCallback(() => {
    onSchedule(new Date());
  }, [onSchedule]);

  const handleScheduleTomorrow = useCallback(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    onSchedule(tomorrow);
  }, [onSchedule]);

  return (
    <>
      <Animated.View entering={EnteringAnimation} style={{ flexDirection: 'row', justifyContent: 'space-between', width: 252 }}>
        <IconedOptionTile
          Icon={getDaytimeIcon()}
          label={t('scheduleOptions.today')}
          onPress={handleScheduleToday}
          autoAnimateIcon
        />
        <IconedOptionTile
          Icon={OpenCalendarIcon}
          label={t('scheduleOptions.tomorrow')}
          onPress={handleScheduleTomorrow}
        />
      </Animated.View>
      <Animated.View entering={FadeIn.delay(200)} style={{ flexDirection: 'row', justifyContent: 'space-between', width: 252, marginTop: 10 }}>
        <IconedOptionTile
          Icon={CalendarIcon}
          label={t('scheduleOptions.nextDays')}
          onPress={onPressNextDays}
          autoAnimateIcon
          iconAnimationDelay={1200}
        />
        <IconedOptionTile
          Icon={CalendarIcon}
          label={t('scheduleOptions.date')}
          onPress={onPressDate}
          autoAnimateIcon
          iconAnimationDelay={1200}
        />
      </Animated.View>
    </>
  );
});

type PopupStage = {
  title: string;
  Icon: React.FC<any>;
  Content: React.ReactNode;
  ActionButton: React.ReactNode | undefined;
};

type PopupStages = {
  initial: PopupStage;
  nextDays: PopupStage;
};

enum PopupStageEnum {
  INITIAL = 'initial',
  NEXT_DAYS = 'nextDays',
}

const ScheduleModal: React.FC<ScheduleModalProps> = memo(({ isVisible, onModalClose, onSchedule }) => {

  const [popupStage, setPopupStage] = useState(PopupStageEnum.INITIAL);

  const onPressDate = () => {
    // Handle date selection
  };

  const onPressNextDays = useCallback(() => {
    // Handle next days selection
    setPopupStage(PopupStageEnum.NEXT_DAYS);
  }, []);

  const handleModalClose = useCallback(() => {
    setPopupStage(PopupStageEnum.INITIAL);
    onModalClose();
  }, [onModalClose]);

  const handleScheduleToDate = useCallback((date: Date) => {
    onSchedule(date);
    handleModalClose();
  }, [onSchedule, handleModalClose]);

  const popupStages: Record<PopupStageEnum, PopupStage> = useMemo(
    () => ({
      [PopupStageEnum.INITIAL]: {
        title: t('popupTitles.schedule'),
        Icon: CalendarIcon,
        Content: (
          <ScheduleOptions
            onSchedule={handleScheduleToDate}
            onPressNextDays={onPressNextDays}
            onPressDate={onPressDate}
          />
        ),
        ActionButton: undefined,
      },
      [PopupStageEnum.NEXT_DAYS]: {
        title: t('popupTitles.scheduleToNext'),
        Icon: OpenCalendarIcon,
        Content: <NextDays onScheduleToDay={handleScheduleToDate} />,
        ActionButton: (
          <BackButton onPress={() => setPopupStage(PopupStageEnum.INITIAL)} />
        ),
      },
    }),
    [handleScheduleToDate, handleModalClose, onPressNextDays, onPressDate]
  );

  if (!isVisible) return null;

  return (
    <PopupModal
      visible
      onRequestClose={handleModalClose}
      title={popupStages[popupStage].title}
      buttons={[
        { label: t('buttons.cancel'), onPress: handleModalClose },
      ]}
      ActionButton={popupStages[popupStage].ActionButton}
      Icon={popupStages[popupStage].Icon}>
      <OptionsContainer>
        {popupStages[popupStage].Content}
      </OptionsContainer>
    </PopupModal>
  );
});

export { ScheduleModal };