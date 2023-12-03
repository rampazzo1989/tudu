import React, {memo, useCallback, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TextInput} from 'react-native';
import {PopupModal} from '../../../../components/popup-modal';
import {ListDefaultIcon} from '../../../../components/animated-icons/list-default-icon';
import {Input} from './styles';
import {PopupButton} from '../../../../components/popup-modal/types';
import {NewListModalProps} from './types';
import {ListViewModel} from '../../../home/types';
import {getDuplicateProofListTitle} from '../../../../utils/list-and-group-utils';
import {generateRandomHash} from '../../../../hooks/useHashGenerator';
import {useListService} from '../../../../service/list-service-hook/useListService';

const getNewEmptyList = () =>
  new ListViewModel(
    {
      label: '',
      id: generateRandomHash('New List'),
    },
    new Map(),
  );

const NewListModal: React.FC<NewListModalProps> = memo(
  ({visible, editingList, onRequestClose}) => {
    const [internalListData, setInternalListData] = useState<ListViewModel>(
      editingList ?? getNewEmptyList(),
    );
    const {getAllLists, saveList} = useListService();

    const {t} = useTranslation();

    const inputRef = useRef<TextInput>(null);

    const handleTextChange = useCallback((text: string) => {
      setInternalListData(x => {
        const newList = x.clone();
        newList.label = text;
        return newList;
      });
    }, []);

    const isEditing = useMemo(() => !!editingList, [editingList]);

    const insertOrUpdateList = useCallback(
      (newList: ListViewModel) => {
        const isUpdatingTitle = newList.label !== editingList?.label;

        const allLists = getAllLists();

        const duplicateProofListTitle = isUpdatingTitle
          ? getDuplicateProofListTitle(allLists, internalListData.label)
          : newList.label;

        newList.label = duplicateProofListTitle;

        saveList(newList);
      },
      [editingList?.label, getAllLists, internalListData.label, saveList],
    );

    const handleConfirmButtonPress = useCallback(() => {
      if (!internalListData.label) {
        return;
      }

      internalListData.label = internalListData.label.trim();

      insertOrUpdateList(internalListData);

      onRequestClose();
    }, [insertOrUpdateList, internalListData, onRequestClose]);

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
