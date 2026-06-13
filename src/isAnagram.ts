/**
 * Return true if `a` and `b` are anagrams: the same characters with the same
 * multiplicities, in any order.
 *
 * Behavior is case-sensitive, and whitespace and punctuation count as
 * characters. Characters are compared by Unicode code point, so astral-plane
 * characters such as emoji are handled correctly.
 *
 * @throws {TypeError} if either argument is not a string.
 */
export function isAnagram(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') {
    throw new TypeError('isAnagram: both arguments must be strings');
  }
  if (a.length !== b.length) return false;

  const counts = new Map<string, number>();
  for (const ch of a) {
    counts.set(ch, (counts.get(ch) ?? 0) + 1);
  }
  for (const ch of b) {
    const remaining = counts.get(ch);
    if (!remaining) return false;
    counts.set(ch, remaining - 1);
  }
  return true;
}
