jest.mock('react-dom', () => ({}), { virtual: true });

jest.mock('../src/i18n', () => ({
  t: (key: string, options?: any) => options?.defaultValue || key,
}));

jest.mock('react-native-navigation-bar-color', () => jest.fn());

jest.mock('recoil-nexus', () => ({
  getRecoil: jest.fn(() => ({})),
  setRecoil: jest.fn(),
}));

jest.mock('@notifee/react-native', () => {
  const notifeeMock = {
    createChannel: jest.fn(),
    createTriggerNotification: jest.fn(),
    cancelNotification: jest.fn(),
    getTriggerNotificationIds: jest.fn().mockResolvedValue([]),
    displayNotification: jest.fn(),
    requestPermission: jest.fn().mockResolvedValue({ authorizationStatus: 1 }),
    getNotificationSettings: jest.fn().mockResolvedValue({ authorizationStatus: 1 }),
  };
  return {
    __esModule: true,
    default: notifeeMock,
    ...notifeeMock,
    AndroidImportance: { HIGH: 4, DEFAULT: 3 },
    AndroidVisibility: { PUBLIC: 1 },
    AndroidCategory: { CALL: 'call', ALARM: 'alarm' },
    AndroidLaunchActivityFlag: { NEW_TASK: 2, SINGLE_TOP: 1 },
    AuthorizationStatus: { AUTHORIZED: 1, PROVISIONAL: 2, DENIED: 0 },
    TriggerType: { TIMESTAMP: 0 },
    AlarmType: {
      SET_EXACT: 0,
      SET_EXACT_AND_ALLOW_WHILE_IDLE: 1,
      SET: 2,
      SET_AND_ALLOW_WHILE_IDLE: 3,
      SET_ALARM_CLOCK: 4,
    },
  };
});

jest.mock('react-native-linear-gradient', () => {
  const React = require('react');
  const { View } = require('react-native');
  return (props: any) => React.createElement(View, props, props.children);
});

jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: {
      View,
      createAnimatedComponent: (comp: any) => comp,
    },
    useSharedValue: jest.fn(() => ({ value: 0 })),
    useAnimatedStyle: jest.fn(() => ({})),
    withSpring: jest.fn(val => val),
    withTiming: jest.fn(val => val),
    runOnJS: jest.fn(fn => fn),
  };
});

jest.mock('react-native-haptic-feedback', () => ({
  trigger: jest.fn(),
}));

jest.mock('react-native-purchases', () => {
  return {
    __esModule: true,
    default: {
      configure: jest.fn(),
      logIn: jest.fn().mockResolvedValue({ customerInfo: {} }),
      getCustomerInfo: jest.fn().mockResolvedValue({ entitlements: { active: {} } }),
      addCustomerInfoUpdateListener: jest.fn(),
      getOfferings: jest.fn().mockResolvedValue({
        current: {
          monthly: {
            identifier: 'tudu_pro_monthly',
            product: {
              identifier: 'tudu_pro_monthly_490',
              priceString: 'R$ 4,90',
            },
          },
        },
      }),
      purchasePackage: jest.fn(),
      restorePurchases: jest.fn(),
    },
  };
});

const mockPurchasePro = jest.fn().mockResolvedValue(true);
const mockRestorePurchases = jest.fn().mockResolvedValue(true);
const mockManageSubscription = jest.fn();

let mockIsPro = false;
let mockStatus = 'INACTIVE';
let mockTrialEndsAt: string | null = null;
let mockCurrentPeriodEndsAt: string | null = null;
let mockDaysLeftInTrial: number | null = null;

jest.mock('../src/service/subscription/useSubscription', () => ({
  useSubscription: () => ({
    isPro: mockIsPro,
    status: mockStatus,
    trialEndsAt: mockTrialEndsAt,
    currentPeriodEndsAt: mockCurrentPeriodEndsAt,
    daysLeftInTrial: mockDaysLeftInTrial,
    priceFormatted: 'R$ 4,90/mês',
    loading: false,
    error: null,
    purchasePro: mockPurchasePro,
    restorePurchases: mockRestorePurchases,
    openPaywall: jest.fn(),
    closePaywall: jest.fn(),
    manageSubscription: mockManageSubscription,
  }),
}));

