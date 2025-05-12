import React from 'react';
import { PopupModal } from '../popup-modal';
import { useTranslation } from 'react-i18next';
import { getDaytimeIcon } from '../../utils/general-utils';
import { SendToTodayConfirmationModalProps } from './types';
import { CalendarIcon } from '../animated-icons/calendar';
import { Label, OptionsContainer } from './styles';
import { CopyIcon } from '../animated-icons/copy-icon';
import { IconedOptionTile } from '../iconed-option-tile';

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
        <IconedOptionTile Icon={CalendarIcon} label={t('options.rescheduleForToday')} onPress={onReschedule} iconAnimationDelay={800} />
        <IconedOptionTile Icon={CopyIcon} label={t('options.copyToToday')} onPress={onCreateCopy} iconAnimationDelay={1600} />
      </OptionsContainer>
    </PopupModal>
  );
};

export {SendToTodayConfirmationModal};