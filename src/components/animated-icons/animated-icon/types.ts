import {AnimatedLottieViewProps} from 'lottie-react-native';

export interface BaseAnimatedIconProps extends AnimatedLottieViewProps {
  componentName: string;
  initialFrame?: number;
  finalFrame?: number;
  animateWhenIdle?: boolean;
}

export type AnimatedIconProps = Omit<
  BaseAnimatedIconProps,
  'componentName' | 'source'
>;

export type BaseAnimatedIconRef = {play: () => void; pause: () => void};
