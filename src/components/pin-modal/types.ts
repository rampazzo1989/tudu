export type PinModalMode = 'setup' | 'change' | 'disable' | 'confirm';

export interface PinModalProps {
  visible: boolean;
  mode: PinModalMode;
  onClose: () => void;
  onSuccess: (pin?: string) => void;
}
