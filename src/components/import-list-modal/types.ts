import { ImportListPreviewInfo } from '../../service/list-sharing/types';

export interface ImportListModalProps {
  visible: boolean;
  preview: ImportListPreviewInfo | null;
  onConfirmImport: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}
