import {AnimatedLottieViewProps} from 'lottie-react-native';

export interface BaseAnimatedIconProps extends AnimatedLottieViewProps {
  componentName: string;
  initialFrame?: number;
  finalFrame?: number;
  animateWhenIdle?: boolean;
  autoPlayDelay?: number;
  staticStateFrame?: number;
}

export type AnimatedIconProps = Omit<
  BaseAnimatedIconProps,
  'componentName' | 'source'
>;

export type BaseAnimatedIconRef = {
  play: (onAnimationFinish?: () => void) => void;
  pause: () => void;
  toggle: () => void;
};
