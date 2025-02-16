import React, {memo, useCallback, useContext, useMemo, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import { DeleteIcon } from '../../animated-icons/delete-icon';
import { MenuOption } from '../../menu-options/types';
import { MenuOptions } from '../../menu-options';
import { RefreshIcon } from '../../animated-icons/refresh-icon';
import { DoneItemsOptionsProps } from './types';
import { DraggableContext } from '../../../modules/draggable/draggable-context';
import { showItemDeletedToast } from '../../../utils/toast-utils';

const DoneItemsOptions: React.FC<DoneItemsOptionsProps> = memo(
  ({closeMenu, onClearAllDone, onUndoAll}) => {
    const draggableContext = useContext(DraggableContext);

    const {t} = useTranslation();

    const previousStateData = useRef(JSON.stringify(draggableContext.data));

    const handleUndoAllPress = useCallback(() => {
      onUndoAll();
      closeMenu();
    }, [closeMenu]);

    const handleClearAllPress = useCallback(() => {
      previousStateData.current = JSON.stringify(draggableContext.data);
      onClearAllDone();
      closeMenu();
    }, [closeMenu]);

    const options = useMemo<MenuOption[]>(() => {
      return [
        {
          Icon: RefreshIcon,
          label: 'Undo All',
          onPress: handleUndoAllPress,
        },
        {
          Icon: DeleteIcon,
          label: 'Clear All',
          onPress: handleClearAllPress,
        },
      ];
    }, [
      handleUndoAllPress,
      handleClearAllPress,
    ]);

    return <MenuOptions options={options} />;
  },
);

export {DoneItemsOptions};
