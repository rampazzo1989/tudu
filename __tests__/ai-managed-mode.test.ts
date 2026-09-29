jest.mock('react-dom', () => ({}), { virtual: true });

const mockGetRecoil = jest.fn();
const mockSetRecoil = jest.fn();

jest.mock('recoil-nexus', () => ({
  getRecoil: (atom: any) => mockGetRecoil(atom),
  setRecoil: (atom: any, val: any) => mockSetRecoil(atom, val),
}));

jest.mock('../src/service/api/tudu-api', () => ({
  tuduApi: {
    ai: {
      suggestEmojis: jest.fn().mockResolvedValue({
        emojis: ['🍕', '🍝', '🍷'],
        providerUsed: 'deepseek',
      }),
      suggestTasks: jest.fn().mockResolvedValue({
        suggestions: ['Fazer massa', 'Comprar queijo'],
        providerUsed: 'openai',
      }),
      parseList: jest.fn().mockResolvedValue({
        result: {
          title: 'Mercado',
          items: ['Arroz', 'Feijão'],
        },
        providerUsed: 'openai',
      }),
      reorderList: jest.fn().mockResolvedValue({
        result: {
          title: 'Mercado Organizado',
          items: ['🍌 Banana', '🥛 Leite'],
          sections: [{ title: '🥦 Hortifruti', items: ['🍌 Banana'] }],
        },
        providerUsed: 'deepseek',
      }),
    },
  },
}));

import {
  suggestEmojisWithAI,
  suggestTasksWithAI,
  parseListFromTextWithAI,
  reorderListWithAI,
} from '../src/service/ai/ai-service';
import { tuduApi } from '../src/service/api/tudu-api';
import {
  aiSettingsState,
  paywallModalVisibleState,
  subscriptionState,
} from '../src/state/atoms';

describe('AI Service Mode Routing (Managed vs BYOK)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Managed Mode without Active Subscription', () => {
    beforeEach(() => {
      mockGetRecoil.mockImplementation((atom: any) => {
        if (atom === aiSettingsState) return { mode: 'managed' };
        if (atom === subscriptionState) return { isPro: false };
        return null;
      });
    });

    it('should open paywall modal and throw error for suggestEmojisWithAI', async () => {
      await expect(
        suggestEmojisWithAI('openai', { type: 'list', title: 'Restaurante Italiano' }),
      ).rejects.toThrow('SUBSCRIPTION_REQUIRED');

      expect(mockSetRecoil).toHaveBeenCalledWith(paywallModalVisibleState, true);
      expect(tuduApi.ai.suggestEmojis).not.toHaveBeenCalled();
    });

    it('should open paywall modal and throw error for suggestTasksWithAI', async () => {
      await expect(
        suggestTasksWithAI('openai', { listName: 'Receitas' }),
      ).rejects.toThrow('SUBSCRIPTION_REQUIRED');

      expect(mockSetRecoil).toHaveBeenCalledWith(paywallModalVisibleState, true);
      expect(tuduApi.ai.suggestTasks).not.toHaveBeenCalled();
    });

    it('should open paywall modal and throw error for parseListFromTextWithAI', async () => {
      await expect(
        parseListFromTextWithAI('openai', 'Itens: cafe, leite'),
      ).rejects.toThrow('SUBSCRIPTION_REQUIRED');

      expect(mockSetRecoil).toHaveBeenCalledWith(paywallModalVisibleState, true);
      expect(tuduApi.ai.parseList).not.toHaveBeenCalled();
    });

    it('should open paywall modal and throw error for reorderListWithAI', async () => {
      await expect(
        reorderListWithAI('openai', ['Arroz', 'Feijão']),
      ).rejects.toThrow('SUBSCRIPTION_REQUIRED');

      expect(mockSetRecoil).toHaveBeenCalledWith(paywallModalVisibleState, true);
      expect(tuduApi.ai.reorderList).not.toHaveBeenCalled();
    });
  });

  describe('Managed Mode with Active Subscription (Tudú Pro)', () => {
    beforeEach(() => {
      mockGetRecoil.mockImplementation((atom: any) => {
        if (atom === aiSettingsState) return { mode: 'managed' };
        if (atom === subscriptionState) return { isPro: true };
        return null;
      });
    });

    it('should route suggestEmojisWithAI to tuduApi.ai.suggestEmojis', async () => {
      const result = await suggestEmojisWithAI('openai', {
        type: 'list',
        title: 'Comida Italiana Nova',
      });

      expect(result).toEqual(['🍕', '🍝', '🍷']);
      expect(tuduApi.ai.suggestEmojis).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'list',
          title: 'Comida Italiana Nova',
        }),
      );
      expect(mockSetRecoil).not.toHaveBeenCalledWith(paywallModalVisibleState, true);
    });

    it('should route suggestTasksWithAI to tuduApi.ai.suggestTasks', async () => {
      const result = await suggestTasksWithAI('openai', {
        listName: 'Cozinha',
      });

      expect(result).toEqual(['Fazer massa', 'Comprar queijo']);
      expect(tuduApi.ai.suggestTasks).toHaveBeenCalledWith(
        expect.objectContaining({
          listName: 'Cozinha',
        }),
      );
    });

    it('should route parseListFromTextWithAI to tuduApi.ai.parseList', async () => {
      const result = await parseListFromTextWithAI(
        'openai',
        'Mercado: Arroz, Feijao',
      );

      expect(result.title).toBe('Mercado');
      expect(result.items).toHaveLength(2);
      expect(tuduApi.ai.parseList).toHaveBeenCalledWith(
        expect.objectContaining({
          rawText: 'Mercado: Arroz, Feijao',
        }),
      );
    });

    it('should route reorderListWithAI to tuduApi.ai.reorderList', async () => {
      const result = await reorderListWithAI(
        'openai',
        ['Leite', 'Banana'],
        ['Hortifruti'],
        undefined,
        'Mercado',
      );

      expect(result.title).toBe('Mercado Organizado');
      expect(result.items).toEqual(['🍌 Banana', '🥛 Leite']);
      expect(result.sections).toHaveLength(1);
      expect(tuduApi.ai.reorderList).toHaveBeenCalledWith(
        expect.objectContaining({
          items: ['Leite', 'Banana'],
          currentSections: ['Hortifruti'],
          listName: 'Mercado',
        }),
      );
    });

    it('should route to managed cloud API even if mode was byok when user is Pro', async () => {
      mockGetRecoil.mockImplementation((atom: any) => {
        if (atom === aiSettingsState) return { mode: 'byok' };
        if (atom === subscriptionState) return { isPro: true };
        return null;
      });

      const result = await suggestEmojisWithAI('openai', {
        type: 'list',
        title: 'Viagem de Ferias',
      });

      expect(result).toEqual(['🍕', '🍝', '🍷']);
      expect(tuduApi.ai.suggestEmojis).toHaveBeenCalled();
    });
  });
});
