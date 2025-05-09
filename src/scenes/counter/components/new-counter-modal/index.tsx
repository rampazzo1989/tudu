import React, {memo, useCallback, useMemo, useRef, useState} from 'react';
import {NewCounterModalProps} from './types';
import {PopupModal} from '../../../../components/popup-modal';
import {CounterViewModel} from '../../../home/types';
import {
  CustomPaceInput,
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
import {Keyboard, TextInput, View} from 'react-native';
import {generateRandomHash} from '../../../../hooks/useHashGenerator';
import {useCounterService} from '../../../../service/counter-service-hook/useCounterService';
import {getDuplicateProofCounterTitle} from '../../../../utils/counter-utils';

const emptyCounter = new CounterViewModel({
  title: '',
  value: 0,
  pace: 1,
  id: generateRandomHash('New counter'),
});

const defaultPaceOptions = [1, 5, 10];

const NewCounterModal: React.FC<NewCounterModalProps> = memo(
  ({visible, editingCounterData, onRequestClose, onInsertNewCounter}) => {
    const [internalCounterData, setInternalCounterData] =
      useState<CounterViewModel>(editingCounterData ?? emptyCounter);
    const [customPace, setCustomPace] = useState<number>();
    const titleInputRef = useRef<TextInput>(null);
    const valueInputRef = useRef<TextInput>(null);
    const customPaceInputRef = useRef<TextInput>(null);
    const [customPaceInputValue, setCustomPaceInputValue] = useState<number>();
    const [customPaceInputVisible, setCustomPaceInputVisible] = useState(false);
    const {saveCounter, getAllCounters} = useCounterService();

    const {t} = useTranslation();

    const isEditing = useMemo(() => !!editingCounterData, [editingCounterData]);
    const dataValidated = useMemo(
      () => !!internalCounterData?.title && !!internalCounterData?.pace,
      [internalCounterData],
    );

    const handlePaceOptionPressGenerator = useCallback(
      (pace: number = 1) =>
        () => {
          setInternalCounterData(previousState => {
            const newCounter = previousState.mapBack();
            newCounter.pace = pace;
            return new CounterViewModel(newCounter);
          });
          setCustomPace(undefined);
          setCustomPaceInputVisible(false);
          Keyboard.dismiss();
        },
      [],
    );

    const insertOrUpdateCounter = useCallback(
      (counter: CounterViewModel) => {
        const isUpdatingTitle = counter.title !== editingCounterData?.title;

        const newTitle = isUpdatingTitle
          ? getDuplicateProofCounterTitle(getAllCounters(), counter.title)
          : counter.title;

        const newCounter = new CounterViewModel(counter.mapBack());

        newCounter.title = newTitle;

        saveCounter(newCounter);
      },
      [editingCounterData?.title, getAllCounters, saveCounter],
    );

    const handleCustomPaceInputSubmit = useCallback(() => {
      if (defaultPaceOptions.includes(customPaceInputValue ?? 0)) {
        setCustomPace(undefined);
        handlePaceOptionPressGenerator(customPaceInputValue)();
        setCustomPaceInputVisible(false);

        return;
      }
      setCustomPace(customPaceInputValue);
      setCustomPaceInputVisible(false);
      setInternalCounterData(previousState => {
        const viewModel = new CounterViewModel(previousState.mapBack());
        viewModel.pace = customPaceInputValue ?? 0;
        return viewModel;
      });
    }, [customPaceInputValue, handlePaceOptionPressGenerator]);

    const handleConfirmButtonPress = useCallback(() => {
      if (customPaceInputVisible) {
        handleCustomPaceInputSubmit();
        return;
      }

      if (!internalCounterData?.title || !internalCounterData?.pace) {
        return;
      }

      insertOrUpdateCounter(internalCounterData);

      onInsertNewCounter?.();

      onRequestClose();
    }, [
      customPaceInputVisible,
      handleCustomPaceInputSubmit,
      insertOrUpdateCounter,
      internalCounterData,
      onInsertNewCounter,
      onRequestClose,
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
      setInternalCounterData(previousState => {
        const viewModel = new CounterViewModel(previousState.mapBack());
        viewModel.title = text;

        return viewModel;
      });
    }, []);

    const handleValueChange = useCallback((text: string) => {
      // Remove all non-numeric characters from the input
      let numericValue = parseInt(text.replace(/[^0-9]/g, ''), 10);
      numericValue = isNaN(numericValue) || !numericValue ? 0 : numericValue;
      setInternalCounterData(previousState => {
        const viewModel = new CounterViewModel(previousState.mapBack());
        viewModel.value = numericValue;

        return viewModel;
      });
    }, []);

    const paceOptions = useMemo(
      () => [
        {
          pace: 1,
          label: '+1',
          onPress: handlePaceOptionPressGenerator(1),
        },
        {
          pace: 5,
          label: '+5',
          onPress: handlePaceOptionPressGenerator(5),
        },
        {
          pace: 10,
          label: '+10',
          onPress: handlePaceOptionPressGenerator(10),
        },
        {
          pace: customPace,
          label: customPace ? `+${customPace}...` : `${t('buttons.other')}...`,
          onPress: () => {
            setCustomPaceInputVisible(true);
            setTimeout(() => {
              customPaceInputRef.current?.focus();
            }, 100);
          },
        },
      ],
      [customPace, handlePaceOptionPressGenerator],
    );

    const handleTitleSubmit = useCallback(() => {
      valueInputRef.current?.focus();
    }, []);

    const handleCustomPaceInputBlur = useCallback(() => {
      setCustomPaceInputVisible(false);
    }, []);

    const handleCustomPaceInputChange = useCallback((text: string) => {
      // Remove all non-numeric characters from the input
      let numericValue = parseInt(text.replace(/[^0-9]/g, ''), 10);
      numericValue = isNaN(numericValue) || !numericValue ? 0 : numericValue;
      setCustomPaceInputValue(numericValue);
    }, []);

    const handlePopupShow = useCallback(() => {
      setCustomPaceInputVisible(false);

      if (isEditing && editingCounterData) {
        setInternalCounterData(editingCounterData);
        if (!defaultPaceOptions.includes(editingCounterData.pace)) {
          setCustomPace(editingCounterData.pace);
          setCustomPaceInputValue(editingCounterData.pace);
        }
      } else {
        setInternalCounterData(emptyCounter);
        setCustomPaceInputValue(0);
      }
      setTimeout(() => titleInputRef.current?.focus(), 200);
    }, [editingCounterData, isEditing]);

    return (
      <PopupModal
        visible={visible}
        onRequestClose={onRequestClose}
        onShow={handlePopupShow}
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
            <Label>{t('inputLabels.pace')}</Label>
            <PaceOptions>
              {paceOptions.map((option, index) =>
                customPaceInputVisible && index === paceOptions.length - 1 ? (
                  <CustomPaceInput
                    key={`${option.label}-${index}-input`}
                    ref={customPaceInputRef}
                    onSubmitEditing={handleCustomPaceInputSubmit}
                    keyboardType="number-pad"
                    onBlur={handleCustomPaceInputBlur}
                    onChangeText={handleCustomPaceInputChange}
                    value={String(customPaceInputValue ?? 0)}
                  />
                ) : (
                  <PaceOptionButton
                    highlight={option.pace === internalCounterData.pace}
                    key={`${option.label}-${index}`}
                    onPress={option.onPress}>
                    <PaceOptionLabel>{option.label}</PaceOptionLabel>
                  </PaceOptionButton>
                ),
              )}
            </PaceOptions>
          </PaceContainer>
        </View>
      </PopupModal>
    );
  },
);

export {NewCounterModal};
