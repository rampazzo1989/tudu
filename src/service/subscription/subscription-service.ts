import { Platform } from 'react-native';
import Purchases, { PurchasesOffering, PurchasesPackage } from 'react-native-purchases';
import { getRecoil, setRecoil } from 'recoil-nexus';
import {
  aiSettingsState,
  cloudSyncState,
  subscriptionState,
  SubscriptionStatusType,
  userSessionState,
} from '../../state/atoms';
import { tuduApi } from '../api/tudu-api';

// Public API Keys for RevenueCat (Google Play and iOS App Store)
// Replace with your real public keys from RevenueCat Dashboard (Project Settings > API Keys > Public app-specific API keys)
export const REVENUECAT_GOOGLE_API_KEY = 'goog_MKAShsWPOnqmnDlBhcgIkAvYmsI';
export const REVENUECAT_APPLE_API_KEY = 'appl_TuduProRevenueCatPublicKey2026';

export const isRevenueCatKeyValid = (key: string): boolean => {
  return Boolean(
    key &&
    !key.includes('TuduProRevenueCatPublicKey') &&
    !key.includes('placeholder') &&
    !key.startsWith('your_') &&
    key.length > 20
  );
};

export class SubscriptionService {
  private static isConfigured = false;

  /**
   * Checks whether RevenueCat is enabled with a valid public API key.
   */
  static isRevenueCatEnabled(): boolean {
    if (process.env.NODE_ENV === 'test') {
      return true;
    }
    const apiKey = Platform.OS === 'ios' ? REVENUECAT_APPLE_API_KEY : REVENUECAT_GOOGLE_API_KEY;
    return isRevenueCatKeyValid(apiKey);
  }

  /**
   * Initializes RevenueCat SDK.
   */
  static async initialize() {
    if (this.isConfigured) return;

    if (!this.isRevenueCatEnabled()) {
      console.log('[SubscriptionService] RevenueCat mock mode: no valid public API key configured. Real purchases disabled.');
      this.isConfigured = true;
      return;
    }

    const apiKey = Platform.OS === 'ios' ? REVENUECAT_APPLE_API_KEY : REVENUECAT_GOOGLE_API_KEY;

    try {
      // Safe log handler to prevent unhandled RedBox errors in dev mode
      if (typeof Purchases.setLogHandler === 'function') {
        Purchases.setLogHandler((level, message) => {
          if (level === Purchases.LOG_LEVEL?.ERROR) {
            console.warn('[RevenueCat]', message);
          }
        });
      }

      Purchases.configure({ apiKey });
      this.isConfigured = true;

      // Identify user if logged in
      const session = getRecoil(userSessionState);
      if (session?.user?.id) {
        await Purchases.logIn(session.user.id);
      }

      // Check initial customer info
      const customerInfo = await Purchases.getCustomerInfo();
      this.updateStateFromCustomerInfo(customerInfo);

      // Synchronize with Tudú backend status
      await this.syncWithBackend();

      // Listen for real-time updates
      Purchases.addCustomerInfoUpdateListener(info => {
        this.updateStateFromCustomerInfo(info);
        this.syncWithBackend().catch(() => {});
      });
    } catch (error) {
      console.warn('[SubscriptionService] Error initializing RevenueCat:', error);
    }
  }

  /**
   * Fetches current available offerings.
   */
  static async getMonthlyOffering(): Promise<PurchasesPackage | null> {
    if (!this.isRevenueCatEnabled()) {
      return null;
    }

    try {
      await this.initialize();
      const offerings = await Purchases.getOfferings();
      if (offerings.current && offerings.current.monthly) {
        return offerings.current.monthly;
      }
      return null;
    } catch (error) {
      console.warn('[SubscriptionService] Could not fetch offerings:', error);
      return null;
    }
  }

