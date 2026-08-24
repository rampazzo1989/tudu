let isLockSuppressed = false;
let suppressionTimeout: NodeJS.Timeout | null = null;

export const suppressAppLock = (durationMs: number = 60000): void => {
  isLockSuppressed = true;
  if (suppressionTimeout) {
    clearTimeout(suppressionTimeout);
  }
  suppressionTimeout = setTimeout(() => {
    isLockSuppressed = false;
    suppressionTimeout = null;
  }, durationMs);
};

export const resumeAppLock = (delayMs: number = 1500): void => {
  if (suppressionTimeout) {
    clearTimeout(suppressionTimeout);
  }
  suppressionTimeout = setTimeout(() => {
    isLockSuppressed = false;
    suppressionTimeout = null;
  }, delayMs);
};

export const isAppLockSuppressed = (): boolean => isLockSuppressed;

export const withAppLockSuppressed = async <T>(
  action: () => Promise<T>,
  resumeDelayMs: number = 1500,
): Promise<T> => {
  suppressAppLock();
  try {
    return await action();
  } finally {
    resumeAppLock(resumeDelayMs);
  }
};
