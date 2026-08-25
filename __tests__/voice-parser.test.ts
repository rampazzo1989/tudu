import { parseVoiceInput } from '../src/utils/voice-parser';

describe('Voice Parser Utility', () => {
  it('should parse a simple task without date/time', () => {
    const result = parseVoiceInput('Comprar pão e leite');
    expect(result.cleanedText).toBe('Comprar pão e leite');
    expect(result.dueDate).toBeUndefined();
    expect(result.hasTime).toBeUndefined();
    expect(result.recurrence).toBeUndefined();
  });

  it('should parse task with "amanhã"', () => {
    const result = parseVoiceInput('Comprar remédio amanhã');
    expect(result.cleanedText).toBe('Comprar remédio');
    expect(result.dueDate).toBeDefined();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(result.dueDate?.getDate()).toBe(tomorrow.getDate());
    expect(result.hasTime).toBe(false);
  });

  it('should parse task with "amanhã às 14:30"', () => {
    const result = parseVoiceInput('Dentista amanhã às 14:30');
    expect(result.cleanedText).toBe('Dentista');
    expect(result.dueDate).toBeDefined();
    expect(result.hasTime).toBe(true);
    expect(result.dueDate?.getHours()).toBe(14);
    expect(result.dueDate?.getMinutes()).toBe(30);
  });

  it('should parse task with "às 9h" and "importante"', () => {
    const result = parseVoiceInput('Reunião com diretoria hoje às 9h importante');
    expect(result.cleanedText).toBe('Reunião com diretoria');
    expect(result.dueDate).toBeDefined();
    expect(result.hasTime).toBe(true);
    expect(result.dueDate?.getHours()).toBe(9);
    expect(result.dueDate?.getMinutes()).toBe(0);
    expect(result.starred).toBe(true);
  });

  it('should parse recurrence "todo dia"', () => {
    const result = parseVoiceInput('Beber 2 litros de água todo dia');
    expect(result.cleanedText).toBe('Beber 2 litros de água');
    expect(result.recurrence).toBe('daily');
    expect(result.dueDate).toBeDefined();
  });

  it('should parse recurrence "toda semana"', () => {
    const result = parseVoiceInput('Regar as plantas toda semana');
    expect(result.cleanedText).toBe('Regar as plantas');
    expect(result.recurrence).toBe('weekly');
  });

  it('should parse recurrence "todo mês"', () => {
    const result = parseVoiceInput('Pagar aluguel todo mês');
    expect(result.cleanedText).toBe('Pagar aluguel');
    expect(result.recurrence).toBe('monthly');
  });

  it('should parse day of the week "na próxima sexta"', () => {
    const result = parseVoiceInput('Jantar em família na próxima sexta às 20h');
    expect(result.cleanedText).toBe('Jantar em família');
    expect(result.dueDate).toBeDefined();
    expect(result.dueDate?.getDay()).toBe(5); // Friday
    expect(result.hasTime).toBe(true);
    expect(result.dueDate?.getHours()).toBe(20);
  });

  it('should parse English input "buy groceries tomorrow at 3pm"', () => {
    const result = parseVoiceInput('buy groceries tomorrow at 3pm');
    expect(result.cleanedText).toBe('buy groceries');
    expect(result.dueDate).toBeDefined();
    expect(result.hasTime).toBe(true);
    expect(result.dueDate?.getHours()).toBe(15);
  });

  it('should parse Spanish input "comprar medicina mañana a las 10:00"', () => {
    const result = parseVoiceInput('comprar medicina mañana a las 10:00');
    expect(result.cleanedText).toBe('comprar medicina');
    expect(result.dueDate).toBeDefined();
    expect(result.hasTime).toBe(true);
    expect(result.dueDate?.getHours()).toBe(10);
  });

  it('should clean up leading "lembrar de" prefix', () => {
    const result = parseVoiceInput('Lembrar de comprar frutas');
    expect(result.cleanedText).toBe('comprar frutas');
  });

  it('should handle empty or invalid input', () => {
    expect(parseVoiceInput('').cleanedText).toBe('');
    expect(parseVoiceInput('   ').cleanedText).toBe('');
  });
});
