import { Dimensions } from 'react-native';

// Screen dimensions
export const screenHeight = Dimensions.get('window').height;
export const screenWidth = Dimensions.get('window').width;

export const radiusSmall = 8; // For small containers
export const radiusBase = 12;
export const radiusLarge = 24;

export const smallBorderWidth = 0.5;
export const mediumBorderWidth = 1;
export const largeBorderWidth = 1.5;

export const dropSmallShadow = {
  // Android
  elevation: 1,
  // Ios
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.15,
  shadowRadius: 1.4,
};

// Card drop shadow
export const dropShadow = {
  // Android
  elevation: 2,
  // Ios
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 1.8,
};

export const dropHugeShadow = {
  // Android
  elevation: 5,
  /// Ios
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.1,
  shadowRadius: 5,
};
