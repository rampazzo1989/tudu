import Lottie from 'lottie-react-native';
import {useEffect} from 'react';
import {useSetRecoilState} from 'recoil';
import {idlyAnimatedComponents} from '../state/atoms';

type UseIdlyAnimatedComponent = {
  componentRef: React.RefObject<Lottie>;
  componentName: string;
  initialFrame?: number;
  finalFrame?: number;
  shouldAnimate?: boolean;
};

const useIdlyAnimatedComponent = ({
  componentRef,
  componentName,
  initialFrame = 0,
  finalFrame = 500,
  shouldAnimate = true,
}: UseIdlyAnimatedComponent) => {
  const setIdlyAnimatedComponent = useSetRecoilState(idlyAnimatedComponents);

  // Starts the animation from the last frame (to show the image static in the last frame).
  useEffect(() => {
    if (!shouldAnimate) {
      return;
    }

    componentRef.current?.play(finalFrame, finalFrame);
    setIdlyAnimatedComponent(current => [
      ...current,
      {componentRef, componentName, initialFrame, finalFrame},
    ]);

    console.log('HERE');

    return () => {
      setIdlyAnimatedComponent(current =>
        current.filter(x => x.componentName === componentName),
      );
    };
  }, [
    componentName,
    componentRef,
    finalFrame,
    initialFrame,
    setIdlyAnimatedComponent,
    shouldAnimate,
  ]);

  // Registers the component on the state
};

export {useIdlyAnimatedComponent};
