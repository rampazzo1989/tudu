import React, { useState } from 'react';
import { PopupModal } from '../popup-modal';
import { getDaytimeIcon } from '../../utils/general-utils';
import { CalendarIcon, OpenCalendarIcon } from '../animated-icons/calendar';
import { ScheduleModalProps, ScheduleOptionsProps } from './types';
import { OptionsContainer } from './styles';
import { t } from 'i18next';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';
import { IconedOptionTile } from '../iconed-option-tile';
import { ScrollView, View } from 'react-native';
import { OptionTile } from '../option-tile';

const EnteringAnimation = FadeIn.duration(600);

const NextDays: React.FC = () => {
  const daysOfWeek = [
    t('scheduleDays.monday'),
    t('scheduleDays.tuesday'),
    t('scheduleDays.wednesday'),
    t('scheduleDays.thursday'),
    t('scheduleDays.friday'),
    t('scheduleDays.saturday'),
    t('scheduleDays.sunday'),
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{flexShrink: 1, height: 100, borderWidth: 2}}
      contentContainerStyle={{ paddingHorizontal: 10, flexShrink: 1, height: 100, borderWidth: 3}}>
      {daysOfWeek.map((day, index) => (
        <View key={index} style={{ marginRight: 10, flexShrink: 1, height: 200 }}>
          <OptionTile
            TopComponent={undefined} // TopComponent left empty for now
            label={day}
            onPress={() => {
              // Handle day selection logic here
              console.log(`Selected: ${day}`);
            }}
          />
        </View>
      ))}
    </ScrollView>
  );
};

const ScheduleOptions: React.FC<ScheduleOptionsProps>  = ({onSchedule, onModalClose, onPressDate, onPressNextDays}) => {

  const handleScheduleToday = () => {
    onSchedule(new Date());
    onModalClose();
  };

  const handleScheduleTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    onSchedule(tomorrow);
    onModalClose();
  };

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
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ isVisible, onModalClose, onSchedule }) => {
  
  const onPressDate = () => {
    // Handle date selection
  };

  const onPressNextDays = () => {
    // Handle next days selection
    setPopupStage(popupStages.nextDays);
  };
  
  const popupStages = {
    initial: {
      title: t('popupTitles.schedule'),
      Icon: CalendarIcon,
      Content: (
        <ScheduleOptions onSchedule={onSchedule} onModalClose={onModalClose} onPressNextDays={onPressNextDays} onPressDate={onPressDate}  />
      )
    },
    nextDays: {
      title: t('popupTitles.schedule'),
      Icon: OpenCalendarIcon,
      Content: (<NextDays />)
    }
  };

  const [popupStage, setPopupStage] = useState(popupStages.initial);

  if (!isVisible) return null;

  return (
    <PopupModal
      visible
      onRequestClose={onModalClose}
      title={popupStage.title}
      buttons={[
        { label: t('buttons.cancel'), onPress: onModalClose },
      ]}
      Icon={popupStage.Icon}>
      <OptionsContainer>
        {popupStage.Content}
      </OptionsContainer>
    </PopupModal>
  );
};

export { ScheduleModal };