import { test } from '@playwright/test';
import fc from 'fast-check';
import { isAnagram } from '../src/isAnagram.js';

// Widen the default 100-case sweep for broader Unicode coverage.
const propertyOptions = { numRuns: 500 };

/** One valid Unicode code point, including emojis. */
const unicodeCharacter = fc.string({ unit: 'binary', minLength: 1, maxLength: 1 });

/** A random string paired with its characters reversed. */
const stringWithReversedVersion = fc.array(unicodeCharacter).map((characters) => ({
  original: characters.join(''),
  reversed: [...characters].reverse().join(''),
}));

test.describe('isAnagram property tests', () => {
  // Reversal keeps the same characters, so the two are always anagrams.
  test('a reversed string is an anagram of the original', () => {
    fc.assert(
      fc.property(stringWithReversedVersion, ({ original, reversed }) =>
        isAnagram(original, reversed),
      ),
      propertyOptions,
    );
  });

  // One extra character breaks the match.
  test('adding one character makes it no longer an anagram', () => {
    fc.assert(
      fc.property(
        stringWithReversedVersion,
        unicodeCharacter,
        ({ original, reversed }, extraCharacter) =>
          !isAnagram(original + extraCharacter, reversed),
      ),
      propertyOptions,
    );
  });
});
