import Lottie from 'lottie-react-native';

export type IdlyAnimatedComponent = {
  componentRef: React.RefObject<Lottie>;
  componentName: string;
  initialFrame?: number;
  finalFrame?: number;
};
