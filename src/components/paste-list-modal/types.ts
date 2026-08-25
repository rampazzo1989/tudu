export interface PasteListModalProps {
  visible: boolean;
  onRequestClose: () => void;
  onListCreated?: (listId: string, listTitle: string) => void;
  onOpenAISettings?: () => void;
}
