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
import {PopupModal} from '../../../../components/popup-modal';
import {ListDefaultIcon} from '../../../../components/animated-icons/list-default-icon';
import {Input} from './styles';
import {PopupButton} from '../../../../components/popup-modal/types';
import {NewListModalProps} from './types';
import {DraggableContext} from '../../../../modules/draggable/draggable-context';
import {insertNewItem} from '../../../../modules/draggable/draggable-utils';
import {List} from '../../../home/types';
import {getDuplicateProofListTitle} from '../../../../utils/list-and-group-utils';

const NewListModal: React.FC<NewListModalProps> = memo(
  ({visible, onRequestClose}) => {
    const [internalListName, setInternalListName] = useState('');
    const draggableContext = useContext(DraggableContext);

    const {t} = useTranslation();

    const inputRef = useRef<TextInput>(null);

    const handleTextChange = useCallback((text: string) => {
      setInternalListName(text);
    }, []);

    const handleConfirmButtonPress = useCallback(() => {
      if (!internalListName) {
        return;
      }

      const duplicateProofListTitle = getDuplicateProofListTitle(
        draggableContext.data,
        internalListName,
      );

      const newList: List = {
        label: duplicateProofListTitle,
        numberOfActiveItems: 0,
      };

      insertNewItem(draggableContext.data, draggableContext.setData, newList);

      onRequestClose();
    }, [
      draggableContext.data,
      draggableContext.setData,
      internalListName,
      onRequestClose,
    ]);

    const buttonsData = useMemo<PopupButton[]>(
      () => [
        {
          label: t('buttons.ok'),
          onPress: handleConfirmButtonPress,
          disabled: !internalListName,
        },
        {label: t('buttons.cancel'), onPress: onRequestClose},
      ],
      [handleConfirmButtonPress, internalListName, onRequestClose, t],
    );

    return (
      <PopupModal
        visible={visible}
        onRequestClose={onRequestClose}
        onShow={() => {
          setInternalListName('');
          setTimeout(() => inputRef.current?.focus(), 200);
        }}
        title={t('popupTitles.newList')}
        buttons={buttonsData}
        Icon={ListDefaultIcon}>
        <Input
          value={internalListName}
          onChangeText={handleTextChange}
          maxLength={30}
          ref={inputRef}
        />
      </PopupModal>
    );
  },
);

export {NewListModal};