  /**
   * Purchases the Tudú Pro Monthly subscription (with 7 days free trial).
   */
  static async purchaseProMonthly(pkg?: PurchasesPackage) {
    if (!this.isRevenueCatEnabled()) {
      // [MOCK COMENTADO PARA TESTAR SEMPRE ASSINATURA REAL NO EMULADOR]
      // return this.devActivateTrial();
      throw new Error('[SubscriptionService] RevenueCat não está configurado.');
    }

    try {
      await this.initialize();

      let targetPackage = pkg;
      if (!targetPackage) {
        targetPackage = (await this.getMonthlyOffering()) || undefined;
      }

      if (!targetPackage) {
        // [MOCK COMENTADO PARA TESTAR SEMPRE ASSINATURA REAL NO EMULADOR]
        // Fallback for sandbox / dev testing when packages aren't published on store yet
        // return this.devActivateTrial();
        throw new Error('Nenhum pacote de assinatura encontrado na loja.');
      }

      const { customerInfo } = await Purchases.purchasePackage(targetPackage);
      this.updateStateFromCustomerInfo(customerInfo);

      // Refresh status with backend
      await this.syncWithBackend();

      return customerInfo;
    } catch (error: any) {
      if (!error.userCancelled) {
        console.warn('[SubscriptionService] Purchase failed:', error);
      }
      throw error;
    }
  }

  /**
   * Restores existing purchases.
   */
  static async restorePurchases() {
    if (!this.isRevenueCatEnabled()) {
      await this.syncWithBackend();
      return null;
    }

    try {
      await this.initialize();
      const customerInfo = await Purchases.restorePurchases();
      this.updateStateFromCustomerInfo(customerInfo);
      await this.syncWithBackend();
      return customerInfo;
    } catch (error) {
      console.warn('[SubscriptionService] Restore purchases failed:', error);
      throw error;
    }
  }

  // ============================================================================
  // [MOCK / SIMULAÇÃO COMENTADO PARA TESTAR SEMPRE A ASSINATURA REAL NO EMULADOR]
  // ============================================================================
  // /**
  //  * Directly sets the subscription status for testing/dev purposes.
  //  * Allows quickly jumping between:
  //  * - 'FREE': resets to free user
  //  * - 'TRIALING': 7-day free trial
  //  * - 'ACTIVE': paid Pro subscriber (skipping trial)
  //  */
  // static async devSetStatus(target: 'FREE' | 'TRIALING' | 'ACTIVE') {
  //   const session = getRecoil(userSessionState);
  //
  //   if (target === 'FREE') {
  //     setRecoil(subscriptionState, {
  //       isPro: false,
  //       status: 'NONE' as SubscriptionStatusType,
  //       trialEndsAt: null,
  //       currentPeriodEndsAt: null,
  //     });
  //     return { success: true };
  //   }
  //
  //   if (target === 'TRIALING') {
  //     const trialEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  //     let currentToken = session?.token;
  //     if (!currentToken && __DEV__) {
  //       try {
  //         const { AuthService } = require('../auth/auth-service');
  //         await AuthService.devLogin();
  //         currentToken = getRecoil(userSessionState)?.token;
  //       } catch (e) {
  //         // Dev login fallback
  //       }
  //     }
  //     if (currentToken) {
  //       try {
  //         await tuduApi.subscriptions.devActivate(true);
  //       } catch (e) {
  //         // Local fallback
  //       }
  //     }
  //     setRecoil(subscriptionState, {
  //       isPro: true,
  //       status: 'TRIALING' as SubscriptionStatusType,
  //       trialEndsAt,
  //       currentPeriodEndsAt: null,
  //     });
  //     this.enableEmojiSuggestionsIfDefault();
  //     return { success: true };
  //   }
  //
  //   if (target === 'ACTIVE') {
  //     const currentPeriodEndsAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  //     let currentToken = session?.token;
  //     if (!currentToken && __DEV__) {
  //       try {
  //         const { AuthService } = require('../auth/auth-service');
  //         await AuthService.devLogin();
  //         currentToken = getRecoil(userSessionState)?.token;
  //       } catch (e) {
  //         // Dev login fallback
  //       }
  //     }
  //     if (currentToken) {
  //       try {
  //         await tuduApi.subscriptions.devActivate(false);
  //       } catch (e) {
  //         // Local fallback
  //       }
  //     }
  //     setRecoil(subscriptionState, {
  //       isPro: true,
  //       status: 'ACTIVE' as SubscriptionStatusType,
  //       trialEndsAt: null,
  //       currentPeriodEndsAt,
  //     });
  //     this.enableEmojiSuggestionsIfDefault();
  //     return { success: true };
  //   }
  //
  //   return { success: false };
  // }
  //
  // /**
  //  * Activates development trial (useful for testing on emulator/sandbox).
  //  */
  // static async devActivateTrial() {
  //   return this.devSetStatus('TRIALING');
  // }

