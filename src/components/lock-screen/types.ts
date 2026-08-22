export interface PinPadProps {
  onDigitPress: (digit: string) => void;
  onDeletePress: () => void;
  onBiometricsPress?: () => void;
  showBiometricsButton?: boolean;
  biometricsType?: 'TouchID' | 'FaceID' | 'Biometrics' | null;
  disabled?: boolean;
}

export interface PinDotsProps {
  length?: number;
  filledCount: number;
  isError?: boolean;
}

export interface LockScreenProps {
  onUnlockSuccess?: () => void;
}
