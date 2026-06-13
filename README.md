# isAnagram

A small TypeScript `isAnagram(a, b)` function with an example-based and
property-based test suite, run on GitHub Actions.

## Install & test

```bash
npm ci
npm test          # run the test suite
npm run typecheck # type-check with tsc
```

## Behavior

Two strings are anagrams when they contain the same characters with the same
multiplicities, in any order.

- Case-sensitive (`'Listen'` vs `'Silent'` → `false`).
- Whitespace and punctuation count as characters.
- Characters are compared by Unicode **code point**, so emoji and other
  astral-plane characters are handled correctly (never split into surrogate halves).
- Non-string input throws a `TypeError`.

The implementation is O(n): a single length check, then one code-point
frequency map counted up for `a` and down for `b` with an early exit.

## Tests

- `tests/isAnagram.spec.ts` — example-based coverage: valid/invalid pairs,
  empty strings, differing lengths, duplicate-character multiplicities, the
  case/whitespace/punctuation defaults, Unicode/emoji, invalid input, and a
  one-million-character correctness check.
- `tests/properties.spec.ts` — fast-check properties: every permutation is an
  anagram, appending a character breaks it, and replacing a character breaks it.

## CI

`.github/workflows/ci.yml` runs `npm run typecheck` and `npm test` on every
push and pull request.
