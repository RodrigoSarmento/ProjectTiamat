module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@assets': './src/assets',
          '@components': './src/components',
          '@data': './src/data',
          '@helper': './src/helper',
          '@hooks': './src/hooks',
          '@jest': './jest',
          '@navigators': './src/routes',
          '@redux': './src/redux',
          '@screens': './src/screens',
          '@styles': './src/styles',
          '@test': './jest/utils',
          '@utils': './src/utils',
        },
      },
    ],
    // Must be listed last
    'react-native-reanimated/plugin',
  ],
};
