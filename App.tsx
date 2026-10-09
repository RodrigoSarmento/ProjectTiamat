import { StyleSheet, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';

import { DEFAULT_THEME, useSound } from '@hooks/use-sound';
import GameStackNavigator from '@navigators/GameStackNavigator';
import { persistor, store } from '@redux/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import './src/i18n';

function App() {
  const { playSound } = useSound();

  const playSavedThemeOrBackground = () => {
    playSound(store.getState().saves.save.themeOrBackground ?? DEFAULT_THEME);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <Provider store={store}>
          <PersistGate
            loading={null}
            persistor={persistor}
            onBeforeLift={playSavedThemeOrBackground}
          >
            <NavigationContainer>
              <View style={styles.container}>
                <GameStackNavigator />
              </View>
            </NavigationContainer>
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
