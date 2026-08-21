import {CalendarIcon} from '../../components/animated-icons/calendar';
import {FolderIcon} from '../../components/animated-icons/folder-icon';
import {ListDefaultIcon} from '../../components/animated-icons/list-default-icon';
import {StarIcon} from '../../components/animated-icons/star-icon';
import {getDaytimeIcon} from '../../utils/general-utils';

export const ListIcons = {
  today: getDaytimeIcon(),
  calendar: CalendarIcon,
  default: ListDefaultIcon,
  archived: FolderIcon,
  star: StarIcon,
};

export type ListIconType = keyof typeof ListIcons;

