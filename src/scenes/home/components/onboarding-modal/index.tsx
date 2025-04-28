import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  Button,
} from 'react-native';
import { useRecoilState } from 'recoil';
import { hasSeenOnboarding as hasSeenOnboardingState } from '../../../../state/onboarding';
import { PopupModal } from '../../../../components/popup-modal';
import { BackButton } from '../../../../components/back-button';
import { NextButton } from '../../../../components/next-button';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { TranslationKeys } from './types';

const onboardingSteps: Array<{
  titleKey: TranslationKeys;
  descriptionKey: TranslationKeys;
  image: string;
}> = [
  {
    titleKey: 'onboarding.steps.lists.title',
    descriptionKey: 'onboarding.steps.lists.description',
    image: 'https://res.cloudinary.com/dnizif4j6/image/upload/v1744994793/lists_hjpxmc.png',
  },
  {
    titleKey: 'onboarding.steps.tudus.title',
    descriptionKey: 'onboarding.steps.tudus.description',
    image: 'https://res.cloudinary.com/dnizif4j6/image/upload/v1744995053/tudus_dpwis7.png',
  },
  {
    titleKey: 'onboarding.steps.emojis.title',
    descriptionKey: 'onboarding.steps.emojis.description',
    image: 'https://res.cloudinary.com/dnizif4j6/image/upload/v1744994793/emojis_owgxbz.png',
  },
  {
    titleKey: 'onboarding.steps.counters.title',
    descriptionKey: 'onboarding.steps.counters.description',
    image: 'https://res.cloudinary.com/dnizif4j6/image/upload/v1744994823/Captura_de_Tela_2025-04-18_a%CC%80s_13.43.37_cbhvfk.png',
  },
  {
    titleKey: 'onboarding.steps.scheduled.title',
    descriptionKey: 'onboarding.steps.scheduled.description',
    image: 'https://res.cloudinary.com/dnizif4j6/image/upload/v1744994824/Captura_de_Tela_2025-04-18_a%CC%80s_13.45.05_krjyhw.png',
  },
  {
    titleKey: 'onboarding.steps.search.title',
    descriptionKey: 'onboarding.steps.search.description',
    image: 'https://res.cloudinary.com/dnizif4j6/image/upload/v1744994824/Captura_de_Tela_2025-04-18_a%CC%80s_13.45.53_wbexqt.png',
  },
];

export const OnboardingModal: React.FC = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useRecoilState(hasSeenOnboardingState);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isShowingWelcome, setIsShowingWelcome] = useState(true);
  const [isShowingWelcomeText, setIsShowingWelcomeText] = useState(true);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setIsImageLoading(true);
    } else {
      setHasSeenOnboarding(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setIsImageLoading(true);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setIsShowingWelcome(false);
    }, 4300);
    setTimeout(() => {
      setIsShowingWelcomeText(false);
    }, 2500);
  }, []);

  if (hasSeenOnboarding) return null;

  const { titleKey, descriptionKey, image } = onboardingSteps[currentStep];

  return (
    <PopupModal visible={!hasSeenOnboarding} animationType="fade" transparent onRequestClose={() => setHasSeenOnboarding(false)}>
      <View style={styles.container}>
        {/* Welcome Message */}
        {isShowingWelcome ? (isShowingWelcomeText && (
          <Animated.View entering={FadeIn.duration(2500)} exiting={FadeOut.duration(2000)}>
            <Text style={styles.title}>{t('onboarding.welcome')}</Text>
          </Animated.View>)) : (
          <>
        <Animated.View style={styles.stepperContainer}>
          {onboardingSteps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.step,
                index === currentStep ? styles.activeStep : styles.inactiveStep,
              ]}
            />
          ))}
        </Animated.View>

        {isImageLoading && (
          <ActivityIndicator size="large" color="#FFFFFF" style={styles.loader} />
        )}
        <Image
          source={{ uri: image }}
          style={[styles.image, isImageLoading && { opacity: 0 }]}
          onLoad={() => setIsImageLoading(false)}
          onError={() => setIsImageLoading(false)}
        />

        <Text style={styles.title}>{t(titleKey)}</Text>
        <Text style={styles.description}>{t(descriptionKey)}</Text>

        <View style={styles.buttonContainer}>
          {currentStep > 0 && (
            <BackButton onPress={handlePrevious} style={styles.button} />
          )}
          {currentStep < onboardingSteps.length - 1 && (
            <NextButton onPress={handleNext} style={styles.button} />
          )}
          {currentStep === onboardingSteps.length - 1 && (
            <Button
              title={t('onboarding.finish')}
              onPress={handleNext}
              color="#7956BF"
            />
          )}
        </View></>)}
      </View>
    </PopupModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 90,
  },
  stepperContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  step: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeStep: {
    backgroundColor: '#7956BF',
  },
  inactiveStep: {
    backgroundColor: '#D3D3D3',
  },
  loader: {
    position: 'absolute',
    top: 40,
    minHeight: 200,
    minWidth: 200,
    height: 200,
    width: 200,
  },
  image: {
    width: 280,
    height: 280,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  button: {
    backgroundColor: '#7956BF',
    width: 36,
  }
});