import React, {memo, useCallback, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TextInput} from 'react-native';
import {PopupModal} from '../../../../components/popup-modal';
import {ListDefaultIcon} from '../../../../components/animated-icons/list-default-icon';
import {Input} from './styles';
import {PopupButton} from '../../../../components/popup-modal/types';
import {NewListModalProps} from './types';
import {List} from '../../../home/types';
import {
  getDuplicateProofListTitle,
  insertList,
  updateList,
} from '../../../../utils/list-and-group-utils';
import {generateRandomHash} from '../../../../hooks/useHashGenerator';
import {useRecoilState, useRecoilValue} from 'recoil';
import {
  archivedLists as archivedListsState,
  homeDefaultLists,
  myLists,
} from '../../../home/state';

const getNewEmptyList = (): List => ({
  label: '',
  numberOfActiveItems: 0,
  id: generateRandomHash('New List'),
});

const NewListModal: React.FC<NewListModalProps> = memo(
  ({visible, editingList, onRequestClose}) => {
    const [internalListData, setInternalListData] = useState<List>(
      editingList ?? getNewEmptyList(),
    );
    const [customLists, setCustomLists] = useRecoilState(myLists);
    const defaultLists = useRecoilValue(homeDefaultLists);
    const archivedLists = useRecoilValue(archivedListsState);

    const {t} = useTranslation();

    const allLists = useMemo(
      () => [...customLists, ...defaultLists, ...archivedLists],
      [archivedLists, customLists, defaultLists],
    );

    const inputRef = useRef<TextInput>(null);

    const handleTextChange = useCallback((text: string) => {
      setInternalListData(x => ({...x, label: text}));
    }, []);

    const isEditing = useMemo(() => !!editingList, [editingList]);

    const insertOrUpdateList = useCallback(
      (newList: List, update: boolean) => {
        const isUpdatingTitle = newList.label !== editingList?.label;

        const duplicateProofListTitle = isUpdatingTitle
          ? getDuplicateProofListTitle(allLists, internalListData.label)
          : newList.label;

        newList.label = duplicateProofListTitle;

        if (update) {
          updateList(setCustomLists, newList);
        } else {
          insertList(setCustomLists, newList);
        }
      },
      [allLists, editingList?.label, internalListData.label, setCustomLists],
    );

    const handleConfirmButtonPress = useCallback(() => {
      if (!internalListData.label) {
        return;
      }

      insertOrUpdateList(internalListData, isEditing);

      onRequestClose();
    }, [insertOrUpdateList, internalListData, isEditing, onRequestClose]);

    const buttonsData = useMemo<PopupButton[]>(
      () => [
        {
          label: t('buttons.ok'),
          onPress: handleConfirmButtonPress,
          disabled: !internalListData.label,
        },
        {label: t('buttons.cancel'), onPress: onRequestClose},
      ],
      [handleConfirmButtonPress, internalListData.label, onRequestClose, t],
    );

    return (
      <PopupModal
        visible={visible}
        onRequestClose={onRequestClose}
        onShow={() => {
          setInternalListData(editingList ?? getNewEmptyList());
          setTimeout(() => inputRef.current?.focus(), 200);
        }}
        title={t(isEditing ? 'popupTitles.editList' : 'popupTitles.newList')}
        buttons={buttonsData}
        Icon={ListDefaultIcon}>
        <Input
          value={internalListData.label}
          onChangeText={handleTextChange}
          maxLength={30}
          ref={inputRef}
        />
      </PopupModal>
    );
  },
);

export {NewListModal};
