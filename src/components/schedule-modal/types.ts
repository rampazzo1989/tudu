import { TuduViewModel } from "../../scenes/home/types";

export type ScheduleModalProps = {
    isVisible: boolean;
    currentDate?: Date;
    hasTimeInitial?: boolean;
    onModalClose: () => void;
    onSchedule: (date: Date, hasTime?: boolean, schedulingTudu?: TuduViewModel) => void;
}

export type ScheduleOptionsProps = {
    hasTime: boolean;
    onToggleHasTime: (val: boolean) => void;
    onSchedule: (date: Date) => void;
    onPressNextDays: () => void;
    onPressDate: () => void;
}