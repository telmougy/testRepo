import { test, expect } from '@playwright/test';
import { isAnagram } from '../src/isAnagram.js';

test.describe('isAnagram — Unicode handling', () => {
  test('emoji reordering is an anagram (astral-plane code points)', () => {
    expect(isAnagram('😀😁', '😁😀')).toBe(true);
  });

  test('astral-plane character mixed with BMP characters', () => {
    // U+1D452 MATHEMATICAL ITALIC SMALL E is two UTF-16 units; a naive
    // charAt/charCodeAt implementation would split its surrogate pair.
    expect(isAnagram('\u{1d452}ab', 'ba\u{1d452}')).toBe(true);
  });

  test('a surrogate pair is not equivalent to two BMP characters of the same UTF-16 length', () => {
    expect(isAnagram('😀', 'ab')).toBe(false);
  });

  test('different emoji with identical UTF-16 lengths are not anagrams', () => {
    expect(isAnagram('😀', '😁')).toBe(false);
  });

  test('combining marks are counted as their own code points', () => {
    // "e" + combining acute reordered: same multiset of code points.
    expect(isAnagram('e\u0301a', 'ae\u0301')).toBe(true);
  });

  test('zero-width characters count by default', () => {
    // U+200B ZERO WIDTH SPACE is invisible but still a character.
    expect(isAnagram('ab\u200b', 'ab')).toBe(false);
  });

  test('non-breaking space is treated as whitespace by ignoreWhitespace', () => {
    // U+00A0 NO-BREAK SPACE
    expect(isAnagram('a\u00a0b', 'ab', { ignoreWhitespace: true })).toBe(true);
  });

  test('Arabic text anagram', () => {
    expect(isAnagram('سلام', 'مالس')).toBe(true);
  });

  test('case-folding nuance is documented: sharp s does not equal SS under ignoreCase', () => {
    // 'ß'.toLowerCase() is 'ß' while 'SS'.toLowerCase() is 'ss' — full Unicode
    // case folding is intentionally out of scope; this locks the behavior.
    expect(isAnagram('ß', 'SS', { ignoreCase: true })).toBe(false);
  });
});
