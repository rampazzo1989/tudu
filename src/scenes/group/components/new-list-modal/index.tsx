import React, {memo, useCallback, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TextInput} from 'react-native';
import {PopupModal} from '../../../../components/popup-modal';
import {ListDefaultIcon} from '../../../../components/animated-icons/list-default-icon';
import {Input} from './styles';
import {PopupButton} from '../../../../components/popup-modal/types';
import {NewListModalProps} from './types';
import {ListDataViewModel, ListViewModel} from '../../../home/types';
import {getDuplicateProofListTitle} from '../../../../utils/list-and-group-utils';
import {generateRandomHash} from '../../../../hooks/useHashGenerator';
import {useListService} from '../../../../service/list-service-hook/useListService';
import {useEmojiSearch} from '../../../../hooks/useEmojiSearch';
import SuggestedEmojiList from '../../../../components/suggested-emoji-list';
import { trimEmoji } from '../../../../utils/emoji-utils';

const getNewEmptyList = (): ListDataViewModel => ({
  id: generateRandomHash('New List'),
  label: '',
  numberOfActiveItems: 0,
  origin: 'default',
});

const NewListModal: React.FC<NewListModalProps> = memo(
  ({ visible, editingList, onRequestClose }) => {
    const [internalListData, setInternalListData] = useState<ListDataViewModel>(
      editingList ?? getNewEmptyList(),
    );
    const [suggestedEmojis, setSuggestedEmojis] = useState<string[]>([]);
    const [isTopContainerVisible, setIsTopContainerVisible] = useState(false);
    const { getAllLists, saveList } = useListService();
    const { t } = useTranslation();
    const inputRef = useRef<TextInput>(null);
    const { 
      debounceSearchEmojis, 
      searchEmojis, 
      getMostUsedEmojis, 
      getDefaultEmojis 
    } = useEmojiSearch(700);
    const [showingMostUsedEmojis, setShowingMostUsedEmojis] = useState(false);

    const handleRequestClose = useCallback(() => {
      setIsTopContainerVisible(false); 
      setSuggestedEmojis([]);
      onRequestClose();
    }, []);

    const handleTextChange = useCallback(
      (text: string) => {
        setInternalListData((x) => {
          const newList = { ...x };
          newList.label = text;
          return newList;
        });

        setIsTopContainerVisible(true);

        debounceSearchEmojis(text, (results, isShowingMostUsed) => {
          setShowingMostUsedEmojis(isShowingMostUsed);

          var emojis = results;

          if (isShowingMostUsed) {
            emojis = [...emojis, ...getDefaultEmojis('list')];
          }

          setSuggestedEmojis(emojis);
        });
      },
      [debounceSearchEmojis, getDefaultEmojis],
    );

    const isEditing = useMemo(() => !!editingList, [editingList]);

    const insertOrUpdateList = useCallback(
      (newList: ListDataViewModel) => {
        const isUpdatingTitle = newList.label !== editingList?.label;
        const allLists = getAllLists();

        const duplicateProofListTitle = isUpdatingTitle
          ? getDuplicateProofListTitle(allLists ?? [], internalListData.label)
          : newList.label;

        newList.label = duplicateProofListTitle;
        const newListViewModel = new ListViewModel(newList);
        saveList(newListViewModel);
      },
      [editingList?.label, getAllLists, internalListData.label, saveList],
    );

    const handleConfirmButtonPress = useCallback(() => {
      if (!internalListData.label) {
        return;
      }
      internalListData.label = internalListData.label.trim();

      insertOrUpdateList(internalListData);

      handleRequestClose();
    }, [insertOrUpdateList, internalListData, handleRequestClose]);

    const buttonsData = useMemo<PopupButton[]>(
      () => [
        {
          label: t('buttons.ok'),
          onPress: handleConfirmButtonPress,
          disabled: !internalListData.label,
        },
        { label: t('buttons.cancel'), onPress: handleRequestClose },
      ],
      [handleConfirmButtonPress, internalListData.label, handleRequestClose, t],
    );

    const handleEmojiSelect = useCallback((emoji: string) => {
      setInternalListData((current) => {
        var label = current.label;
        label = trimEmoji(label, "start")?.formattedText ?? '';
        return { ...current, label: `${emoji} ${label.trim()}` };
      });
    }, []);

    return (
      <PopupModal
        visible={visible}
        topContainerVisible={isTopContainerVisible} 
        onRequestClose={handleRequestClose}
        TopContainerComponent={
          <SuggestedEmojiList emojis={suggestedEmojis} onEmojiSelect={handleEmojiSelect} showDefaultIcon isShowingMostUsedEmojis={showingMostUsedEmojis} />
        }
        onShow={() => {
          setInternalListData(editingList ?? getNewEmptyList());
          setTimeout(() => inputRef.current?.focus(), 200);
          setTimeout(() => {
            if (editingList) {
              setIsTopContainerVisible(true);
              var emojis = searchEmojis(editingList.label);
              if (!emojis.length) {
                emojis = [...getMostUsedEmojis(), ...getDefaultEmojis("list")];
                setShowingMostUsedEmojis(true);
              }
              if (!emojis.length) {
              }
              setSuggestedEmojis(emojis);
            }
          }, 1000);
        }}
        title={t(isEditing ? 'popupTitles.editList' : 'popupTitles.newList')}
        buttons={buttonsData}
        Icon={ListDefaultIcon}
      >
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

export { NewListModal };
