import {FolderIcon} from '../../components/animated-icons/folder-icon';
import {ListDefaultIcon} from '../../components/animated-icons/list-default-icon';
import {MoonIcon} from '../../components/animated-icons/moon-icon';
import {StarIcon} from '../../components/animated-icons/star-icon';
import {SunIcon} from '../../components/animated-icons/sun-icon';

const getDaytimeIcon = () => {
  const currentTime = new Date();

  const sunsetTime = new Date();
  sunsetTime.setHours(18);
  sunsetTime.setMinutes(30); // Assuming sunset is at 6:30 PM

  const sunriseTime = new Date();
  sunriseTime.setHours(6);
  sunriseTime.setMinutes(0); // Assuming sunrise is at 6 AM

  return currentTime >= sunsetTime || currentTime < sunriseTime
    ? MoonIcon
    : SunIcon;
};

export const ListIcons = {
  today: getDaytimeIcon(),
  default: ListDefaultIcon,
  archived: FolderIcon,
  star: StarIcon,
};

export type ListIconType = keyof typeof ListIcons;
