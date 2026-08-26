import React, { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Svg, { Path, Rect } from 'react-native-svg';
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { GoogleCalendarOptionProps } from './types';
import { ActiveDot, IconWrapper, OptionContainer, OptionText } from './styles';

const GoogleCalendarIcon: React.FC<{ isSelected: boolean; size?: number }> = memo(
  ({ isSelected, size = 16 }) => {
    return (
      <IconWrapper isSelected={isSelected}>
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          {/* Top bar - Blue */}
          <Path
            d="M3 7C3 5.34315 4.34315 4 6 4H18C19.6569 4 21 5.34315 21 7V9H3V7Z"
            fill="#4285F4"
          />
          {/* Right side - Red */}
          <Path
            d="M21 9H16V21H18C19.6569 21 21 19.6569 21 18V9Z"
            fill="#EA4335"
          />
          {/* Bottom side - Yellow */}
          <Path
            d="M8 16H16V21H8V16Z"
            fill="#FBBC05"
          />
          {/* Left side - Green */}
          <Path
            d="M3 9H8V21H6C4.34315 21 3 19.6569 3 18V9Z"
            fill="#34A853"
          />
          {/* Center white plate */}
          <Rect
            x="8"
            y="9"
            width="8"
            height="7"
            fill="#FFFFFF"
          />
          {/* Header pins */}
          <Path
            d="M7.5 2V5M16.5 2V5"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Small check mark in center */}
          <Path
            d="M10 11.5L11.5 13L14.5 10"
            stroke="#4285F4"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </IconWrapper>
    );
  },
);

export const GoogleCalendarOption: React.FC<GoogleCalendarOptionProps> = memo(
  ({ isSelected, onToggle, style, disabled = false }) => {
    const { t } = useTranslation();
    const scale = useSharedValue(1);

    const handlePress = useCallback(() => {
      if (disabled) {
        return;
      }
      RNReactNativeHapticFeedback.trigger('impactLight');
      scale.value = withTiming(0.92, { duration: 80 }, () => {
        scale.value = withSpring(1, { damping: 12, stiffness: 200 });
      });
      onToggle(!isSelected);
    }, [disabled, isSelected, onToggle, scale]);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const accessibilityLabel = isSelected
      ? t('scheduleOptions.googleCalendarOptionActive', {
          defaultValue: 'Adicionar ao Google Agenda ativado',
        })
      : t('scheduleOptions.googleCalendarOption', {
          defaultValue: 'Adicionar ao Google Agenda',
        });

    return (
      <OptionContainer
        isSelected={isSelected}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.7}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isSelected }}
        accessibilityLabel={accessibilityLabel}
        style={[animatedStyle, style]}>
        <GoogleCalendarIcon isSelected={isSelected} size={16} />
        <OptionText isSelected={isSelected}>Google</OptionText>
        {isSelected && (
          <ActiveDot entering={FadeIn.duration(200)} exiting={FadeOut.duration(150)} />
        )}
      </OptionContainer>
    );
  },
);
