jest.mock('react-native-tts', () => {
  const listeners: Record<string, Function> = {};
  return {
    getInitStatus: jest.fn().mockResolvedValue('success'),
    setDefaultLanguage: jest.fn().mockResolvedValue('success'),
    setDefaultRate: jest.fn().mockResolvedValue('success'),
    setDefaultPitch: jest.fn().mockResolvedValue('success'),
    setIgnoreSilentSwitch: jest.fn().mockResolvedValue(true),
    setDucking: jest.fn().mockResolvedValue('success'),
    speak: jest.fn(),
    stop: jest.fn(),
    addEventListener: jest.fn((event: string, handler: Function) => {
      listeners[event] = handler;
      return {
        remove: jest.fn(() => {
          delete listeners[event];
        }),
      };
    }),
  };
});

jest.mock('../src/i18n', () => ({
  language: 'pt-BR',
  t: (key: string, options?: any) => {
    if (key === 'incomingCall.tts.testMessage') {
      return 'Olá! Este é um teste de ligação do Tudú. Suas notificações por chamada com voz offline estão funcionando com sucesso!';
    }
    if (key === 'incomingCall.tts.messageWithList') {
      return `Atenção! Lembrete da sua lista ${options?.list}: ${options?.task}.`;
    }
    if (key === 'incomingCall.tts.message') {
      return `Atenção! Lembrete do Tudú para agora: ${options?.task}.`;
    }
    return options?.defaultValue || key;
  },
}));

import Tts from 'react-native-tts';
import { ttsService } from '../src/service/tts/ttsService';

describe('TtsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize TTS engine with default rate and pitch', async () => {
    const initialized = await ttsService.init(0.5, 1.0);
    expect(initialized).toBe(true);
    expect(Tts.getInitStatus).toHaveBeenCalled();
    expect(Tts.setDefaultLanguage).toHaveBeenCalledWith('pt-BR');
    expect(Tts.setDefaultRate).toHaveBeenCalledWith(0.5);
    expect(Tts.setDefaultPitch).toHaveBeenCalledWith(1.0);
  });

  it('should format task message with list name', () => {
    const message = ttsService.formatTaskMessage('Comprar pão', 'Mercado');
    expect(message).toBe('Atenção! Lembrete da sua lista Mercado: Comprar pão.');
  });

  it('should format task message without list name', () => {
    const message = ttsService.formatTaskMessage('Fazer caminhada', 'Unlisted');
    expect(message).toBe('Atenção! Lembrete do Tudú para agora: Fazer caminhada.');
  });

  it('should format task message stripping emojis from task and list', () => {
    const message = ttsService.formatTaskMessage('🥦 Comprar brócolis 🍎', '🛒 Compras de Mercado');
    expect(message).toBe('Atenção! Lembrete da sua lista Compras de Mercado: Comprar brócolis.');
  });

  it('should format task message without list name and strip emoji from task', () => {
    const message = ttsService.formatTaskMessage('🏃‍♂️ Fazer caminhada matinal', 'Unlisted');
    expect(message).toBe('Atenção! Lembrete do Tudú para agora: Fazer caminhada matinal.');
  });

  it('should format test message when isTest is true', () => {
    const message = ttsService.formatTaskMessage('Qualquer coisa', 'Geral', true);
    expect(message).toContain('teste de ligação do Tudú');
  });

  it('should call Tts.speak when speak is invoked and strip emojis from text', async () => {
    await ttsService.speak('🔔 Olá mundo 🚀');
    expect(Tts.stop).toHaveBeenCalled();
    expect(Tts.speak).toHaveBeenCalledWith('Olá mundo');
  });

  it('should call Tts.stop when stop is invoked', () => {
    ttsService.stop();
    expect(Tts.stop).toHaveBeenCalled();
  });
});
