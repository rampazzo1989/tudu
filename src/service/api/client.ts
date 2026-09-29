import { Platform } from 'react-native';
import { getRecoil, setRecoil } from 'recoil-nexus';
import {
  paywallModalVisibleState,
  userSessionState,
} from '../../state/atoms';

// Default development host per platform
const DEV_API_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

export const API_BASE_URL = __DEV__
  ? DEV_API_URL
  : 'https://api.tudu.app'; // Production URL

export class ApiError extends Error {
  status: number;
  code?: string;
  data?: any;

  constructor(message: string, status: number, code?: string, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.data = data;
  }
}

interface RequestOptions {
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

export async function apiRequest<T = any>(
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any,
  options?: RequestOptions,
): Promise<T> {
  const url = `${API_BASE_URL.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
  let session = getRecoil(userSessionState);

  // In development, auto-login if token is missing and not already calling auth endpoint
  if (!session?.token && __DEV__ && !path.includes('auth/')) {
    try {
      const { AuthService } = require('../auth/auth-service');
      await AuthService.devLogin();
      session = getRecoil(userSessionState);
    } catch {
      // Backend might be offline or starting up; proceed without token
    }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options?.headers || {}),
  };

  if (session?.token) {
    headers['Authorization'] = `Bearer ${session.token}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    signal: options?.signal,
  });

  const responseData = await response.json().catch(() => ({}));

  if (!response.ok) {
    // 403 Forbidden with SUBSCRIPTION_REQUIRED -> automatically trigger Paywall Modal
    if (response.status === 403 && responseData?.code === 'SUBSCRIPTION_REQUIRED') {
      setRecoil(paywallModalVisibleState, true);
    }

    // 401 Unauthorized -> clear token
    if (response.status === 401) {
      setRecoil(userSessionState, prev => ({ ...prev, token: null }));
    }

    throw new ApiError(
      responseData?.message || `API Error (${response.status})`,
      response.status,
      responseData?.code,
      responseData,
    );
  }

  return responseData as T;
}
