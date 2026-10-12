import { StyleSheet, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';

import { useSoundSettings } from '@hooks/use-sound-settings';
import GameStackNavigator from '@navigators/GameStackNavigator';
import { persistor, store } from '@redux/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import './src/i18n';

const AppNavigation = () => {
  useSoundSettings();

  return (
    <NavigationContainer>
      <View style={styles.container}>
        <GameStackNavigator />
      </View>
    </NavigationContainer>
  );
};

function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <AppNavigation />
          </PersistGate>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
