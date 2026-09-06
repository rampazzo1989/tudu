import {Section} from '../../../scenes/home/types';

export interface SectionHeaderProps {
  section: Section;
  itemCount: number;
  onRename: (section: Section) => void;
  onDelete: (section: Section) => void;
  onMoveUp?: (section: Section) => void;
  onMoveDown?: (section: Section) => void;
  isFirst?: boolean;
  isLast?: boolean;
}
