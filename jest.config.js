const preset = require('@react-native/jest-preset');

module.exports = {
  preset: '@react-native/jest-preset',
  setupFilesAfterEnv: ['<rootDir>/jest/setup.js'],
  moduleNameMapper: {
    ...preset.moduleNameMapper,
    useEnsureGestureHandlerRootView$: '<rootDir>/jest/noopGestureRoot.js',
  },
  // The preset only transforms react-native itself. These packages publish an
  // ESM entry (or a "react-native" export that is ESM), which Jest cannot run
  // until Babel sees them.
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|react-native-reanimated|react-native-worklets|react-native-gesture-handler|react-native-safe-area-context|react-native-screens|immer|react-redux)/)',
  ],
};
