/**
 * Unit tests for validation helpers
 */

import { validateEmail, validateTodoTitle, validatePassword } from '../validation';

describe('validateEmail', () => {
  it('should return true for valid email addresses', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    expect(validateEmail('user+tag@example.com')).toBe(true);
  });

  it('should return false for invalid email addresses', () => {
    expect(validateEmail('')).toBe(false);
    expect(validateEmail('invalid')).toBe(false);
    expect(validateEmail('invalid@')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
    expect(validateEmail('user@')).toBe(false);
    expect(validateEmail('user @example.com')).toBe(false);
  });
});

describe('validateTodoTitle', () => {
  it('should return valid for proper todo titles', () => {
    const result = validateTodoTitle('Buy groceries');
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should reject empty titles', () => {
    const result = validateTodoTitle('');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Title cannot be empty');
  });

  it('should reject whitespace-only titles', () => {
    const result = validateTodoTitle('   ');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Title cannot be empty');
  });

  it('should reject titles shorter than 3 characters', () => {
    const result = validateTodoTitle('ab');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Title must be at least 3 characters');
  });

  it('should reject titles longer than 200 characters', () => {
    const longTitle = 'a'.repeat(201);
    const result = validateTodoTitle(longTitle);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Title cannot exceed 200 characters');
  });

  it('should accept titles at boundary lengths', () => {
    const minTitle = 'abc';
    const maxTitle = 'a'.repeat(200);
    
    expect(validateTodoTitle(minTitle).valid).toBe(true);
    expect(validateTodoTitle(maxTitle).valid).toBe(true);
  });
});

describe('validatePassword', () => {
  it('should return valid for proper passwords', () => {
    const result = validatePassword('password123');
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should reject empty passwords', () => {
    const result = validatePassword('');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Password cannot be empty');
  });

  it('should reject passwords shorter than 6 characters', () => {
    const result = validatePassword('12345');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Password must be at least 6 characters');
  });

  it('should accept passwords at minimum length', () => {
    const result = validatePassword('123456');
    expect(result.valid).toBe(true);
  });
});
