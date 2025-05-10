export type ScheduleModalProps = {
    isVisible: boolean;
    onModalClose: () => void;
    onSchedule: (date: Date) => void;
}