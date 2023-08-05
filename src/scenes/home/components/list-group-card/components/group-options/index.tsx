import React, {memo, useCallback, useMemo} from 'react';
import {DeleteIcon} from '../../../../../../components/animated-icons/delete-icon';
import {ListDefaultIcon} from '../../../../../../components/animated-icons/list-default-icon';
import {MenuOptions} from '../../../../../../components/menu-options';
import {MenuOption} from '../../../../../../components/menu-options/types';
import {GroupOptionsProps} from './types';

const GroupOptions: React.FC<GroupOptionsProps> = memo(({groupData}) => {
  const options = useMemo<MenuOption[]>(() => {
    return [
      {
        Icon: ListDefaultIcon,
        label: 'Rename',
        onPress: () => console.log('Rename'),
      },
      {
        Icon: DeleteIcon,
        label: 'Delete Group',
        onPress: () => console.log('Delete Group'),
      },
      {
        Icon: ListDefaultIcon,
        label: 'Ungroup All',
        onPress: () => console.log('Ungroup All'),
      },
    ];
  }, []);

  return <MenuOptions options={options} />;
});

export {GroupOptions};
