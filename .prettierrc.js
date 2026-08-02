module.exports = {
  singleQuote: true,
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrder: [
    '^react$',
    '^react-native$',
    '^react/.+',
    '<THIRD_PARTY_MODULES>',
    '^framework-ui/',
    '^@react-navigation/',
    '^@?\\w',
    '^\\.\\./',
    '^\\./',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
