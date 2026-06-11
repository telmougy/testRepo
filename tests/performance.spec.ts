import { test, expect } from '@playwright/test';
import { isAnagram } from '../src/isAnagram.js';

/**
 * Sanity guards against accidental quadratic implementations
 * (e.g. sort-based O(n log n) is fine, repeated indexOf scans are not).
 * Budgets are generous to stay stable on slow CI runners.
 */
test.describe('isAnagram — performance sanity', () => {
  const SIZE = 1_000_000;
  const BUDGET_MS = 2_000;

  let cached: { a: string; b: string } | undefined;
  function buildPair(): { a: string; b: string } {
    if (!cached) {
      const alphabet = 'abcdefghijklmnopqrstuvwxyz';
      const a = alphabet.repeat(Math.ceil(SIZE / alphabet.length)).slice(0, SIZE);
      cached = { a, b: [...a].reverse().join('') };
    }
    return cached;
  }

  test(`confirms a ${SIZE.toLocaleString()}-char anagram within ${BUDGET_MS}ms`, () => {
    const { a, b } = buildPair();
    const start = performance.now();
    const result = isAnagram(a, b);
    const elapsed = performance.now() - start;
    expect(result).toBe(true);
    expect(elapsed).toBeLessThan(BUDGET_MS);
  });

  test('rejects a near-anagram differing only in the last character within budget', () => {
    const { a, b } = buildPair();
    const almost = b.slice(0, -1) + '!';
    const start = performance.now();
    const result = isAnagram(a, almost);
    const elapsed = performance.now() - start;
    expect(result).toBe(false);
    expect(elapsed).toBeLessThan(BUDGET_MS);
  });
});
