export interface ReorderResultSection {
  title: string;
  order: number;
}

export interface ReorderResultItem {
  label: string;
  sectionTitle?: string;
}

export interface ReorderApplyPayload {
  sections?: ReorderResultSection[];
  reorderedItems: ReorderResultItem[];
  orderingPrompt?: string;
}

export interface ReorderPromptModalProps {
  visible: boolean;
  listName?: string;
  initialPrompt?: string;
  currentItems: string[];
  currentSections?: string[];
  onApplyReorder: (payload: ReorderApplyPayload) => Promise<void> | void;
  onRequestClose: () => void;
  onOpenAISettings?: () => void;
}
