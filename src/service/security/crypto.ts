/* eslint-disable no-bitwise, curly */
/**
 * Crypto utility for App Lock PIN hashing and verification
 * Uses SHA-256 with a random salt per device.
 */

// Simple, fast and standard pure TypeScript SHA-256 implementation
function sha256(ascii: string): string {
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = 'length';
  let i = 0;
  let j = 0;
  let result = '';

  const words: number[] = [];
  const asciiBitLength = ascii[lengthProperty] * 8;

  let hash: number[] = [];
  const k: number[] = [];
  let primeCounter = 0;

  const isPrime = (n: number) => {
    for (let factor = 2; factor * factor <= n; factor++) {
      if (n % factor === 0) return false;
    }
    return true;
  };

  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (isPrime(candidate)) {
      if (primeCounter < 8) {
        hash[primeCounter] = (mathPow(candidate, 1 / 2) * maxWord) | 0;
      }
      k[primeCounter] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
      primeCounter++;
    }
  }

  words[asciiBitLength >> 5] |= 0x80 << (24 - (asciiBitLength % 32));
  words[(((asciiBitLength + 64) >> 9) << 4) + 15] = asciiBitLength;

  for (i = 0; i < ascii[lengthProperty]; i++) {
    words[i >> 2] |= ascii.charCodeAt(i) << ((3 - (i % 4)) * 8);
  }

  for (j = 0; j < words[lengthProperty]; j += 16) {
    const w = words.slice(j, j + 16);
    const oldHash = [...hash];

    for (i = 0; i < 64; i++) {
      let w15 = w[i - 15];
      let w2 = w[i - 2];

      const s0 =
        ((w15 >>> 7) | (w15 << (32 - 7))) ^
        ((w15 >>> 18) | (w15 << (32 - 18))) ^
        (w15 >>> 3);
      const s1 =
        ((w2 >>> 17) | (w2 << (32 - 17))) ^
        ((w2 >>> 19) | (w2 << (32 - 19))) ^
        (w2 >>> 10);

      w[i] =
        i < 16
          ? w[i] || 0
          : ((w[i - 16] + s0 + (w[i - 7] || 0) + s1) | 0) || 0;

      const a = hash[0];
      const e = hash[4];

      const s1e =
        ((e >>> 6) | (e << (32 - 6))) ^
        ((e >>> 11) | (e << (32 - 11))) ^
        ((e >>> 25) | (e << (32 - 25)));
      const ch = (e & hash[5]) ^ (~e & hash[6]);
      const temp1 = (hash[7] + s1e + ch + k[i] + w[i]) | 0;

      const s0a =
        ((a >>> 2) | (a << (32 - 2))) ^
        ((a >>> 13) | (a << (32 - 13))) ^
        ((a >>> 22) | (a << (32 - 22)));
      const maj = (a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]);
      const temp2 = (s0a + maj) | 0;

      hash = [
        (temp1 + temp2) | 0,
        hash[0],
        hash[1],
        hash[2],
        (hash[3] + temp1) | 0,
        hash[4],
        hash[5],
        hash[6],
      ];
    }

    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (let b = 3; b >= 0; b--) {
      const byte = (hash[i] >> (b * 8)) & 255;
      result += (byte < 16 ? '0' : '') + byte.toString(16);
    }
  }

  return result;
}

export function generateSalt(length: number = 16): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function hashPin(pin: string, salt: string): string {
  return sha256(`tudu-pin:${salt}:${pin}`);
}

export function verifyPin(
  enteredPin: string,
  storedHash: string | null,
  salt: string | null,
): boolean {
  if (!storedHash || !salt) return false;
  const computedHash = hashPin(enteredPin, salt);
  return computedHash === storedHash;
}
