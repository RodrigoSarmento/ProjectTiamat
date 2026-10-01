# Combat audit findings

Audit of the combat work (Combat container, Prepare / Running / FinalResult steps, combat-die / combatant-card / health-bar components, dice catalog, saves deck, redux-persist change). Ranked high → low.

**Second pass (Oct 1, 2026):** re-audited the uncommitted changes (FinalResult screen with `restart` / `finish`, narrative as `string[]`, required enemy portrait, toss direction, skipped empty exchanges, `enemy-*` dice). Earlier items keep their numbers; new findings start at 14.

Fix **one item at a time**. Do not bundle.

| #   | Severity | Decision                    |
| --- | -------- | --------------------------- |
| 3   | Medium   | Partly resolved — still WIP |
| 4   | Medium   | Ignore                      |
| 5   | Medium   | Later                       |
| 10  | Low      | _Undecided_                 |
| 11  | Low      | Ignore — still building     |
| 14  | Medium   | Later — still WIP           |
| 18  | Low      | _Undecided_                 |
| 20  | Low      | _Undecided_                 |

---

## Medium

### 3. No way out of combat — Partly resolved (still WIP)

**Where:** `src/screens/combat/final-result/FinalResult.tsx` (Continue), `src/screens/combat/prepare/Prepare.tsx`, `src/routes/GameStackNavigator.tsx:28` (`gestureEnabled: false`)

**What's still open:** you can now leave from the final result's Continue button, but Prepare and Running still have no exit, and swipe-back is still disabled on iOS. Once a fight starts, the only way out is to finish it.

**Fix (when it's time):** add a small flee / back button in Prepare that calls `combatRef.current?.finish()`, if fleeing should be allowed.

---

### 4. Duplicate dice in the player deck break things — Ignore

**Where:** `src/screens/combat/prepare/Prepare.hooks.ts`, `src/helper/combatDice.ts` (`discardUsedDice`, `rollDice`), `src/screens/combat/Combat.tsx` (`selectDice`)

Still applies in theory: player dice use plain catalog ids for keys, the tray, rolls and morto. It can't trigger today, because the 8 `STARTER_DICES` ids are unique and nothing adds dice to the save yet. Revisit if a "gain a die" reward ever allows duplicates.

---

### 5. Too many re-renders while dragging and rolling — Later

**Where:** `src/screens/combat/prepare/Prepare.tsx` (inline `onDrag*` props), `src/components/combat-die/CombatDie.tsx` (flicker `setInterval` → `setRollingFace`)

**What's wrong:** each time the hovered slot or the tray changes during a drag, Prepare re-renders all of itself. Every un-memoized `CombatDie` then gets new inline callbacks and rebuilds its pan gesture mid-drag. While rolling, each die's flicker timer re-renders the whole die about 15–20 times a second.

**Fix:** wrap `CombatDie` in `React.memo` and give it stable, id-based callbacks. Optionally drive the flickering face from a shared value or a small child component.

---

### 14. The fight's result never reaches the story, and the narrative is never sent — Later (still WIP)

**Where:** `src/screens/combat/Combat.tsx:91` (`finish`), `src/screens/game/Game.tsx:103-104`

**What's wrong:** `finish` just goes back, so Continue after a defeat does exactly the same thing as after a victory, and the story has no way to branch on the result. The only place that opens combat passes nothing but `enemyId`. That means `victoryText`, `defeatText` and `background` are always undefined in the real app: the narrative panel never shows and the background is always the default one.

**Fix:** report the outcome when finishing (a callback in the route params, a Redux action, or navigating to the right story node). Have the story pass the narrative lines and the current background when it opens combat.

---

## Low

### 10. Too many measurements per layout pass

**Where:** `src/screens/combat/prepare/Prepare.tsx:123, 150, 187` (`measureDropTargets` on root, slots and tray `onLayout`)

**What's wrong:** each `onLayout` re-measures every target, so mounting costs (slots + 2)² `measureInWindow` calls, plus a full pass at every drag start.

**Fix:** measure only from the root's `onLayout`, plus once at drag start.

---

### 11. Persisted dice ids aren't validated — Ignore (still building the game)

**Where:** `src/redux/store/index.ts:37`, `src/redux/slices/SavesSlice.ts` (`dices`)

**What's wrong:** `autoMergeLevel2` only fills fields an old save doesn't have yet. Once `dices` is persisted, later changes to the starter deck are ignored. If a catalog id is ever renamed, `getDie` returns an object with no `faces` / `sides` and combat crashes. This pass only added catalog ids, and every `STARTER_DICES` id still exists, so it hasn't gotten worse.

**Fix:** add a persist `version` with `createMigrate`, or filter persisted ids against `COMBAT_DICE` on rehydrate.

---

### 18. The blink animation runs even with no narrative panel

**Where:** `src/screens/combat/final-result/FinalResult.tsx:28`, `:68`

**What's wrong:** `useBlink()` is called at the top of the screen, so its endless opacity loop runs even when the narrative panel (and the ▼ it animates) isn't rendered. It's cheap, but it's work for nothing.

**Fix:** move the ▼ indicator into a small child component that calls `useBlink` itself.

---

### 20. Outcome only looks at the enemy's health

**Where:** `src/screens/combat/Combat.tsx:50`, `:55-61` (`next`)

**What's wrong:** `outcome` is `victory` only when the enemy is at 0; anything else counts as defeat. In real play Running only reaches the final result when someone hits 0, so it works. But `next()` still wraps through `COMBAT_STEPS` and can land on `finalResult` with both sides alive, showing "Derrota". The first Combat.spec test does exactly that.

**Fix:** have `next()` stop at `finalResult` instead of wrapping, or derive the outcome from both health values.
