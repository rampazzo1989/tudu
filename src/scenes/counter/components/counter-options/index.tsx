import React, {memo, useCallback, useMemo} from 'react';
import {DeleteStaticIcon, RenameStaticIcon} from '../../../../assets/static/tudu-icons';
import {MenuOptions} from '../../../../components/menu-options';
import {MenuOption} from '../../../../components/menu-options/types';
import {CounterOptionsProps} from './types';
import { useTranslation } from 'react-i18next';

const CounterOptions: React.FC<CounterOptionsProps> = memo(
  ({counterData, closeMenu, onEditOption, onDeleteOption}) => {
    const {t} = useTranslation();
    
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
          Icon: RenameStaticIcon,
          label: t('menuLabels.edit'),
          onPress: handleEditOptionPress,
        },
        {
          Icon: DeleteStaticIcon,
          label: t('menuLabels.delete'),
          onPress: handleDeleteOptionPress,
        },
      ];
    }, [handleDeleteOptionPress, handleEditOptionPress]);

    return <MenuOptions options={options} />;
  },
);

export {CounterOptions};
