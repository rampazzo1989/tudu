import React, {memo, useCallback, useContext, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {DeleteIcon} from '../../../../../../components/animated-icons/delete-icon';
import {ListDefaultIcon} from '../../../../../../components/animated-icons/list-default-icon';
import {MenuOptions} from '../../../../../../components/menu-options';
import {MenuOption} from '../../../../../../components/menu-options/types';
import {DraggableContext} from '../../../../../../modules/draggable/draggable-context';
import {DraggableItem} from '../../../../../../modules/draggable/draggable-context/types';
import {
  isNestedItem,
  ungroupAllItems,
} from '../../../../../../modules/draggable/draggable-utils';
import {List} from '../../../../types';
import {GroupOptionsProps} from './types';

const GroupOptions: React.FC<GroupOptionsProps> = memo(
  ({groupData, closeMenu, onRename}) => {
    const draggableContext = useContext(DraggableContext);
    const {t} = useTranslation();

    const titleBuilder = useCallback(
      (item?: DraggableItem<List> | List) => {
        if (!item) {
          return '';
        }
        let listName: string;
        let itemType: string = t('messages.confirmDeleteItemType.list');
        if (isNestedItem(item)) {
          listName = (item as List).label;
        } else {
          const draggableItem = item as DraggableItem<List>;
          listName = draggableItem.groupId ?? draggableItem.data[0].label;
          itemType = draggableItem.groupId
            ? t('messages.confirmDeleteItemType.group')
            : itemType;
        }
        return t('messages.confirmDelete', {itemType, listName});
      },
      [t],
    );

    const handleDeleteOptionPress = useCallback(() => {
      draggableContext.showDeleteConfirmationModal(groupData, titleBuilder);
      closeMenu();
    }, [closeMenu, draggableContext, groupData, titleBuilder]);

    const handleUngroupOptionPress = useCallback(() => {
      closeMenu();
      setTimeout(
        () =>
          ungroupAllItems(
            draggableContext.data,
            draggableContext.setData,
            groupData,
          ),
        200,
      );
    }, [closeMenu, draggableContext, groupData]);

    const handleRenameOptionPress = useCallback(() => {
      closeMenu();
      onRename();
    }, [closeMenu, onRename]);

    const options = useMemo<MenuOption[]>(() => {
      return [
        {
          Icon: ListDefaultIcon,
          label: 'Rename',
          onPress: handleRenameOptionPress,
        },
        {
          Icon: DeleteIcon,
          label: 'Delete Group',
          onPress: handleDeleteOptionPress,
        },
        {
          Icon: ListDefaultIcon,
          label: 'Ungroup All',
          onPress: handleUngroupOptionPress,
        },
      ];
    }, [
      handleDeleteOptionPress,
      handleRenameOptionPress,
      handleUngroupOptionPress,
    ]);

    return <MenuOptions options={options} />;
  },
);

export {GroupOptions};
