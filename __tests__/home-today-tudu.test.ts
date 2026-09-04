import { TuduViewModel } from '../src/scenes/home/types';
import { parseVoiceInput } from '../src/utils/voice-parser';

const UNLISTED_LIST_ID = 'unlisted';

describe('Home Today Tudú Quick Capture', () => {
  it('should initialize an unlisted tudu scheduled for today', () => {
    const today = new Date();
    const tudu = new TuduViewModel(
      {
        id: 'test-id',
        label: '',
        done: false,
        dueDate: today,
      },
      UNLISTED_LIST_ID,
      'unlisted',
      'Today',
    );

    expect(tudu.listId).toBe('unlisted');
    expect(tudu.origin).toBe('unlisted');
    expect(tudu.dueDate).toBeDefined();
    expect(tudu.dueDate?.toDateString()).toBe(today.toDateString());
    expect(tudu.listName).toBe('Today');
  });

  it('should keep today due date when voice input has no date override', () => {
    const defaultDate = new Date();
    const parsed = parseVoiceInput('Comprar pão de queijo');

    const tudu = new TuduViewModel(
      {
        id: 'test-id',
        label: parsed.cleanedText,
        done: false,
        dueDate: parsed.dueDate ?? defaultDate,
        hasTime: parsed.hasTime ?? false,
      },
      UNLISTED_LIST_ID,
      'unlisted',
      'Today',
    );

    expect(tudu.label).toBe('Comprar pão de queijo');
    expect(tudu.dueDate?.toDateString()).toBe(defaultDate.toDateString());
    expect(tudu.hasTime).toBe(false);
  });

  it('should override today due date when voice input contains a specific date', () => {
    const defaultDate = new Date();
    const parsed = parseVoiceInput('Pagar contas amanhã');

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tudu = new TuduViewModel(
      {
        id: 'test-id',
        label: parsed.cleanedText,
        done: false,
        dueDate: parsed.dueDate ?? defaultDate,
        hasTime: parsed.hasTime ?? false,
      },
      UNLISTED_LIST_ID,
      'unlisted',
      'Today',
    );

    expect(tudu.label).toBe('Pagar contas');
    expect(tudu.dueDate?.getDate()).toBe(tomorrow.getDate());
  });

  it('should parse time and recurrence from voice dictation', () => {
    const parsed = parseVoiceInput('Tomar remédio todos os dias às 14h30');
    expect(parsed.cleanedText).toBe('Tomar remédio');
    expect(parsed.recurrence).toBe('daily');
    expect(parsed.hasTime).toBe(true);
    expect(parsed.dueDate?.getHours()).toBe(14);
    expect(parsed.dueDate?.getMinutes()).toBe(30);
  });
});
