import React, {memo, useCallback, useMemo} from 'react';
import {DeleteIcon} from '../../../../components/animated-icons/delete-icon';
import {RenameIcon} from '../../../../components/animated-icons/rename-icon';
import {MenuOptions} from '../../../../components/menu-options';
import {MenuOption} from '../../../../components/menu-options/types';
import {CounterOptionsProps} from './types';

const CounterOptions: React.FC<CounterOptionsProps> = memo(
  ({counterData, closeMenu, onEditOption, onDeleteOption}) => {
    const handleDeleteOptionPress = useCallback(() => {
      closeMenu();
      onDeleteOption(counterData);
    }, [closeMenu, counterData, onDeleteOption]);

    const handleEditOptionPress = useCallback(() => {
      closeMenu();
      onEditOption(counterData);
    }, [closeMenu, counterData, onEditOption]);

    const options = useMemo<MenuOption[]>(() => {
      return [
        {
          Icon: RenameIcon,
          label: 'Edit',
          onPress: handleEditOptionPress,
        },
        {
          Icon: DeleteIcon,
          label: 'Delete',
          onPress: handleDeleteOptionPress,
        },
      ];
    }, [handleDeleteOptionPress, handleEditOptionPress]);

    return <MenuOptions options={options} />;
  },
);

export {CounterOptions};
