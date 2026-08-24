import {
  GoogleSignin,
  statusCodes,
  User,
} from '@react-native-google-signin/google-signin';
import { BackupGoogleUser } from '../../state/atoms';
import { withAppLockSuppressed } from '../security';

export const GOOGLE_DRIVE_APPDATA_SCOPE =
  'https://www.googleapis.com/auth/drive.appdata';

let isConfigured = false;

export const configureGoogleSignIn = () => {
  if (isConfigured) {
    return;
  }

  GoogleSignin.configure({
    scopes: [GOOGLE_DRIVE_APPDATA_SCOPE],
    // offlineAccess can be false since we get fresh access token when needed
    offlineAccess: false,
    forceCodeForRefreshToken: false,
  });

  isConfigured = true;
};

export const mapGoogleUser = (user: User | null): BackupGoogleUser | null => {
  if (!user || !user.user) {
    return null;
  }

  return {
    id: user.user.id,
    email: user.user.email,
    name: user.user.name || user.user.email.split('@')[0],
    photo: user.user.photo || undefined,
  };
};

export const signInWithGoogle = async (): Promise<BackupGoogleUser> => {
  configureGoogleSignIn();

  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await withAppLockSuppressed(async () => {
      return await GoogleSignin.signIn();
    });
    
    // In newer versions response.data is the User object, in older response is User
    const userObj = (response as any).data || response;
    const mapped = mapGoogleUser(userObj);

    if (!mapped) {
      throw new Error('Não foi possível obter os dados da conta Google.');
    }

    return mapped;
  } catch (error: any) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      throw new Error('Login cancelado pelo usuário.');
    } else if (error.code === statusCodes.IN_PROGRESS) {
      throw new Error('Login já em andamento.');
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      throw new Error('Google Play Services não disponível ou desatualizado.');
    } else {
      throw new Error(error.message || 'Erro ao autenticar com o Google.');
    }
  }
};

export const signInSilentlyWithGoogle = async (): Promise<BackupGoogleUser | null> => {
  configureGoogleSignIn();

  try {
    const response = await GoogleSignin.signInSilently();
    const userObj = (response as any).data || response;
    return mapGoogleUser(userObj);
  } catch (error) {
    return null;
  }
};

export const getGoogleAccessToken = async (): Promise<string> => {
  configureGoogleSignIn();

  try {
    const tokens = await GoogleSignin.getTokens();
    if (tokens?.accessToken) {
      return tokens.accessToken;
    }
  } catch (err) {
    // Attempt silent sign-in to refresh
    try {
      await GoogleSignin.signInSilently();
      const freshTokens = await GoogleSignin.getTokens();
      if (freshTokens?.accessToken) {
        return freshTokens.accessToken;
      }
    } catch (silentErr) {
      // ignore
    }
  }

  throw new Error('Não foi possível obter o token de acesso do Google. Faça login novamente.');
};

export const signOutFromGoogle = async (): Promise<void> => {
  configureGoogleSignIn();

  try {
    await GoogleSignin.signOut();
  } catch (error) {
    console.warn('[GoogleAuthService] Error signing out:', error);
  }
};

export const getCurrentGoogleUser = async (): Promise<BackupGoogleUser | null> => {
  configureGoogleSignIn();

  try {
    const user = await GoogleSignin.getCurrentUser();
    return mapGoogleUser(user);
  } catch (error) {
    return null;
  }
};
