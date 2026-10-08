# Save game audit

Review of the save/resume feature: `progress` in `SavesSlice`, resume in `useStoryGame`, and ERASE SAVE in the debug menu.

No high-severity issues. Already verified as fine:

- Redux-persist finishes loading before `Game` mounts (`PersistGate` wraps navigation), so the restored progress is read correctly and the mount effect can't overwrite it.
- Saves from before this change have no `progress` and start from the chapter entry. Saves from before the story log was added have no `storyLog` and resume with an empty log.
- Erasing can't race with the save effects, because both effects depend only on local state.

## Status

| Item | Status |
| --- | --- |
| 1. Game renders twice on every node change | Fixed |
| 2. The resume test only checks the text | Fixed |
| 3. A resume replays the current node's text | Accepted |
| 4. A dice roll can be redone by killing the app | Accepted |
| 5. Saved node no longer exists | Fixed (story log is saved) |
| 6. Extra save on mount | Fixed |
| 7. Erasing is the only save action handled in the screen | Kept in `Game.tsx` by choice |
| 8. A character can end up with no name | Fixed |
| 9. Small test gaps | Fixed |

## Accepted

### 3. A resume replays the current node's text

Only the node is saved, not the page, so a resume opens the saved node at its first page with the choices closed. If you'd read all of a node's text and reached its choices, you page through that node's text again. Earlier nodes don't replay.

Kept on purpose: a player coming back days later gets a recap of where they were. The story log keeps the history before that node.

This also applies to hub nodes reached with `skipNextText` (like `try-to-help-gus` after "rethink"). On resume, their text plays from the start.

### 4. A dice roll can be redone by killing the app

The save only updates after the roll resolves. If the app is closed during the d20 animation, you resume before the roll and can roll again. Accepted as is.

### 7. Erasing is the only save action handled in the screen

`handleEraseSave` stays in `Game.tsx`, next to where it's used, instead of in a separate hook in `Game.hooks.ts`.

## Fixed

### 1. Game renders twice on every node change

`useStoryGame` now reads the saved progress once, with `useStore().getState()` in the `useState` initializer, instead of subscribing with `useSelector`.

### 2. The resume test only checks the text

`Game.spec.tsx` now covers:

- restoring used choices and flags (`hack-terminal` disabled, `force-passage` enabled), and carrying them into the next save;
- restoring the story log without duplicating the current node's pages;
- falling back to the latest logged node when the saved node no longer exists;
- starting over when no logged node exists.

### 5. Saved node no longer exists

The story log is now part of the save (`IStoryProgress.storyLog`), and each entry records its `nodeId`. On resume:

- **The saved node still exists:** the log is restored without that node's pages. Those pages are logged again as you reread them, so they aren't duplicated.
- **The saved node is gone:** the game goes back to the most recent logged node that still exists. It keeps flags, used choices and the log up to that node.
- **No logged node exists:** the game starts over from the chapter entry with an empty save.

The log keeps the latest 20 pages (`STORY_LOG_LIMIT`), so the fallback can only reach back that far.

### 6. Extra save on mount

The save effect skips the write when the node, flags, used choices and log are exactly what's already saved. A resume still writes once, because the log is trimmed back to the start of the current node.

### 8. A character can end up with no name

`hasCreatedCharacter` is now set by `saveCharName` instead of `saveStatus`. If the app closes on the name prompt, the player is sent back to Character Creation.

### 9. Small test gaps

- `Game.debug.spec.tsx` checks that ERASE SAVE is hidden without a handler.
- `Game.spec.tsx` clears `mockReset` before each test.
