export type ScheduleModalProps = {
    isVisible: boolean;
    onModalClose: () => void;
    onSchedule: (date: Date) => void;
}

export type ScheduleOptionsProps = Omit<ScheduleModalProps, 'isVisible'> 
& {
    onPressNextDays: () => void;
    onPressDate: () => void;
}