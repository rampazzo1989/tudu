import { generateSalt, hashPin, verifyPin } from '../src/service/security/crypto';

describe('Security Crypto Service', () => {
  it('should generate unique salts of expected length', () => {
    const salt1 = generateSalt(16);
    const salt2 = generateSalt(16);

    expect(salt1).toBeDefined();
    expect(salt1.length).toBe(16);
    expect(salt2.length).toBe(16);
    expect(salt1).not.toBe(salt2);
  });

  it('should hash a numeric PIN deterministically with given salt', () => {
    const pin = '1234';
    const salt = 'testsalt123456';

    const hash1 = hashPin(pin, salt);
    const hash2 = hashPin(pin, salt);

    expect(hash1).toBe(hash2);
    expect(typeof hash1).toBe('string');
    expect(hash1.length).toBe(64); // SHA-256 hex length
  });

  it('should verify a valid PIN successfully', () => {
    const pin = '5678';
    const salt = generateSalt();
    const hash = hashPin(pin, salt);

    expect(verifyPin(pin, hash, salt)).toBe(true);
    expect(verifyPin('0000', hash, salt)).toBe(false);
    expect(verifyPin('5679', hash, salt)).toBe(false);
    expect(verifyPin('567', hash, salt)).toBe(false);
  });

  it('should return false if hash or salt is null/empty', () => {
    expect(verifyPin('1234', null, 'salt')).toBe(false);
    expect(verifyPin('1234', 'hash', null)).toBe(false);
    expect(verifyPin('1234', null, null)).toBe(false);
  });
});
