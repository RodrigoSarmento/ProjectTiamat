# Audit findings

Full-app audit, ranked high → low. Nits dropped from the original pass are at the bottom (inline `App` styles, unused color tokens, `endTrecho` scaffolding types).

Fix **one item at a time**. Do not bundle.

| #   | Severity | Decision                                                   |
| --- | -------- | ---------------------------------------------------------- |
| 1   | High     | **Fix**                                                    |
| 5   | High     | **Fix** (cursor on the Redux save, which already persists) |
| 7   | Medium   | **Fix**                                                    |
| 10  | Medium   | **Fix**                                                    |
| 11  | Medium   | **Fix**                                                    |

---

## High

### 1. Jest cannot boot

**Where:** `jest.config.js:2`, `babel.config.js`, `tsconfig.json`

**What’s wrong:** Babel aliases `@jest` → `./jest`. That rewrites the real package `@jest/globals` inside the RN Jest preset, so every suite dies (`Cannot find module '../../../../jest/globals'`). CI and local tests are blind.

**Fix:** Remove the `@jest` alias from babel and `tsconfig`. If immer / Redux ESM then fail to parse, add `transformIgnorePatterns` that transpiles `@reduxjs|immer|react-redux`.

**Do not:** create `jest/globals.js`, or alias `@jest` to anything. That name belongs to Jest.

---

### 5. Story cursor is only in React state

**Where:** `src/screens/game/Game.hooks.ts`, `src/redux/slices/SavesSlice.ts`

**What’s wrong:** `nodeId`, `pageIndex`, `flags`, and `usedChoiceIds` live in component state. Kill the app and you restart at the chapter entry. “Save” does not resume the story.

**Fix:** Those four fields belong on `ISave`. The persist whitelist is already `saves`. Game hydrates from the save (`save?.nodeId || chapter.entry`). `ensureSave` backfills missing fields on old persisted saves.

---

## Medium

### 7. Quick-choice timer is keyed off count, not the prompt

**Where:** `src/components/choice-select-modal/ChoiceSelectModal.tsx` (timer `useEffect` deps)

**What’s wrong:** The timer / commit lock reset when `isVisible`, `isQuick`, or `choices.length` change. Two quick prompts in a row with the same number of options keep those deps stable, so `hasCommittedRef` stays `true` and Confirm does nothing.

`promptEpoch` already includes choice ids for the selected-id reset. The **timer effect does not**.

**Fix:** Put the prompt identity (choice ids, not just length) on that effect’s dependency list, and reset `hasCommittedRef` when it changes. Confirm on prompt B must work after prompt A committed.

**Do not:**

- Remount the RN `Modal` with `key={promptEpoch}` as the main fix (portal / test host will lie to you).
- Put `jest.useFakeTimers()` on the whole spec file. The existing auto-confirm test is order-sensitive with Animated. Keep fake timers **inside** that one test. For the new prompt, unmount A then mount B, or change the id list on the same instance.
- Rewrite the commit lock three different ways in one pass.

---

### 10. i18n is a JS file + `.d.ts` + sibling `translation/`

**Where:** `src/i18n.js:1`, `src/i18n.d.ts`, `src/translation/portuguese.json`

**What’s wrong:** The rest of `src/` is TypeScript modules. This is the odd one out.

**Fix:** `src/i18n/index.ts` + `src/i18n/portuguese.json` (or `locales/`). Update `App` (`import './src/i18n'`) and `storyText`. Delete the JS file, the `.d.ts` shim, and `src/translation/`.

**Do not:** move prologue strings again. They are already keys.

---

### 11. Jest setup / `renderWithProviders` / missing screen specs

**Where:** no `jest.setup.js`; Game spec builds a one-off `Provider`; Saves specs skip empty-save; Character Creation / Start have no specs

**What’s wrong:** After Jest boots, there is still no shared render helper, no setup file, and the save / Start path is untested. Those gaps hide the save bug in item 2.

**Fix, in this order:**

1. `jest/setup.js` — mock `react-native-sound` so `new Sound(...)` gets methods on **`this`** and the load callback runs **after** construct (microtask). A sync callback runs while `const player = new Sound(...)` is still uninitialized. Do **not** alias this folder `@jest`.
2. `jest/utils/renderWithProviders.tsx` — `await render(...)` (RNTL 14 is async). Import it as a path that is not `@jest` (e.g. `@test` → `./jest/utils`, or a relative import).
3. Game spec uses that helper. Saves spec covers empty-save no-ops. Start spec: press Start → save exists + `replace('Game')`. Character Creation spec: spend `TOTAL_POINTS` across stats (`MAX_STAT` is 6, total is 10 — do not dump all points on Strength).

**Do not:** `require('@react-native-async-storage/async-storage/jest/async-storage-mock')` without checking the package actually ships that file (v3 may not). Write a small manual mock. Do not chase `App.test` through every ESM package in the same pass; mock the stack navigator in that one file if needed.

---
