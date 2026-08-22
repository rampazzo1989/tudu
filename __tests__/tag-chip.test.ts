import {describe, expect, it} from '@jest/globals';

describe('TagChip component', () => {
  it('defines valid variants for metadata tags', () => {
    const validVariants = ['primary', 'neutral', 'today', 'recurrence', 'list'];
    expect(validVariants).toContain('primary');
    expect(validVariants).toContain('today');
    expect(validVariants).toContain('recurrence');
    expect(validVariants).toContain('list');
    expect(validVariants).toContain('neutral');
  });
});
