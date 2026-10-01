# Combat audit findings

Audit of the uncommitted combat work (Combat container, Prepare / Running / FinalResult steps, combat-die / combatant-card / health-bar components, dice catalog, saves deck, redux-persist change). Ranked high → low.

Fix **one item at a time**. Do not bundle.

| #   | Severity | Decision    |
| --- | -------- | ----------- |
| 1   | High     | **Fixed**   |
| 2   | Medium   | Skip (WIP)  |
| 3   | Medium   | Skip (WIP)  |
| 4   | Medium   | Ignore      |
| 5   | Medium   | Later       |
| 6   | Medium   | **Fixed**   |
| 7   | Low      | **Fixed**   |
| 8   | Low      | **Fixed**   |
| 9   | Low      | **Fixed**   |
| 10  | Low      | _Undecided_ |
| 11  | Low      | _Undecided_ |
| 12  | Low      | _Undecided_ |
| 13  | Low      | _Undecided_ |

---

## High

### 1. SavesSlice initial-state spec is stale

**Where:** `src/redux/slices/SavesSlice.spec.ts:13-23`

**What’s wrong:** The first test checks the whole initial state with `toEqual`, but the expected object doesn’t include the new `dices` and `numOfDices` fields. It fails as soon as Jest boots.

**Fix:** Add `dices` and `numOfDices: 2` to the expected object. Better: export the starter deck from the slice (e.g. `STARTER_DICE`) and use it in both the slice and the spec, so they can’t drift.

---

## Medium

### 2. Combat doesn’t reset after it ends

**Where:** `src/screens/combat/Combat.tsx` (`next` in `useImperativeHandle`), `src/screens/combat/final-result/FinalResult.tsx`, `src/screens/combat/running/Running.hooks.ts` (`isOverRef`)

**What’s wrong:** Tapping FinalResult calls `next()`, which wraps back to Prepare with `health`, `hits` and `deadIds` untouched. Whoever reached 0 HP is still at 0, so the next exchange ends the fight even with zero damage (`health[defender] - 0 <= 0`). `Combat.spec.tsx` currently treats that wrap as correct.

**Fix:** Add a `reset()` to `ICombatRef` that restores both HP values, clears hits and `deadIds`, and goes to `prepare`. Or have FinalResult leave the screen. Update `Combat.spec` to match.

**Do not:** keep relying on modulo stepping in `next()` to leave `finalResult`.

---

### 3. No way out of combat

**Where:** `src/screens/combat/Combat.tsx`, `src/screens/combat/prepare/Prepare.tsx`, `src/routes/GameStackNavigator.tsx` (`gestureEnabled: false`)

**What’s wrong:** The back button was removed, the header is hidden and swipe-back is disabled. On iOS there’s no way to leave the screen. Android still has its hardware back button.

**Fix:** Add a small back / flee button in Prepare or at the container level that calls `navigation.goBack()`.

---

### 4. Duplicate dice in the player deck break things

**Where:** `src/screens/combat/prepare/Prepare.hooks.ts:18-31`, `src/helper/combatDice.ts` (`discardUsedDice`), `src/screens/combat/Combat.tsx` (`selectDice`)

**What’s wrong:** `saves.dices` is `CombatDieId[]`, so the same id can appear twice. The player’s dice use plain catalog ids. Two copies would share a React key, placing one would hide both from the tray (`slots.includes(die.id)`), the rolls record would merge them, and `discardUsedDice` would send both copies to morto. The enemy side already avoids this with `drawDice` (`${id}#${index}`).

**Fix:** Build player dice instances once in Combat with the same `#index` scheme, pass them to Prepare, and keep instance ids in `deadIds`. Add a spec with a duplicated player die.

---

### 5. Too many re-renders while dragging and rolling

**Where:** `src/screens/combat/prepare/Prepare.tsx` (`handleDragUpdate`, inline `onDrag*` props), `src/components/combat-die/CombatDie.tsx` (flicker `setInterval` → `setRollingFace`)

**What’s wrong:** Each time the hovered slot or tray changes during a drag, all of Prepare re-renders. Every un-memoized `CombatDie` then gets new inline callbacks and rebuilds its `usePanGesture` config mid-drag. While rolling, each die’s flicker timer re-renders the whole die about 15–20 times a second.

**Fix:** Wrap `CombatDie` in `React.memo` and give it stable, id-based callbacks — that’s the biggest win. Optionally, drive the flickering face from a shared value (or a small child component) so the gesture and shape don’t re-render.

---

### 6. The core combat loop has no tests

