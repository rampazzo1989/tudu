import React, {memo, useCallback, useRef, useState} from 'react';
import {FadeOutDown} from 'react-native-reanimated';
import {toggle} from '../../utils/state-utils';
import {AdjustIcon} from '../animated-icons/adjust-icon';
import {BaseAnimatedIconRef} from '../animated-icons/animated-icon/types';
import {HashIcon} from '../animated-icons/hash-icon';
import {
  ButtonContainer,
  Button,
  CounterText,
  IconContainer,
  Tile,
  TileTitleContainer,
  Title,
  ReplacebleContainer,
  EditingContainer,
  ActionButtonContainer,
  ActionButtonsContainer,
  EditingCounterText,
  OptionsTouchable,
  OptionsIconContainer,
  ShrinkableContainer,
  EditingTextContainer,
} from './styles';
import {
  ActionButtonProps,
  CounterTileProps,
  CounterValueProps,
  EditingCounterValueProps,
  OptionsButtonProps,
  TileTitleProps,
} from './types';
import {ActionMinusIcon} from '../../assets/static/action_minus';
import {ActionPlusIcon} from '../../assets/static/action_plus';
import {CounterViewModel} from '../../scenes/home/types';
import {PopoverMenu} from '../popover-menu';
import {CounterOptions} from '../../scenes/counter/components/counter-options';
import {OptionsArrowDownIcon} from '../animated-icons/options-arrow-down-icon';
import {NewCounterModal} from '../../scenes/counter/components/new-counter-modal';
import {PopupModal} from '../popup-modal';
import {
  DeleteIcon,
  DeleteIconActionAnimation,
} from '../animated-icons/delete-icon';
import {useTranslation} from 'react-i18next';
import {useCounterService} from '../../service/counter-service-hook/useCounterService';

const TileTitle: React.FC<TileTitleProps> = memo(({title}) => {
  return (
    <TileTitleContainer>
      <IconContainer>
        <HashIcon autoPlay size={14} animateWhenIdle />
      </IconContainer>
      <Title numberOfLines={2}>{title}</Title>
    </TileTitleContainer>
  );
});

const CounterValue: React.FC<CounterValueProps> = memo(({value}) => {
  return (
    <CounterText adjustsFontSizeToFit numberOfLines={1}>
      {value}
    </CounterText>
  );
});

const EditingCounterValue: React.FC<EditingCounterValueProps> = memo(
  ({value, onEditOption}) => {
    return (
      <EditingTextContainer onPress={onEditOption}>
        <EditingCounterText adjustsFontSizeToFit numberOfLines={1}>
          {value}
        </EditingCounterText>
      </EditingTextContainer>
    );
  },
);

const AdjustButton: React.FC = memo(() => {
  const iconRef = useRef<BaseAnimatedIconRef>(null);

  return (
    <ButtonContainer exiting={FadeOutDown.duration(300)}>
      <Button>
        <AdjustIcon ref={iconRef} autoPlay />
      </Button>
    </ButtonContainer>
  );
});

const MoreOptionsButton: React.FC<OptionsButtonProps> = memo(
  ({counterData, onDeleteOption, onEditOption}) => {
    const [popoverMenuVisible, setPopoverMenuVisible] = useState(false);
    const iconRef = useRef<BaseAnimatedIconRef>(null);

    const handlePopoverMenuRequestClose = useCallback(() => {
      iconRef.current?.toggle();
      setPopoverMenuVisible(false);
    }, []);

    const handleOptionsButtonPress = useCallback(() => {
      iconRef.current?.toggle();
      setPopoverMenuVisible(true);
    }, []);

    const OptionsComponent = useCallback(
      () => (
        <OptionsTouchable
          onPress={handleOptionsButtonPress}
          hitSlop={20}
          scaleFactor={0}>
          <OptionsIconContainer>
            <OptionsArrowDownIcon ref={iconRef} speed={2} />
          </OptionsIconContainer>
        </OptionsTouchable>
      ),
      [handleOptionsButtonPress],
    );

    return (
      <ButtonContainer>
        <PopoverMenu
          isVisible={popoverMenuVisible}
          onRequestClose={handlePopoverMenuRequestClose}
          from={OptionsComponent}>
          <CounterOptions
            counterData={counterData}
            closeMenu={handlePopoverMenuRequestClose}
            onDeleteOption={onDeleteOption}
            onEditOption={onEditOption}
          />
        </PopoverMenu>
      </ButtonContainer>
    );
  },
);

