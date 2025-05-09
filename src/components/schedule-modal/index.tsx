import React from 'react';
import { PopupModal } from '../popup-modal';
import { useTranslation } from 'react-i18next';
import { getDaytimeIcon } from '../../utils/general-utils';
import { CalendarIcon } from '../animated-icons/calendar';
import { ScheduleModalProps } from './types';
import { OptionButtonStyled, OptionsContainer } from './styles';

const ScheduleModal: React.FC<ScheduleModalProps> = ({ isVisible, onModalClose }) => {
  const { t } = useTranslation();

  if (!isVisible) return null;
  return (
    <PopupModal
      visible
      onRequestClose={onModalClose}
      title={t('popupTitles.schedule')}
      buttons={[
        { label: t('buttons.cancel'), onPress: onModalClose },
      ]}
      Icon={CalendarIcon}
      shakeOnShow
      haptics>
      <OptionsContainer>
        <OptionButtonStyled Icon={getDaytimeIcon()} label={t('scheduleDays.today')} onPress={() => {}} iconAnimationDelay={800} />
        <OptionButtonStyled Icon={CalendarIcon} label={t('scheduleDays.tomorrow')} onPress={() => {}} iconAnimationDelay={1600} />
      </OptionsContainer>
    </PopupModal>
  );
};

export {ScheduleModal};