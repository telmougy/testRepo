import { test, expect } from '@playwright/test';
import { isAnagram } from '../src/isAnagram.js';

test.describe('isAnagram — default policies (documented behavior)', () => {
  test('is case-sensitive by default', () => {
    expect(isAnagram('Listen', 'Silent')).toBe(false);
  });

  test('counts whitespace as characters by default', () => {
    expect(isAnagram('moon starer', 'moonstarer')).toBe(false);
  });

  test('counts punctuation as characters by default', () => {
    expect(isAnagram('a-b', 'ab-')).toBe(true);
    expect(isAnagram('a-b', 'ab')).toBe(false);
  });
});

test.describe('isAnagram — options.ignoreCase', () => {
  test('treats letters case-insensitively when enabled', () => {
    expect(isAnagram('Listen', 'Silent', { ignoreCase: true })).toBe(true);
  });

  test('still rejects non-anagrams when enabled', () => {
    expect(isAnagram('Hello', 'World', { ignoreCase: true })).toBe(false);
  });
});

test.describe('isAnagram — options.ignoreWhitespace', () => {
  test('ignores spaces when enabled', () => {
    expect(isAnagram('moon starer', 'moonstarer', { ignoreWhitespace: true })).toBe(true);
  });

  test('ignores tabs, newlines, and unicode spaces when enabled', () => {
    expect(isAnagram('a\tb\nc', 'abc ', { ignoreWhitespace: true })).toBe(true);
  });

  test('strings differing only in whitespace placement match when enabled', () => {
    expect(isAnagram('  ab', 'a b ', { ignoreWhitespace: true })).toBe(true);
  });
});

test.describe('isAnagram — options.ignorePunctuation', () => {
  test('ignores punctuation marks when enabled', () => {
    expect(isAnagram("madami'madam", 'madamimadam,', { ignorePunctuation: true })).toBe(true);
  });

  test('does not ignore letters or digits when enabled', () => {
    expect(isAnagram('ab1', 'ab2', { ignorePunctuation: true })).toBe(false);
  });
});

test.describe('isAnagram — options.normalizeUnicode', () => {
  test('composed and decomposed forms differ by default', () => {
    expect(isAnagram('caf\u00e9', 'cafe\u0301')).toBe(false);
  });

  test('composed and decomposed forms match when enabled (NFC)', () => {
    expect(isAnagram('caf\u00e9', 'cafe\u0301', { normalizeUnicode: true })).toBe(true);
  });

  test('compatibility forms match only under NFKC', () => {
    // U+FB01 LATIN SMALL LIGATURE FI vs "fi"
    expect(isAnagram('ﬁ', 'fi', { normalizeUnicode: true })).toBe(false);
    expect(isAnagram('ﬁ', 'fi', { normalizeUnicode: 'NFKC' })).toBe(true);
  });
});

test.describe('isAnagram — combined options', () => {
  test('classic phrase anagram with ignoreCase + ignoreWhitespace', () => {
    expect(
      isAnagram('Astronomer', 'Moon starer', { ignoreCase: true, ignoreWhitespace: true }),
    ).toBe(true);
  });

  test('full sentence anagram with all text options', () => {
    expect(
      isAnagram("Madam, I'm Adam", 'madamimadam', {
        ignoreCase: true,
        ignoreWhitespace: true,
        ignorePunctuation: true,
      }),
    ).toBe(true);
  });

  test('explicit false flags behave like defaults', () => {
    expect(
      isAnagram('Listen', 'Silent', {
        ignoreCase: false,
        ignoreWhitespace: false,
        ignorePunctuation: false,
      }),
    ).toBe(false);
  });
});