const DecrementButton: React.FC<ActionButtonProps> = memo(({onAction}) => {
  return (
    <ActionButtonContainer onPress={onAction}>
      <ActionMinusIcon />
    </ActionButtonContainer>
  );
});

const IncrementButton: React.FC<ActionButtonProps> = memo(({onAction}) => {
  return (
    <ActionButtonContainer onPress={onAction}>
      <ActionPlusIcon />
    </ActionButtonContainer>
  );
});

const EDITING_TIMEOUT_MS = 7000;

const CounterTile: React.FC<CounterTileProps> = memo(
  ({counterData, animateIcon}) => {
    const [isEditing, setEditing] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const {saveCounter, deleteCounter} = useCounterService();
    const {t} = useTranslation();

    const idleTime = useRef<NodeJS.Timeout>();

    const startCloseEditingTimeout = useCallback(() => {
      idleTime.current = setTimeout(() => {
        clearTimeout(idleTime.current);
        idleTime.current = undefined;
        setEditing(false);
      }, EDITING_TIMEOUT_MS);
    }, []);

    const handleChangeButtonPress = useCallback(() => {
      startCloseEditingTimeout();
      setEditing(toggle);
    }, [startCloseEditingTimeout]);

    const handleChangeValue = useCallback(
      (operation: 'increment' | 'decrement') => {
        const newValue =
          operation === 'increment'
            ? counterData.value + counterData.pace
            : counterData.value - counterData.pace;
        const newCounter = new CounterViewModel({
          ...counterData.mapBack(),
          value: newValue,
        });

        saveCounter(newCounter);
      },
      [counterData, saveCounter],
    );

    const handleIncrement = useCallback(
      () => handleChangeValue('increment'),
      [handleChangeValue],
    );

    const handleDecrement = useCallback(
      () => handleChangeValue('decrement'),
      [handleChangeValue],
    );

    const handleEditCounter = useCallback(() => {
      setEditModalVisible(true);
    }, []);

    const handleDeleteCounter = useCallback(() => {
      setDeleteModalVisible(true);
    }, []);

    const handleConfirmDelete = useCallback(() => {
      setDeleteModalVisible(false);
      if (idleTime.current) {
        clearTimeout(idleTime.current);
      }
      setEditing(false);
      deleteCounter(counterData);
      animateIcon?.(DeleteIconActionAnimation);
    }, [animateIcon, counterData, deleteCounter]);

    const handleCancelDelete = useCallback(() => {
      setDeleteModalVisible(false);
    }, []);

    return (
      <Tile
        onStartShouldSetResponderCapture={() => {
          if (idleTime.current) {
            clearTimeout(idleTime.current);
            startCloseEditingTimeout();
          }
          return false;
        }}>
        <ReplacebleContainer visible={!isEditing}>
          <ShrinkableContainer
            scaleFactor={0.05}
            delayPressEvent={100}
            onPress={handleChangeButtonPress}>
            <TileTitle title={counterData.title} />
            <CounterValue value={counterData.value} />
            <AdjustButton />
          </ShrinkableContainer>
        </ReplacebleContainer>

        <EditingContainer visible={isEditing}>
          <MoreOptionsButton
            counterData={counterData}
            onEditOption={handleEditCounter}
            onDeleteOption={handleDeleteCounter}
          />
          <EditingCounterValue
            value={counterData.value}
            onEditOption={handleEditCounter}
          />
          <ActionButtonsContainer>
            <DecrementButton onAction={handleDecrement} />
            <IncrementButton onAction={handleIncrement} />
          </ActionButtonsContainer>
        </EditingContainer>
        <NewCounterModal
          visible={editModalVisible}
          onRequestClose={() => setEditModalVisible(false)}
          editingCounterData={counterData}
        />
        <PopupModal
          visible={deleteModalVisible}
          onRequestClose={() => setDeleteModalVisible(false)}
          title={t('messages.confirmCounterDelete', {
            counterTitle: counterData.title,
          })}
          buttons={[
            {label: t('buttons.yes'), onPress: handleConfirmDelete},
            {label: t('buttons.no'), onPress: handleCancelDelete},
          ]}
          Icon={DeleteIcon}
          shakeOnShow
          haptics
        />
      </Tile>
    );
  },
);

export {CounterTile};
