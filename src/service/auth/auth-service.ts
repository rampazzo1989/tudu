import { Platform } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { setRecoil, getRecoil } from 'recoil-nexus';
import { tuduApi } from '../api/tudu-api';
import {
  backupSettingsState,
  subscriptionState,
  SubscriptionStatusType,
  userSessionState,
} from '../../state/atoms';
import { configureGoogleSignIn } from '../backup/googleAuthService';
import { withAppLockSuppressed } from '../security';

export class AuthService {
  /**
   * Performs Google Sign-In and authenticates with Tudú API.
   * Also centralizes Google Drive backup so the same account is used for both.
   */
  static async signInWithGoogle() {
    try {
      configureGoogleSignIn();
      await GoogleSignin.hasPlayServices();
      const signInResult = await withAppLockSuppressed(async () => {
        return await GoogleSignin.signIn();
      });
      const tokens = await GoogleSignin.getTokens();
      const idToken = tokens.idToken;

      if (!idToken) {
        throw new Error('Google Sign-In did not return an idToken.');
      }

      const { user, accessToken } = await tuduApi.auth.loginWithGoogle(idToken);

      setRecoil(userSessionState, {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
          provider: 'google',
        },
        token: accessToken,
      });

      // Centralized account: automatically link Google Drive backup to the same account
      setRecoil(backupSettingsState, prev => ({
        ...prev,
        googleUser: {
          id: user.id,
          email: user.email,
          name: user.name || user.email.split('@')[0],
          photo: user.avatarUrl,
        },
      }));

      // Synchronize subscription status after login
      await this.refreshSubscriptionStatus();

      return user;
    } catch (error) {
      console.error('[AuthService] Google Sign-In error:', error);
      throw error;
    }
  }

  /**
   * Performs Apple Sign-In and authenticates with Tudú API (iOS only).
   */
  static async signInWithApple() {
    if (Platform.OS !== 'ios') {
      throw new Error('Apple Sign-In is only available on iOS.');
    }

    try {
      const { appleAuth } = require('@invertase/react-native-apple-authentication');
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      const { identityToken, email, fullName } = appleAuthRequestResponse;

      if (!identityToken) {
        throw new Error('Apple Sign-In did not return an identityToken.');
      }

      const nameStr = fullName
        ? [fullName.givenName, fullName.familyName].filter(Boolean).join(' ')
        : undefined;

      const { user, accessToken } = await tuduApi.auth.loginWithApple(
        identityToken,
        nameStr,
        email || undefined,
      );

      setRecoil(userSessionState, {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
          provider: 'apple',
        },
        token: accessToken,
      });

      await this.refreshSubscriptionStatus();
      return user;
    } catch (error) {
      console.error('[AuthService] Apple Sign-In error:', error);
      throw error;
    }
  }

  /**
   * Dev login for local testing.
   */
  static async devLogin(email: string = 'dev@tudu.app', name: string = 'Dev Tester') {
    const { user, accessToken } = await tuduApi.auth.devLogin(email, name);

    setRecoil(userSessionState, {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        provider: 'dev',
      },
      token: accessToken,
    });

    // In dev mode, also link backup settings for consistency
    setRecoil(backupSettingsState, prev => ({
      ...prev,
      googleUser: prev.googleUser || {
        id: user.id,
        email: user.email,
        name: user.name,
        photo: user.avatarUrl,
      },
    }));

    await this.refreshSubscriptionStatus();
    return user;
  }

  /**
   * Refreshes subscription status from Tudú API.
   */
  static async refreshSubscriptionStatus() {
    const session = getRecoil(userSessionState);
    if (!session?.token) return null;

    try {
      const status = await tuduApi.subscriptions.getStatus();
      setRecoil(subscriptionState, {
        isPro: status.isPro,
        status: status.status as SubscriptionStatusType,
        trialEndsAt: status.trialEndsAt,
        currentPeriodEndsAt: status.currentPeriodEndsAt,
      });
      return status;
    } catch (error) {
      console.warn('[AuthService] Could not refresh subscription status:', error);
      return null;
    }
  }

  /**
   * Signs out user and clears local session.
   * Also disconnects the centralized Google Drive backup.
   */
  static async signOut() {
    try {
      await GoogleSignin.signOut().catch(() => {});
    } catch {
      // Ignore
    }

    setRecoil(userSessionState, { user: null, token: null });

    // Disconnect centralized backup account
    setRecoil(backupSettingsState, prev => ({
      ...prev,
      googleUser: null,
      autoBackupEnabled: false,
    }));
  }
}
