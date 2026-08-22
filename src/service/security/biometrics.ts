import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics({
  allowDeviceCredentials: false,
});

export interface BiometricSensorInfo {
  available: boolean;
  biometryType: 'TouchID' | 'FaceID' | 'Biometrics' | null;
  error?: string;
}

export async function checkBiometricsAvailability(): Promise<BiometricSensorInfo> {
  try {
    const { available, biometryType, error } =
      await rnBiometrics.isSensorAvailable();

    if (!available) {
      return {
        available: false,
        biometryType: null,
        error,
      };
    }

    let normalizedType: 'TouchID' | 'FaceID' | 'Biometrics' = 'Biometrics';
    if (biometryType === BiometryTypes.TouchID) {
      normalizedType = 'TouchID';
    } else if (biometryType === BiometryTypes.FaceID) {
      normalizedType = 'FaceID';
    } else if (biometryType === BiometryTypes.Biometrics) {
      normalizedType = 'Biometrics';
    }

    return {
      available: true,
      biometryType: normalizedType,
    };
  } catch (err: any) {
    return {
      available: false,
      biometryType: null,
      error: err?.message || 'Error checking biometric sensor',
    };
  }
}

export async function authenticateWithBiometrics(
  promptMessage: string = 'Desbloquear Tudú',
  cancelButtonText: string = 'Cancelar',
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await rnBiometrics.simplePrompt({
      promptMessage,
      cancelButtonText,
    });

    return {
      success: !!result.success,
      error: result.error,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Biometric authentication cancelled or failed',
    };
  }
}
