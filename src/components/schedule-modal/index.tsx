import React from 'react';
import { PopupModal } from '../popup-modal';
import { useTranslation } from 'react-i18next';
import { getDaytimeIcon } from '../../utils/general-utils';
import { CalendarIcon, OpenCalendarIcon } from '../animated-icons/calendar';
import { ScheduleModalProps } from './types';
import { OptionsContainer } from './styles';
import { OptionTile } from '../option-tile';
import { View } from 'react-native';

const ScheduleModal: React.FC<ScheduleModalProps> = ({ isVisible, onModalClose, onSchedule }) => {
  const { t } = useTranslation();

  const handleScheduleToday = () => {
    onSchedule(new Date());
    onModalClose();
  }

  const handleScheduleTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    onSchedule(tomorrow);
    onModalClose();
  }

  if (!isVisible) return null;
  return (
    <PopupModal
      visible
      onRequestClose={onModalClose}
      title={t('popupTitles.schedule')}
      buttons={[
        { label: t('buttons.cancel'), onPress: onModalClose },
      ]}
      Icon={CalendarIcon}>
      <OptionsContainer>
        {/* <OptionButtonStyled Icon={getDaytimeIcon()} label={t('scheduleOptions.today')} onPress={() => {}} autoAnimateIcon iconAnimationDelay={800} />
        <OptionButtonStyled Icon={CalendarIcon} label={t('scheduleOptions.tomorrow')} onPress={() => {}} />
        <OptionButtonStyled Icon={CalendarIcon} label={t('scheduleOptions.nextDays')} onPress={() => {}} />
        <OptionButtonStyled Icon={CalendarIcon} label={t('scheduleOptions.date')} onPress={() => {}} autoAnimateIcon iconAnimationDelay={1600} /> */}
        <View style={{flexDirection: 'row', justifyContent: 'space-between', width: 252}}>
          <OptionTile
            Icon={getDaytimeIcon()}
            label={t('scheduleOptions.today')}
            onPress={handleScheduleToday}
            autoAnimateIcon
          />
          <OptionTile
            Icon={OpenCalendarIcon}
            label={t('scheduleOptions.tomorrow')}
            onPress={handleScheduleTomorrow}
          />
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', width: 252, marginTop: 10}}>
          <OptionTile
            Icon={CalendarIcon}
            label={t('scheduleOptions.nextDays')}
            onPress={() => {}}
            autoAnimateIcon
            iconAnimationDelay={1200}
          />
          <OptionTile
            Icon={CalendarIcon}
            label={t('scheduleOptions.date')}
            onPress={() => {}}
            autoAnimateIcon
            iconAnimationDelay={1200}
          />
        </View>
      </OptionsContainer>
    </PopupModal>
  );
};

export {ScheduleModal};