import React, {memo, useCallback, useMemo, useRef, useState} from 'react';
import {NewCounterModalProps} from './types';
import {PopupModal} from '../../../../components/popup-modal';
import {Counter} from '../../../home/types';
import {
  InputsContainer,
  Label,
  PaceContainer,
  PaceOptionButton,
  PaceOptionLabel,
  PaceOptions,
  TitleContainer,
  TitleInput,
  ValueContainer,
  ValueInput,
} from './styles';
import {useTranslation} from 'react-i18next';
import {HashIcon} from '../../../../components/animated-icons/hash-icon';
import {PopupButton} from '../../../../components/popup-modal/types';
import {useSetRecoilState} from 'recoil';
import {counters} from '../../../home/state';
import {Keyboard, TextInput, View} from 'react-native';

const emptyCounter: Counter = {title: '', value: 0, pace: 1};

const NewCounterModal: React.FC<NewCounterModalProps> = memo(
  ({visible, editingCounterData, onRequestClose}) => {
    const [internalCounterData, setInternalCounterData] = useState<Counter>(
      editingCounterData ?? emptyCounter,
    );
    const [customPace, setCustomPace] = useState<number>();
    const titleInputRef = useRef<TextInput>(null);
    const valueInputRef = useRef<TextInput>(null);

    const {t} = useTranslation();
    const setCountersList = useSetRecoilState(counters);

    const isEditing = useMemo(() => !!editingCounterData, [editingCounterData]);
    const dataValidated = useMemo(
      () => !!internalCounterData?.title && !!internalCounterData?.pace,
      [internalCounterData],
    );

    const paceOptions = useMemo(
      () => [
        {
          pace: 1,
          label: '+1',
        },
        {
          pace: 5,
          label: '+5',
        },
        {
          pace: 10,
          label: '+10',
        },
        {
          pace: customPace,
          label: 'other...',
        },
      ],
      [customPace],
    );

    const handleConfirmButtonPress = useCallback(() => {
      if (!internalCounterData?.title || !internalCounterData?.pace) {
        return;
      }
      if (isEditing) {
        setCountersList(current => {
          const currentIndex = current.indexOf(editingCounterData);
          const newList = [...current];
          newList.splice(currentIndex, 1, internalCounterData);
          return newList;
        });
      } else {
        setCountersList(current => [internalCounterData, ...current]);
      }
      onRequestClose();
    }, [
      editingCounterData,
      internalCounterData,
      isEditing,
      onRequestClose,
      setCountersList,
    ]);

    const buttonsData = useMemo<PopupButton[]>(
      () => [
        {
          label: t('buttons.ok'),
          onPress: handleConfirmButtonPress,
          disabled: !dataValidated,
        },
        {label: t('buttons.cancel'), onPress: onRequestClose},
      ],
      [dataValidated, handleConfirmButtonPress, onRequestClose, t],
    );

    const handleTitleChange = useCallback((text: string) => {
      setInternalCounterData(current => ({...current, title: text}));
    }, []);

    const handleValueChange = useCallback((text: string) => {
      // Remove all non-numeric characters from the input
      let numericValue = parseInt(text.replace(/[^0-9]/g, ''), 10);
      numericValue = isNaN(numericValue) || !numericValue ? 0 : numericValue;
      setInternalCounterData(current => ({...current, value: numericValue}));
    }, []);

    const handlePaceOptionPressGenerator = useCallback(
      (pace: number = 1) =>
        () => {
          setInternalCounterData(current => ({...current, pace}));
          Keyboard.dismiss();
        },
      [],
    );

    const handleTitleSubmit = useCallback(() => {
      valueInputRef.current?.focus();
    }, []);

    return (
      <PopupModal
        visible={visible}
        onRequestClose={onRequestClose}
        onShow={() => {
          if (isEditing && editingCounterData) {
            setInternalCounterData(editingCounterData);
          } else {
            setInternalCounterData(emptyCounter);
          }
          setTimeout(() => titleInputRef.current?.focus(), 200);
        }}
        title={t(
          isEditing ? 'popupTitles.editCounter' : 'popupTitles.newCounter',
        )}
        buttons={buttonsData}
        Icon={HashIcon}>
        <View>
          <InputsContainer>
            <TitleContainer>
              <Label>{t('inputLabels.description')}</Label>
              <TitleInput
                value={internalCounterData.title}
                onChangeText={handleTitleChange}
                onSubmitEditing={handleTitleSubmit}
                ref={titleInputRef}
                enterKeyHint="next"
              />
            </TitleContainer>
            <ValueContainer>
              <Label>
                {t(
                  isEditing
                    ? 'inputLabels.currentValue'
                    : 'inputLabels.initialValue',
                )}
              </Label>
              <ValueInput
                value={String(internalCounterData.value)}
                onChangeText={handleValueChange}
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                }}
                keyboardType="number-pad"
                ref={valueInputRef}
              />
            </ValueContainer>
          </InputsContainer>
          <PaceContainer>
            <Label>{'Pace'}</Label>
            <PaceOptions>
              {paceOptions.map((option, index) => (
                <PaceOptionButton
                  highlight={option.pace === internalCounterData.pace}
                  key={`${option.label}-${index}`}
                  onPress={handlePaceOptionPressGenerator(option.pace)}>
                  <PaceOptionLabel>{option.label}</PaceOptionLabel>
                </PaceOptionButton>
              ))}
            </PaceOptions>
          </PaceContainer>
        </View>
      </PopupModal>
    );
  },
);

export {NewCounterModal};