const mockStorage = new Map<string, any>();
jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn().mockImplementation(() => ({
    clearAll: () => mockStorage.clear(),
    delete: (key: string) => mockStorage.delete(key),
    set: (key: string, value: any) => mockStorage.set(key, value),
    getString: (key: string) => {
      const result = mockStorage.get(key);
      return typeof result === 'string' ? result : undefined;
    },
    getNumber: (key: string) => {
      const result = mockStorage.get(key);
      return typeof result === 'number' ? result : undefined;
    },
    getBoolean: (key: string) => {
      const result = mockStorage.get(key);
      return typeof result === 'boolean' ? result : undefined;
    },
    contains: (key: string) => mockStorage.has(key),
    getAllKeys: () => Array.from(mockStorage.keys()),
  })),
}));

import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { RecoilRoot } from 'recoil';
import { ThemeProvider } from 'styled-components/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { darkTheme } from '../src/themes/dark';
import { SubscriptionSettingsPage } from '../src/scenes/settings/subscription-settings';
import { SubscriptionReminderModal } from '../src/components/subscription-reminder-modal';
import { HomeHeader } from '../src/scenes/home/components/home-header';
import { hasSeenSubscriptionReminderState } from '../src/state/atoms';
import { hasSeenOnboarding } from '../src/state/onboarding';
import { ProHeaderBadgeButton } from '../src/scenes/home/components/home-header/styles';
import { PrimaryButton } from '../src/components/subscription-reminder-modal/styles';
import { PrimaryActionButton } from '../src/scenes/settings/subscription-settings/styles';

