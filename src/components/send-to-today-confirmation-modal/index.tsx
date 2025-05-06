import React from 'react';
import { PopupModal } from '../popup-modal';
import { useTranslation } from 'react-i18next';
import { getDaytimeIcon } from '../../utils/general-utils';
import { View } from 'react-native';
import { SendToTodayConfirmationModalProps } from './types';

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
            <View style={{backgroundColor: 'white', padding: 20, borderRadius: 10}} />
        </PopupModal>
    );
};

export default SendToTodayConfirmationModal;