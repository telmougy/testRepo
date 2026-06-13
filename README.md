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

- Case-insensitive (`'Listen'` vs `'Silent'` → `true`).
- Whitespace and punctuation count as characters.
- Characters are compared by Unicode **code point**, so emoji and other
  astral-plane characters are handled correctly (never split into surrogate halves).
- Non-string input throws a `TypeError`.

The implementation is O(n): it builds a per-character lower-cased code-point
frequency map for each input and compares them. Case is folded per character
(not on the whole string) so matching depends only on the multiset of
characters, never their order.

## Tests

- `tests/isAnagram.spec.ts` — example-based coverage: valid/invalid pairs,
  empty strings, differing lengths, duplicate-character multiplicities, the
  case/whitespace/punctuation defaults, Unicode/emoji, invalid input, and a
  one-million-character correctness check.
- `tests/isAnagram.property.spec.ts` — fast-check properties over random
  Unicode characters: reversing a string's characters produces an anagram, and
  adding one more character breaks the anagram.

## CI

`.github/workflows/ci.yml` runs `npm run typecheck` and `npm test` on every
push and pull request.
