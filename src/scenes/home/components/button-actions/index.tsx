import {ListDefaultIcon} from '../../../../components/animated-icons/list-default-icon';
import {MenuOption} from '../../../../components/menu-options/types';

const handleNewListPress = () => {
  console.log('Menu pressed');
};

const options: MenuOption[] = [
  {
    Icon: ListDefaultIcon,
    label: 'New list',
    onPress: handleNewListPress,
  },
  {
    Icon: ListDefaultIcon,
    label: 'New group',
    onPress: handleNewListPress,
  },
  {
    Icon: ListDefaultIcon,
    label: 'New counter',
    onPress: handleNewListPress,
  },
];

export {options};