const initialMetrics = {
  frame: { x: 0, y: 0, width: 360, height: 640 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

describe('Subscription UI & Reminder Flow', () => {
  const mockNavigation: any = {
    goBack: jest.fn(),
    navigate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockStorage.clear();
    mockIsPro = false;
    mockStatus = 'INACTIVE';
    mockTrialEndsAt = null;
    mockCurrentPeriodEndsAt = null;
    mockDaysLeftInTrial = null;
  });

  describe('SubscriptionSettingsPage', () => {
    it('renders free user view with trial badge and purchase CTA', () => {
      mockIsPro = false;
      mockStatus = 'INACTIVE';

      let renderer: TestRenderer.ReactTestRenderer;
      act(() => {
        renderer = TestRenderer.create(
          <SafeAreaProvider initialMetrics={initialMetrics}>
            <RecoilRoot>
              <ThemeProvider theme={darkTheme}>
                <SubscriptionSettingsPage navigation={mockNavigation} />
              </ThemeProvider>
            </RecoilRoot>
          </SafeAreaProvider>,
        );
      });

      const root = renderer!.root;
      const textNodes = root.findAllByType('Text');
      const textContents = textNodes.map(node => node.props.children).flat();

      expect(textContents).toContain('Tudú Pro');
      expect(textContents).toContain('7 DIAS GRÁTIS');
      expect(textContents).toContain('Experimentar 7 Dias Grátis');
      expect(textContents).toContain('Restaurar Compras');
    });

    it('renders active pro user view with PRO ATIVO badge and manage CTA', () => {
      mockIsPro = true;
      mockStatus = 'ACTIVE';

      let renderer: TestRenderer.ReactTestRenderer;
      act(() => {
        renderer = TestRenderer.create(
          <SafeAreaProvider initialMetrics={initialMetrics}>
            <RecoilRoot>
              <ThemeProvider theme={darkTheme}>
                <SubscriptionSettingsPage navigation={mockNavigation} />
              </ThemeProvider>
            </RecoilRoot>
          </SafeAreaProvider>,
        );
      });

      const root = renderer!.root;
      const textNodes = root.findAllByType('Text');
      const textContents = textNodes.map(node => node.props.children).flat();

      expect(textContents).toContain('PRO ATIVO');
      expect(textContents).toContain('Gerenciar Assinatura na Loja');
    });

    it('handles purchasePro action when free user clicks primary button', async () => {
      mockIsPro = false;
      mockStatus = 'INACTIVE';

      let renderer: TestRenderer.ReactTestRenderer;
      act(() => {
        renderer = TestRenderer.create(
          <SafeAreaProvider initialMetrics={initialMetrics}>
            <RecoilRoot>
              <ThemeProvider theme={darkTheme}>
                <SubscriptionSettingsPage navigation={mockNavigation} />
              </ThemeProvider>
            </RecoilRoot>
          </SafeAreaProvider>,
        );
      });

      const root = renderer!.root;
      const primaryBtns = root.findAllByType(PrimaryActionButton);
      expect(primaryBtns.length).toBeGreaterThan(0);

      await act(async () => {
        await primaryBtns[0].props.onPress();
      });

      expect(mockPurchasePro).toHaveBeenCalled();
    });
  });

  describe('SubscriptionReminderModal', () => {
    it('does not display if user is already Pro', () => {
      mockIsPro = true;

      let renderer: TestRenderer.ReactTestRenderer;
      act(() => {
        renderer = TestRenderer.create(
          <RecoilRoot
            initializeState={snap => {
              snap.set(hasSeenSubscriptionReminderState, false);
              snap.set(hasSeenOnboarding, true);
            }}>
            <ThemeProvider theme={darkTheme}>
              <SubscriptionReminderModal />
            </ThemeProvider>
          </RecoilRoot>,
        );
      });

      const root = renderer!.root;
      const modals = root.findAllByType('Modal');
      expect(modals.length).toBe(0);
    });

    it('displays for free user who completed onboarding and has not seen reminder', () => {
      jest.useFakeTimers();
      mockIsPro = false;

      let renderer: TestRenderer.ReactTestRenderer;
      act(() => {
        renderer = TestRenderer.create(
          <RecoilRoot
            initializeState={snap => {
              snap.set(hasSeenSubscriptionReminderState, false);
              snap.set(hasSeenOnboarding, true);
            }}>
            <ThemeProvider theme={darkTheme}>
              <SubscriptionReminderModal />
            </ThemeProvider>
          </RecoilRoot>,
        );
      });

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      const root = renderer!.root;
      const modals = root.findAllByType('Modal');
      expect(modals.length).toBe(1);
      expect(modals[0].props.visible).toBe(true);

      jest.useRealTimers();
    });

    it('navigates to subscription and dismisses when user taps try free trial button', () => {
      jest.useFakeTimers();
      mockIsPro = false;
      const mockNav = jest.fn();

      let renderer: TestRenderer.ReactTestRenderer;
      act(() => {
        renderer = TestRenderer.create(
          <RecoilRoot
            initializeState={snap => {
              snap.set(hasSeenSubscriptionReminderState, false);
              snap.set(hasSeenOnboarding, true);
            }}>
            <ThemeProvider theme={darkTheme}>
              <SubscriptionReminderModal onNavigateToSubscription={mockNav} />
            </ThemeProvider>
          </RecoilRoot>,
        );
      });

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      const root = renderer!.root;
      const primaryBtns = root.findAllByType(PrimaryButton);
      expect(primaryBtns.length).toBeGreaterThan(0);

      act(() => {
        primaryBtns[0].props.onPress();
      });

      expect(mockNav).toHaveBeenCalledTimes(1);

      jest.useRealTimers();
    });
  });

  describe('HomeHeader Pro Highlight Icon', () => {
    it('shows Pro badge button for free users and triggers onProPress', () => {
      mockIsPro = false;
      const onProPress = jest.fn();

      let renderer: TestRenderer.ReactTestRenderer;
      act(() => {
        renderer = TestRenderer.create(
          <RecoilRoot>
            <ThemeProvider theme={darkTheme}>
              <HomeHeader
                onSearchPress={jest.fn()}
                onSettingsPress={jest.fn()}
                onProPress={onProPress}
              />
            </ThemeProvider>
          </RecoilRoot>,
        );
      });

      const root = renderer!.root;
      const proBadge = root.findAllByType(ProHeaderBadgeButton);
      expect(proBadge.length).toBe(1);

      // Find the shrinkable view or touchable wrapping ProHeaderBadgeButton
      const proTouchable = root.findAllByProps({ onPress: onProPress });
      expect(proTouchable.length).toBeGreaterThan(0);

      act(() => {
        proTouchable[0].props.onPress();
      });

      expect(onProPress).toHaveBeenCalledTimes(1);
    });

    it('does not show Pro badge button for Pro users', () => {
      mockIsPro = true;
      const onProPress = jest.fn();

      let renderer: TestRenderer.ReactTestRenderer;
      act(() => {
        renderer = TestRenderer.create(
          <RecoilRoot>
            <ThemeProvider theme={darkTheme}>
              <HomeHeader
                onSearchPress={jest.fn()}
                onSettingsPress={jest.fn()}
                onProPress={onProPress}
              />
            </ThemeProvider>
          </RecoilRoot>,
        );
      });

      const root = renderer!.root;
      const proBadge = root.findAllByType(ProHeaderBadgeButton);
      expect(proBadge.length).toBe(0);
    });
  });
});
