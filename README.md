# isAnagram — QA Automation Assessment (Part 2)

A TypeScript implementation of `isAnagram(a, b, options?)` with a comprehensive,
multi-layer automated test suite and a GitHub Actions CI workflow that runs on
every push and pull request.

## Quick start

```bash
npm ci          # install dependencies
npm test        # run the full test suite (Playwright Test, pure Node — no browsers)
npm run typecheck
npm run test:report   # open the HTML report after a run
```

## Anagram policy

Two strings are anagrams when they contain the same Unicode **code points** with
the same multiplicities; order does not matter.

| Policy | Default | Option to change it |
|---|---|---|
| Letter case | Case-sensitive (`'Listen'` vs `'Silent'` → `false`) | `ignoreCase: true` |
| Whitespace | Counts as characters (all Unicode whitespace) | `ignoreWhitespace: true` |
| Punctuation | Counts as characters (Unicode category `P`) | `ignorePunctuation: true` |
| Unicode normalization | Off — `é` (U+00E9) ≠ `e`+U+0301 | `normalizeUnicode: true` (NFC) or `'NFC' \| 'NFD' \| 'NFKC' \| 'NFKD'` |
| Non-string input | Throws `TypeError` with a clear message | — |

Transforms are applied in a fixed order (normalize → case → whitespace →
punctuation) before comparison, so the length early-exit can never observe
pre-transform lengths.

### Documented edge semantics

- Characters are counted by **code point**, not UTF-16 unit — emoji and other
  astral-plane characters are never split into surrogate halves.
- `ignoreCase` uses locale-independent `toLowerCase()`. Full Unicode case
  folding is intentionally out of scope: `isAnagram('ß', 'SS', { ignoreCase: true })`
  is `false`, and the suite locks that behavior in a test.
- Zero-width characters count by default; `ignoreWhitespace` removes all
  Unicode whitespace including NBSP.

## Test design

The suite is layered so each failure points at a specific policy, and the
property-based layer proves invariants no finite example list can:

| Layer | File | What it proves |
|---|---|---|
| Core behavior | `tests/core-behavior.spec.ts` | Happy paths, multiplicity traps (`aab` vs `abb`), empty/length edges |
| Defaults & options | `tests/options.spec.ts` | Each documented default, each option alone and in combination |
| Unicode | `tests/unicode.spec.ts` | Code-point counting, surrogate pairs, combining marks, zero-width chars, RTL text, case-folding nuance |
| Invalid input | `tests/invalid-input.spec.ts` | `TypeError` contract for all non-string types, both argument positions |
| Properties | `tests/properties.spec.ts` | fast-check invariants: reflexivity, symmetry, permutation-invariance, concatenation commutativity, append/substitution falsifiers, plus a meta-test proving the harness can detect violations |
| Performance | `tests/performance.spec.ts` | Linear-time behavior on 10⁶-character inputs (guards against quadratic regressions) |

All tests were written test-first (red → green → refactor); every behavior was
observed failing before it was implemented.

## Why Playwright Test as the runner?

Deliberate choice, not a default: the suite runs in **pure Node mode** — no
browsers are installed or launched, so CI stays fast. Playwright Test provides
parallel workers, `forbidOnly` as a CI guard against accidentally committed
`.only`, first-class TypeScript without a build step, and an HTML report
uploaded as a CI artifact. It also keeps this project consistent with the
E2E stack I use daily; for a pure function, Jest or Vitest would be equally
valid — the test design, not the runner, carries the quality here.

## CI

`.github/workflows/ci.yml` runs on **every push and every pull request**:
checkout → Node LTS with npm cache → `npm ci` → `tsc --noEmit` → `npm test` →
upload the Playwright HTML report as an artifact (also on failure, for
debugging).

## Project layout

```
src/isAnagram.ts        implementation + typed options interface
tests/*.spec.ts         six-layer test suite (see table above)
playwright.config.ts    pure-Node runner config
.github/workflows/ci.yml
```
