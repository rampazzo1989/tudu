import React from 'react';
import { PopupModal } from '../popup-modal';
import { useTranslation } from 'react-i18next';
import { getDaytimeIcon } from '../../utils/general-utils';
import { SendToTodayConfirmationModalProps } from './types';
import { OptionTile } from '../option-tile';
import { CalendarIcon } from '../animated-icons/calendar';
import { Label, OptionsContainer } from './styles';
import { CopyIcon } from '../animated-icons/copy-icon';

const SendToTodayConfirmationModal: React.FC<SendToTodayConfirmationModalProps> = ({ isVisible: isOpen, onReschedule, onCreateCopy, onModalClose }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;
  return (
    <PopupModal
      visible
      onRequestClose={onModalClose}
      title={t('actions.sendToToday')}
      buttons={[
        { label: t('buttons.cancel'), onPress: onModalClose },
      ]}
      Icon={getDaytimeIcon()}
      shakeOnShow
      haptics>
      <Label>{t('messages.confirmSendRecurrentToToday')}</Label>
      <OptionsContainer>
        <OptionTile Icon={CalendarIcon} label={t('options.rescheduleForToday')} onPress={onReschedule} iconAnimationDelay={800} />
        <OptionTile Icon={CopyIcon} label={t('options.copyToToday')} onPress={onCreateCopy} iconAnimationDelay={1600} />
      </OptionsContainer>
    </PopupModal>
  );
};

export {SendToTodayConfirmationModal};