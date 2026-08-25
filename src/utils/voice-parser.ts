import { RecurrenceType } from '../scenes/home/types';

export interface ParsedVoiceResult {
  cleanedText: string;
  dueDate?: Date;
  hasTime?: boolean;
  recurrence?: RecurrenceType;
  starred?: boolean;
}

const getNextDayOfWeek = (targetDay: number, forceNextWeek = false): Date => {
  const date = new Date();
  const currentDay = date.getDay();
  let daysUntil = (targetDay + 7 - currentDay) % 7;
  if (daysUntil === 0 && forceNextWeek) {
    daysUntil = 7;
  } else if (daysUntil === 0) {
    daysUntil = 0;
  }
  date.setDate(date.getDate() + daysUntil);
  return date;
};

// Helper to create a regex that matches terms surrounded by whitespace, punctuation or string boundaries
const makeTermRegex = (pattern: string, flags = 'i') =>
  new RegExp(`(?:^|[\\s,.;!?])(${pattern})(?=[\\s,.;!?]|$)`, flags);

/**
 * Parses natural spoken voice input to extract task label, due date, time, recurrence and priority.
 */
export function parseVoiceInput(text: string): ParsedVoiceResult {
  if (!text || typeof text !== 'string') {
    return { cleanedText: '' };
  }

  let raw = text.trim();
  let dueDate: Date | undefined;
  let hasTime = false;
  let recurrence: RecurrenceType | undefined;
  let starred = false;

  // 1. Priority / Starred
  const starRegex = makeTermRegex('importante|favorito|favorita|urgente|com\\s+estrela|starred|important');
  if (starRegex.test(raw)) {
    starred = true;
    raw = raw.replace(starRegex, ' ').trim();
  }

  // 2. Recurrence
  const dailyRegex = makeTermRegex('todo\\s+dia|todos\\s+os\\s+dias|diariamente|di[aá]rio|diario|daily|every\\s+day|todos\\s+los\\s+d[ií]as|ogni\\s+giorno');
  const weeklyRegex = makeTermRegex('toda\\s+semana|todas\\s+as\\s+semanas|semanalmente|semanal|weekly|every\\s+week|todas\\s+las\\s+semanas|ogni\\s+settimana');
  const monthlyRegex = makeTermRegex('todo\\s+m[eê]s|todos\\s+os\\s+meses|mensalmente|mensal|monthly|every\\s+month|todos\\s+los\\s+meses|ogni\\s+mese');
  const yearlyRegex = makeTermRegex('todo\\s+ano|todos\\s+os\\s+anos|anualmente|anual|yearly|every\\s+year|todos\\s+los\\s+a[nñ]os|ogni\\s+anno');

  if (dailyRegex.test(raw)) {
    recurrence = 'daily';
    dueDate ||= new Date();
    raw = raw.replace(dailyRegex, ' ').trim();
  } else if (weeklyRegex.test(raw)) {
    recurrence = 'weekly';
    dueDate ||= new Date();
    raw = raw.replace(weeklyRegex, ' ').trim();
  } else if (monthlyRegex.test(raw)) {
    recurrence = 'monthly';
    dueDate ||= new Date();
    raw = raw.replace(monthlyRegex, ' ').trim();
  } else if (yearlyRegex.test(raw)) {
    recurrence = 'yearly';
    dueDate ||= new Date();
    raw = raw.replace(yearlyRegex, ' ').trim();
  }

  // 3. Relative Dates
  const dayAfterTomorrowRegex = makeTermRegex('depois\\s+de\\s+amanh[aã]|day\\s+after\\s+tomorrow|pasado\\s+ma[nñ]ana|dopodomani');
  const tomorrowRegex = makeTermRegex('amanh[aã]|tomorrow|ma[nñ]ana|domani');
  const todayRegex = makeTermRegex('hoje|today|hoy|oggi');

  if (dayAfterTomorrowRegex.test(raw)) {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    dueDate = d;
    raw = raw.replace(dayAfterTomorrowRegex, ' ').trim();
  } else if (tomorrowRegex.test(raw)) {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    dueDate = d;
    raw = raw.replace(tomorrowRegex, ' ').trim();
  } else if (todayRegex.test(raw)) {
    dueDate = new Date();
    raw = raw.replace(todayRegex, ' ').trim();
  }

  // 4. Days of the week
  // Sunday (0), Monday (1), Tuesday (2), Wednesday (3), Thursday (4), Friday (5), Saturday (6)
  const weekdays: { regex: RegExp; day: number }[] = [
    { regex: makeTermRegex('(?:no\\s+)?(?:pr[oó]ximo\\s+)?domingo|(?:next\\s+)?sunday|(?:pr[oó]ximo\\s+)?domenica'), day: 0 },
    { regex: makeTermRegex('(?:na\\s+)?(?:pr[oó]xima\\s+)?segunda(?:-feira)?|(?:next\\s+)?monday|(?:pr[oó]ximo\\s+)?lunes|(?:pr[oó]ximo\\s+)?luned[iì]'), day: 1 },
    { regex: makeTermRegex('(?:na\\s+)?(?:pr[oó]xima\\s+)?ter[cç]a(?:-feira)?|(?:next\\s+)?tuesday|(?:pr[oó]ximo\\s+)?martes|(?:pr[oó]ximo\\s+)?marted[iì]'), day: 2 },
    { regex: makeTermRegex('(?:na\\s+)?(?:pr[oó]xima\\s+)?quarta(?:-feira)?|(?:next\\s+)?wednesday|(?:pr[oó]ximo\\s+)?mi[eé]rcoles|(?:pr[oó]ximo\\s+)?mercoled[iì]'), day: 3 },
    { regex: makeTermRegex('(?:na\\s+)?(?:pr[oó]xima\\s+)?quinta(?:-feira)?|(?:next\\s+)?thursday|(?:pr[oó]ximo\\s+)?jueves|(?:pr[oó]ximo\\s+)?gioved[iì]'), day: 4 },
    { regex: makeTermRegex('(?:na\\s+)?(?:pr[oó]xima\\s+)?sexta(?:-feira)?|(?:next\\s+)?friday|(?:pr[oó]ximo\\s+)?viernes|(?:pr[oó]ximo\\s+)?venerd[iì]'), day: 5 },
    { regex: makeTermRegex('(?:no\\s+)?(?:pr[oó]ximo\\s+)?s[aá]bado|(?:next\\s+)?saturday|(?:pr[oó]ximo\\s+)?s[aá]bato'), day: 6 },
  ];

  if (!dueDate) {
    for (const item of weekdays) {
      if (item.regex.test(raw)) {
        dueDate = getNextDayOfWeek(item.day, true);
        raw = raw.replace(item.regex, ' ').trim();
        break;
      }
    }
  }

  // 5. Time parsing
  // Matches: "às 14h30", "as 14:30", "às 14h", "às 14 horas", "at 3:30 pm", "at 14:00", "14h30", "14:30"
  const timeWithWordRegex = /(?:[aàá]s|at|a\s+las|alle)\s+(\d{1,2})(?::|h|:h)?(\d{2})?(?:\s*(horas?|hrs?|am|pm|da\s+manh[aã]|da\s+tarde|da\s+noite))?/i;
  const directTimeRegex = /(?:^|[\s,.;!?])(\d{1,2})h(\d{2})?(?=[\\s,.;!?]|$)|(?:^|[\s,.;!?])(\d{1,2}):(\d{2})(?=[\\s,.;!?]|$)/i;

  let timeMatch = raw.match(timeWithWordRegex);

  if (timeMatch) {
    const matchedStr = timeMatch[0];
    let hours = parseInt(timeMatch[1], 10);
    const minutes = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
    const modifier = timeMatch[3]?.toLowerCase();

    if (modifier) {
      if ((modifier.includes('pm') || modifier.includes('tarde') || modifier.includes('noite')) && hours < 12) {
        hours += 12;
      } else if ((modifier.includes('am') || modifier.includes('manh')) && hours === 12) {
        hours = 0;
      }
    }

    if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
      hasTime = true;
      dueDate ||= new Date();
      dueDate = new Date(dueDate);
      dueDate.setHours(hours, minutes, 0, 0);
      raw = raw.replace(matchedStr, ' ').trim();
    }
  } else {
    timeMatch = raw.match(directTimeRegex);
    if (timeMatch) {
      const matchedStr = timeMatch[0].trim();
      const hours = parseInt(timeMatch[1] || timeMatch[3], 10);
      const minutes = timeMatch[2] || timeMatch[4] ? parseInt(timeMatch[2] || timeMatch[4], 10) : 0;

      if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
        hasTime = true;
        dueDate ||= new Date();
        dueDate = new Date(dueDate);
        dueDate.setHours(hours, minutes, 0, 0);
        raw = raw.replace(matchedStr, ' ').trim();
      }
    }
  }

  // 6. Clean up residual prepositions like "para", "para o", "na", "no", "at", "on", "for", "em"
  raw = raw
    .replace(/\s+(para|para\s+o|para\s+a|na|no|em|de|for|at|on|il|per)\s*$/i, '')
    .replace(/^\s*(para|para\s+o|para\s+a|na|no|em|lembrar\s+de|lembrete\s+de|lembrar)\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim();

  // If text became completely empty from date keywords (e.g. user just said "amanhã às 14h"), restore original
  const cleanedText = raw.length > 0 ? raw : text.trim();

  return {
    cleanedText,
    dueDate,
    hasTime: dueDate ? hasTime : undefined,
    recurrence,
    starred: starred || undefined,
  };
}
