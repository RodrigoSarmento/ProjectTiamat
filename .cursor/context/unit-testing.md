# Unit testing — luna-oculus

## Runner

- `npm test` / `npx jest` (preset `react-native`)
- Specs: `**/*.spec.ts(x)` next to source or under the same feature folder
- Setup: `jest.setup.js` (NetInfo, RNFS, Firebase, maps, etc.)

## Patterns

- Prefer `renderWithProviders` from `jest/utils` when Redux is involved.
- Navigation: mock `@react-navigation/native` `useRoute` / `useNavigation`.
- Assert user-visible text / `testID`s; don't snapshot huge trees unless needed.

## Coverage expectations for changes
