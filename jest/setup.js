jest.mock('react-native-sound', () => {
  const MockSound = jest.fn(function MockSound(_file, _bundle, callback) {
    this.play = jest.fn();
    this.stop = jest.fn();
    this.release = jest.fn();
    this.setVolume = jest.fn();
    this.setNumberOfLoops = jest.fn();
    queueMicrotask(() => {
      if (typeof callback === 'function') {
        callback(undefined);
      }
    });
  });

  MockSound.setCategory = jest.fn();
  MockSound.MAIN_BUNDLE = 'MAIN_BUNDLE';

  return MockSound;
});

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
  multiGet: jest.fn(() => Promise.resolve([])),
  multiSet: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
}));
