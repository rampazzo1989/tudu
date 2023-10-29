import React, {memo, useCallback, useContext, useMemo, useRef} from 'react';
import {DeleteIcon} from '../../../../../../components/animated-icons/delete-icon';
import {MenuOptions} from '../../../../../../components/menu-options';
import {MenuOption} from '../../../../../../components/menu-options/types';
import {DraggableContext} from '../../../../../../modules/draggable/draggable-context';
import {
  refreshListState,
  ungroupAllItems,
} from '../../../../../../modules/draggable/draggable-utils';
import {GroupOptionsProps} from './types';
import {generateListAndGroupDeleteTitle} from '../../../../../../utils/list-and-group-utils';
import {RenameIcon} from '../../../../../../components/animated-icons/rename-icon';
import {UngroupIcon} from '../../../../../../components/animated-icons/ungroup-icon';
import {showItemDeletedToast} from '../../../../../../utils/toast-utils';
import {useTranslation} from 'react-i18next';
import {DraggableItem} from '../../../../../../modules/draggable/draggable-context/types';
import {ListViewModel} from '../../../../types';
import Toast from 'react-native-toast-message';

const GroupOptions: React.FC<GroupOptionsProps> = memo(
  ({groupData, closeMenu, onRename, onDeleteCallback}) => {
    const draggableContext = useContext(DraggableContext);

    const {t} = useTranslation();

    const previousStateData = useRef(JSON.stringify(draggableContext.data));

    const handleUndoDeletePress = useCallback(() => {
      try {
        const parsedOldState: DraggableItem<ListViewModel>[] = JSON.parse(
          previousStateData.current,
        );

        refreshListState(parsedOldState, draggableContext.setData);
        Toast.hide();
      } catch {
        Toast.show({
          type: 'error',
          position: 'bottom',
          bottomOffset: 60,
          text1: 'Unexpected error on trying to undo',
        });
      }
    }, [draggableContext.setData]);

    const handleDeleteOptionPress = useCallback(() => {
      previousStateData.current = JSON.stringify(draggableContext.data);
      draggableContext.showConfirmationModal(
        groupData,
        generateListAndGroupDeleteTitle,
        'delete',
        undefined,
        () => {
          onDeleteCallback?.();
          showItemDeletedToast(
            t('toast.itemDeleted', {itemType: 'Group'}),
            handleUndoDeletePress,
          );
        },
      );
      closeMenu();
    }, [
      closeMenu,
      draggableContext,
      groupData,
      handleUndoDeletePress,
      onDeleteCallback,
      t,
    ]);

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
