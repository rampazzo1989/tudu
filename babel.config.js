module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          buffer: 'buffer',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
