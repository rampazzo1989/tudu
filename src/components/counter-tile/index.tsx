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
  OptionsButton,
  ActionButtonContainer,
  ActionButtonsContainer,
  EditingCounterText,
  OptionsTouchable,
  OptionsIconContainer,
  ShrinkableContainer,
} from './styles';
import {
  ActionButtonProps,
  AdjustButtonProps,
  CounterTileProps,
  CounterValueProps,
  OptionsButtonProps,
  TileTitleProps,
} from './types';
import {OptionsIcon} from '../../assets/static/options';
import {ActionMinusIcon} from '../../assets/static/action_minus';
import {ActionPlusIcon} from '../../assets/static/action_plus';
import {useSetRecoilState} from 'recoil';
import {counters} from '../../scenes/home/state';
import {Counter} from '../../scenes/home/types';
import {PopoverMenu} from '../popover-menu';
import {CounterOptions} from '../../scenes/counter/components/counter-options';
import {OptionsArrowDownIcon} from '../animated-icons/options-arrow-down-icon';
import {NewCounterModal} from '../../scenes/counter/components/new-counter-modal';
import {PopupModal} from '../popup-modal';
import {DeleteIcon} from '../animated-icons/delete-icon';
import {ShrinkableView} from '../shrinkable-view';

const TileTitle: React.FC<TileTitleProps> = memo(({title}) => {
  return (
    <TileTitleContainer>
      <IconContainer>
        <HashIcon autoPlay size={14} />
      </IconContainer>
      <Title>{title}</Title>
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

const EditingCounterValue: React.FC<CounterValueProps> = memo(({value}) => {
  return (
    <EditingCounterText adjustsFontSizeToFit numberOfLines={1}>
      {value}
    </EditingCounterText>
  );
});

const AdjustButton: React.FC<AdjustButtonProps> = memo(
  ({onChangeButtonPress}) => {
    const iconRef = useRef<BaseAnimatedIconRef>(null);

    const handleChangeButtonPress = () => {
      iconRef?.current?.play();
      onChangeButtonPress();
    };

    return (
      <ButtonContainer exiting={FadeOutDown.duration(300)}>
        <Button onPress={handleChangeButtonPress} hitSlop={20}>
          <AdjustIcon ref={iconRef} autoPlay />
        </Button>
      </ButtonContainer>
    );
  },
);

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
            <OptionsArrowDownIcon
              ref={iconRef}
              animateWhenIdle={false}
              speed={2}
            />
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

const CounterTile: React.FC<CounterTileProps> = memo(({counterData}) => {
  const [isEditing, setEditing] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const setCountersList = useSetRecoilState(counters);

  const idleTime = useRef<NodeJS.Timeout>();

  const startCloseEditingTimeout = useCallback(() => {
    idleTime.current = setTimeout(() => {
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
      const newCounter: Counter = {...counterData, value: newValue};

      setCountersList(current => {
        const currentIndex = current.indexOf(counterData);
        const newList = [...current];
        newList.splice(currentIndex, 1, newCounter);
        return newList;
      });
    },
    [counterData, setCountersList],
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
    setCountersList(current => {
      const currentIndex = current.indexOf(counterData);
      const newList = [...current];
      newList.splice(currentIndex, 1);
      return newList;
    });
  }, [counterData, setCountersList]);

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
        <ShrinkableContainer scaleFactor={0.04}>
          <TileTitle title={counterData.title} />
          <CounterValue value={counterData.value} />
          <AdjustButton onChangeButtonPress={handleChangeButtonPress} />
        </ShrinkableContainer>
      </ReplacebleContainer>

      <EditingContainer visible={isEditing}>
        <MoreOptionsButton
          counterData={counterData}
          onEditOption={handleEditCounter}
          onDeleteOption={handleDeleteCounter}
        />
        <EditingCounterValue value={counterData.value} />
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
        title={'Deseja excluir o contador?'}
        buttons={[
          {label: 'Sim', onPress: handleConfirmDelete},
          {label: 'Não', onPress: handleCancelDelete},
        ]}
        Icon={DeleteIcon}
        shakeOnShow
        haptics
      />
    </Tile>
  );
});

export {CounterTile};
