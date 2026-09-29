import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useCallback, useEffect, useState } from 'react';
import { Linking, Platform } from 'react-native';
import { PurchasesPackage } from 'react-native-purchases';
import { paywallModalVisibleState, subscriptionState } from '../../state/atoms';
import { SubscriptionService } from './subscription-service';
import { formatPriceWithPeriod } from './subscription-pricing';

export function useSubscription() {
  const subscription = useRecoilValue(subscriptionState);
  const setPaywallVisible = useSetRecoilState(paywallModalVisibleState);
  const [monthlyPackage, setMonthlyPackage] = useState<PurchasesPackage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    SubscriptionService.initialize();
    SubscriptionService.getMonthlyOffering().then(pkg => {
      if (pkg) {
        setMonthlyPackage(pkg);
      }
    });
  }, []);

  const purchasePro = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await SubscriptionService.purchaseProMonthly(monthlyPackage || undefined);
      setPaywallVisible(false);
      return true;
    } catch (err: any) {
      if (!err?.userCancelled) {
        setError(err?.message || 'Falha ao processar assinatura.');
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, [monthlyPackage, setPaywallVisible]);

  const restorePurchases = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await SubscriptionService.restorePurchases();
      return true;
    } catch (err: any) {
      setError(err?.message || 'Nenhuma assinatura encontrada para restaurar.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const openPaywall = useCallback(() => {
    setPaywallVisible(true);
  }, [setPaywallVisible]);

  const closePaywall = useCallback(() => {
    setPaywallVisible(false);
  }, [setPaywallVisible]);

  const manageSubscription = useCallback(() => {
    const playStoreUrl = 'https://play.google.com/store/account/subscriptions?package=com.rampazzo.tudu';
    const appStoreUrl = 'https://apps.apple.com/account/subscriptions';
    const url = Platform.OS === 'ios' ? appStoreUrl : playStoreUrl;
    Linking.openURL(url).catch(() => {
      Linking.openURL('https://play.google.com/store/account/subscriptions');
    });
  }, []);

  /* [MOCK DE SIMULAÇÃO COMENTADO PARA TESTAR SEMPRE ASSINATURA REAL]
  const devSetStatus = useCallback((target: 'FREE' | 'TRIALING' | 'ACTIVE') => {
    return SubscriptionService.devSetStatus(target);
  }, []);
  */

  // Compute days left if in trial
  const daysLeftInTrial = subscription.trialEndsAt
    ? Math.max(
        0,
        Math.ceil(
          (new Date(subscription.trialEndsAt).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24),
        ),
      )
    : null;

  return {
    isPro: subscription.isPro,
    status: subscription.status,
    trialEndsAt: subscription.trialEndsAt,
    currentPeriodEndsAt: subscription.currentPeriodEndsAt,
    daysLeftInTrial,
    priceFormatted: formatPriceWithPeriod(monthlyPackage?.product?.priceString),
    hasStorePrice: Boolean(monthlyPackage?.product?.priceString),
    loading,
    error,
    purchasePro,
    restorePurchases,
    openPaywall,
    closePaywall,
    manageSubscription,
    // devSetStatus,
  };
}