  /**
   * Synchronizes subscription state with Tudú Backend.
   */
  static async syncWithBackend() {
    let session = getRecoil(userSessionState);
    if (!session?.token && __DEV__) {
      try {
        const { AuthService } = require('../auth/auth-service');
        await AuthService.devLogin();
        session = getRecoil(userSessionState);
      } catch (e) {
        // Fallback
      }
    }
    if (!session?.token) return;

    try {
      const status = await tuduApi.subscriptions.getStatus();
      const currentSub = getRecoil(subscriptionState);
      const isPro = Boolean(status.isPro || currentSub.isPro);

      setRecoil(subscriptionState, {
        isPro,
        status: status.status as SubscriptionStatusType,
        trialEndsAt: status.trialEndsAt,
        currentPeriodEndsAt: status.currentPeriodEndsAt,
      });

      if (isPro) {
        this.enableEmojiSuggestionsIfDefault();

        // Automatic Cloud Sync on App Startup / Pro Recognition:
        // If lastSyncAt is unset or 0 (clean install / data wiped), restore data from cloud!
        // Otherwise, run an incremental delta sync.
        try {
          const { SyncEngine } = require('../sync/sync-engine');
          const syncState = getRecoil(cloudSyncState);
          if (!syncState?.lastSyncAt) {
            console.log('[SubscriptionService] Fresh start for Pro user: auto-restoring cloud data...');
            await SyncEngine.restoreFromCloud();
          } else {
            console.log('[SubscriptionService] Pro user: auto-syncing delta...');
            await SyncEngine.syncDelta();
          }
        } catch (syncErr) {
          console.warn('[SubscriptionService] Auto-sync on startup error:', syncErr);
        }
      }
    } catch (e) {
      console.warn('[SubscriptionService] Could not sync subscription with backend:', e);
    }
  }

  private static enableEmojiSuggestionsIfDefault() {
    try {
      const current = getRecoil(aiSettingsState);
      if (!current.aiEmojiSuggestionsManuallySet && !current.aiEmojiSuggestionsEnabled) {
        setRecoil(aiSettingsState, {
          ...current,
          aiEmojiSuggestionsEnabled: true,
        });
      }
    } catch (e) {
      // Recoil might not be ready or outside context
    }
  }

  private static updateStateFromCustomerInfo(customerInfo: any) {
    if (!customerInfo) return;

    const activeEntitlements = customerInfo.entitlements?.active;
    const proEntitlement =
      activeEntitlements?.['tudú_pro'] ||
      activeEntitlements?.['tudu_pro'] ||
      activeEntitlements?.['pro'];

    if (proEntitlement) {
      const isTrial = proEntitlement.periodType === 'TRIAL';
      setRecoil(subscriptionState, {
        isPro: true,
        status: (isTrial ? 'TRIALING' : 'ACTIVE') as SubscriptionStatusType,
        trialEndsAt: isTrial ? proEntitlement.expirationDate : null,
        currentPeriodEndsAt: proEntitlement.expirationDate || null,
      });
      this.enableEmojiSuggestionsIfDefault();
    }
  }
}
