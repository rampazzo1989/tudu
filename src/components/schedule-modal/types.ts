import { TuduViewModel } from "../../scenes/home/types";

export type ScheduleModalProps = {
    isVisible: boolean;
    currentDate?: Date;
    onModalClose: () => void;
    onSchedule: (date: Date, schedulingTudu?: TuduViewModel) => void;
}

export type ScheduleOptionsProps = Omit<ScheduleModalProps, 'isVisible' | 'onModalClose'> & {
    onPressNextDays: () => void;
    onPressDate: () => void;
}