import {MMKV} from 'react-native-mmkv';
import {AIProvider} from './types';

// Dedicated encrypted MMKV instance for sensitive API credentials
const secureStorage = new MMKV({
  id: 'tudu_secure_ai_vault',
  encryptionKey: 'tudu_secure_vault_key_2026',
});

export const getSecureApiKey = (provider: AIProvider): string | null => {
  try {
    return secureStorage.getString(`api_key_${provider}`) ?? null;
  } catch {
    return null;
  }
};

export const setSecureApiKey = (provider: AIProvider, apiKey: string): void => {
  secureStorage.set(`api_key_${provider}`, apiKey.trim());
};

export const deleteSecureApiKey = (provider: AIProvider): void => {
  secureStorage.delete(`api_key_${provider}`);
};

export const hasSecureApiKey = (provider: AIProvider): boolean => {
  const key = getSecureApiKey(provider);
  return Boolean(key && key.trim().length > 0);
};

export const maskApiKey = (apiKey: string): string => {
  if (!apiKey || apiKey.length < 8) return '••••••••';
  const prefix = apiKey.slice(0, 4);
  const suffix = apiKey.slice(-4);
  const maskLength = Math.max(4, Math.min(16, apiKey.length - 8));
  return `${prefix}${'•'.repeat(maskLength)}${suffix}`;
};
