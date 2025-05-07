import { TuduViewModel } from "../../scenes/home/types";

export interface SendToTodayModalProps {
  tudu: TuduViewModel | null;
  onUpdateTudu: (tudu: TuduViewModel) => void;
  onClose: () => void;
}