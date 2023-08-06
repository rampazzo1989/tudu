import React, {memo, useCallback, useRef, useState} from 'react';
import {ListDefaultIcon} from '../../../../components/animated-icons/list-default-icon';
import {generateRandomHash} from '../../../../hooks/useHashGenerator';
import {DraggableItem} from '../../../../modules/draggable/draggable-item';
import {
  ListGroupContainer,
  OptionsIconContainer,
  OptionsTouchable,
  SubListCard,
  Title,
  TitleContainer,
} from './styles';
import {ListGroupProps} from './types';
import {PopoverMenu} from '../../../../components/popover-menu';
import {GroupOptions} from './components/group-options';
import {OptionsArrowDownIcon} from '../../../../components/animated-icons/options-arrow-down-icon';
import {BaseAnimatedIconRef} from '../../../../components/animated-icons/animated-icon/types';
import {PopupModal} from '../../../../components/popup-modal';
import {TextInput} from 'react-native';

const ListGroupCard: React.FC<ListGroupProps> = memo(({groupData}) => {
  const iconRef = useRef<BaseAnimatedIconRef>(null);
  const [popoverMenuVisible, setPopoverMenuVisible] = useState(false);
  const [renamePopupVisible, setRenamePopupVisible] = useState(false);

  const handleOptionsButtonPress = useCallback(() => {
    iconRef.current?.toggle();
    setPopoverMenuVisible(true);
  }, []);

  const handlePopoverMenuRequestClose = useCallback(() => {
    iconRef.current?.toggle();
    setPopoverMenuVisible(false);
  }, []);

  const OptionsComponent = useCallback(
    () => (
      <OptionsTouchable onPress={handleOptionsButtonPress} hitSlop={20}>
        <OptionsIconContainer>
          <OptionsArrowDownIcon ref={iconRef} animateWhenIdle={false} />
        </OptionsIconContainer>
      </OptionsTouchable>
    ),
    [handleOptionsButtonPress],
  );

  return (
    <ListGroupContainer>
      <TitleContainer>
        <Title>{groupData.groupId}</Title>

        <PopoverMenu
          isVisible={popoverMenuVisible}
          onRequestClose={handlePopoverMenuRequestClose}
          from={OptionsComponent}>
          <GroupOptions
            groupData={groupData}
            closeMenu={handlePopoverMenuRequestClose}
            onRename={() => setRenamePopupVisible(true)}
          />
        </PopoverMenu>
      </TitleContainer>
      {groupData.data.map(list => {
        return (
          <DraggableItem
            key={generateRandomHash(`${list.label}${groupData.groupId}`)}
            payload={list}>
            <SubListCard
              Icon={ListDefaultIcon}
              label={list.label}
              numberOfActiveItems={list.numberOfActiveItems}
            />
          </DraggableItem>
        );
      })}
      <PopupModal
        visible={renamePopupVisible}
        onRequestClose={() => setRenamePopupVisible(false)}
        title={'Rename Group'}
        buttons={[
          {label: 'OK', onPress: () => console.log('CONFIRM RENAME')},
          {label: 'Cancel', onPress: () => console.log('CANCEL RENAME')},
        ]}
        Icon={ListDefaultIcon}
        shakeOnShow>
        <TextInput
          style={{
            width: '100%',
            backgroundColor: '#444B56',
            borderRadius: 4,
          }}
        />
      </PopupModal>
    </ListGroupContainer>
  );
});

export {ListGroupCard};
