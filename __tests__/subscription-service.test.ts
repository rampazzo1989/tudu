jest.mock('react-dom', () => ({}), { virtual: true });

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

const mockGetRecoil = jest.fn();
const mockSetRecoil = jest.fn();

jest.mock('recoil-nexus', () => ({
  getRecoil: (atom: any) => mockGetRecoil(atom),
  setRecoil: (atom: any, val: any) => mockSetRecoil(atom, val),
}));

jest.mock('../src/service/api/tudu-api', () => ({
  tuduApi: {
    subscriptions: {
      getStatus: jest.fn().mockResolvedValue({
        isPro: true,
        status: 'ACTIVE',
        trialEndsAt: null,
        currentPeriodEndsAt: '2026-10-28',
      }),
      devActivate: jest.fn().mockResolvedValue({
        subscription: {
          isPro: true,
          status: 'TRIALING',
          trialEndsAt: '2026-10-05T00:00:00.000Z',
          currentPeriodEndsAt: '2026-10-05T00:00:00.000Z',
        },
      }),
    },
  },
}));

import Purchases from 'react-native-purchases';
import { SubscriptionService } from '../src/service/subscription/subscription-service';
import { subscriptionState } from '../src/state/atoms';

describe('SubscriptionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (SubscriptionService as any).isConfigured = false;
    mockGetRecoil.mockReturnValue(null);
  });

  it('should initialize Purchases configure with correct API key', async () => {
    await SubscriptionService.initialize();
    expect(Purchases.configure).toHaveBeenCalledWith(
      expect.objectContaining({
        apiKey: expect.any(String),
      }),
    );
  });

  it('should fetch monthly offering correctly', async () => {
    const pkg = await SubscriptionService.getMonthlyOffering();
    expect(pkg).not.toBeNull();
    expect(pkg?.product.priceString).toBe('R$ 4,90');
  });

  it('should purchase package and update subscription state when active', async () => {
    (Purchases.purchasePackage as jest.Mock).mockResolvedValueOnce({
      customerInfo: {
        entitlements: {
          active: {
            pro: {
              periodType: 'TRIAL',
              expirationDate: '2026-10-05T00:00:00.000Z',
            },
          },
        },
      },
    });

    const mockPkg = { identifier: 'pkg_1' } as any;
    await SubscriptionService.purchaseProMonthly(mockPkg);

    expect(Purchases.purchasePackage).toHaveBeenCalledWith(mockPkg);
    expect(mockSetRecoil).toHaveBeenCalledWith(subscriptionState, {
      isPro: true,
      status: 'TRIALING',
      trialEndsAt: '2026-10-05T00:00:00.000Z',
      currentPeriodEndsAt: '2026-10-05T00:00:00.000Z',
    });
  });

  it('should restore purchases successfully', async () => {
    (Purchases.restorePurchases as jest.Mock).mockResolvedValueOnce({
      entitlements: {
        active: {
          pro: {
            periodType: 'NORMAL',
            expirationDate: '2026-11-28T00:00:00.000Z',
          },
        },
      },
    });

    await SubscriptionService.restorePurchases();

    expect(Purchases.restorePurchases).toHaveBeenCalled();
    expect(mockSetRecoil).toHaveBeenCalledWith(subscriptionState, {
      isPro: true,
      status: 'ACTIVE',
      trialEndsAt: null,
      currentPeriodEndsAt: '2026-11-28T00:00:00.000Z',
    });
  });

  it('should support devActivateTrial fallback', async () => {
    await SubscriptionService.devActivateTrial();

    expect(mockSetRecoil).toHaveBeenCalledWith(
      subscriptionState,
      expect.objectContaining({
        isPro: true,
        status: 'TRIALING',
        trialEndsAt: expect.any(String),
      }),
    );
  });

  describe('when RevenueCat is disabled or placeholder key is used', () => {
    beforeEach(() => {
      jest.spyOn(SubscriptionService, 'isRevenueCatEnabled').mockReturnValue(false);
      (SubscriptionService as any).isConfigured = false;
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should not call Purchases.configure in mock mode', async () => {
      await SubscriptionService.initialize();
      expect(Purchases.configure).not.toHaveBeenCalled();
    });

    it('should return null for getMonthlyOffering in mock mode', async () => {
      const pkg = await SubscriptionService.getMonthlyOffering();
      expect(pkg).toBeNull();
      expect(Purchases.getOfferings).not.toHaveBeenCalled();
    });

    it('should directly activate dev trial on purchaseProMonthly in mock mode', async () => {
      const devSpy = jest.spyOn(SubscriptionService, 'devActivateTrial').mockResolvedValueOnce({ success: true } as any);
      await SubscriptionService.purchaseProMonthly();
      expect(Purchases.purchasePackage).not.toHaveBeenCalled();
      expect(devSpy).toHaveBeenCalled();
    });
  });
});
