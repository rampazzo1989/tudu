import React, {memo, useCallback, useMemo, useRef, useState} from 'react';
import {ListDefaultIcon} from '../../../../components/animated-icons/list-default-icon';
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
import {ListDataViewModel} from '../../types';
import {DeleteIconActionAnimation} from '../../../../components/animated-icons/delete-icon';

const ListGroupCard: React.FC<ListGroupProps> = memo(
  ({
    groupData,
    onListPress,
    handleArchiveGenerator,
    handleDeleteGenerator,
    handleEditListGenerator,
    animateIcon,
  }) => {
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
            <OptionsArrowDownIcon ref={iconRef} speed={2} />
          </OptionsIconContainer>
        </OptionsTouchable>
      ),
      [handleOptionsButtonPress],
    );

    const listPressHandlerGenerator = useCallback(
      (listData: ListDataViewModel) => () => {
        onListPress(listData);
      },
      [onListPress],
    );

    const handleRename = useCallback(() => setRenamePopupVisible(true), []);

    const items = useMemo(() => {
      return (
        <>
          {groupData.data.map(list => {
            return (
              <DraggableItem
                key={`${list.label}${groupData.groupId}`}
                payload={list}>
                <SubListCard
                  Icon={ListDefaultIcon}
                  label={list.label}
                  numberOfActiveItems={list.numberOfActiveItems}
                  onPress={listPressHandlerGenerator(list)}
                  onDelete={handleDeleteGenerator(list)}
                  onArchive={handleArchiveGenerator(list)}
                  onEdit={handleEditListGenerator(list)}
                />
              </DraggableItem>
            );
          })}
        </>
      );
    }, [
      groupData.data,
      groupData.groupId,
      handleArchiveGenerator,
      handleDeleteGenerator,
      handleEditListGenerator,
      listPressHandlerGenerator,
    ]);

    const handleAnimateIconOnDelete = useCallback(() => {
      animateIcon?.(DeleteIconActionAnimation);
    }, [animateIcon]);

    return (
      <ListGroupContainer>
        <TitleContainer>
          <Title layout={FadeIn.delay(150).duration(600)} numberOfLines={1}>
            {groupData.groupId}
          </Title>

          <PopoverMenu
            isVisible={popoverMenuVisible}
            onRequestClose={handlePopoverMenuRequestClose}
            from={OptionsComponent}>
            <GroupOptions
              groupData={groupData}
              closeMenu={handlePopoverMenuRequestClose}
              onRename={handleRename}
              onDeleteCallback={handleAnimateIconOnDelete}
            />
          </PopoverMenu>
        </TitleContainer>
        {items}
        <RenameModal
          visible={renamePopupVisible}
          onRequestClose={() => setRenamePopupVisible(false)}
          groupData={groupData}
        />
      </ListGroupContainer>
    );
  },
);

export {ListGroupCard};
