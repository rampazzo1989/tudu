import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  SpotlightStep,
  SpotlightTourContextType,
  SpotlightTourProviderProps,
  TargetLayout,
  TargetMeasureFn,
} from './types';
import { SpotlightOverlay } from './spotlight-overlay';

const SpotlightTourContext = createContext<SpotlightTourContextType | null>(null);

export const SpotlightTourProvider: React.FC<SpotlightTourProviderProps> = ({
  children,
  onTourFinish,
}) => {
  const targetsRef = useRef<Map<string, TargetMeasureFn>>(new Map());
  const onFinishCallbackRef = useRef<(() => void) | undefined>(onTourFinish);

  const [isTourActive, setIsTourActive] = useState(false);
  const [steps, setSteps] = useState<SpotlightStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [activeTargetLayout, setActiveTargetLayout] = useState<TargetLayout | null>(null);

  const registerTarget = useCallback((name: string, measureFn: TargetMeasureFn) => {
    targetsRef.current.set(name, measureFn);
  }, []);

  const unregisterTarget = useCallback((name: string) => {
    targetsRef.current.delete(name);
  }, []);

  const updateActiveTarget = useCallback(async (step: SpotlightStep) => {
    const measureFn = targetsRef.current.get(step.name);
    if (!measureFn) {
      setActiveTargetLayout(null);
      return;
    }

    // Attempt measurement with retry to handle layout changes
    for (let attempt = 0; attempt < 6; attempt++) {
      try {
        const layout = await measureFn();
        if (layout && layout.width > 0 && layout.height > 0) {
          setActiveTargetLayout({
            ...layout,
            shape: step.shape || layout.shape || 'rect',
            borderRadius: step.borderRadius ?? layout.borderRadius ?? 16,
            padding: step.padding ?? layout.padding ?? 8,
          });
          return;
        }
      } catch (e) {
        // Continue retry
      }
      await new Promise(resolve => setTimeout(resolve, 80));
    }

    setActiveTargetLayout(null);
  }, []);

  const startTour = useCallback(
    (tourSteps: SpotlightStep[], onFinish?: () => void) => {
      if (!tourSteps || tourSteps.length === 0) return;
      onFinishCallbackRef.current = onFinish || onTourFinish;
      setSteps(tourSteps);
      setCurrentStepIndex(0);
      setIsTourActive(true);
    },
    [onTourFinish],
  );

  const stopTour = useCallback(() => {
    setIsTourActive(false);
    setSteps([]);
    setCurrentStepIndex(0);
    setActiveTargetLayout(null);
    if (onFinishCallbackRef.current) {
      onFinishCallbackRef.current();
    }
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStepIndex(prevIndex => {
      if (prevIndex < steps.length - 1) {
        return prevIndex + 1;
      } else {
        stopTour();
        return prevIndex;
      }
    });
  }, [steps.length, stopTour]);

  const previousStep = useCallback(() => {
    setCurrentStepIndex(prevIndex => {
      if (prevIndex > 0) {
        return prevIndex - 1;
      }
      return prevIndex;
    });
  }, []);

  useEffect(() => {
    if (isTourActive && steps[currentStepIndex]) {
      updateActiveTarget(steps[currentStepIndex]);
    }
  }, [isTourActive, currentStepIndex, steps, updateActiveTarget]);

  const currentStep = isTourActive && steps[currentStepIndex] ? steps[currentStepIndex] : null;

  return (
    <SpotlightTourContext.Provider
      value={{
        registerTarget,
        unregisterTarget,
        startTour,
        stopTour,
        nextStep,
        previousStep,
        currentStepIndex,
        currentStep,
        totalSteps: steps.length,
        isTourActive,
        activeTargetLayout,
      }}>
      {children}
      {isTourActive && currentStep && (
        <SpotlightOverlay
          step={currentStep}
          currentStepIndex={currentStepIndex}
          totalSteps={steps.length}
          targetLayout={activeTargetLayout}
          onNext={nextStep}
          onPrevious={previousStep}
          onSkip={stopTour}
        />
      )}
    </SpotlightTourContext.Provider>
  );
};

export const useSpotlightTour = (): SpotlightTourContextType => {
  const context = useContext(SpotlightTourContext);
  if (!context) {
    throw new Error('useSpotlightTour must be used within a SpotlightTourProvider');
  }
  return context;
};