**Where:** `src/screens/combat/running/Running.spec.tsx`, `src/screens/combat/Combat.spec.tsx`, `src/screens/combat/prepare/Prepare.spec.tsx`

**What’s wrong:**

- Running: nothing checks that an exchange resolves after the dice settle, that `applyDamage` gets `max(0, attack − defense)`, or that the screen moves to `finalResult` at 0 HP and back to `prepare` otherwise.
- Combat: the steps are mocked and nothing checks that `health` or `deadIds` change after `applyDamage` / `selectDice`.
- Prepare: the spec uses `numOfDices: 2`, which is already the default, so it doesn’t prove the slot count follows the setting. Nothing checks that Ready calls `selectDice` then `next`.

**Fix:** In Running, mock `Math.random`, advance fake timers past `rollDurationMs + rollDelayMs` (or fire `onRollSettled`), tap to continue, and assert the ref calls for “someone dies” and “both survive”. In Combat, have the mocked Prepare render `deadIds.length` and the HP values and assert on them across two rounds. Use `numOfDices: 3` in the Prepare spec.

---

## Low

### 7. Softlock with a small deck

**Where:** `src/screens/combat/prepare/Prepare.hooks.ts` (`isReady`), `src/helper/combatDice.ts` (`discardUsedDice`)

**What’s wrong:** If `saves.dices.length < numOfDices` (including an empty deck), Ready never enables and `discardUsedDice` always returns `[]`. The player is stuck in Prepare.

**Fix:** Cap the slot count at `Math.min(numOfDices, deckIds.length)` in Prepare and in `discardUsedDice`, or block entering combat when the deck is too small.

---

### 8. Unused roll animations

**Where:** `src/components/combat-die/CombatDie.animations.ts`, `CombatDie.tsx` (`rollStyle`, `rollGeneration`), `CombatDie.constants.ts` (`ROLL_STYLES`, `REEL_TICK_MS`)

**What’s wrong:** No screen passes `rollStyle` anymore, so only `toss` runs. `spin`, `reel`, `drop`, `REEL_TICK_MS` and the `rollGeneration` prop are dead code (`DiceSide` remounts by key instead).

**Fix:** Either delete them, or bring back a roll-style picker. These options were picked on purpose earlier, so decide before deleting.

---

### 9. Colocation slips

**Where:** `src/components/health-bar/HealthSegment.tsx` (`IHealthSegment`), `src/screens/combat/running/initiative-toast/InitiativeToast.tsx` (`D20Roll` props), `src/components/combat-die/CombatDie.tsx` (flicker timings 46 / 56 / 64)

**What’s wrong:** Prop types are declared inside `.tsx` files and the flicker timings are inline numbers, against the colocated `.types.ts` / `.constants.ts` pattern.

**Fix:** Move the types to `HealthBar.types.ts` / `InitiativeToast.types.ts` and the timings to `CombatDie.constants.ts`.

---

### 10. Too many measurements per layout pass

**Where:** `src/screens/combat/prepare/Prepare.tsx` (`measureDropTargets` on root, tray and every slot `onLayout`)

**What’s wrong:** Each `onLayout` re-measures every target, so mount costs (slots + 2)² `measureInWindow` calls, plus a full pass on each drag start.

**Fix:** Measure only from the root’s `onLayout`, plus once at drag start.

---

### 11. Persisted dice ids aren’t validated

**Where:** `src/redux/store/index.ts` (persist config), `src/redux/slices/SavesSlice.ts` (`dices`)

**What’s wrong:** `autoMergeLevel2` only fills fields an old save doesn’t have yet. Once `dices` is persisted, later changes to the starter deck are ignored, and if a catalog id is renamed, `getDie` returns an object with no `faces` / `sides` and combat crashes.

**Fix:** Add a persist `version` with `createMigrate`, or filter persisted ids against `COMBAT_DICE` on rehydrate.

---

### 12. `docs/combate.md` is out of date

**Where:** `docs/combate.md`

**What’s wrong:** It still describes drawing a hand of 6 and reshuffling morto only when the deck runs out. The code shows the whole non-morto deck, requires exactly `numOfDices` picks, and recovers every die once fewer than `numOfDices` remain.

**Fix:** Update the doc to the rules in code (or update the code, if the doc is the intended design).

---

### 13. `ENEMIES` export is unused

**Where:** `src/data/story/index.ts:5`

**What’s wrong:** `ENEMIES` is re-exported but nothing outside `enemies.ts` uses it; everything goes through `getEnemy`.

**Fix:** Drop it from the index re-export, unless you plan to list enemies.
