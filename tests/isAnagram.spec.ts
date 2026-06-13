import { test, expect } from '@playwright/test';
import { isAnagram } from '../src/isAnagram.js';

test.describe('isAnagram — valid pairs', () => {
  test('returns true for a classic anagram pair', () => {
    expect(isAnagram('listen', 'silent')).toBe(true);
  });

  test('returns true for identical strings', () => {
    expect(isAnagram('same', 'same')).toBe(true);
  });
});

test.describe('isAnagram — invalid pairs', () => {
  test('returns false for unrelated strings of equal length', () => {
    expect(isAnagram('hello', 'world')).toBe(false);
  });
});

test.describe('isAnagram — edge cases', () => {
  test('two empty strings are anagrams', () => {
    expect(isAnagram('', '')).toBe(true);
  });

  test('empty vs non-empty is not an anagram', () => {
    expect(isAnagram('', 'a')).toBe(false);
  });

  test('returns false when lengths differ', () => {
    expect(isAnagram('abc', 'abcd')).toBe(false);
  });

  test('returns false when characters match but multiplicities differ', () => {
    expect(isAnagram('aab', 'abb')).toBe(false);
  });
});

test.describe('isAnagram — default policies', () => {
  test('is case-sensitive', () => {
    expect(isAnagram('Listen', 'Silent')).toBe(false);
  });

  test('counts whitespace as characters', () => {
    expect(isAnagram('moon starer', 'moonstarer')).toBe(false);
  });

  test('counts punctuation as characters', () => {
    expect(isAnagram('a-b', 'ab-')).toBe(true);
    expect(isAnagram('a-b', 'ab')).toBe(false);
  });
});

test.describe('isAnagram — Unicode', () => {
  test('emoji reordering is an anagram (astral-plane code points)', () => {
    expect(isAnagram('😀😁', '😁😀')).toBe(true);
  });

  test('different emoji of equal UTF-16 length are not anagrams', () => {
    expect(isAnagram('😀', '😁')).toBe(false);
  });

  test('non-ASCII text reordering is an anagram', () => {
    expect(isAnagram('café', 'éfac')).toBe(true);
  });
});

test.describe('isAnagram — invalid input', () => {
  const invalidValues: Array<[string, unknown]> = [
    ['null', null],
    ['undefined', undefined],
    ['number', 42],
    ['boolean', true],
    ['array', ['a', 'b']],
    ['object', { a: 1 }],
  ];

  for (const [label, value] of invalidValues) {
    test(`throws TypeError when an argument is ${label}`, () => {
      expect(() => isAnagram(value as string, 'abc')).toThrow(TypeError);
      expect(() => isAnagram('abc', value as string)).toThrow(TypeError);
    });
  }
});

test.describe('isAnagram — large input', () => {
  const targetLength = 1_000_000;
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  let original: string;
  let reversed: string;
  let nearMiss: string;

  test.beforeAll(() => {
    original = alphabet.repeat(Math.ceil(targetLength / alphabet.length)).slice(0, targetLength);
    reversed = [...original].reverse().join('');
    nearMiss = original.slice(0, -1) + '!';
  });

  test('confirms a one-million-character anagram', () => {
    expect(isAnagram(original, reversed)).toBe(true);
  });

  test('rejects a one-million-character near-miss', () => {
    expect(isAnagram(original, nearMiss)).toBe(false);
  });
});
