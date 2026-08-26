import { Linking } from 'react-native';
import { RecurrenceType } from '../scenes/home/types';

export interface GoogleCalendarEventOptions {
  title: string;
  date: Date;
  hasTime?: boolean;
  recurrence?: RecurrenceType;
  notes?: string;
  listName?: string;
}

const pad = (num: number): string => (num < 10 ? `0${num}` : `${num}`);

const formatDateToUtcIso = (date: Date): string => {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
};

const formatDateToAllDayString = (date: Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
};

export const buildGoogleCalendarUrl = ({
  title,
  date,
  hasTime = false,
  recurrence,
  notes,
  listName,
}: GoogleCalendarEventOptions): string => {
  const castDate = typeof date === 'string' ? new Date(date) : date;
  const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';

  const params: string[] = [];

  // Title
  const eventTitle = title?.trim() || 'tudú';
  params.push(`text=${encodeURIComponent(eventTitle)}`);

  // Dates
  if (hasTime) {
    const startDateUtc = formatDateToUtcIso(castDate);
    // Default duration: 1 hour
    const endDate = new Date(castDate.getTime() + 60 * 60 * 1000);
    const endDateUtc = formatDateToUtcIso(endDate);
    params.push(`dates=${startDateUtc}/${endDateUtc}`);
  } else {
    // All-day event: start day to next day in YYYYMMDD
    const startStr = formatDateToAllDayString(castDate);
    const nextDay = new Date(castDate);
    nextDay.setDate(nextDay.getDate() + 1);
    const endStr = formatDateToAllDayString(nextDay);
    params.push(`dates=${startStr}/${endStr}`);
  }

  // Description / Details
  const detailsParts: string[] = [];
  if (notes && notes.trim()) {
    detailsParts.push(notes.trim());
  }
  if (listName && listName.trim()) {
    detailsParts.push(`Lista: ${listName.trim()}`);
  }
  detailsParts.push('Agendado pelo tudú');

  params.push(`details=${encodeURIComponent(detailsParts.join('\n\n'))}`);

  // Recurrence
  if (recurrence) {
    const recurrenceMap: Record<RecurrenceType, string> = {
      daily: 'RRULE:FREQ=DAILY',
      weekly: 'RRULE:FREQ=WEEKLY',
      monthly: 'RRULE:FREQ=MONTHLY',
      yearly: 'RRULE:FREQ=YEARLY',
    };
    const rrule = recurrenceMap[recurrence];
    if (rrule) {
      params.push(`recur=${encodeURIComponent(rrule)}`);
    }
  }

  return `${baseUrl}&${params.join('&')}`;
};

export const openGoogleCalendarEvent = async (
  options: GoogleCalendarEventOptions,
): Promise<boolean> => {
  try {
    const url = buildGoogleCalendarUrl(options);
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
      return true;
    } else {
      // Fallback: try opening directly
      await Linking.openURL(url);
      return true;
    }
  } catch (error) {
    console.warn('[GoogleCalendarUtils] Error opening Google Calendar:', error);
    return false;
  }
};
