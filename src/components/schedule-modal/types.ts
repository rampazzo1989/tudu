import { RecurrenceType, TuduItem, TuduViewModel } from '../../scenes/home/types';

export type ScheduleModalProps = {
    isVisible: boolean;
    currentDate?: Date;
    hasTimeInitial?: boolean;
    currentRecurrence?: RecurrenceType;
    onModalClose: () => void;
    onSchedule: (
      date: Date,
      hasTime?: boolean,
      recurrence?: RecurrenceType,
      addToGoogleCalendar?: boolean,
      schedulingTudu?: TuduViewModel,
    ) => void;
    tuduTitle?: string;
    tuduNotes?: string;
    listName?: string;
    tudu?: TuduViewModel | TuduItem;
}

export type ScheduleOptionsProps = {
    hasTime: boolean;
    onToggleHasTime: (val: boolean) => void;
    recurrence?: RecurrenceType;
    onSelectRecurrence: (recurrence?: RecurrenceType) => void;
    onSchedule: (date: Date) => void;
    onPressNextDays: () => void;
    onPressDate: () => void;
    currentDate?: Date;
    currentTime?: Date;
};