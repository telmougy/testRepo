import { test, expect } from '@playwright/test';
import fc from 'fast-check';
import { isAnagram } from '../src/isAnagram.js';

/** Any Unicode code point sequence (including astral-plane characters). */
const anyString = fc.string({ unit: 'binary' });
const anyChar = fc.string({ unit: 'binary', minLength: 1, maxLength: 1 });

/** Deterministic seeded PRNG so shrinking stays reproducible. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleCodePoints(s: string, seed: number): string {
  const chars = [...s];
  const rand = mulberry32(seed);
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [chars[i], chars[j]] = [chars[j]!, chars[i]!];
  }
  return chars.join('');
}

test.describe('isAnagram — properties (fast-check)', () => {
  test('reflexivity: every string is an anagram of itself', () => {
    fc.assert(
      fc.property(anyString, (s) => isAnagram(s, s) === true),
    );
  });

  test('symmetry: isAnagram(a, b) always equals isAnagram(b, a)', () => {
    fc.assert(
      fc.property(anyString, anyString, (a, b) => isAnagram(a, b) === isAnagram(b, a)),
    );
  });

  test('permutation invariance: any shuffle of a string is its anagram', () => {
    fc.assert(
      fc.property(anyString, fc.integer(), (s, seed) =>
        isAnagram(s, shuffleCodePoints(s, seed)) === true,
      ),
    );
  });

  test('concatenation commutes: a+b is always an anagram of b+a', () => {
    fc.assert(
      fc.property(anyString, anyString, (a, b) => isAnagram(a + b, b + a) === true),
    );
  });

  test('appending any character always breaks the anagram', () => {
    fc.assert(
      fc.property(anyString, anyChar, fc.integer(), (s, c, seed) =>
        isAnagram(s + c, shuffleCodePoints(s, seed)) === false,
      ),
    );
  });

  test('substituting one code point for a different one always breaks the anagram', () => {
    fc.assert(
      fc.property(
        fc.string({ unit: 'binary', minLength: 1 }),
        fc.nat(),
        anyChar,
        fc.integer(),
        (s, idx, replacement, seed) => {
          const chars = [...s];
          const i = idx % chars.length;
          fc.pre(chars[i] !== replacement);
          chars[i] = replacement;
          return isAnagram(shuffleCodePoints(s, seed), chars.join('')) === false;
        },
      ),
    );
  });

  test('reflexivity holds under every combination of options', () => {
    fc.assert(
      fc.property(
        anyString,
        fc.record({
          ignoreCase: fc.boolean(),
          ignoreWhitespace: fc.boolean(),
          ignorePunctuation: fc.boolean(),
          normalizeUnicode: fc.constantFrom<boolean | 'NFC' | 'NFD' | 'NFKC' | 'NFKD'>(
            false, true, 'NFC', 'NFD', 'NFKC', 'NFKD',
          ),
        }),
        (s, options) => isAnagram(s, s, options) === true,
      ),
    );
  });
});

test('property test sanity: the suite itself can detect a violation', () => {
  // Guards against a silently misconfigured fc.assert (e.g. zero runs).
  expect(() =>
    fc.assert(fc.property(fc.constant('ab'), (s) => isAnagram(s, s + 'x'))),
  ).toThrow();
});
