import { test } from '@playwright/test';
import fc from 'fast-check';
import { isAnagram } from '../src/isAnagram.js';

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

test.describe('isAnagram — properties (fast-check)', () => {
  test('every permutation of a string is an anagram of it', () => {
    fc.assert(
      fc.property(withShuffle(anyString), ([s, shuffled]) => isAnagram(s, shuffled) === true),
    );
  });

  test('appending any character breaks the anagram', () => {
    fc.assert(
      fc.property(withShuffle(anyString), anyChar, ([s, shuffled], c) =>
        isAnagram(s + c, shuffled) === false,
      ),
    );
  });

  test('replacing one character with a different character breaks the anagram', () => {
    fc.assert(
      fc.property(
        withShuffle(fc.string({ unit: 'binary', minLength: 1 })),
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
});
