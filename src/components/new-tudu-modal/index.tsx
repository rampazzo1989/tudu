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
  ({visible, editingTudu, onRequestClose, onInsertOrUpdate}) => {
    const [internalTuduData, setInternalTuduData] = useState<TuduViewModel>(
      editingTudu ?? getNewEmptyTudu(),
    );
    const timer = useRef<NodeJS.Timeout | undefined>(undefined);

    const {t} = useTranslation();

    const inputRef = useRef<TextInput>(null);

    const { debounceSearchEmojis } = useEmojiSearch(2000);

    const handleTextChange = useCallback((text: string) => {
      setInternalTuduData(x => {
      const newTudu = x.clone();
      newTudu.label = text;
      return newTudu;
      });

      debounceSearchEmojis(text, (results) => {
        console.log("Olha", results);
      });
    }, [debounceSearchEmojis]);

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
