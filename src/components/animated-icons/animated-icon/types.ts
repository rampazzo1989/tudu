import {AnimatedLottieViewProps} from 'lottie-react-native';

export interface BaseAnimatedIconProps extends AnimatedLottieViewProps {
  componentName: string;
  initialFrame?: number;
  finalFrame?: number;
  animateWhenIdle?: boolean;
  autoPlayDelay?: number;
  staticStateFrame?: number;
  size?: number;
}

export type AnimatedIconProps = Omit<
  BaseAnimatedIconProps,
  'componentName' | 'source'
>;

export type BaseAnimationOptions = {
  onAnimationFinish?: () => void;
  initialFrame?: number;
  finalFrame?: number;
};

export type BaseAnimatedIconRef = {
  play: (options?: BaseAnimationOptions) => void;
  pause: () => void;
  toggle: () => void;
};

export type AnimationOptions = {
  animationLayer: 'intro' | 'hover';
  onAnimationFinish?: () => void;
};

export type AnimatedIconRef = {
  play: (options?: AnimationOptions) => void;
  pause: () => void;
  toggle: () => void;
};
