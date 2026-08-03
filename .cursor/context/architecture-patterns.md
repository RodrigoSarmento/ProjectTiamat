# Architecture patterns — ProjectTiamat

React Native app for ProjectTiamat (RPG Book Game)

## Layout

- `src/screens/` — screen containers (one folder per screen)
- `src/components/` — reusable UI (one folder per component)
- `src/redux/slices/` — Redux Toolkit slices
- `src/services/` — upload, API helpers
- `src/hooks/` — shared hooks
- `src/helper/` — pure helpers

## Screen & component folder pattern

Screens and components use the same folder layout. References: `screens/character-creation`, `components/stat-bar`.

```
src/screens/<kebab-name>/          # or src/components/<kebab-name>/
  index.ts                         # public barrel export (named)
  <Name>.tsx                       # component (default export)
  <Name>.styles.ts                 # optional StyleSheet
  <Name>.constants.ts              # optional constants / static data
  <Name>.types.ts                  # optional types / interfaces
  <Name>.spec.tsx                  # optional tests
```

### Rules

- **Folder name:** kebab-case (`character-creation`, `image-button`, `dice-roll-d20`).
- **File prefix:** PascalCase matching the component (`CharacterCreation`, `ImageButton`).
- **No root barrels:** do not use `src/components/index.ts` or `src/screens/index.ts`. Import from each folder.
- **`index.ts`:** re-export as named exports so consumers import from the folder:

  ```ts
  export { default as StatBar } from './StatBar';
  export { MAX_STAT } from './StatBar.constants';
  export type { IStatBar } from './StatBar.types';
  ```

  ```ts
  import { ImageButton } from '@components/image-button';
  import { CharacterCreation } from '@screens/character-creation';
  ```

- **`.tsx`:** UI + logic only. Prefer colocated `.styles.ts` / `.constants.ts` / `.types.ts` over large inline StyleSheets, constants, or types.
- **`.styles.ts`:** `StyleSheet.create(...)` exported as `styles`.
- **`.constants.ts`:** constants and static config local to that module (not types).
- **`.types.ts`:** types and interfaces local to that module (not runtime values).
- Add more colocated files only when needed (e.g. `.hooks.ts`, `.utils.ts`), keeping `<Name>.<role>.ts` naming.
- Do not put screens or components as a single file directly under `src/screens/` or `src/components/`.

## Conventions

- Prefer existing patterns in neighboring files over new abstractions.
- Don't invent comments; match surrounding style.
- Avoid drive-by refactors outside the task scope.
- Always remove dead code/styles unless they have a comment explaining why they're there.
