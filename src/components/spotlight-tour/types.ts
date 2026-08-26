import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export type SpotlightShape = 'rect' | 'circle' | 'pill';

export type TooltipPosition = 'auto' | 'top' | 'bottom';

export interface SpotlightStep {
  name: string;
  title: string;
  description: string;
  icon?: string;
  shape?: SpotlightShape;
  padding?: number;
  borderRadius?: number;
  tooltipPosition?: TooltipPosition;
}

export interface TargetLayout {
  x: number;
  y: number;
  width: number;
  height: number;
  shape?: SpotlightShape;
  borderRadius?: number;
  padding?: number;
}

export type TargetMeasureFn = () => Promise<TargetLayout | null>;

export interface SpotlightTourContextType {
  registerTarget: (name: string, measureFn: TargetMeasureFn) => void;
  unregisterTarget: (name: string) => void;
  startTour: (steps: SpotlightStep[], onFinish?: () => void) => void;
  stopTour: () => void;
  nextStep: () => void;
  previousStep: () => void;
  currentStepIndex: number;
  currentStep: SpotlightStep | null;
  totalSteps: number;
  isTourActive: boolean;
  activeTargetLayout: TargetLayout | null;
}

export interface SpotlightTourProviderProps {
  children: ReactNode;
  onTourFinish?: () => void;
}

export interface SpotlightTargetProps {
  name: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  shape?: SpotlightShape;
  borderRadius?: number;
  padding?: number;
}

export interface TooltipCardProps {
  step: SpotlightStep;
  currentStepIndex: number;
  totalSteps: number;
  targetLayout: TargetLayout | null;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
}
