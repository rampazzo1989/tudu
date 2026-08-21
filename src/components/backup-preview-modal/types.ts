import { BackupPreviewInfo } from '../../service/backup/types';

export interface BackupPreviewModalProps {
  visible: boolean;
  preview: BackupPreviewInfo | null;
  onConfirmRestore: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}
