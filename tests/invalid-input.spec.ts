import { test, expect } from '@playwright/test';
import { isAnagram } from '../src/isAnagram.js';

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
    test(`throws TypeError with clear message when first argument is ${label}`, () => {
      expect(() => isAnagram(value as string, 'abc')).toThrow(
        new TypeError('isAnagram: both arguments must be strings'),
      );
    });

    test(`throws TypeError with clear message when second argument is ${label}`, () => {
      expect(() => isAnagram('abc', value as string)).toThrow(
        new TypeError('isAnagram: both arguments must be strings'),
      );
    });
  }
});
