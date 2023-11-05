import {MoonIcon} from '../../components/animated-icons/moon-icon';
import {SunIcon} from '../../components/animated-icons/sun-icon';

export function isEmpty(obj: Record<string, any>) {
  return Object.keys(obj).length === 0;
}

export function getDaytimeIcon() {
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
}
