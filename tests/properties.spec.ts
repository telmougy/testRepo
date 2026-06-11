import { test, expect } from '@playwright/test';
import fc from 'fast-check';
import { isAnagram, type IsAnagramOptions } from '../src/isAnagram.js';

/** Any Unicode code point sequence (including astral-plane characters). */
const anyString = fc.string({ unit: 'binary' });
const anyChar = fc.string({ unit: 'binary', minLength: 1, maxLength: 1 });

/** A string paired with a random permutation of its code points. */
const withShuffle = (arb: fc.Arbitrary<string>) =>
  arb.chain((s) => {
    const chars = [...s];
    return fc.tuple(
      fc.constant(s),
      fc.shuffledSubarray(chars, { minLength: chars.length }).map((c) => c.join('')),
    );
  });
const stringWithShuffle = withShuffle(anyString);
const nonEmptyStringWithShuffle = withShuffle(fc.string({ unit: 'binary', minLength: 1 }));

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
      fc.property(stringWithShuffle, ([s, shuffled]) => isAnagram(s, shuffled) === true),
    );
  });

  test('concatenation commutes: a+b is always an anagram of b+a', () => {
    fc.assert(
      fc.property(anyString, anyString, (a, b) => isAnagram(a + b, b + a) === true),
    );
  });

  test('appending any character always breaks the anagram', () => {
    fc.assert(
      fc.property(stringWithShuffle, anyChar, ([s, shuffled], c) =>
        isAnagram(s + c, shuffled) === false,
      ),
    );
  });

  test('substituting one code point for a different one always breaks the anagram', () => {
    fc.assert(
      fc.property(
        nonEmptyStringWithShuffle,
        fc.nat(),
        anyChar,
        ([s, shuffled], idx, replacement) => {
          const chars = [...s];
          const i = idx % chars.length;
          fc.pre(chars[i] !== replacement);
          chars[i] = replacement;
          return isAnagram(shuffled, chars.join('')) === false;
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
          normalizeUnicode: fc.constantFrom<NonNullable<IsAnagramOptions['normalizeUnicode']>>(
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
