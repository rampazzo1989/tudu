import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { TooltipCardProps } from './types';

export const TooltipCard: React.FC<TooltipCardProps> = ({
  step,
  currentStepIndex,
  totalSteps,
  onNext,
  onPrevious,
  onSkip,
}) => {
  const { t } = useTranslation();
  const isLastStep = currentStepIndex === totalSteps - 1;
  const isFirstStep = currentStepIndex === 0;

  const handleNext = () => {
    RNReactNativeHapticFeedback.trigger('impactLight');
    onNext();
  };

  const handlePrevious = () => {
    RNReactNativeHapticFeedback.trigger('impactLight');
    onPrevious();
  };

  const handleSkip = () => {
    RNReactNativeHapticFeedback.trigger('impactLight');
    onSkip();
  };

  return (
    <View style={styles.cardContainer}>
      {/* Header with step pill and skip button */}
      <View style={styles.headerRow}>
        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>
            {t('tour.stepIndicator', {
              current: currentStepIndex + 1,
              total: totalSteps,
              defaultValue: `Passo ${currentStepIndex + 1} de ${totalSteps}`,
            })}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleSkip}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.skipText}>
            {t('tour.skip', { defaultValue: 'Pular' })}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Title & Description */}
      <Text style={styles.titleText}>
        {step.icon ? `${step.icon} ` : ''}
        {step.title}
      </Text>
      <Text style={styles.descriptionText}>{step.description}</Text>

      {/* Stepper dots & action buttons */}
      <View style={styles.footerRow}>
        <View style={styles.dotsContainer}>
          {Array.from({ length: totalSteps }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentStepIndex ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        <View style={styles.buttonsContainer}>
          {!isFirstStep && (
            <TouchableOpacity
              onPress={handlePrevious}
              style={styles.backButton}
              activeOpacity={0.7}>
              <Text style={styles.backButtonText}>
                {t('tour.back', { defaultValue: 'Voltar' })}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={handleNext}
            style={styles.nextButton}
            activeOpacity={0.8}>
            <Text style={styles.nextButtonText}>
              {isLastStep
                ? t('tour.finish', { defaultValue: 'Concluir' })
                : t('tour.next', { defaultValue: 'Próximo' })}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#2E3544',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: 'rgba(121, 86, 191, 0.4)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepBadge: {
    backgroundColor: 'rgba(121, 86, 191, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(161, 136, 210, 0.3)',
  },
  stepBadgeText: {
    color: '#D4C2F7',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter-Medium',
  },
  skipText: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'Inter-Regular',
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
    lineHeight: 24,
  },
  descriptionText: {
    color: '#D1D5DB',
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
    marginBottom: 18,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  activeDot: {
    width: 18,
    backgroundColor: '#7956BF',
  },
  inactiveDot: {
    width: 6,
    backgroundColor: '#4B5563',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#3C414A',
    marginRight: 8,
  },
  backButtonText: {
    color: '#E5E7EB',
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Inter-Medium',
  },
  nextButton: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#7956BF',
    shadowColor: '#7956BF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Inter-SemiBold',
  },
});
