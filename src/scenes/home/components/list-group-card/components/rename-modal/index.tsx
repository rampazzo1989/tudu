import React, {
  memo,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import {useTranslation} from 'react-i18next';
import {TextInput} from 'react-native';
import {ListDefaultIcon} from '../../../../../../components/animated-icons/list-default-icon';
import {RenameIcon} from '../../../../../../components/animated-icons/rename-icon';
import {PopupModal} from '../../../../../../components/popup-modal';
import {PopupButton} from '../../../../../../components/popup-modal/types';
import {DraggableContext} from '../../../../../../modules/draggable/draggable-context';
import {renameGroup} from '../../../../../../modules/draggable/draggable-utils';
import {
  getDuplicateProofGroupTitle,
  getDuplicateProofListTitle,
} from '../../../../../../utils/list-and-group-utils';
import {Input} from './styles';
import {RenameModalProps} from './types';

const RenameModal: React.FC<RenameModalProps> = memo(
  ({visible, groupData, onRequestClose}) => {
    const [internalGroupName, setInternalGroupName] = useState(
      groupData.groupId,
    );
    const draggableContext = useContext(DraggableContext);

    const {t} = useTranslation();

    const inputRef = useRef<TextInput>(null);

    const handleTextChange = useCallback((text: string) => {
      setInternalGroupName(text);
    }, []);

    const handleConfirmButtonPress = useCallback(() => {
      if (!internalGroupName) {
        return;
      }

      const isUpdatingTitle = internalGroupName !== groupData.groupId;

      if (!isUpdatingTitle) {
        return onRequestClose();
      }

      const newName = getDuplicateProofGroupTitle(
        draggableContext.data,
        internalGroupName,
      );

      renameGroup(
        draggableContext.data,
        draggableContext.setData,
        groupData,
        newName,
      );
      onRequestClose();
    }, [
      draggableContext.data,
      draggableContext.setData,
      groupData,
      internalGroupName,
      onRequestClose,
    ]);

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
        Icon={RenameIcon}>
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
