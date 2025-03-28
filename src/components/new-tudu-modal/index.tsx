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
import emojisPtBr from 'emojilib-pt-br/dist/emoji-pt-BR.json';
import emojisEn from 'emojilib-pt-br/dist/emoji-en-US.json';
import { getLocales } from "react-native-localize";
import Fuse from 'fuse.js';

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

const MINIMUM_TEXT_SIZE_TO_SUGGEST_EMOJI = 3;

const MAX_TUDU_LENGTH = 100;
const TEXT_DEBOUNCE_DELAY = 2000;

const NewTuduModal: React.FC<NewTuduModalProps> = memo(
  ({visible, editingTudu, onRequestClose, onInsertOrUpdate}) => {
    const [internalTuduData, setInternalTuduData] = useState<TuduViewModel>(
      editingTudu ?? getNewEmptyTudu(),
    );
    const timer = useRef<NodeJS.Timeout | undefined>(undefined);

    const {t} = useTranslation();

    const inputRef = useRef<TextInput>(null);

    const emojis = useMemo(() => {
      const language = getLocales()[0].languageTag; // or use a prop/context to determine language
      return language.startsWith('pt-BR') ? emojisPtBr : emojisEn;
    }, []);

    const debounce = useCallback((func: () => void, delay: number) => {
      return () => {
      clearTimeout(timer.current);
      timer.current = setTimeout(func, delay);
      };
    }, []);

    const searchEmojis = useCallback((text: string) => {
      const words = text.split(/\s+/).filter(Boolean);
      var sortedWords = words.sort((a, b) => b.length - a.length);
      if (sortedWords.length > 1){
        sortedWords = sortedWords.filter(word => word.length >= MINIMUM_TEXT_SIZE_TO_SUGGEST_EMOJI);
      }

      const searchLimitPerWord = sortedWords.length > 2 ? 2 : 4;

      var emojiEntries = Object.entries(emojis).map(([key, values]) => ({ key, values }));
      const fuse = new Fuse(emojiEntries, { keys: ['values'], threshold: 0.25, distance: 100, includeScore: true });
      
      const resultSet = new Set(
        sortedWords.flatMap(word => 
          fuse.search(word, { limit: searchLimitPerWord }).sort((a, b) => (a.score ?? 0) - (b.score ?? 0))
        ).map(x => x.item.key)
      );

      const results = Array.from(resultSet);
      console.log(results);
    }, []);

    const handleTextChange = useCallback((text: string) => {
      setInternalTuduData(x => {
      const newTudu = x.clone();
      newTudu.label = text;
      return newTudu;
      });

      debounce(() => searchEmojis(text), TEXT_DEBOUNCE_DELAY)();
    }, [debounce, searchEmojis]);

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

      onRequestClose();
    }, [handleInsertOrUpdateTudu, internalTuduData, onRequestClose]);

    const buttonsData = useMemo<PopupButton[]>(
      () => [
        {
          label: t('buttons.ok'),
          onPress: handleConfirmButtonPress,
          disabled: !internalTuduData.label,
        },
        {label: t('buttons.cancel'), onPress: onRequestClose},
      ],
      [handleConfirmButtonPress, internalTuduData.label, onRequestClose, t],
    );

    return (
      <PopupModal
        visible={visible}
        onRequestClose={onRequestClose}
        onShow={() => {
          setInternalTuduData(editingTudu ?? getNewEmptyTudu());
          setTimeout(() => inputRef.current?.focus(), 200);
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
