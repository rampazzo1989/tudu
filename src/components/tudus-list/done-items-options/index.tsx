import React, {memo, useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import { DeleteIcon } from '../../animated-icons/delete-icon';
import { MenuOption } from '../../menu-options/types';
import { MenuOptions } from '../../menu-options';
import { RefreshIcon } from '../../animated-icons/refresh-icon';
import { DoneItemsOptionsProps } from './types';

const DoneItemsOptions: React.FC<DoneItemsOptionsProps> = memo(
  ({}) => {
    // const draggableContext = useContext(DraggableContext);

    const {t} = useTranslation();

    // const previousStateData = useRef(JSON.stringify(draggableContext.data));

    const handleUndoAllPress = useCallback(() => {

    }, []);

    const handleClearAllPress = useCallback(() => {

    }, []);

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
