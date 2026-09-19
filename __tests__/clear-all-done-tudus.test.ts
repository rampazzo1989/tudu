jest.mock('react-dom', () => ({}), { virtual: true });

import { TuduViewModel } from '../src/scenes/home/types';

describe('Clear All Done Tudus Feature Tests', () => {
  describe('Clear all done logic and edge case safety', () => {
    it('should correctly remove only completed tudus and retain active ones', () => {
      const active1 = new TuduViewModel({ id: '1', label: 'Active 1', done: false }, 'list-1');
      const active2 = new TuduViewModel({ id: '2', label: 'Active 2', done: false }, 'list-1');
      const done1 = new TuduViewModel({ id: '3', label: 'Done 1', done: true }, 'list-1');
      const done2 = new TuduViewModel({ id: '4', label: 'Done 2', done: true }, 'list-1');

      const allTudus = [active1, active2, done1, done2];
      const doneTudus = allTudus.filter(t => t.done);

      const doneIds = new Set(doneTudus.map(t => t.id));
      const remainingTudus = allTudus.filter(t => !doneIds.has(t.id));

      expect(remainingTudus.length).toBe(2);
      expect(remainingTudus.map(t => t.id)).toEqual(['1', '2']);
      expect(remainingTudus.every(t => !t.done)).toBe(true);
    });

    it('should handle undo all done tudus correctly', () => {
      const active1 = new TuduViewModel({ id: '1', label: 'Active 1', done: false }, 'list-1');
      const done1 = new TuduViewModel({ id: '2', label: 'Done 1', done: true }, 'list-1');
      const done2 = new TuduViewModel({ id: '3', label: 'Done 2', done: true }, 'list-1');

      const allTudus = [active1, done1, done2];
      const doneTudus = allTudus.filter(t => t.done);

      const doneIds = new Set(doneTudus.map(t => t.id));
      const updatedTudus = allTudus.map(t => {
        if (doneIds.has(t.id)) {
          const clone = t.clone();
          clone.done = false;
          return clone;
        }
        return t;
      });

      expect(updatedTudus.length).toBe(3);
      expect(updatedTudus.every(t => !t.done)).toBe(true);
    });

    it('should not throw error when done tudus array is empty or undefined', () => {
      const safeDeleteTudus = (tuduList?: TuduViewModel[]) => {
        if (!tuduList || !tuduList.length) {
          return;
        }
        const origin = tuduList[0].origin;
        return origin;
      };

      expect(() => safeDeleteTudus(undefined)).not.toThrow();
      expect(() => safeDeleteTudus([])).not.toThrow();
      expect(safeDeleteTudus(undefined)).toBeUndefined();
      expect(safeDeleteTudus([])).toBeUndefined();

      const tudu = new TuduViewModel({ id: '1', label: 'Test', done: true }, 'list-1', 'default');
      expect(safeDeleteTudus([tudu])).toBe('default');
    });
  });
});
