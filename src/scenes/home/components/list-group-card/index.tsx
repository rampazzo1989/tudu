import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import { ListDefaultIcon } from '../../../../components/animated-icons/list-default-icon';
import { DraggableItem } from '../../../../modules/draggable/draggable-item';
import {
  ListGroupContainer,
  OptionsIconContainer,
  OptionsTouchable,
  SeeMoreButton,
  SeeMoreIconContainer,
  SeeMoreText,
  SubListCard,
  Title,
  TitleContainer,
} from './styles';
import { ListGroupProps } from './types';
import { PopoverMenu } from '../../../../components/popover-menu';
import { GroupOptions } from './components/group-options';
import { OptionsThreeDotsIcon } from '../../../../components/animated-icons/options-arrow-down-icon';
import { BaseAnimatedIconRef } from '../../../../components/animated-icons/animated-icon/types';
import { FadeIn } from 'react-native-reanimated';
import { ListDataViewModel } from '../../types';
import { DeleteIconActionAnimation } from '../../../../components/animated-icons/delete-icon';
import { NewGroupModal } from '../../../group/components/new-group-modal';
import { NextStaticIcon } from '../../../../assets/static/tudu-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackNavigatorParamList } from '../../../../navigation/stack-navigator/types';
import { useTranslation } from 'react-i18next';

const MAX_DISPLAYED_LISTS = 3;

const ListGroupCard: React.FC<ListGroupProps> = memo(
  ({
    groupData,
    onListPress,
    handleArchiveGenerator,
    handleDeleteGenerator,
    handleEditListGenerator,
    deleteGroupFn,
    undoDeletionFn,
    animateIcon,
  }) => {
    const iconRef = useRef<BaseAnimatedIconRef>(null);
    const [popoverMenuVisible, setPopoverMenuVisible] = useState(false);
    const [editGroupModalVisible, setEditGroupModalVisible] = useState(false);
    const navigation =
      useNavigation<NativeStackNavigationProp<StackNavigatorParamList>>();
    const { t } = useTranslation();

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
            <OptionsThreeDotsIcon ref={iconRef} speed={2} />
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

    const handleEditGroup = useCallback(
      () => setEditGroupModalVisible(true),
      [],
    );

    const handleSeeMorePress = useCallback(() => {
      if (groupData.groupId) {
        navigation.navigate('Group', { groupName: groupData.groupId });
      }
    }, [groupData.groupId, navigation]);

    const displayedLists = useMemo(() => {
      return groupData.data.slice(0, MAX_DISPLAYED_LISTS);
    }, [groupData.data]);

    const remainingCount = groupData.data.length - MAX_DISPLAYED_LISTS;

    const items = useMemo(() => {
      return (
        <>
          {displayedLists.map(list => {
            return (
              <DraggableItem
                key={`${list.label}${groupData.groupId}`}
                style={{ marginBottom: 8 }}
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
      displayedLists,
      groupData.groupId,
      handleArchiveGenerator,
      handleDeleteGenerator,
      handleEditListGenerator,
      listPressHandlerGenerator,
    ]);

    const handleDeleteGroup = useCallback(() => {
      deleteGroupFn(groupData.groupId!);
      animateIcon?.(DeleteIconActionAnimation);
    }, [animateIcon, deleteGroupFn, groupData.groupId]);

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
              onEditGroup={handleEditGroup}
              onDelete={handleDeleteGroup}
              onUndoDeletion={undoDeletionFn}
            />
          </PopoverMenu>
        </TitleContainer>
        {items}
        {remainingCount > 0 && (
          <SeeMoreButton onPress={handleSeeMorePress} scaleFactor={0.97}>
            <SeeMoreText>
              {t('groupCard.seeMore', {
                count: remainingCount,
                defaultValue: `+ ${remainingCount} ${remainingCount === 1 ? 'lista' : 'listas'
                  }`,
              })}
            </SeeMoreText>
            <SeeMoreIconContainer>
              <NextStaticIcon size={14} />
            </SeeMoreIconContainer>
          </SeeMoreButton>
        )}
        <NewGroupModal
          visible={editGroupModalVisible}
          onRequestClose={() => setEditGroupModalVisible(false)}
          editingGroupData={groupData}
        />
      </ListGroupContainer>
    );
  },
);

export { ListGroupCard };
