import React, {memo, useCallback, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TextInput} from 'react-native';
import {generateRandomHash} from '../../hooks/useHashGenerator';
import {TuduViewModel} from '../../scenes/home/types';
import {CheckMarkIcon} from '../animated-icons/check-mark';
import {PopupModal} from '../popup-modal';
import {PopupButton} from '../popup-modal/types';
import {Input} from './styles';
import {NewTuduModalProps} from './types';
import { useEmojiSearch } from '../../hooks/useEmojiSearch';
import SuggestedEmojiList from '../suggested-emoji-list';
import { trimEmoji } from '../../utils/emoji-utils';

const getNewEmptyTudu = () =>
  new TuduViewModel(
    {
      label: '',
      done: false,
      id: generateRandomHash('New Tudu'),
    },
    '',
    'default',
  );

const MAX_TUDU_LENGTH = 100;

const NewTuduModal: React.FC<NewTuduModalProps> = memo(
  ({visible, editingTudu, listName, onRequestClose, onInsertOrUpdate}) => {
    const [internalTuduData, setInternalTuduData] = useState<TuduViewModel>(
      editingTudu ?? getNewEmptyTudu(),
    );
    const [suggestedEmojis, setSuggestedEmojis] = useState<string[]>([]);
    const [isTopContainerVisible, setIsTopContainerVisible] = useState(false);
    const [showingMostUsedEmojis, setShowingMostUsedEmojis] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {t} = useTranslation();

    const inputRef = useRef<TextInput>(null);

    const { 
      debounceSearchEmojis, 
      searchEmojis, 
      getMostUsedEmojis, 
      getDefaultEmojis 
    } = useEmojiSearch(700);

    const handleRequestClose = useCallback(() => {
      setIsTopContainerVisible(false);
      setSuggestedEmojis([]);
      onRequestClose();
    }, []);

    const searchEmojisForListName = useCallback(() => {
      var resultsForListName: string[] = [];
      const tuduListName = editingTudu?.listName || listName;
      
      if (tuduListName) {
        resultsForListName = searchEmojis(tuduListName);
      }

      return resultsForListName;
    }, [editingTudu, searchEmojis]);

    const handleTextChange = useCallback((text: string) => {
      setInternalTuduData(x => {
        const newTudu = x.clone();
        newTudu.label = text;
        return newTudu;
      });

      setIsTopContainerVisible(true);

      debounceSearchEmojis(text, (results, isShowingMostUsed) => {
        var emojis = results;
        
        if (emojis.length < 8) {
          emojis = [...emojis, ...searchEmojisForListName()];
        }
        setShowingMostUsedEmojis(isShowingMostUsed);

        if (isShowingMostUsed) {
          emojis = [...emojis, ...getDefaultEmojis('tudu')];
        }
        setIsLoading(false);
        setSuggestedEmojis(emojis);
      },true, () => setIsLoading(true));
    }, [debounceSearchEmojis, editingTudu]);

    const isEditing = useMemo(() => !!editingTudu, [editingTudu]);

    const handleInsertOrUpdateTudu = useCallback(
      (tudu: TuduViewModel) => {
        onInsertOrUpdate(tudu);
      },
      [onInsertOrUpdate],
    );

    const handleConfirmButtonPress = useCallback(() => {
      if (!internalTuduData.label) {
        return;
      }

      handleInsertOrUpdateTudu(internalTuduData);

      handleRequestClose();
    }, [handleInsertOrUpdateTudu, internalTuduData, handleRequestClose]);

    const buttonsData = useMemo<PopupButton[]>(
      () => [
        {
          label: t('buttons.ok'),
          onPress: handleConfirmButtonPress,
          disabled: !internalTuduData.label,
        },
        {label: t('buttons.cancel'), onPress: handleRequestClose},
      ],
      [handleConfirmButtonPress, internalTuduData.label, handleRequestClose, t],
    );

    const handleEmojiSelect = useCallback((emoji: string) => {
      setInternalTuduData((current) => {
        var tuduClone = current.clone();
        var label = tuduClone.label;
        label = trimEmoji(label, "start")?.formattedText ?? '';
        tuduClone.label = `${emoji} ${label.trim()}`;
        return tuduClone;
      });
    }, []);

    const TopContainerComponent = useMemo(() => {
      return (
        <SuggestedEmojiList
          emojis={suggestedEmojis}
          onEmojiSelect={handleEmojiSelect}
          isShowingMostUsedEmojis={showingMostUsedEmojis}
          isLoading={isLoading}
        />
      );
    }, [suggestedEmojis, handleEmojiSelect, showingMostUsedEmojis, isLoading]);

    return (
      <PopupModal
        visible={visible}
        topContainerVisible={isTopContainerVisible} 
        onRequestClose={handleRequestClose}
        TopContainerComponent={TopContainerComponent}
        onShow={() => {
          setInternalTuduData(editingTudu ?? getNewEmptyTudu());
          setTimeout(() => inputRef.current?.focus(), 200);
          setTimeout(() => {
            setIsLoading(true);
            setIsTopContainerVisible(true);

            setTimeout(() => {
              var emojis = searchEmojis(editingTudu?.label ?? '');
            
              if (!emojis.length) {
                emojis = [...new Set([...getMostUsedEmojis(), ...getDefaultEmojis("tudu")])];
                setShowingMostUsedEmojis(!!emojis.length);
              }
  
              if (emojis.length < 8) {
                emojis = [...emojis, ...searchEmojisForListName()];
              }
  
              setSuggestedEmojis(emojis);
              setIsLoading(false);
            }, 0);
          }, 700);
        }}
        title={t(isEditing ? 'popupTitles.editTudu' : 'popupTitles.newTudu')}
        buttons={buttonsData}
        Icon={CheckMarkIcon}>
        <Input
          value={internalTuduData.label}
          onChangeText={handleTextChange}
          maxLength={MAX_TUDU_LENGTH}
          ref={inputRef}
        />
      </PopupModal>
    );
  },
);

export {NewTuduModal};
