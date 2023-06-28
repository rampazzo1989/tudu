export type IdlyAnimatedComponent = {
  animateFunction: () => void;
  componentKey: string;
  initialFrame?: number;
  finalFrame?: number;
};
