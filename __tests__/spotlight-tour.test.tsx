import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import ptBR from '../src/locale/pt-BR.json';
import en from '../src/locale/en.json';
import es from '../src/locale/es.json';
import itLocale from '../src/locale/it.json';

jest.mock('react-native-reanimated', () => {
  const View = require('react-native').View;
  return {
    __esModule: true,
    default: {
      View,
    },
    FadeIn: { duration: () => ({}) },
    FadeOut: { duration: () => ({}) },
  };
});

jest.mock('react-native-svg', () => {
  const View = require('react-native').View;
  return {
    __esModule: true,
    default: View,
    Svg: View,
    Defs: View,
    Mask: View,
    Rect: View,
    Circle: View,
  };
});

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 40, bottom: 20, left: 0, right: 0 }),
}));

jest.mock('react-native-haptic-feedback', () => ({
  trigger: jest.fn(),
}));

import { SpotlightTourProvider, useSpotlightTour, SpotlightStep } from '../src/components/spotlight-tour';

describe('Spotlight Tour System', () => {
  const mockSteps: SpotlightStep[] = [
    {
      name: 'step1',
      title: 'Step 1',
      description: 'First step description',
    },
    {
      name: 'step2',
      title: 'Step 2',
      description: 'Second step description',
    },
  ];

  it('manages tour lifecycle and step navigation correctly via provider', () => {
    let tourContext: ReturnType<typeof useSpotlightTour> | null = null;

    const Consumer = () => {
      tourContext = useSpotlightTour();
      return null;
    };

    ReactTestRenderer.create(
      <SpotlightTourProvider>
        <Consumer />
      </SpotlightTourProvider>,
    );

    expect(tourContext).not.toBeNull();
    expect(tourContext!.isTourActive).toBe(false);
    expect(tourContext!.currentStep).toBeNull();
    expect(tourContext!.currentStepIndex).toBe(0);

    // Start tour
    act(() => {
      tourContext!.startTour(mockSteps);
    });

    expect(tourContext!.isTourActive).toBe(true);
    expect(tourContext!.currentStep?.name).toBe('step1');
    expect(tourContext!.currentStepIndex).toBe(0);
    expect(tourContext!.totalSteps).toBe(2);

    // Next step
    act(() => {
      tourContext!.nextStep();
    });

    expect(tourContext!.isTourActive).toBe(true);
    expect(tourContext!.currentStep?.name).toBe('step2');
    expect(tourContext!.currentStepIndex).toBe(1);

    // Previous step
    act(() => {
      tourContext!.previousStep();
    });

    expect(tourContext!.currentStep?.name).toBe('step1');
    expect(tourContext!.currentStepIndex).toBe(0);

    // Complete tour by stepping past the last step
    act(() => {
      tourContext!.nextStep();
    });
    act(() => {
      tourContext!.nextStep();
    });

    expect(tourContext!.isTourActive).toBe(false);
    expect(tourContext!.currentStep).toBeNull();
  });

  it('has all tour translations in all supported languages', () => {
    const languages = [
      { code: 'pt-BR', data: ptBR },
      { code: 'en', data: en },
      { code: 'es', data: es },
      { code: 'it', data: itLocale },
    ];

    languages.forEach(({ data }) => {
      expect(data).toHaveProperty('tour');
      expect(data.tour).toHaveProperty('skip');
      expect(data.tour).toHaveProperty('next');
      expect(data.tour).toHaveProperty('back');
      expect(data.tour).toHaveProperty('finish');
      expect(data.tour).toHaveProperty('home');
      expect(data.tour.home).toHaveProperty('createAction');
      expect(data.tour.home).toHaveProperty('smartLists');
      expect(data.tour.home).toHaveProperty('customLists');
      expect(data.tour.home).toHaveProperty('header');

      expect(data.tour).toHaveProperty('list');
      expect(data.tour.list).toHaveProperty('addTudu');
      expect(data.tour.list).toHaveProperty('aiAssistant');
      expect(data.tour.list).toHaveProperty('tuduInteractions');
      expect(data.tour.list).toHaveProperty('listOptions');

      expect(data.settings).toHaveProperty('tutorial');
      expect(data.settings.tutorial).toHaveProperty('title');
      expect(data.settings.tutorial).toHaveProperty('subtitle');
    });
  });
});
