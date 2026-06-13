import { test, expect } from '@playwright/test';
import { isAnagram } from '../src/isAnagram.js';

test.describe('isAnagram — valid and invalid pairs', () => {
  test('returns true for a classic anagram pair', () => {
    expect(isAnagram('listen', 'silent')).toBe(true);
  });

  test('returns false for unrelated strings of equal length', () => {
    expect(isAnagram('hello', 'world')).toBe(false);
  });

  test('returns true for identical strings', () => {
    expect(isAnagram('same', 'same')).toBe(true);
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

  test('an astral-plane character is not split into surrogate halves', () => {
    // U+1D452 is two UTF-16 units; a charCodeAt-based count would mishandle it.
    expect(isAnagram('\u{1d452}ab', 'ba\u{1d452}')).toBe(true);
  });

  test('different emoji of equal UTF-16 length are not anagrams', () => {
    expect(isAnagram('😀', '😁')).toBe(false);
  });

  test('Arabic text reordering is an anagram', () => {
    expect(isAnagram('سلام', 'مالس')).toBe(true);
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
  test('correctly confirms a one-million-character anagram and its near-miss', () => {
    const size = 1_000_000;
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const a = alphabet.repeat(Math.ceil(size / alphabet.length)).slice(0, size);
    const b = [...a].reverse().join('');

    expect(isAnagram(a, b)).toBe(true);
    expect(isAnagram(a, b.slice(0, -1) + '!')).toBe(false);
  });
});
