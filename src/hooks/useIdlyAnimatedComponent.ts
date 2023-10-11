import Lottie from 'lottie-react-native';
import {useCallback, useEffect} from 'react';
import {useSetRecoilState} from 'recoil';
import {idlyAnimatedComponents} from '../state/atoms';

type UseIdlyAnimatedComponent = {
  componentRef: React.MutableRefObject<Lottie | null>;
  componentKey: string;
  initialFrame?: number;
  finalFrame?: number;
  shouldAnimate?: boolean;
  staticStateFrame?: number;
};

const useIdlyAnimatedComponent = ({
  componentRef,
  componentKey,
  initialFrame = 0,
  finalFrame = 500,
  shouldAnimate = false,
  staticStateFrame = 0,
}: UseIdlyAnimatedComponent) => {
  const setIdlyAnimatedComponent = useSetRecoilState(idlyAnimatedComponents);

  const animate = useCallback(() => {
    componentRef?.current?.play(initialFrame, finalFrame);
  }, [componentRef, finalFrame, initialFrame]);

  // Starts the animation from static state frame (to show the image static on a specific frame).
  useEffect(() => {
    componentRef.current?.play(staticStateFrame, staticStateFrame);

    if (!shouldAnimate) {
      return;
    }

    setIdlyAnimatedComponent(current => {
      var newArray = current.filter(x => x.componentKey !== componentKey);

      return [
        ...newArray,
        {
          animateFunction: animate,
          componentKey,
          initialFrame,
          finalFrame,
        },
      ];
    });

    return () => {
      setIdlyAnimatedComponent(current => {
        var a = current.filter(x => x.componentKey !== componentKey);
        return [...a];
      });
    };
  }, [
    animate,
    componentKey,
    componentRef,
    finalFrame,
    initialFrame,
    setIdlyAnimatedComponent,
    shouldAnimate,
    staticStateFrame,
  ]);
};

export {useIdlyAnimatedComponent};
