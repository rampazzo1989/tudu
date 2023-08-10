import React, {memo, useCallback, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TextInput} from 'react-native';
import {ListDefaultIcon} from '../../../../../../components/animated-icons/list-default-icon';
import {PopupModal} from '../../../../../../components/popup-modal';
import {PopupButton} from '../../../../../../components/popup-modal/types';
import {renameGroup} from '../../../../../../modules/draggable/draggable-utils';
import {Input} from './styles';
import {RenameModalProps} from './types';

const RenameModal: React.FC<RenameModalProps> = memo(
  ({visible, groupData, onRequestClose}) => {
    const [internalGroupName, setInternalGroupName] = useState(
      groupData.groupId,
    );

    const {t} = useTranslation();

    const inputRef = useRef<TextInput>(null);

    const handleTextChange = useCallback((text: string) => {
      setInternalGroupName(text);
    }, []);

    const handleConfirmButtonPress = useCallback(() => {
      if (!internalGroupName) {
        return;
      }
      renameGroup(groupData, internalGroupName);
      onRequestClose();
    }, [groupData, internalGroupName, onRequestClose]);

    const buttonsData = useMemo<PopupButton[]>(
      () => [
        {
          label: t('buttons.ok'),
          onPress: handleConfirmButtonPress,
          disabled: !internalGroupName,
        },
        {label: t('buttons.cancel'), onPress: onRequestClose},
      ],
      [handleConfirmButtonPress, internalGroupName, onRequestClose, t],
    );

    return (
      <PopupModal
        visible={visible}
        onRequestClose={onRequestClose}
        onShow={() => {
          setInternalGroupName(groupData.groupId);
          setTimeout(() => inputRef.current?.focus(), 200);
        }}
        title={t('popupTitles.renameGroup')}
        buttons={buttonsData}
        Icon={ListDefaultIcon}>
        <Input
          value={internalGroupName}
          onChangeText={handleTextChange}
          ref={inputRef}
        />
      </PopupModal>
    );
  },
);

export {RenameModal};
