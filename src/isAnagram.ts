/** Count how many times each character appears in `text`. */
function countCharacters(text: string): Map<string, number> {
  const characterCounts = new Map<string, number>();

  for (const character of text) {
    const currentCount = characterCounts.get(character) ?? 0;
    characterCounts.set(character, currentCount + 1);
  }

  return characterCounts;
}

/** Check whether two character-count maps contain the same counts. */
function haveSameCharacterCounts(
  firstCounts: Map<string, number>,
  secondCounts: Map<string, number>,
): boolean {
  if (firstCounts.size !== secondCounts.size) {
    return false;
  }

  for (const [character, count] of firstCounts) {
    if (secondCounts.get(character) !== count) {
      return false;
    }
  }
  return true;
}

/**
 * Return true when both strings contain the same characters with the same
 * counts, in any order.
 *
 * Matching is case-sensitive; whitespace and punctuation count as characters.
 * Characters are compared by Unicode code point, so astral-plane characters
 * such as emoji are handled correctly.
 *
 * @throws {TypeError} When either argument is not a string.
 */
export function isAnagram(first: string, second: string): boolean {
  if (typeof first !== 'string' || typeof second !== 'string') {
    throw new TypeError('isAnagram: both arguments must be strings');
  }

  const firstCounts = countCharacters(first);
  const secondCounts = countCharacters(second);

  return haveSameCharacterCounts(firstCounts, secondCounts);
}
