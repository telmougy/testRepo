export interface IsAnagramOptions {
  /** Compare letters case-insensitively. Default: false (case-sensitive). */
  ignoreCase?: boolean;
  /** Strip all Unicode whitespace before comparing. Default: false (whitespace counts). */
  ignoreWhitespace?: boolean;
  /** Strip all Unicode punctuation (category P) before comparing. Default: false (punctuation counts). */
  ignorePunctuation?: boolean;
  /**
   * Apply Unicode normalization before comparing, so composed and decomposed
   * forms (e.g. U+00E9 vs e + U+0301) are treated as the same character.
   * `true` is shorthand for 'NFC'. Default: false (code points compared as-is).
   */
  normalizeUnicode?: boolean | 'NFC' | 'NFD' | 'NFKC' | 'NFKD';
}

function applyOptions(input: string, options: IsAnagramOptions): string {
  let result = input;
  if (options.normalizeUnicode) {
    result = result.normalize(
      options.normalizeUnicode === true ? 'NFC' : options.normalizeUnicode,
    );
  }
  if (options.ignoreCase) result = result.toLowerCase();
  if (options.ignoreWhitespace) result = result.replace(/\s/gu, '');
  if (options.ignorePunctuation) result = result.replace(/\p{P}/gu, '');
  return result;
}

/**
 * Return true if `a` and `b` are anagrams (same characters with the same
 * multiplicities). Order does not matter.
 * Defaults: case-sensitive; whitespace and punctuation count as characters.
 * Characters are counted by Unicode code point, so astral-plane characters
 * (emoji, mathematical alphanumerics) are handled correctly.
 */
export function isAnagram(a: string, b: string, options: IsAnagramOptions = {}): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') {
    throw new TypeError('isAnagram: both arguments must be strings');
  }

  const left = applyOptions(a, options);
  const right = applyOptions(b, options);
  if (left.length !== right.length) return false;

  const counts = new Map<string, number>();
  for (const ch of left) {
    counts.set(ch, (counts.get(ch) ?? 0) + 1);
  }
  for (const ch of right) {
    const remaining = counts.get(ch);
    if (!remaining) return false;
    counts.set(ch, remaining - 1);
  }
  return true;
}
