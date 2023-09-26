import React, {memo, useCallback, useContext, useMemo} from 'react';
import {DeleteIcon} from '../../../../../../components/animated-icons/delete-icon';
import {MenuOptions} from '../../../../../../components/menu-options';
import {MenuOption} from '../../../../../../components/menu-options/types';
import {DraggableContext} from '../../../../../../modules/draggable/draggable-context';
import {ungroupAllItems} from '../../../../../../modules/draggable/draggable-utils';
import {GroupOptionsProps} from './types';
import {generateListAndGroupDeleteTitle} from '../../../../../../utils/list-and-group-utils';
import {RenameIcon} from '../../../../../../components/animated-icons/rename-icon';
import {UngroupIcon} from '../../../../../../components/animated-icons/ungroup-icon';

const GroupOptions: React.FC<GroupOptionsProps> = memo(
  ({groupData, closeMenu, onRename, onDeleteCallback}) => {
    const draggableContext = useContext(DraggableContext);

    const handleDeleteOptionPress = useCallback(() => {
      draggableContext.showConfirmationModal(
        groupData,
        generateListAndGroupDeleteTitle,
        'delete',
        undefined,
        onDeleteCallback,
      );
      closeMenu();
    }, [closeMenu, draggableContext, groupData, onDeleteCallback]);

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
          Icon: RenameIcon,
          label: 'Rename',
          onPress: handleRenameOptionPress,
        },
        {
          Icon: DeleteIcon,
          label: 'Delete Group',
          onPress: handleDeleteOptionPress,
        },
        {
          Icon: UngroupIcon,
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
