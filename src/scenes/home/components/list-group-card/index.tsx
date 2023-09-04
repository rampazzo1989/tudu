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
import {RenameModal} from './components/rename-modal';
import {FadeIn} from 'react-native-reanimated';

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
    <ListGroupContainer>
      <TitleContainer>
        <Title layout={FadeIn.delay(150).duration(600)}>
          {groupData.groupId}
        </Title>

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
              onPress={() => console.log(list.label)}
            />
          </DraggableItem>
        );
      })}
      <RenameModal
        visible={renamePopupVisible}
        onRequestClose={() => setRenamePopupVisible(false)}
        groupData={groupData}
      />
    </ListGroupContainer>
  );
});

export {ListGroupCard};
