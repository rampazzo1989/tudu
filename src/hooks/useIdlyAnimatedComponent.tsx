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
};

const useIdlyAnimatedComponent = ({
  componentRef,
  componentKey,
  initialFrame = 0,
  finalFrame = 500,
  shouldAnimate = true,
}: UseIdlyAnimatedComponent) => {
  const setIdlyAnimatedComponent = useSetRecoilState(idlyAnimatedComponents);

  const animate = useCallback(() => {
    componentRef?.current?.play(initialFrame, finalFrame);
  }, [componentRef, finalFrame, initialFrame]);

  // Starts the animation from the last frame (to show the image static in the last frame).
  useEffect(() => {
    if (!shouldAnimate) {
      return;
    }

    componentRef.current?.play(finalFrame, finalFrame);

    setIdlyAnimatedComponent(current => {
      console.log('INSIDE SETTER', {componentKey});
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
      console.log('SAINDO', {componentKey});

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
  ]);
};

export {useIdlyAnimatedComponent};
