export interface AISuggestionsModalProps {
  isVisible: boolean;
  listName?: string;
  existingTasks?: string[];
  seedInput?: string;
  onClose: () => void;
  onConfirm: (selectedTasks: string[]) => void;
  onOpenAISettings?: () => void;
}
