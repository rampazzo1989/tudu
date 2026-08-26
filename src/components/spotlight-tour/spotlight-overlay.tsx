import React, { useEffect } from 'react';
import {
  BackHandler,
  StyleSheet,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import Svg, { Circle, Defs, Mask, Rect } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { SpotlightStep, TargetLayout } from './types';
import { TooltipCard } from './tooltip-card';

interface SpotlightOverlayProps {
  step: SpotlightStep;
  currentStepIndex: number;
  totalSteps: number;
  targetLayout: TargetLayout | null;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
}

export const SpotlightOverlay: React.FC<SpotlightOverlayProps> = ({
  step,
  currentStepIndex,
  totalSteps,
  targetLayout,
  onNext,
  onPrevious,
  onSkip,
}) => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Listen to Android hardware back button to skip tour
  useEffect(() => {
    const onBackPress = () => {
      onSkip();
      return true;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [onSkip]);

  const pad = targetLayout?.padding ?? 8;
  const shape = targetLayout?.shape || step.shape || 'rect';
  const borderRadius = targetLayout?.borderRadius ?? step.borderRadius ?? 16;

  const cutoutX = targetLayout ? Math.max(0, targetLayout.x - pad) : 0;
  const cutoutY = targetLayout ? Math.max(0, targetLayout.y - pad) : 0;
  const cutoutWidth = targetLayout ? targetLayout.width + pad * 2 : 0;
  const cutoutHeight = targetLayout ? targetLayout.height + pad * 2 : 0;

  const isCircle = shape === 'circle';
  const circleRadius = isCircle
    ? Math.max(cutoutWidth, cutoutHeight) / 2
    : 0;
  const circleCenterX = cutoutX + cutoutWidth / 2;
  const circleCenterY = cutoutY + cutoutHeight / 2;

  const rectRx = shape === 'pill' ? cutoutHeight / 2 : borderRadius;
  const rectRy = shape === 'pill' ? cutoutHeight / 2 : borderRadius;

  // Tooltip positioning logic
  const targetCenterY = targetLayout
    ? targetLayout.y + targetLayout.height / 2
    : screenHeight / 2;

  const shouldPlaceAbove =
    step.tooltipPosition === 'top' ||
    (step.tooltipPosition !== 'bottom' && targetCenterY > screenHeight * 0.52);

  const tooltipStyle = React.useMemo(() => {
    const horizontalMargin = 18;
    const cardWidth = screenWidth - horizontalMargin * 2;

    if (!targetLayout) {
      // Fallback centered
      return {
        top: screenHeight / 2 - 120,
        left: horizontalMargin,
        width: cardWidth,
      };
    }

    if (shouldPlaceAbove) {
      const bottomCoord = screenHeight - cutoutY + 14;
      return {
        bottom: Math.min(bottomCoord, screenHeight - insets.top - 60),
        left: horizontalMargin,
        width: cardWidth,
      };
    } else {
      const topCoord = cutoutY + cutoutHeight + 14;
      return {
        top: Math.max(topCoord, insets.top + 20),
        left: horizontalMargin,
        width: cardWidth,
      };
    }
  }, [
    targetLayout,
    shouldPlaceAbove,
    screenWidth,
    screenHeight,
    cutoutY,
    cutoutHeight,
    insets.top,
  ]);

  return (
    <View style={styles.fullScreenOverlay} pointerEvents="box-none">
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(150)}
        style={StyleSheet.absoluteFill}
        pointerEvents="box-none">
        {/* Fullscreen SVG with Cutout Mask */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Svg width={screenWidth} height={screenHeight} style={StyleSheet.absoluteFill}>
            <Defs>
              <Mask id="spotlight-mask">
                {/* White area = visible dark overlay */}
                <Rect
                  x="0"
                  y="0"
                  width={screenWidth}
                  height={screenHeight}
                  fill="#FFFFFF"
                />
                {/* Black area = transparent cutout hole */}
                {targetLayout &&
                  (isCircle ? (
                    <Circle
                      cx={circleCenterX}
                      cy={circleCenterY}
                      r={circleRadius}
                      fill="#000000"
                    />
                  ) : (
                    <Rect
                      x={cutoutX}
                      y={cutoutY}
                      width={cutoutWidth}
                      height={cutoutHeight}
                      rx={rectRx}
                      ry={rectRy}
                      fill="#000000"
                    />
                  ))}
              </Mask>
            </Defs>

            {/* Masked Dark Backdrop */}
            <Rect
              x="0"
              y="0"
              width={screenWidth}
              height={screenHeight}
              fill="rgba(15, 20, 30, 0.82)"
              mask="url(#spotlight-mask)"
            />

            {/* Highlight ring/border around the cutout */}
            {targetLayout &&
              (isCircle ? (
                <Circle
                  cx={circleCenterX}
                  cy={circleCenterY}
                  r={circleRadius}
                  fill="transparent"
                  stroke="#7956BF"
                  strokeWidth="2.5"
                  strokeDasharray="6, 4"
                />
              ) : (
                <Rect
                  x={cutoutX}
                  y={cutoutY}
                  width={cutoutWidth}
                  height={cutoutHeight}
                  rx={rectRx}
                  ry={rectRy}
                  fill="transparent"
                  stroke="#7956BF"
                  strokeWidth="2.5"
                  strokeDasharray="6, 4"
                />
              ))}
          </Svg>
        </View>

        {/* Tap backdrop to advance or dismiss */}
        <TouchableWithoutFeedback onPress={onNext}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>

        {/* Tooltip Card Overlay */}
        <Animated.View
          key={`step-${currentStepIndex}-${step.name}`}
          entering={FadeIn.duration(250)}
          style={[styles.tooltipContainer, tooltipStyle]}
          pointerEvents="box-none">
          <TooltipCard
            step={step}
            currentStepIndex={currentStepIndex}
            totalSteps={totalSteps}
            targetLayout={targetLayout}
            onNext={onNext}
            onPrevious={onPrevious}
            onSkip={onSkip}
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999999,
    elevation: 999999,
  },
  tooltipContainer: {
    position: 'absolute',
    zIndex: 999999,
    elevation: 999999,
  },
});
