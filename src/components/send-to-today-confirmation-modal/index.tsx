import React from 'react';
import { PopupModal } from '../popup-modal';
import { useTranslation } from 'react-i18next';
import { getDaytimeIcon } from '../../utils/general-utils';
import { View } from 'react-native';
import { SendToTodayConfirmationModalProps } from './types';
import { OptionTile } from '../option-tile';
import { CalendarIcon } from '../animated-icons/calendar';
import { OptionsContainer } from './styles';
import { SunIcon } from '../animated-icons/sun-icon';

const SendToTodayConfirmationModal: React.FC<SendToTodayConfirmationModalProps> = ({ isVisible: isOpen, onReschedule, onCreateCopy, onModalClose }) => {
    if (!isOpen) return null;
    const { t } = useTranslation();
    
    return (
        <PopupModal
          visible
          onRequestClose={onModalClose}
          title={t('actions.sendToToday')}
          buttons={[
            {label: t('buttons.cancel'), onPress: onModalClose},
          ]}
          Icon={getDaytimeIcon()}
          shakeOnShow
          haptics>
            <OptionsContainer>
              <OptionTile Icon={CalendarIcon} label={'Reagendar a partir de hoje'} onPress={onReschedule} iconAnimationDelay={800}  />
              <OptionTile Icon={SunIcon} label={'Criar cópia em Hoje'} onPress={onCreateCopy} iconAnimationDelay={1600} />
            </OptionsContainer>
        </PopupModal>
    );
};

export default SendToTodayConfirmationModal;