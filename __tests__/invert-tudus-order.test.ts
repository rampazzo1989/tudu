jest.mock('react-dom', () => ({}), { virtual: true });

import ptBR from '../src/locale/pt-BR.json';
import en from '../src/locale/en.json';
import es from '../src/locale/es.json';
import itLocale from '../src/locale/it.json';
import { TuduViewModel } from '../src/scenes/home/types';

describe('Invert Tudus Order Feature Tests', () => {
  describe('i18n menuLabels.reverseOrder', () => {
    it('should have reverseOrder defined in all supported locales', () => {
      expect(ptBR.menuLabels.reverseOrder).toBe('Inverter ordem');
      expect(en.menuLabels.reverseOrder).toBe('Reverse order');
      expect(es.menuLabels.reverseOrder).toBe('Invertir orden');
      expect(itLocale.menuLabels.reverseOrder).toBe('Inverti ordine');
    });
  });

  describe('Active Tudus Inversion Logic', () => {
    const invertActiveTudus = (tudus: TuduViewModel[]): TuduViewModel[] => {
      const activeTudus = tudus.filter(x => !x.done);
      if (activeTudus.length <= 1) {
        return tudus;
      }
      const reversedActive = [...activeTudus].reverse();
      const doneTudus = tudus.filter(x => x.done);
      return [...reversedActive, ...doneTudus];
    };

    it('should reverse the order of all active tudus when there are no completed tudus', () => {
      const tudu1 = new TuduViewModel({ id: '1', label: 'Item 1', done: false }, 'list-1');
      const tudu2 = new TuduViewModel({ id: '2', label: 'Item 2', done: false }, 'list-1');
      const tudu3 = new TuduViewModel({ id: '3', label: 'Item 3', done: false }, 'list-1');

      const original = [tudu1, tudu2, tudu3];
      const result = invertActiveTudus(original);

      expect(result.map(t => t.id)).toEqual(['3', '2', '1']);
      expect(result.map(t => t.label)).toEqual(['Item 3', 'Item 2', 'Item 1']);
    });

    it('should only reverse active tudus and keep completed tudus unchanged at the bottom', () => {
      const tudu1 = new TuduViewModel({ id: '1', label: 'Item 1 (Active)', done: false }, 'list-1');
      const tudu2 = new TuduViewModel({ id: '2', label: 'Item 2 (Active)', done: false }, 'list-1');
      const tudu3 = new TuduViewModel({ id: '3', label: 'Item 3 (Active)', done: false }, 'list-1');
      const done1 = new TuduViewModel({ id: '4', label: 'Done 1', done: true }, 'list-1');
      const done2 = new TuduViewModel({ id: '5', label: 'Done 2', done: true }, 'list-1');

      const original = [tudu1, tudu2, tudu3, done1, done2];
      const result = invertActiveTudus(original);

      expect(result.map(t => t.id)).toEqual(['3', '2', '1', '4', '5']);
      expect(result.map(t => t.done)).toEqual([false, false, false, true, true]);
    });

    it('should preserve all metadata (starred, dueDate, recurrence) during reversal', () => {
      const date = new Date('2026-08-25T10:00:00.000Z');
      const tudu1 = new TuduViewModel(
        { id: '1', label: 'Item 1', done: false, starred: true, dueDate: date, recurrence: 'daily' },
        'list-1',
      );
      const tudu2 = new TuduViewModel(
        { id: '2', label: 'Item 2', done: false, starred: false },
        'list-1',
      );

      const result = invertActiveTudus([tudu1, tudu2]);

      expect(result[0].id).toBe('2');
      expect(result[1].id).toBe('1');
      expect(result[1].starred).toBe(true);
      expect(result[1].dueDate).toEqual(date);
      expect(result[1].recurrence).toBe('daily');
    });

    it('should return the original list if there is only 1 active item', () => {
      const tudu1 = new TuduViewModel({ id: '1', label: 'Single Active', done: false }, 'list-1');
      const done1 = new TuduViewModel({ id: '2', label: 'Done 1', done: true }, 'list-1');

      const original = [tudu1, done1];
      const result = invertActiveTudus(original);

      expect(result.map(t => t.id)).toEqual(['1', '2']);
    });

    it('should return the original list if there are no active items', () => {
      const done1 = new TuduViewModel({ id: '1', label: 'Done 1', done: true }, 'list-1');
      const done2 = new TuduViewModel({ id: '2', label: 'Done 2', done: true }, 'list-1');

      const original = [done1, done2];
      const result = invertActiveTudus(original);

      expect(result.map(t => t.id)).toEqual(['1', '2']);
    });

    it('should return an empty list if input is empty', () => {
      const result = invertActiveTudus([]);
      expect(result).toEqual([]);
    });
  });
});
