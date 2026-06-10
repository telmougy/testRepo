import { test, expect } from '@playwright/test';
import { isAnagram } from '../src/isAnagram.js';

test.describe('isAnagram — core behavior', () => {
  test('returns true for a classic anagram pair', () => {
    expect(isAnagram('listen', 'silent')).toBe(true);
  });

  test('returns false for unrelated strings of equal length', () => {
    expect(isAnagram('hello', 'world')).toBe(false);
  });

  test('returns false when lengths differ', () => {
    expect(isAnagram('abc', 'abcd')).toBe(false);
  });

  test('returns false when characters match but multiplicities differ', () => {
    expect(isAnagram('aab', 'abb')).toBe(false);
  });

  test('returns true for identical strings', () => {
    expect(isAnagram('same', 'same')).toBe(true);
  });

  test('returns true for two empty strings', () => {
    expect(isAnagram('', '')).toBe(true);
  });

  test('returns false for empty vs non-empty string', () => {
    expect(isAnagram('', 'a')).toBe(false);
  });
});
