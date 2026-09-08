import React, {memo, useCallback, useContext, useMemo, useRef} from 'react';
import {DeleteStaticIcon, RenameStaticIcon, UngroupStaticIcon} from '../../../../../../assets/static/tudu-icons';
import {MenuOptions} from '../../../../../../components/menu-options';
import {MenuOption} from '../../../../../../components/menu-options/types';
import {DraggableContext} from '../../../../../../modules/draggable/draggable-context';
import {ungroupAllItems} from '../../../../../../modules/draggable/draggable-utils';
import {GroupOptionsProps} from './types';
import {generateListAndGroupDeleteTitle} from '../../../../../../utils/list-and-group-utils';
import {showItemDeletedToast} from '../../../../../../utils/toast-utils';
import {useTranslation} from 'react-i18next';

const GroupOptions: React.FC<GroupOptionsProps> = memo(
  ({groupData, closeMenu, onEditGroup, onDelete, onUndoDeletion}) => {
    const draggableContext = useContext(DraggableContext);

    const {t} = useTranslation();

    const previousStateData = useRef(JSON.stringify(draggableContext.data));

    const handleDeleteOptionPress = useCallback(() => {
      previousStateData.current = JSON.stringify(draggableContext.data);
      draggableContext.showConfirmationModal(
        groupData,
        generateListAndGroupDeleteTitle,
        'delete',
        undefined,
        () => {
          onDelete();
          showItemDeletedToast(
            t('toast.itemDeleted', {itemType: 'Group'}),
            onUndoDeletion,
          );
        },
      );
      closeMenu();
    }, [closeMenu, draggableContext, groupData, onDelete, onUndoDeletion, t]);

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

    const handleEditGroupOptionPress = useCallback(() => {
      closeMenu();
      onEditGroup();
    }, [closeMenu, onEditGroup]);

    const options = useMemo<MenuOption[]>(() => {
      return [
        {
          Icon: RenameStaticIcon,
          label: t('menuLabels.editGroup', {defaultValue: 'Editar grupo'}),
          onPress: handleEditGroupOptionPress,
        },
        {
          Icon: DeleteStaticIcon,
          label: t('menuLabels.deleteGroup'),
          onPress: handleDeleteOptionPress,
        },
        {
          Icon: UngroupStaticIcon,
          label: t('menuLabels.ungroupAll'),
          onPress: handleUngroupOptionPress,
        },
      ];
    }, [
      handleDeleteOptionPress,
      handleEditGroupOptionPress,
      handleUngroupOptionPress,
      t,
    ]);

    return <MenuOptions options={options} />;
  },
);

export {GroupOptions};
